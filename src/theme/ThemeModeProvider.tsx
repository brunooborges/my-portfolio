import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

import darkTheme from '../assets/styles/Themes/default';
import lightTheme from '../assets/styles/Themes/light';
import type { ThemeMode } from '../assets/styles/Themes/types';
import { parseThemeMode, resolveThemeMode, THEME_STORAGE_KEY } from './modes';
import { ThemeModeContext, type ThemeModeValue } from './ThemeModeContext';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

const THEMES = { dark: darkTheme, light: lightTheme } as const;

function readStoredMode(): ThemeMode | null {
  try {
    return parseThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

function lightQuery(): MediaQueryList | null {
  return typeof window.matchMedia === 'function' ? window.matchMedia(LIGHT_QUERY) : null;
}

interface ThemeModeProviderProps {
  children: ReactNode;
}

/**
 * Owns the light/dark choice. The system preference is the default and is followed live;
 * only an explicit choice is stored (like the language), so a visitor who never picked
 * keeps following their system.
 */
export default function ThemeModeProvider({ children }: ThemeModeProviderProps): React.JSX.Element {
  const [explicitMode, setExplicitMode] = useState<ThemeMode | null>(readStoredMode);
  const [systemPrefersLight, setSystemPrefersLight] = useState<boolean>(() => lightQuery()?.matches ?? false);
  const mode = resolveThemeMode(explicitMode, systemPrefersLight);
  const theme = THEMES[mode];

  useEffect(() => {
    const query = lightQuery();

    if (query === null) {
      return undefined;
    }

    function handleChange(event: { matches: boolean }): void {
      setSystemPrefersLight(event.matches);
    }

    query.addEventListener('change', handleChange);
    return () => {
      query.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.background);
  }, [mode, theme]);

  const setMode = useCallback((next: ThemeMode): void => {
    setExplicitMode(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode, site settings); the switch still works.
    }
  }, []);

  const toggleMode = useCallback((): void => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo<ThemeModeValue>(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
