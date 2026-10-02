import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import { DynamoVisitorStore } from './dynamoStore';

const TABLE = 'visitors-test';
const ID = '3f0c1a52-8d7e-4b1a-9c55-2d1f6e7a8b90';

function cancellation(...codes: string[]): TransactionCanceledException {
  return new TransactionCanceledException({
    message: 'Transaction cancelled',
    $metadata: {},
    CancellationReasons: codes.map((Code) => ({ Code })),
  });
}

describe('DynamoVisitorStore', () => {
  describe('recordVisit', () => {
    it('writes the visitor and increments the counter in one transaction', async () => {
      const send = vi.fn().mockResolvedValue({});
      const store = new DynamoVisitorStore({ send }, TABLE);

      const counted = await store.recordVisit(ID);

      expect(counted).toBe(true);
      expect(send).toHaveBeenCalledTimes(1);
      const command = send.mock.calls[0][0] as TransactWriteCommand;
      expect(command).toBeInstanceOf(TransactWriteCommand);
      const [put, update] = command.input.TransactItems ?? [];
      expect(put.Put?.TableName).toBe(TABLE);
      expect(put.Put?.Item).toMatchObject({ pk: `VISITOR#${ID}` });
      expect(put.Put?.ConditionExpression).toBe('attribute_not_exists(pk)');
      expect(update.Update?.Key).toEqual({ pk: 'COUNTER' });
      expect(update.Update?.UpdateExpression).toBe('ADD #count :one');
      expect(update.Update?.ExpressionAttributeValues).toEqual({ ':one': 1 });
    });

    it('stores the id lowercased so casing cannot create a second visitor', async () => {
      const send = vi.fn().mockResolvedValue({});
      const store = new DynamoVisitorStore({ send }, TABLE);

      await store.recordVisit(ID.toUpperCase());

      const command = send.mock.calls[0][0] as TransactWriteCommand;
      expect(command.input.TransactItems?.[0].Put?.Item).toMatchObject({ pk: `VISITOR#${ID}` });
    });

    it('records when the visitor was first seen', async () => {
      const send = vi.fn().mockResolvedValue({});
      const store = new DynamoVisitorStore({ send }, TABLE, () => new Date('2026-09-29T12:00:00.000Z'));

      await store.recordVisit(ID);

      const command = send.mock.calls[0][0] as TransactWriteCommand;
      expect(command.input.TransactItems?.[0].Put?.Item).toMatchObject({
        firstSeen: '2026-09-29T12:00:00.000Z',
      });
    });

    it('reports an already-counted visitor when the condition check fails', async () => {
      const send = vi.fn().mockRejectedValue(cancellation('ConditionalCheckFailed', 'None'));
      const store = new DynamoVisitorStore({ send }, TABLE);

      await expect(store.recordVisit(ID)).resolves.toBe(false);
    });

    it('rethrows a cancellation that is not a duplicate visitor', async () => {
      const send = vi.fn().mockRejectedValue(cancellation('ThrottlingError', 'None'));
      const store = new DynamoVisitorStore({ send }, TABLE);

      await expect(store.recordVisit(ID)).rejects.toBeInstanceOf(TransactionCanceledException);
    });

    it('rethrows unexpected errors', async () => {
      const send = vi.fn().mockRejectedValue(new Error('network down'));
      const store = new DynamoVisitorStore({ send }, TABLE);

      await expect(store.recordVisit(ID)).rejects.toThrow('network down');
    });
  });

  describe('getCount', () => {
    it('reads the counter item with a consistent read', async () => {
      const send = vi.fn().mockResolvedValue({ Item: { pk: 'COUNTER', count: 41 } });
      const store = new DynamoVisitorStore({ send }, TABLE);

      await expect(store.getCount()).resolves.toBe(41);

      const command = send.mock.calls[0][0] as GetCommand;
      expect(command).toBeInstanceOf(GetCommand);
      expect(command.input).toMatchObject({ TableName: TABLE, Key: { pk: 'COUNTER' }, ConsistentRead: true });
    });

    it('returns zero before the first visit', async () => {
      const send = vi.fn().mockResolvedValue({});
      const store = new DynamoVisitorStore({ send }, TABLE);

      await expect(store.getCount()).resolves.toBe(0);
    });
  });
});
