export type ThemeMode = 'light' | 'dark';

/**
 * Color roles shared by every theme. Components use roles, never raw hex values, so a new
 * theme only has to fill this shape (themes.test.ts checks the contrast of each pairing).
 */
export interface AppTheme {
  mode: ThemeMode;
  colors: {
    /** Page background. */
    background: string;
    primary: {
      /** Raised surface on top of a panel (badges, thumbnails, hover). */
      lighter: string;
      /** Panels (intro, portfolio showcase). */
      light: string;
      main: string;
      /** Deepest tone: gradient ends and the like. */
      dark: string;
    };
    text: {
      /** Strong text and headings. */
      light: string;
      /** Body text. */
      main: string;
    };
    /** Brand indigo for fills, borders and decoration. Not safe as small text on dark surfaces. */
    highlight: string;
    /** Brand indigo tuned for text, focus rings and accent edges on the page and panels. */
    accent: string;
    /** Text on a `highlight` fill. */
    onHighlight: string;
    /** Inactive slider tick. */
    slider: string;
    /** Hairline drawn around screenshots. */
    hairline: string;
  };
}
