import { ReadmeSectionId, SectionMeta } from '@/types';

/**
 * Canonical default ordering of the reorderable README sections.
 *
 * This is the single source of truth for section order. Never duplicate this
 * array in components, hooks, or utilities — read from here instead.
 *
 * Note: the project title, badge row, and description are intentionally NOT
 * part of this list. The identity header always renders first so the README
 * keeps a predictable top area.
 */
export const DEFAULT_SECTION_ORDER = [
  'techStack',
  'features',
  'installation',
  'usage',
  'contributing',
  'license',
  'contact',
] as const satisfies readonly ReadmeSectionId[];

/**
 * Centralized presentation metadata for every reorderable README section.
 * Used by the Section Order customization UI so labels are never duplicated.
 */
const SECTION_META: Record<ReadmeSectionId, SectionMeta> = {
  techStack: {
    id: 'techStack',
    label: 'Tech Stack',
    description: 'Languages, frameworks, runtimes, and core tools',
  },
  features: {
    id: 'features',
    label: 'Features',
    description: 'Key capabilities and highlights of your project',
  },
  installation: {
    id: 'installation',
    label: 'Installation',
    description: 'Prerequisites, dependency install, and setup steps',
  },
  usage: {
    id: 'usage',
    label: 'Usage',
    description: 'Quickstart guidance and code examples',
  },
  contributing: {
    id: 'contributing',
    label: 'Contributing',
    description: 'Contribution guidelines and pull request rules',
  },
  license: {
    id: 'license',
    label: 'License',
    description: 'Open source or proprietary license notice',
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    description: 'Author details, social handles, and support links',
  },
};

/**
 * Reorderable sections in default order, ready to render in the UI.
 */
export const README_SECTIONS: readonly SectionMeta[] = DEFAULT_SECTION_ORDER.map(
  (id) => SECTION_META[id]
);

/**
 * Looks up display metadata for a single README section.
 */
export function getSectionMeta(id: ReadmeSectionId): SectionMeta {
  return SECTION_META[id];
}
