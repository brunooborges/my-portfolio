import { renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import { act } from 'react';

import i18n from '../i18n';
import useDocumentMeta from './useDocumentMeta';

function wrapper({ children }: { children: ReactNode }): React.JSX.Element {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

function metaContent(selector: string): string | null {
  return document.querySelector(selector)?.getAttribute('content') ?? null;
}

describe('useDocumentMeta', () => {
  beforeEach(async () => {
    document.head.innerHTML = [
      '<meta name="description" content="" />',
      '<meta property="og:title" content="" />',
      '<meta property="og:description" content="" />',
      '<meta property="og:locale" content="" />',
      '<meta name="twitter:title" content="" />',
      '<meta name="twitter:description" content="" />',
    ].join('');
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
  it('keeps the share-preview tags (Open Graph and Twitter) in the active language', async () => {
    renderHook(() => useDocumentMeta(), { wrapper });

    expect(metaContent('meta[property="og:title"]')).toBe('Bruno Borges - Full-Stack Developer');
    expect(metaContent('meta[property="og:description"]')).toBe(
      'Bruno Borges, a Full-Stack Developer who loves building great user experiences.',
    );
    expect(metaContent('meta[property="og:locale"]')).toBe('en_US');
    expect(metaContent('meta[name="twitter:title"]')).toBe('Bruno Borges - Full-Stack Developer');

    await act(async () => {
      await i18n.changeLanguage('pt-BR');
    });

    expect(metaContent('meta[property="og:title"]')).toBe('Bruno Borges - Desenvolvedor Full-Stack');
    expect(metaContent('meta[property="og:locale"]')).toBe('pt_BR');
    expect(metaContent('meta[name="twitter:description"]')).toBe(
      'Bruno Borges, Desenvolvedor Full-Stack que adora construir ótimas experiências de usuário.',
    );
  });

  it('does not fail when the page has no share-preview tags', () => {
    document.head.innerHTML = '';

    expect(() => renderHook(() => useDocumentMeta(), { wrapper })).not.toThrow();
  });
});
