import { useTranslation } from 'react-i18next';

import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUMES } from '../../../../data/contact';
import { resolveLanguage } from '../../../../i18n/languages';

import { Container } from './styles';

interface ContactProps {
  id: string;
}

const EXTERNAL_REL = 'noopener noreferrer';

export default function Contact({ id }: ContactProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const resume = RESUMES[resolveLanguage(i18n.resolvedLanguage ?? i18n.language)];

  return (
    <Container
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>{t('contact.title')}</h2>
      <p className='intro'>{t('contact.intro')}</p>

      <div className='actions'>
        <a
          className='button primary'
          href={`mailto:${EMAIL}`}
        >
          {EMAIL}
        </a>
        <a
          className='button secondary'
          href={resume.href}
          download={resume.downloadName}
        >
          {t('contact.resume')}
        </a>
      </div>

      <ul
        className='profiles'
        translate='no'
      >
        <li>
          <a
            href={LINKEDIN_URL}
            target='_blank'
            rel={EXTERNAL_REL}
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={GITHUB_URL}
            target='_blank'
            rel={EXTERNAL_REL}
          >
            GitHub
          </a>
        </li>
      </ul>
    </Container>
  );
}
