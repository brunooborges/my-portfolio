import type { LambdaFunctionURLEvent } from 'aws-lambda';

import { createHandler } from './handler';
import type { VisitorStore } from './store';

const VALID_ID = '3f0c1a52-8d7e-4b1a-9c55-2d1f6e7a8b90';

/** In-memory stand-in for DynamoDB: same contract as the real store. */
function createFakeStore(): VisitorStore & { visitors: Set<string> } {
  const visitors = new Set<string>();
  return {
    visitors,
    recordVisit: async (id) => {
      if (visitors.has(id)) {
        return false;
      }
      visitors.add(id);
      return true;
    },
    getCount: async () => visitors.size,
  };
}

function event(method: string, path: string, body?: unknown, extra: Partial<LambdaFunctionURLEvent> = {}): LambdaFunctionURLEvent {
  return {
    version: '2.0',
    rawPath: path,
    rawQueryString: '',
    headers: {},
    isBase64Encoded: false,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    requestContext: { http: { method, path } },
    ...extra,
  } as LambdaFunctionURLEvent;
}

function parse(result: { body?: string }): Record<string, unknown> {
  return JSON.parse(result.body ?? '{}') as Record<string, unknown>;
}

describe('visitor counter handler', () => {
  let store: ReturnType<typeof createFakeStore>;
  let handler: ReturnType<typeof createHandler>;

  beforeEach(() => {
    store = createFakeStore();
    handler = createHandler(store);
  });

  describe('POST /visit', () => {
    it('counts a first-time visitor', async () => {
      const result = await handler(event('POST', '/visit', { visitorId: VALID_ID }));

      expect(result.statusCode).toBe(200);
      expect(parse(result)).toEqual({ count: 1, counted: true });
    });

    it('does not count the same visitor twice', async () => {
      await handler(event('POST', '/visit', { visitorId: VALID_ID }));

      const result = await handler(event('POST', '/visit', { visitorId: VALID_ID }));

      expect(result.statusCode).toBe(200);
      expect(parse(result)).toEqual({ count: 1, counted: false });
    });

    it('counts different visitors separately', async () => {
      await handler(event('POST', '/visit', { visitorId: VALID_ID }));

      const result = await handler(event('POST', '/visit', { visitorId: '11111111-2222-4333-8444-555555555555' }));

      expect(parse(result)).toEqual({ count: 2, counted: true });
    });

    it('accepts an uppercase id and treats it as the same visitor', async () => {
      await handler(event('POST', '/visit', { visitorId: VALID_ID }));

      const result = await handler(event('POST', '/visit', { visitorId: VALID_ID.toUpperCase() }));

      expect(parse(result)).toEqual({ count: 1, counted: false });
    });

    it('decodes a base64 body', async () => {
      const body = Buffer.from(JSON.stringify({ visitorId: VALID_ID })).toString('base64');

      const result = await handler(event('POST', '/visit', body, { isBase64Encoded: true }));

      expect(parse(result)).toEqual({ count: 1, counted: true });
    });

    it.each([
      ['a missing body', undefined],
      ['invalid JSON', '{not json'],
      ['a JSON array', []],
      ['a missing visitorId', {}],
      ['a non-string visitorId', { visitorId: 42 }],
      ['a malformed id', { visitorId: 'not-a-uuid' }],
      ['an id with injected characters', { visitorId: `${VALID_ID}'; DROP` }],
      ['an id that is not a v4 UUID', { visitorId: '3f0c1a52-8d7e-1b1a-9c55-2d1f6e7a8b90' }],
    ])('rejects %s with 400 and does not touch the store', async (_label, body) => {
      const result = await handler(event('POST', '/visit', body));

      expect(result.statusCode).toBe(400);
      expect(parse(result)).toEqual({ error: 'Invalid request' });
      expect(store.visitors.size).toBe(0);
    });

    it('rejects an oversized body with 413', async () => {
      const result = await handler(event('POST', '/visit', { visitorId: VALID_ID, padding: 'x'.repeat(2000) }));

      expect(result.statusCode).toBe(413);
      expect(store.visitors.size).toBe(0);
    });
  });

  describe('GET /count', () => {
    it('returns the current count without counting the caller', async () => {
      await handler(event('POST', '/visit', { visitorId: VALID_ID }));

      const result = await handler(event('GET', '/count'));

      expect(result.statusCode).toBe(200);
      expect(parse(result)).toEqual({ count: 1 });
      expect(store.visitors.size).toBe(1);
    });

    it('returns zero when nobody has visited', async () => {
      const result = await handler(event('GET', '/count'));

      expect(parse(result)).toEqual({ count: 0 });
    });
  });

  describe('routing and responses', () => {
    it('answers 404 for unknown paths', async () => {
      const result = await handler(event('GET', '/admin'));

      expect(result.statusCode).toBe(404);
    });

    it.each([
      ['GET', '/visit'],
      ['POST', '/count'],
      ['DELETE', '/count'],
    ])('answers 405 with an Allow header for %s %s', async (method, path) => {
      const result = await handler(event(method, path));

      expect(result.statusCode).toBe(405);
      expect(result.headers?.allow).toBe(path === '/visit' ? 'POST' : 'GET');
    });

    it('always answers JSON and disables caching', async () => {
      const result = await handler(event('GET', '/count'));

      expect(result.headers).toMatchObject({
        'content-type': 'application/json',
        'cache-control': 'no-store',
      });
    });

    it('hides internal errors behind a generic 500 and logs them', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const failing = createHandler({
        recordVisit: async () => {
          throw new Error('dynamodb exploded: secret-table-name');
        },
        getCount: async () => 0,
      });

      const result = await failing(event('POST', '/visit', { visitorId: VALID_ID }));

      expect(result.statusCode).toBe(500);
      expect(parse(result)).toEqual({ error: 'Internal error' });
      expect(result.body).not.toContain('secret-table-name');
      expect(errorSpy).toHaveBeenCalledTimes(1);
      errorSpy.mockRestore();
    });
  });
});
