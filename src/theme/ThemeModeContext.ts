import { createContext } from 'react';

import type { ThemeMode } from '../assets/styles/Themes/types';

export interface ThemeModeValue {
  mode: ThemeMode;
  /** Switches mode and remembers it as the visitor's explicit choice. */
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeValue | null>(null);
