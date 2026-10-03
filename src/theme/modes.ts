import type { ThemeMode } from '../assets/styles/Themes/types';

export const THEME_STORAGE_KEY = 'theme';

export function parseThemeMode(value: string | null | undefined): ThemeMode | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/**
 * An explicit choice wins. Otherwise follow the system only when it asks for light:
 * dark is the site's own design, so it is also the answer when the system says nothing.
 */
export function resolveThemeMode(stored: string | null | undefined, systemPrefersLight: boolean): ThemeMode {
  const explicit = parseThemeMode(stored);

  if (explicit !== null) {
    return explicit;
  }

  return systemPrefersLight ? 'light' : 'dark';
}
