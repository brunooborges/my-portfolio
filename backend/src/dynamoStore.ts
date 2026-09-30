import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import type { VisitorStore } from './store';

const COUNTER_KEY = 'COUNTER';

/** The slice of the DynamoDB document client this store needs (easy to fake in tests). */
export interface CommandSender {
  send: (command: TransactWriteCommand | GetCommand) => Promise<unknown>;
}

/**
 * Single-table design: one `VISITOR#<uuid>` item per visitor plus one `COUNTER`
 * item. Registering a visitor is a single transaction, so the counter can never
 * drift from the set of stored visitors.
 */
export class DynamoVisitorStore implements VisitorStore {
  constructor(
    private readonly client: CommandSender,
    private readonly tableName: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async recordVisit(visitorId: string): Promise<boolean> {
    try {
      await this.client.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.tableName,
                Item: { pk: `VISITOR#${visitorId.toLowerCase()}`, firstSeen: this.now().toISOString() },
                ConditionExpression: 'attribute_not_exists(pk)',
              },
            },
            {
              Update: {
                TableName: this.tableName,
                Key: { pk: COUNTER_KEY },
                UpdateExpression: 'ADD #count :one',
                ExpressionAttributeNames: { '#count': 'count' },
                ExpressionAttributeValues: { ':one': 1 },
              },
            },
          ],
        }),
      );
      return true;
    } catch (error: unknown) {
      if (isDuplicateVisitor(error)) {
        return false;
      }
      throw error;
    }
  }

  async getCount(): Promise<number> {
    const result = (await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { pk: COUNTER_KEY }, ConsistentRead: true }),
    )) as { Item?: { count?: number } };

    return Number(result.Item?.count ?? 0);
  }
}

function isDuplicateVisitor(error: unknown): boolean {
  return (
    error instanceof TransactionCanceledException &&
    error.CancellationReasons?.[0]?.Code === 'ConditionalCheckFailed'
  );
}
