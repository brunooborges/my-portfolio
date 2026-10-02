import {
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTailwindcss,
  siTypescript,
} from 'simple-icons';

export interface TechTile {
  id: string;
  label: string;
  /** SVG path data on a 24x24 viewBox. */
  path: string;
  /** Brand color, `#RRGGBB`, or `currentColor` for a mark that follows the text color. */
  color: string;
}

/**
 * Generic cloud glyph (Material Design "cloud", Apache-2.0) for the AWS tile:
 * the AWS logo is not available in simple-icons and is not reproduced here.
 */
const CLOUD_PATH =
  'M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z';

// Next.js is black in simple-icons: follow the text color so it shows on dark and light pages.
const NEXTJS_COLOR = 'currentColor';

export const techStack: readonly TechTile[] = [
  { id: 'typescript', label: 'TypeScript', path: siTypescript.path, color: `#${siTypescript.hex}` },
  { id: 'react', label: 'React', path: siReact.path, color: `#${siReact.hex}` },
  { id: 'nextjs', label: 'Next.js', path: siNextdotjs.path, color: NEXTJS_COLOR },
  { id: 'nodejs', label: 'Node.js', path: siNodedotjs.path, color: `#${siNodedotjs.hex}` },
  { id: 'nestjs', label: 'NestJS', path: siNestjs.path, color: `#${siNestjs.hex}` },
  { id: 'postgresql', label: 'PostgreSQL', path: siPostgresql.path, color: `#${siPostgresql.hex}` },
  { id: 'tailwind', label: 'Tailwind', path: siTailwindcss.path, color: `#${siTailwindcss.hex}` },
  { id: 'aws', label: 'AWS', path: CLOUD_PATH, color: '#FF9900' },
];
