import { useContext } from 'react';

import { ThemeModeContext, type ThemeModeValue } from './ThemeModeContext';

export default function useThemeMode(): ThemeModeValue {
  const value = useContext(ThemeModeContext);

  if (value === null) {
    throw new Error('useThemeMode must be used inside a ThemeModeProvider');
  }

  return value;
}
