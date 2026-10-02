import type { AppTheme } from './types';

/** The dark theme, and the default one. */
const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#121212',
    primary: {
      lighter: '#333333',
      light: '#1F1F1F',
      main: '#121212',
      dark: '#000000',
    },
    text: {
      light: '#FFFFFF',
      main: '#BEBEBE',
    },
    highlight: '#3F51B5',
    accent: '#8C9EFF',
    onHighlight: '#FFFFFF',
    slider: '#4D4C4C',
    hairline: 'rgba(255, 255, 255, 0.1)',
  },
};

export default darkTheme;
