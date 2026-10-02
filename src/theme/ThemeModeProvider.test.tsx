import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import { THEME_STORAGE_KEY } from './modes';
import ThemeModeProvider from './ThemeModeProvider';
import useThemeMode from './useThemeMode';

type Listener = (event: { matches: boolean }) => void;

/** Controls what `(prefers-color-scheme: light)` reports, and lets a test change it later. */
function mockSystemPrefersLight(initial: boolean): { change: (prefersLight: boolean) => void } {
  const listeners = new Set<Listener>();
  const query = {
    matches: initial,
    media: '(prefers-color-scheme: light)',
    addEventListener: (_type: string, listener: Listener): void => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: Listener): void => {
      listeners.delete(listener);
    },
  };
  window.matchMedia = vi.fn().mockReturnValue(query) as unknown as typeof window.matchMedia;

  return {
    change: (prefersLight) => {
      query.matches = prefersLight;
      listeners.forEach((listener) => {
        listener({ matches: prefersLight });
      });
    },
  };
}

function wrapper({ children }: { children: ReactNode }): React.JSX.Element {
  return <ThemeModeProvider>{children}</ThemeModeProvider>;
}

const originalMatchMedia = window.matchMedia;

describe('ThemeModeProvider', () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="theme-color" content="#121212" />';
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('starts dark when the system does not ask for light', () => {
    mockSystemPrefersLight(false);

    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current.mode).toBe('dark');
  });

  it('starts light when the system asks for light and nothing was chosen', () => {
    mockSystemPrefersLight(true);

    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current.mode).toBe('light');
  });

  it('lets a stored choice beat the system preference', () => {
    mockSystemPrefersLight(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current.mode).toBe('dark');
  });

  it('does not store anything until the visitor chooses', () => {
    mockSystemPrefersLight(true);

    renderHook(() => useThemeMode(), { wrapper });

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('switches mode and remembers the explicit choice', () => {
    mockSystemPrefersLight(false);
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('toggles between the two modes', () => {
    mockSystemPrefersLight(false);
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe('light');

    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe('dark');
  });

  it('follows the system while the visitor has not chosen', () => {
    const system = mockSystemPrefersLight(false);
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    act(() => {
      system.change(true);
    });

    expect(result.current.mode).toBe('light');
  });

  it('stops following the system once the visitor has chosen', () => {
    const system = mockSystemPrefersLight(false);
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    act(() => {
      result.current.setMode('dark');
    });

    act(() => {
      system.change(true);
    });

    expect(result.current.mode).toBe('dark');
  });

  it('still works when storage is blocked', () => {
    mockSystemPrefersLight(false);
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { result } = renderHook(() => useThemeMode(), { wrapper });
    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
  });

  it('gives styled components the matching theme', () => {
    mockSystemPrefersLight(true);
    const Probe = styled.p`
      color: ${({ theme }) => theme.colors.background};
    `;

    render(
      <ThemeModeProvider>
        <Probe>probe</Probe>
      </ThemeModeProvider>,
    );

    expect(screen.getByText('probe')).toHaveStyle({ color: '#F4F4F8' });
  });

  it('keeps the browser theme-color and color-scheme in step with the mode', () => {
    mockSystemPrefersLight(false);
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#121212');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    act(() => {
      result.current.setMode('light');
    });

    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#F4F4F8');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('does not fail when the page has no theme-color tag', () => {
    mockSystemPrefersLight(false);
    document.head.innerHTML = '';

    expect(() => renderHook(() => useThemeMode(), { wrapper })).not.toThrow();
  });
});

describe('useThemeMode outside the provider', () => {
  it('fails loudly instead of silently using a default', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useThemeMode())).toThrow(/ThemeModeProvider/);

    vi.restoreAllMocks();
  });
});
