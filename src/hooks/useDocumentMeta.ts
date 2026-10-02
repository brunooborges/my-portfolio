import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { resolveLanguage } from '../i18n/languages';

function setMeta(selector: string, content: string): void {
  document.querySelector(selector)?.setAttribute('content', content);
}

/**
 * Keeps <html lang>, the document title, the meta description and the share-preview
 * tags (Open Graph, Twitter) in sync with the active language. The tags themselves live
 * in index.html, because link-preview crawlers do not run JavaScript.
 */
export default function useDocumentMeta(): void {
  const { t, i18n } = useTranslation();
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const title = t('meta.title');
  const description = t('meta.description');

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', language.replace('-', '_'));
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [language, title, description]);
}
