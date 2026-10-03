import { type SupportedLanguage } from '../i18n/languages';

export const EMAIL = 'bborgesfilho33@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/brunooborges/';
export const GITHUB_URL = 'https://github.com/brunooborges/';

interface Resume {
  /** Served from `public/cv/`. */
  href: string;
  /** File name the browser saves it as. */
  downloadName: string;
}

/** One resume per site language; the Contact section offers the one matching the active language. */
export const RESUMES: Record<SupportedLanguage, Resume> = {
  'en-US': {
    href: '/cv/bruno-borges-resume-en-us.pdf',
    downloadName: 'Bruno_de_Oliveira_Borges_Filho_Resume_EN-US.pdf',
  },
  'pt-BR': {
    href: '/cv/bruno-borges-curriculo-pt-br.pdf',
    downloadName: 'Bruno_de_Oliveira_Borges_Filho_Curriculo_PT-BR.pdf',
  },
};
