import { act, screen, waitFor } from '@testing-library/react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { afterEach, vi } from 'vitest';

import i18n from '../../i18n';
import { renderWithProviders } from '../../test/renderWithProviders';
import Footer from '.';

const API_URL = 'https://abc123.lambda-url.sa-east-1.on.aws';
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function mockFetchJson(body: unknown): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => body });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** Lets the pending fetch/json promises resolve and React apply the resulting state. */
async function settle(): Promise<void> {
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe('Footer', () => {
  beforeEach(async () => {
    vi.stubEnv('VITE_VISITOR_API_URL', API_URL);
    await i18n.changeLanguage('en-US');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('shows the credit with the current year', async () => {
    mockFetchJson({ count: 1, counted: true });
    renderWithProviders(<Footer />);
    await settle();

    expect(
      screen.getByText(new RegExp(`Designed & Built by Bruno Borges © ${new Date().getFullYear()}`)),
    ).toBeInTheDocument();
  });

  describe('revealing the counter', () => {
    it('counts the visit on load but keeps the number hidden until the footer scrolls into view', async () => {
      const fetchMock = mockFetchJson({ count: 1234, counted: true });
      renderWithProviders(<Footer />);
      await settle();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Visitors/)).toBeNull();

      mockAllIsIntersecting(true);

      expect(await screen.findByText(/Visitors: 1,234$/)).toBeInTheDocument();
    });

    it('keeps the number once revealed, even after scrolling away again', async () => {
      mockFetchJson({ count: 9, counted: true });
      renderWithProviders(<Footer />);
      await settle();
      mockAllIsIntersecting(true);
      expect(await screen.findByText(/Visitors: 9$/)).toBeInTheDocument();

      mockAllIsIntersecting(false);

      expect(screen.getByText(/Visitors: 9$/)).toBeInTheDocument();
    });

    it('never shows a number the API did not provide, even when the footer is visible', async () => {
      mockFetchJson({ other: 1 });
      renderWithProviders(<Footer />);
      await settle();

      mockAllIsIntersecting(true);

      expect(screen.queryByText(/Visitors/)).toBeNull();
    });
  });

  describe('counting visitors', () => {
    it('registers a new visitor once with a generated id and shows the formatted count', async () => {
      const fetchMock = mockFetchJson({ count: 1234, counted: true });
      renderWithProviders(<Footer />);
      mockAllIsIntersecting(true);

      expect(await screen.findByText(/Visitors: 1,234$/)).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(`${API_URL}/visit`);
      expect(init.method).toBe('POST');
      expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
      const { visitorId } = JSON.parse(init.body as string) as { visitorId: string };
      expect(visitorId).toMatch(UUID_V4);
      expect(window.localStorage.getItem('visitorId')).toBe(visitorId);
    });

    it('sends the same id when the same browser comes back', async () => {
      const fetchMock = mockFetchJson({ count: 5, counted: false });
      const first = renderWithProviders(<Footer />);
      await settle();
      first.unmount();
      fetchMock.mockClear();

      renderWithProviders(<Footer />);
      await settle();

      const storedId = window.localStorage.getItem('visitorId');
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect((JSON.parse(init.body as string) as { visitorId: string }).visitorId).toBe(storedId);
    });

    it('ignores a trailing slash in the configured URL', async () => {
      vi.stubEnv('VITE_VISITOR_API_URL', `${API_URL}/`);
      const fetchMock = mockFetchJson({ count: 2, counted: true });
      renderWithProviders(<Footer />);
      await settle();

      expect(fetchMock.mock.calls[0][0]).toBe(`${API_URL}/visit`);
    });

    it('only reads the count when the browser cannot keep an id, so nobody is counted twice', async () => {
      vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
        throw new Error('storage blocked');
      });
      const fetchMock = mockFetchJson({ count: 77 });
      renderWithProviders(<Footer />);
      mockAllIsIntersecting(true);

      expect(await screen.findByText(/Visitors: 77$/)).toBeInTheDocument();
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(`${API_URL}/count`);
      expect(init.method).toBeUndefined();
      expect(init.body).toBeUndefined();
    });
  });

  describe('when the counter is unavailable', () => {
    it('makes no request and hides the counter when no API URL is configured', async () => {
      vi.stubEnv('VITE_VISITOR_API_URL', '');
      const fetchMock = mockFetchJson({ count: 1 });
      renderWithProviders(<Footer />);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(fetchMock).not.toHaveBeenCalled();
      expect(screen.queryByText(/Visitors/)).toBeNull();
      expect(screen.getByText(/Designed & Built by Bruno Borges/)).toBeInTheDocument();
    });

    it('hides the counter and logs when the request fails', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
      renderWithProviders(<Footer />);
      await settle();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Visitors/)).toBeNull();
      expect(screen.getByText(/Designed & Built by Bruno Borges/)).toBeInTheDocument();
    });

    it('hides the counter and logs when the API answers with an HTTP error', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
      renderWithProviders(<Footer />);
      await settle();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Visitors/)).toBeNull();
    });

    it.each([
      ['an unexpected shape', { count: { unexpected: true } }],
      ['a missing count field', { other: 1 }],
      ['the previous scanData format', { scanData: [12] }],
      ['a negative number', { count: -5 }],
      ['a fractional number', { count: 1.5 }],
      ['a string instead of a number', { count: '250' }],
      ['an unsafe integer', { count: 2 ** 60 }],
      ['null', null],
    ])('hides the counter when the API returns %s', async (_label, body) => {
      mockFetchJson(body);
      renderWithProviders(<Footer />);
      await settle();

      expect(screen.queryByText(/Visitors/)).toBeNull();
    });
  });

  it('translates the labels and formats the number for the language', async () => {
    mockFetchJson({ count: 1234, counted: true });
    renderWithProviders(<Footer />);
    mockAllIsIntersecting(true);
    await i18n.changeLanguage('pt-BR');

    expect(await screen.findByText(/Visitantes: 1\.234$/)).toBeInTheDocument();
    expect(screen.getByText(/Projetado e desenvolvido por Bruno Borges/)).toBeInTheDocument();
  });

  it('aborts the request when unmounted', async () => {
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        signal = init?.signal ?? undefined;
        return new Promise(() => {});
      }),
    );
    const { unmount } = renderWithProviders(<Footer />);

    unmount();

    expect(signal?.aborted).toBe(true);
  });
});
