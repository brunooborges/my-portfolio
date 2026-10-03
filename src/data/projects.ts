import brmoneyApiTransactions from '../assets/images/projects-images/brmoney/api-transactions.webp';
import brmoneyDashboard from '../assets/images/projects-images/brmoney/dashboard.webp';
import foodiaryActivity from '../assets/images/projects-images/foodiary/activity.webp';
import foodiaryDashboard from '../assets/images/projects-images/foodiary/dashboard.webp';
import foodiaryGoal from '../assets/images/projects-images/foodiary/goal.webp';
import foodiaryMeal from '../assets/images/projects-images/foodiary/meal.webp';
import foodiaryWelcome from '../assets/images/projects-images/foodiary/welcome.webp';
import gazerDashboard from '../assets/images/projects-images/gazer/dashboard.webp';
import gazerDirectives from '../assets/images/projects-images/gazer/directives.webp';
import gazerFeed from '../assets/images/projects-images/gazer/feed.webp';
import gazerPortfolio from '../assets/images/projects-images/gazer/portfolio.webp';
import gazerSignin from '../assets/images/projects-images/gazer/signin.webp';
import gazerStats from '../assets/images/projects-images/gazer/stats.webp';
import fincheck from '../assets/images/projects-images/fincheck.webp';
import githubSearch from '../assets/images/projects-images/github-search.webp';
import mycontacts from '../assets/images/projects-images/mycontacts.webp';
import { type Project } from '../types/Project';

const GITHUB = 'https://github.com/brunooborges';
const PAGES = 'https://brunooborges.github.io';

/**
 * Featured projects, shown in the slider. Company projects (Gazer, BR.Money)
 * are private: no repository or live links, only cleared screenshots from
 * `src/assets/images/projects-images/`.
 */
export const featuredProjects: readonly Project[] = [
  {
    id: 1,
    slug: 'gazer',
    name: 'Gazer',
    visibility: 'private',
    caseStudy: 'gazer',
    tech: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Prisma', 'PostgreSQL', 'WebSockets'],
    screenshots: [gazerDashboard, gazerDirectives, gazerFeed, gazerPortfolio, gazerStats, gazerSignin],
  },
  {
    id: 2,
    slug: 'brmoney',
    name: 'BR.Money',
    visibility: 'private',
    caseStudy: 'brmoney',
    tech: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Prisma', 'PostgreSQL', 'PIX'],
    screenshots: [brmoneyDashboard, brmoneyApiTransactions],
  },
  {
    id: 3,
    slug: 'foodiary',
    name: 'Foodiary',
    visibility: 'public',
    caseStudy: 'foodiary',
    tech: ['React Native', 'Expo', 'TypeScript', 'AWS Lambda', 'S3', 'SQS', 'PostgreSQL', 'OpenAI'],
    screenshots: [foodiaryWelcome, foodiaryGoal, foodiaryActivity, foodiaryDashboard, foodiaryMeal],
    screenshotOrientation: 'portrait',
    github: `${GITHUB}/foodiary-frontend`,
    github2: `${GITHUB}/foodiary-api`,
  },
  {
    id: 4,
    slug: 'fincheck',
    name: 'Fincheck',
    visibility: 'public',
    tech: ['React', 'TypeScript', 'Tailwind', 'NestJS', 'Prisma', 'PostgreSQL'],
    screenshots: [fincheck],
    github: `${GITHUB}/my-fincheck-frontend`,
    github2: `${GITHUB}/my-fincheck-api`,
    live: `${PAGES}/my-fincheck-frontend/`,
  },
  {
    id: 5,
    slug: 'mycontacts',
    name: 'MyContacts',
    visibility: 'public',
    tech: ['React', 'styled-components', 'Node.js', 'Express', 'PostgreSQL'],
    screenshots: [mycontacts],
    github: `${GITHUB}/mycontacts-front-end`,
    github2: `${GITHUB}/mycontacts-api`,
    live: `${PAGES}/mycontacts-front-end/`,
  },
  {
    id: 6,
    slug: 'github-search',
    name: 'Github Search',
    visibility: 'public',
    tech: ['React', 'TypeScript', 'GitHub REST API'],
    screenshots: [githubSearch],
    github: `${GITHUB}/github-search`,
    live: `${PAGES}/github-search/`,
  },
];

/** Small projects, shown as a compact "More experiments" list. */
export const experimentProjects: readonly Project[] = [
  {
    id: 7,
    slug: 'tic-tac-toe',
    name: 'Tic-tac-toe',
    visibility: 'public',
    tech: ['React'],
    github: `${GITHUB}/tic-tac-toe`,
    live: `${PAGES}/tic-tac-toe/`,
  },
  {
    id: 8,
    slug: 'memory-game',
    name: 'Memory Game',
    visibility: 'public',
    tech: ['React'],
    github: `${GITHUB}/react-memory-game`,
    live: `${PAGES}/react-memory-game/`,
  },
  {
    id: 9,
    slug: 'multi-step-form',
    name: 'Multi-step Form',
    visibility: 'public',
    tech: ['React'],
    github: `${GITHUB}/multi-step-form`,
    live: `${PAGES}/multi-step-form/`,
  },
  {
    id: 10,
    slug: 'to-do-list',
    name: 'To-do List',
    visibility: 'public',
    tech: ['React'],
    github: `${GITHUB}/to-do-list`,
    live: `${PAGES}/to-do-list/`,
  },
];

export const projects: readonly Project[] = [...featuredProjects, ...experimentProjects];
