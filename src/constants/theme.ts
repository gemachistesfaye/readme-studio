import { ThemeOption, ThemePreference } from '@/types/theme';

/**
 * Media query used to detect the operating system / browser colour scheme.
 */
export const DARK_SCHEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/**
 * Root class toggled by the theme system. Tailwind's `dark:` variant is
 * wired to this class in `src/index.css`.
 */
export const DARK_MODE_CLASS = 'dark';

/**
 * Preference used on first load. Phase 13 keeps theme selection in memory,
 * so every reload starts from the operating system preference.
 */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export const THEME_PREFERENCE_STORAGE_KEY = 'readme-studio:theme';

export const THEME_OPTIONS: readonly ThemeOption[] = [
  {
    id: 'light',
    label: 'Light',
    description: 'Always use the light interface theme',
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Always use the dark interface theme',
  },
  {
    id: 'system',
    label: 'System',
    description: 'Follow the operating system or browser colour scheme',
  },
];
