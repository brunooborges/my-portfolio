import { useTranslation } from 'react-i18next';

import { setLanguage } from '../../i18n';
import { resolveLanguage, type SupportedLanguage } from '../../i18n/languages';
import { Container } from './styles';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  /** Accessible name: the visible label plus the language's own name. */
  name: string;
}

const OPTIONS: readonly LanguageOption[] = [
  { code: 'en-US', label: 'EN', name: 'EN - English' },
  { code: 'pt-BR', label: 'PT', name: 'PT - Português' },
];

export default function LanguageSwitcher(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const current = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);

  return (
    <Container
      role='group'
      aria-label={t('nav.language')}
    >
      {OPTIONS.map(({ code, label, name }) => (
        <button
          key={code}
          type='button'
          lang={code}
          aria-label={name}
          aria-pressed={current === code}
          onClick={() => {
            void setLanguage(code);
          }}
        >
          {label}
        </button>
      ))}
    </Container>
  );
}
