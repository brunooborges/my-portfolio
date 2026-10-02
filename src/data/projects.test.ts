import enUS from '../i18n/locales/en-US.json';
import ptBR from '../i18n/locales/pt-BR.json';
import { experimentProjects, featuredProjects, projects } from './projects';

const locales = { 'en-US': enUS, 'pt-BR': ptBR } as const;

describe('projects data', () => {
  it('lists the featured projects in the agreed order', () => {
    expect(featuredProjects.map((project) => project.slug)).toEqual([
      'gazer',
      'brmoney',
      'foodiary',
      'fincheck',
      'mycontacts',
      'github-search',
    ]);
  });

  it('lists the small experiments separately', () => {
    expect(experimentProjects.map((project) => project.slug)).toEqual([
      'tic-tac-toe',
      'memory-game',
      'multi-step-form',
      'to-do-list',
    ]);
  });

  it('links Foodiary to its front end and API repositories, with no live demo', () => {
    const foodiary = projects.find((project) => project.slug === 'foodiary');

    expect(foodiary?.visibility).toBe('public');
    expect(foodiary?.github).toBe('https://github.com/brunooborges/foodiary-frontend');
    expect(foodiary?.github2).toBe('https://github.com/brunooborges/foodiary-api');
    expect(foodiary?.live).toBeUndefined();
  });

  it('points the memory game at its current repository and Pages URL', () => {
    const memoryGame = projects.find((project) => project.slug === 'memory-game');

    expect(memoryGame?.github).toBe('https://github.com/brunooborges/react-memory-game');
    expect(memoryGame?.live).toBe('https://brunooborges.github.io/react-memory-game/');
  });

  it('uses unique slugs and ids', () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
  });

  it('never exposes source or live links for private company projects', () => {
    const privateProjects = projects.filter((project) => project.visibility === 'private');

    expect(privateProjects.map((project) => project.slug)).toEqual(['gazer', 'brmoney']);
    for (const project of privateProjects) {
      expect(project.github, project.slug).toBeUndefined();
      expect(project.github2, project.slug).toBeUndefined();
      expect(project.live, project.slug).toBeUndefined();
    }
  });

  it('gives every public project a repository link and https-only URLs', () => {
    for (const project of projects.filter((item) => item.visibility === 'public')) {
      expect(project.github, project.slug).toMatch(/^https:\/\/github\.com\//);
    }
    for (const url of projects.flatMap((project) => [project.github, project.github2, project.live])) {
      if (url !== undefined) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it('has a translated summary in every locale for every project', () => {
    for (const [code, locale] of Object.entries(locales)) {
      for (const project of projects) {
        const entry = (locale.projects as Record<string, { summary?: string }>)[project.slug];
        expect(entry?.summary, `${code} ${project.slug}`).toBeTruthy();
      }
    }
  });

  it('has highlights for every featured project in every locale', () => {
    for (const [code, locale] of Object.entries(locales)) {
      for (const project of featuredProjects) {
        const entry = (locale.projects as Record<string, { highlights?: string[] }>)[project.slug];
        expect(entry?.highlights?.length, `${code} ${project.slug}`).toBeGreaterThan(0);
      }
    }
  });

  it('gives Gazer and BR.Money real screenshots, in the agreed order and count', () => {
    const gazer = projects.find((project) => project.slug === 'gazer');
    const brmoney = projects.find((project) => project.slug === 'brmoney');

    expect(gazer?.screenshots).toHaveLength(6);
    expect(brmoney?.screenshots).toHaveLength(2);
  });

  it('gives Foodiary five portrait phone screenshots', () => {
    const foodiary = projects.find((project) => project.slug === 'foodiary');

    expect(foodiary?.screenshots).toHaveLength(5);
    expect(foodiary?.screenshotOrientation).toBe('portrait');
  });

  it('treats every other project as landscape', () => {
    for (const project of projects.filter((item) => item.slug !== 'foodiary')) {
      expect(project.screenshotOrientation ?? 'landscape', project.slug).toBe('landscape');
    }
  });

  it('never reuses the same image twice within a project', () => {
    for (const project of projects) {
      const images = project.screenshots ?? [];
      expect(new Set(images).size, project.slug).toBe(images.length);
    }
  });

  it('describes every screenshot of a multi-image project in every locale', () => {
    for (const [code, locale] of Object.entries(locales)) {
      for (const project of projects.filter((item) => (item.screenshots?.length ?? 0) > 1)) {
        const entry = (locale.projects as Record<string, { screenshots?: string[] }>)[project.slug];
        expect(entry?.screenshots, `${code} ${project.slug}`).toHaveLength(project.screenshots?.length ?? 0);
        for (const caption of entry?.screenshots ?? []) {
          expect(caption.trim(), `${code} ${project.slug}`).not.toBe('');
        }
      }
    }
  });

  it('lists at least one technology per featured project', () => {
    for (const project of featuredProjects) {
      expect(project.tech.length, project.slug).toBeGreaterThan(0);
    }
  });
});
