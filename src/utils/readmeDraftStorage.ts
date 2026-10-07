import {
  BadgeStyle,
  BadgeType,
  LicenseType,
  ReadmeBadge,
  ReadmeData,
  TechCategory,
  Technology,
  UsageExample,
  Feature,
  InstallationStep,
} from '@/types';
import { DEFAULT_SECTION_ORDER } from '@/constants/sections';
import { normalizeSectionOrder } from './sectionOrder';

export const README_DRAFT_STORAGE_KEY = 'readme-studio:draft';
export const README_DRAFT_SCHEMA_VERSION = 1;

interface StoredReadmeDraft {
  version: number;
  data: ReadmeData;
}

const TECH_CATEGORIES: readonly TechCategory[] = [
  'Language',
  'Frontend',
  'Backend',
  'Database',
  'AI / ML',
  'DevOps / Cloud',
  'Tools',
  'Other',
];

const LICENSE_TYPES: readonly LicenseType[] = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'BSD-3-Clause',
  'ISC',
  'MPL-2.0',
  'Unlicense',
  'Proprietary',
  'Custom',
  'None',
];

const BADGE_TYPES: readonly BadgeType[] = ['technology', 'license', 'custom'];
const BADGE_STYLES: readonly BadgeStyle[] = ['flat', 'flat-square', 'plastic', 'for-the-badge'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === 'string' && values.includes(value as T);
}

function normalizeTechnology(value: unknown, index: number): Technology | null {
  if (!isRecord(value) || !stringValue(value.name).trim() || !isOneOf(value.category, TECH_CATEGORIES)) {
    return null;
  }
  return {
    id: stringValue(value.id) || `tech-restored-${index}`,
    name: stringValue(value.name),
    category: value.category,
  };
}

function normalizeFeature(value: unknown, index: number): Feature | null {
  if (!isRecord(value) || !stringValue(value.title).trim()) return null;
  return {
    id: stringValue(value.id) || `feature-restored-${index}`,
    title: stringValue(value.title),
    description: stringValue(value.description),
  };
}

function normalizeInstallationStep(value: unknown, index: number): InstallationStep | null {
  if (!isRecord(value) || !stringValue(value.instruction).trim()) return null;
  return {
    id: stringValue(value.id) || `step-restored-${index}`,
    instruction: stringValue(value.instruction),
    command: stringValue(value.command),
  };
}

function normalizeUsageExample(value: unknown, index: number): UsageExample | null {
  if (!isRecord(value) || !stringValue(value.title).trim()) return null;
  return {
    id: stringValue(value.id) || `usage-restored-${index}`,
    title: stringValue(value.title),
    description: stringValue(value.description),
    code: stringValue(value.code),
    language: stringValue(value.language) || 'bash',
  };
}

function normalizeBadge(value: unknown, index: number): ReadmeBadge | null {
  if (!isRecord(value) || !stringValue(value.label).trim() || !isOneOf(value.type, BADGE_TYPES)) {
    return null;
  }
  return {
    id: stringValue(value.id) || `badge-restored-${index}`,
    type: value.type,
    label: stringValue(value.label),
    ...(typeof value.message === 'string' ? { message: value.message } : {}),
    ...(typeof value.color === 'string' ? { color: value.color } : {}),
    ...(typeof value.logo === 'string' ? { logo: value.logo } : {}),
    ...(typeof value.link === 'string' ? { link: value.link } : {}),
    ...(isOneOf(value.style, BADGE_STYLES) ? { style: value.style } : {}),
  };
}

export function createInitialReadmeData(): ReadmeData {
  return {
    basicInfo: {
      projectName: '',
      description: '',
      repositoryUrl: '',
      demoUrl: '',
      authorName: '',
      authorGithub: '',
    },
    badges: { badges: [] },
    techStack: { technologies: [] },
    features: { features: [] },
    installation: {
      prerequisites: '',
      cloneCommand: '',
      installCommand: '',
      setupInstructions: [],
    },
    usage: { introduction: '', examples: [] },
    contributing: {
      enabled: true,
      introduction: '',
      guidelines: [],
      customInstructions: '',
    },
    license: { type: 'MIT', customName: '', customText: '' },
    contact: {
      email: '',
      website: '',
      linkedin: '',
      twitter: '',
      additionalLinkLabel: '',
      additionalLinkUrl: '',
    },
    layout: {
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      includeToc: false,
    },
    githubStats: {
      enabled: false,
      username: '',
      showStats: true,
      showTopLangs: true,
      showStreak: true,
      theme: 'github_dark',
    },
  };
}

function hasReadmeShape(value: Record<string, unknown>): boolean {
  return ['basicInfo', 'badges', 'techStack', 'features', 'installation', 'usage', 'contributing', 'license', 'contact', 'layout']
    .some((key) => key in value);
}

/** Normalize current and legacy draft shapes without allowing malformed values into app state. */
export function normalizeReadmeData(input: unknown): ReadmeData {
  const defaults = createInitialReadmeData();
  if (!isRecord(input)) return defaults;

  const basicInfo = isRecord(input.basicInfo) ? input.basicInfo : {};
  const badges = isRecord(input.badges) ? input.badges : {};
  const techStack = isRecord(input.techStack) ? input.techStack : {};
  const features = isRecord(input.features) ? input.features : {};
  const installation = isRecord(input.installation) ? input.installation : {};
  const usage = isRecord(input.usage) ? input.usage : {};
  const contributing = isRecord(input.contributing) ? input.contributing : {};
  const license = isRecord(input.license) ? input.license : {};
  const contact = isRecord(input.contact) ? input.contact : {};
  const layout = isRecord(input.layout) ? input.layout : {};
  const githubStats = isRecord(input.githubStats) ? input.githubStats : {};

  return {
    basicInfo: {
      projectName: stringValue(basicInfo.projectName),
      description: stringValue(basicInfo.description),
      repositoryUrl: stringValue(basicInfo.repositoryUrl),
      demoUrl: stringValue(basicInfo.demoUrl),
      authorName: stringValue(basicInfo.authorName),
      authorGithub: stringValue(basicInfo.authorGithub),
    },
    badges: {
      badges: arrayValue(badges.badges)
        .map(normalizeBadge)
        .filter((badge): badge is ReadmeBadge => badge !== null),
    },
    techStack: {
      technologies: arrayValue(techStack.technologies)
        .map(normalizeTechnology)
        .filter((technology): technology is Technology => technology !== null),
    },
    features: {
      features: arrayValue(features.features)
        .map(normalizeFeature)
        .filter((feature): feature is Feature => feature !== null),
    },
    installation: {
      prerequisites: stringValue(installation.prerequisites),
      cloneCommand: stringValue(installation.cloneCommand),
      installCommand: stringValue(installation.installCommand),
      setupInstructions: arrayValue(installation.setupInstructions)
        .map(normalizeInstallationStep)
        .filter((step): step is InstallationStep => step !== null),
    },
    usage: {
      introduction: stringValue(usage.introduction),
      examples: arrayValue(usage.examples)
        .map(normalizeUsageExample)
        .filter((example): example is UsageExample => example !== null),
    },
    contributing: {
      enabled: typeof contributing.enabled === 'boolean' ? contributing.enabled : true,
      introduction: stringValue(contributing.introduction),
      guidelines: arrayValue(contributing.guidelines).filter(
        (guideline): guideline is string => typeof guideline === 'string'
      ),
      customInstructions: stringValue(contributing.customInstructions),
    },
    license: {
      type: isOneOf(license.type, LICENSE_TYPES) ? license.type : 'MIT',
      customName: stringValue(license.customName),
      customText: stringValue(license.customText),
    },
    contact: {
      email: stringValue(contact.email),
      website: stringValue(contact.website),
      linkedin: stringValue(contact.linkedin),
      twitter: stringValue(contact.twitter),
      additionalLinkLabel: stringValue(contact.additionalLinkLabel),
      additionalLinkUrl: stringValue(contact.additionalLinkUrl),
    },
    layout: {
      sectionOrder: normalizeSectionOrder(layout.sectionOrder),
      includeToc: typeof layout.includeToc === 'boolean' ? layout.includeToc : false,
    },
    githubStats: {
      enabled: typeof githubStats.enabled === 'boolean' ? githubStats.enabled : false,
      username: stringValue(githubStats.username),
      showStats: typeof githubStats.showStats === 'boolean' ? githubStats.showStats : true,
      showTopLangs: typeof githubStats.showTopLangs === 'boolean' ? githubStats.showTopLangs : true,
      showStreak: typeof githubStats.showStreak === 'boolean' ? githubStats.showStreak : true,
      theme: stringValue(githubStats.theme, 'github_dark'),
    },
  };
}

export function loadReadmeDraft(): ReadmeData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(README_DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;

    if (parsed.version !== README_DRAFT_SCHEMA_VERSION && parsed.version !== 0) return null;
    const source = parsed.version === README_DRAFT_SCHEMA_VERSION ? parsed.data : parsed;
    if (!isRecord(source) || !hasReadmeShape(source)) return null;

    return normalizeReadmeData(source);
  } catch {
    return null;
  }
}

export function saveReadmeDraft(data: ReadmeData): void {
  if (typeof window === 'undefined') return;

  const payload: StoredReadmeDraft = {
    version: README_DRAFT_SCHEMA_VERSION,
    data: normalizeReadmeData(data),
  };
  window.localStorage.setItem(README_DRAFT_STORAGE_KEY, JSON.stringify(payload));
}
