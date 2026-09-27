/**
 * User selectable application theme preference.
 *
 * `system` follows the operating system / browser colour scheme, while
 * `light` and `dark` pin the interface to a specific theme.
 *
 * This only affects the README Studio interface. It never influences the
 * generated README Markdown — GitHub renders README.md independently.
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * The concrete theme currently applied to the interface after resolving
 * a `ThemePreference` against the system colour scheme.
 */
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeOption {
  id: ThemePreference;
  label: string;
  description: string;
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}
