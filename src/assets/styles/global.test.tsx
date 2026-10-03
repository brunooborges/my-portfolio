import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, ThemeProvider } from 'styled-components';

import dark from './Themes/default';
import light from './Themes/light';
import type { AppTheme } from './Themes/types';
import GlobalStyles from './global';

/** The CSS the global styles emit for a theme. */
function globalCss(theme: AppTheme): string {
  const sheet = new ServerStyleSheet();
  try {
    renderToString(
      sheet.collectStyles(
        <ThemeProvider theme={theme}>
          <GlobalStyles />
        </ThemeProvider>,
      ),
    );
    return sheet.getStyleTags().replace(/\s+/g, '');
  } finally {
    sheet.seal();
  }
}

describe('GlobalStyles', () => {
  it.each([
    ['dark', dark, '#121212'],
    ['light', light, '#F4F4F8'],
  ])('paints the whole page, html included, in the %s theme page color', (_name, theme, color) => {
    const css = globalCss(theme);

    // :root outranks the plain html rule index.html uses for the first paint, so a theme change
    // cannot leave that first-paint color showing (a dark strip above the first panel in light).
    expect(css).toContain(`:root{background:${color};}`);
    expect(css).toContain(`body{background:${color};`);
  });
});
