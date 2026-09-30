import { useTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE } from '../i18n/languages';

const NAMESPACE = 'translation';

function toStringList(value: unknown): string[] | null {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : null;
}

/**
 * Reads a list of strings from the locale files, falling back to the default
 * language. A missing key (or a key that points at a plain string) yields an
 * empty list instead of crashing the render.
 */
export default function useTranslatedList(key: string): string[] {
  const { i18n } = useTranslation();
  const current = toStringList(i18n.getResource(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE, NAMESPACE, key));

  return current ?? toStringList(i18n.getResource(DEFAULT_LANGUAGE, NAMESPACE, key)) ?? [];
}
