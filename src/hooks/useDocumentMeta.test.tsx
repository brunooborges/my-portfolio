import { renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import { act } from 'react';

import i18n from '../i18n';
import useDocumentMeta from './useDocumentMeta';

function wrapper({ children }: { children: ReactNode }): React.JSX.Element {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

describe('useDocumentMeta', () => {
  beforeEach(async () => {
    document.head.innerHTML = '<meta name="description" content="" />';
    await i18n.changeLanguage('en-US');
  });

  it('sets lang, title and description for the active language', () => {
    renderHook(() => useDocumentMeta(), { wrapper });

    expect(document.documentElement.lang).toBe('en-US');
    expect(document.title).toBe('Bruno Borges - Full-Stack Developer');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Bruno Borges, a Full-Stack Developer who loves building great user experiences.',
    );
  });

  it('updates everything when the language changes', async () => {
    renderHook(() => useDocumentMeta(), { wrapper });

    await act(async () => {
      await i18n.changeLanguage('pt-BR');
    });

    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.title).toBe('Bruno Borges - Desenvolvedor Full-Stack');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Bruno Borges, Desenvolvedor Full-Stack que adora construir ótimas experiências de usuário.',
    );
  });
});
