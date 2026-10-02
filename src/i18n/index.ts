import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  resolveLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './languages';
import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

export const resources = {
  'en-US': { translation: enUS },
  'pt-BR': { translation: ptBR },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    load: 'currentOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      // Only an explicit choice is stored (see setLanguage), so a later change of
      // browser language is still honoured for visitors who never picked one.
      caches: [],
      // Browsers report "pt", "pt-PT", "en-GB"... Map them onto the two supported locales.
      convertDetectedLanguage: (detected: string) => resolveLanguage(detected),
    },
  });

/** Switches language and remembers the visitor's explicit choice. */
export async function setLanguage(language: SupportedLanguage): Promise<void> {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage can be blocked (private mode, site settings); the switch still works.
  }
  await i18n.changeLanguage(language);
}

export default i18n;
