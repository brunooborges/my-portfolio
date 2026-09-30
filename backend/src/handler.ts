import type { LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda';

import type { VisitorStore } from './store';

const MAX_BODY_BYTES = 1024;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_METHOD: Readonly<Record<string, string>> = {
  '/visit': 'POST',
  '/count': 'GET',
};

/** The handler always answers with a structured response (never a bare string). */
export type StructuredResult = Exclude<LambdaFunctionURLResult, string>;

type Handler = (event: LambdaFunctionURLEvent) => Promise<StructuredResult>;

function json(statusCode: number, body: unknown, headers: Record<string, string> = {}): StructuredResult {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
    body: JSON.stringify(body),
  };
}

const badRequest = (): StructuredResult => json(400, { error: 'Invalid request' });

/** Extracts a lowercase v4 UUID from the request body, or `null` when the body is unusable. */
function readVisitorId(event: LambdaFunctionURLEvent): string | null {
  if (event.body === undefined) {
    return null;
  }

  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const { visitorId } = parsed as { visitorId?: unknown };
  return typeof visitorId === 'string' && UUID_V4.test(visitorId) ? visitorId.toLowerCase() : null;
}

export function createHandler(store: VisitorStore): Handler {
  return async (event) => {
    const { method } = event.requestContext.http;
    const path = event.rawPath;

    const allowed = ALLOWED_METHOD[path];
    if (allowed === undefined) {
      return json(404, { error: 'Not found' });
    }
    if (method !== allowed) {
      return json(405, { error: 'Method not allowed' }, { allow: allowed });
    }

    try {
      if (path === '/count') {
        return json(200, { count: await store.getCount() });
      }

      if (Buffer.byteLength(event.body ?? '', 'utf8') > MAX_BODY_BYTES) {
        return json(413, { error: 'Payload too large' });
      }

      const visitorId = readVisitorId(event);
      if (visitorId === null) {
        return badRequest();
      }

      const counted = await store.recordVisit(visitorId);
      return json(200, { count: await store.getCount(), counted });
    } catch (error: unknown) {
      console.error('Visitor counter failed:', error);
      return json(500, { error: 'Internal error' });
    }
  };
}
