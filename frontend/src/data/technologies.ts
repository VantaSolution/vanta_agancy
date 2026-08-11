import { Technology } from '@/types';

export const technologies: Technology[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'REST APIs', category: 'Architecture' },
  { name: 'Cloud Hosting', category: 'Infrastructure' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Vite', category: 'Tooling' },
];

export const technologyConnections: [number, number][] = [
  [0, 1],  // React — Next.js
  [0, 2],  // React — TypeScript
  [1, 2],  // Next.js — TypeScript
  [3, 4],  // Node.js — Express
  [3, 2],  // Node.js — TypeScript
  [4, 5],  // Express — PostgreSQL
  [4, 6],  // Express — REST APIs
  [3, 7],  // Node.js — Cloud Hosting
  [0, 8],  // React — Tailwind CSS
  [0, 9],  // React — Vite
  [1, 9],  // Next.js — Vite
  [5, 6],  // PostgreSQL — REST APIs
];
