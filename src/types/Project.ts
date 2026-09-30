import type enUS from '../i18n/locales/en-US.json';

export type ProjectVisibility = 'public' | 'private';

/** A project that has copy in the locale files (`projects.<slug>`). */
export type ProjectSlug = keyof typeof enUS.projects;

export interface Project {
  id: number;
  slug: ProjectSlug;
  name: string;
  visibility: ProjectVisibility;
  tech: readonly string[];
  /** Screenshot URL. Projects without cleared media render a designed placeholder. */
  screenshot?: string;
  github?: string;
  /** Second repository (e.g. the API next to a front end). */
  github2?: string;
  live?: string;
}
