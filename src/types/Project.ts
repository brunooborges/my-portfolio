import type enUS from '../i18n/locales/en-US.json';

export type ProjectVisibility = 'public' | 'private';

/** Shape of a project's screenshots: desktop-style (default) or tall phone screens. */
export type ScreenshotOrientation = 'landscape' | 'portrait';

/** A project that has copy in the locale files (`projects.<slug>`). */
export type ProjectSlug = keyof typeof enUS.projects;

export interface Project {
  id: number;
  slug: ProjectSlug;
  name: string;
  visibility: ProjectVisibility;
  tech: readonly string[];
  /**
   * Screenshot URLs, in display order. Multi-image projects need one caption per image in the
   * locale files (`projects.<slug>.screenshots`). Projects without any render a placeholder.
   */
  screenshots?: readonly string[];
  /** Defaults to `landscape`. `portrait` gives the card and the enlarged view a phone-shaped frame. */
  screenshotOrientation?: ScreenshotOrientation;
  github?: string;
  /** Second repository (e.g. the API next to a front end). */
  github2?: string;
  live?: string;
}
