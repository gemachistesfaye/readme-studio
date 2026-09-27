import { TechCategory, LicenseType } from '@/types';

/**
 * Mapping of known GitHub language names to README Studio TechCategories.
 */
export const GITHUB_LANGUAGE_CATEGORY_MAP: Record<string, { category: TechCategory; normalizedName?: string }> = {
  TypeScript: { category: 'Language', normalizedName: 'TypeScript' },
  JavaScript: { category: 'Language', normalizedName: 'JavaScript' },
  Python: { category: 'Language', normalizedName: 'Python' },
  Go: { category: 'Language', normalizedName: 'Go' },
  Rust: { category: 'Language', normalizedName: 'Rust' },
  Java: { category: 'Language', normalizedName: 'Java' },
  'C++': { category: 'Language', normalizedName: 'C++' },
  C: { category: 'Language', normalizedName: 'C' },
  'C#': { category: 'Language', normalizedName: 'C#' },
  Ruby: { category: 'Language', normalizedName: 'Ruby' },
  PHP: { category: 'Language', normalizedName: 'PHP' },
  Swift: { category: 'Language', normalizedName: 'Swift' },
  Kotlin: { category: 'Language', normalizedName: 'Kotlin' },
  Dart: { category: 'Language', normalizedName: 'Dart' },
  Scala: { category: 'Language', normalizedName: 'Scala' },
  Elixir: { category: 'Language', normalizedName: 'Elixir' },
  Clojure: { category: 'Language', normalizedName: 'Clojure' },
  Haskell: { category: 'Language', normalizedName: 'Haskell' },
  Lua: { category: 'Language', normalizedName: 'Lua' },
  R: { category: 'Language', normalizedName: 'R' },
  HTML: { category: 'Frontend', normalizedName: 'HTML5' },
  CSS: { category: 'Frontend', normalizedName: 'CSS3' },
  SCSS: { category: 'Frontend', normalizedName: 'Sass / SCSS' },
  Vue: { category: 'Frontend', normalizedName: 'Vue.js' },
  Svelte: { category: 'Frontend', normalizedName: 'Svelte' },
  Shell: { category: 'Tools', normalizedName: 'Bash / Shell' },
  Dockerfile: { category: 'DevOps / Cloud', normalizedName: 'Docker' },
  Solidity: { category: 'Language', normalizedName: 'Solidity' },
  Julia: { category: 'Language', normalizedName: 'Julia' },
  Zig: { category: 'Language', normalizedName: 'Zig' },
};

/**
 * Common package.json dependency names mapped to display technology and category.
 */
export const PACKAGE_JSON_TECH_MAP: Record<string, { name: string; category: TechCategory }> = {
  react: { name: 'React', category: 'Frontend' },
  'react-dom': { name: 'React', category: 'Frontend' },
  vue: { name: 'Vue.js', category: 'Frontend' },
  svelte: { name: 'Svelte', category: 'Frontend' },
  next: { name: 'Next.js', category: 'Frontend' },
  nuxt: { name: 'Nuxt', category: 'Frontend' },
  angular: { name: 'Angular', category: 'Frontend' },
  '@angular/core': { name: 'Angular', category: 'Frontend' },
  express: { name: 'Express', category: 'Backend' },
  nestjs: { name: 'NestJS', category: 'Backend' },
  '@nestjs/core': { name: 'NestJS', category: 'Backend' },
  fastify: { name: 'Fastify', category: 'Backend' },
  koa: { name: 'Koa', category: 'Backend' },
  tailwindcss: { name: 'Tailwind CSS', category: 'Frontend' },
  vite: { name: 'Vite', category: 'Tools' },
  webpack: { name: 'Webpack', category: 'Tools' },
  esbuild: { name: 'esbuild', category: 'Tools' },
  prisma: { name: 'Prisma', category: 'Database' },
  '@prisma/client': { name: 'Prisma', category: 'Database' },
  mongoose: { name: 'MongoDB / Mongoose', category: 'Database' },
  pg: { name: 'PostgreSQL', category: 'Database' },
  mysql2: { name: 'MySQL', category: 'Database' },
  sqlite3: { name: 'SQLite', category: 'Database' },
  redis: { name: 'Redis', category: 'Database' },
  graphql: { name: 'GraphQL', category: 'Backend' },
  jest: { name: 'Jest', category: 'Tools' },
  vitest: { name: 'Vitest', category: 'Tools' },
  playwright: { name: 'Playwright', category: 'Tools' },
  cypress: { name: 'Cypress', category: 'Tools' },
  typescript: { name: 'TypeScript', category: 'Language' },
};

/**
 * Map GitHub SPDX license identifiers to README Studio LicenseType.
 */
export const GITHUB_SPDX_LICENSE_MAP: Record<string, LicenseType> = {
  mit: 'MIT',
  'apache-2.0': 'Apache-2.0',
  'gpl-3.0': 'GPL-3.0',
  'bsd-3-clause': 'BSD-3-Clause',
  isc: 'ISC',
  'mpl-2.0': 'MPL-2.0',
  unlicense: 'Unlicense',
};
