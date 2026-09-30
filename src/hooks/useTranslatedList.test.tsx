import { renderHook } from '@testing-library/react';

import i18n from '../i18n';
import { Providers } from '../test/renderWithProviders';
import useTranslatedList from './useTranslatedList';

describe('useTranslatedList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('returns the translated list', () => {
    const { result } = renderHook(() => useTranslatedList('projects.gazer.highlights'), {
      wrapper: Providers,
    });

    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toMatch(/170\+ reusable components/);
  });

  it('returns an empty list for a key that does not exist', () => {
    const { result } = renderHook(() => useTranslatedList('projects.nope.highlights'), {
      wrapper: Providers,
    });

    expect(result.current).toEqual([]);
  });

  it('returns an empty list when the key points at a plain string', () => {
    const { result } = renderHook(() => useTranslatedList('nav.home'), { wrapper: Providers });

    expect(result.current).toEqual([]);
  });
});
