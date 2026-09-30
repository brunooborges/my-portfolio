import { useEffect, useState } from 'react';

import { getVisitorId } from '../../lib/visitorId';

interface FooterState {
  /** Unique-visitor count ready to display, or `null` when unavailable. */
  count: string | null;
}

/** The API answers `{ count }`. Anything that is not a non-negative safe integer is "unavailable". */
export function parseCount(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null || !('count' in payload)) {
    return null;
  }

  const { count } = payload as { count: unknown };
  return typeof count === 'number' && Number.isSafeInteger(count) && count >= 0 ? String(count) : null;
}

function buildRequest(baseUrl: string, signal: AbortSignal): [string, RequestInit] {
  const visitorId = getVisitorId();

  // Without a stable id the visit cannot be told apart from a returning one:
  // only read the count instead of risking counting the same person repeatedly.
  if (visitorId === null) {
    return [`${baseUrl}/count`, { signal }];
  }

  return [
    `${baseUrl}/visit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
      signal,
    },
  ];
}

export default function useFooter(): FooterState {
  const apiUrl = import.meta.env.VITE_VISITOR_API_URL?.trim() ?? '';
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    if (apiUrl === '') {
      return undefined;
    }

    const controller = new AbortController();

    async function loadCounter(): Promise<void> {
      try {
        const [url, init] = buildRequest(apiUrl.replace(/\/+$/, ''), controller.signal);
        const response = await fetch(url, init);
        if (!response.ok) {
          throw new Error(`Visitor counter responded with HTTP ${response.status}`);
        }
        setCount(parseCount(await response.json()));
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        console.error('Could not load the visitor counter:', error);
        setCount(null);
      }
    }

    void loadCounter();

    return () => {
      controller.abort();
    };
  }, [apiUrl]);

  return { count };
}
