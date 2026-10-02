import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { resolveLanguage } from '../i18n/languages';

/**
 * Keeps <html lang>, the document title and the meta description in sync
 * with the active language.
 */
export default function useDocumentMeta(): void {
  const { t, i18n } = useTranslation();
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const title = t('meta.title');
  const description = t('meta.description');

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description);
  }, [language, title, description]);
}
