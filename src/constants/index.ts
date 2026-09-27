import { AppConfig } from '@/types';

export const APP_CONFIG: AppConfig = {
  name: 'README Studio',
  version: '0.1.0',
  description: 'Modern, interactive GitHub README generator for developers.',
};

export const REPO_URL = 'https://github.com';

export { BADGE_STYLES, TECH_BADGE_PRESETS, type TechBadgePreset } from './badges';
export { README_TEMPLATES } from './templates';
export { LICENSE_OPTIONS } from './licenses';
export { TECH_CATEGORIES, QUICK_ADD_OPTIONS } from './techStack';
export { USAGE_CODE_LANGUAGES } from './usage';
