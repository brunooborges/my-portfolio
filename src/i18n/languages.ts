export const SUPPORTED_LANGUAGES = ['en-US', 'pt-BR'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

export const LANGUAGE_STORAGE_KEY = 'lang';

const LANGUAGE_BY_PREFIX: Readonly<Record<string, SupportedLanguage>> = {
  en: 'en-US',
  pt: 'pt-BR',
};

/**
 * Maps any browser/locale string (e.g. "pt", "PT-br", "en-GB") to one of the
 * languages the site supports, falling back to the default language.
 */
export function resolveLanguage(input: string | null | undefined): SupportedLanguage {
  if (input == null) {
    return DEFAULT_LANGUAGE;
  }

  const prefix = input.trim().toLowerCase().split('-')[0];
  return LANGUAGE_BY_PREFIX[prefix] ?? DEFAULT_LANGUAGE;
}
