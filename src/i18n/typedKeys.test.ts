import i18n from '.';
import type { ProjectSlug } from '../types/Project';

describe('typed translation keys', () => {
  it('accepts real keys and rejects unknown ones at compile time', () => {
    expect(i18n.t('nav.home')).toBe('Home');

    // @ts-expect-error - "nav.doesNotExist" is not a key in the locale files
    i18n.t('nav.doesNotExist');
  });

  it('types project slugs after the keys in the locale files', () => {
    const slug: ProjectSlug = 'gazer';
    expect(i18n.t(`projects.${slug}.summary`)).not.toBe('');

    // @ts-expect-error - "not-a-project" has no copy in the locale files
    const invalid: ProjectSlug = 'not-a-project';
    expect(invalid).toBe('not-a-project');
  });
});
