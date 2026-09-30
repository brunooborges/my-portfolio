import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components';

import defaultTheme from '../assets/styles/Themes/default';
import i18n from '../i18n';

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
    </I18nextProvider>
  );
}

export function renderWithProviders(ui: ReactElement): RenderResult {
  return render(ui, { wrapper: Providers });
}
