import { useSyncExternalStore } from 'react';
import { ResolvedTheme, ThemePreference } from '@/types/theme';
import {
  DARK_MODE_CLASS,
  DARK_SCHEME_MEDIA_QUERY,
  DEFAULT_THEME_PREFERENCE,
} from '@/constants/theme';

export interface ThemeState {
  /** What the user selected: light, dark, or system. */
  themePreference: ThemePreference;
  /** What is actually applied right now after resolving the preference. */
  resolvedTheme: ResolvedTheme;
  setThemePreference: (preference: ThemePreference) => void;
}

/**
 * Resolves a user preference against the detected system theme.
 * Pure and synchronous so the mapping stays testable and obvious.
 */
export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme
): ResolvedTheme {
  if (preference === 'system') return systemTheme;
  return preference;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia(DARK_SCHEME_MEDIA_QUERY).matches ? 'dark' : 'light';
}

/**
 * Centralized theme application. Components never check the theme themselves —
 * they only consume the hook below, and the DOM is updated here.
 */
function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.toggle(DARK_MODE_CLASS, theme === 'dark');
  root.style.colorScheme = theme;
}

/**
 * Phase 13 keeps the preference in memory only. Persistence (along with the
 * README draft and section order) is introduced in Phase 14.
 */
let themePreference: ThemePreference = DEFAULT_THEME_PREFERENCE;
let systemTheme: ResolvedTheme = getSystemTheme();
let resolvedTheme: ResolvedTheme = resolveTheme(themePreference, systemTheme);

const listeners = new Set<() => void>();
let snapshot: ThemeState = buildSnapshot();
let mediaQuery: MediaQueryList | null = null;
let subscriberCount = 0;

function buildSnapshot(): ThemeState {
  return {
    themePreference,
    resolvedTheme,
    setThemePreference,
  };
}

function publish(): void {
  resolvedTheme = resolveTheme(themePreference, systemTheme);
  applyTheme(resolvedTheme);
  snapshot = buildSnapshot();
  for (const listener of listeners) listener();
}

function setThemePreference(preference: ThemePreference): void {
  if (preference === themePreference) return;
  themePreference = preference;
  publish();
}

function handleSystemThemeChange(event: MediaQueryListEvent): void {
  const next: ResolvedTheme = event.matches ? 'dark' : 'light';
  if (next === systemTheme) return;
  systemTheme = next;
  publish();
}

function attachSystemListener(): void {
  if (mediaQuery || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return;
  }
  mediaQuery = window.matchMedia(DARK_SCHEME_MEDIA_QUERY);
  systemTheme = mediaQuery.matches ? 'dark' : 'light';
  mediaQuery.addEventListener('change', handleSystemThemeChange);
}

function detachSystemListener(): void {
  if (!mediaQuery) return;
  mediaQuery.removeEventListener('change', handleSystemThemeChange);
  mediaQuery = null;
}

/**
 * Reference-counted subscription so the media query listener exists only while
 * at least one component is using the theme, and is never registered twice
 * (including under React StrictMode double-mounting).
 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  subscriberCount += 1;
  if (subscriberCount === 1) attachSystemListener();

  return () => {
    listeners.delete(listener);
    subscriberCount -= 1;
    if (subscriberCount === 0) detachSystemListener();
  };
}

function getSnapshot(): ThemeState {
  return snapshot;
}

function getServerSnapshot(): ThemeState {
  return snapshot;
}

// Apply the resolved theme as early as possible so the first paint matches the
// preference. The provider effect below re-applies it once React mounts.
applyTheme(resolvedTheme);

/**
 * Returns the current theme preference, the resolved theme, and a setter.
 * Safe to call from any component that needs the theme UI.
 */
export function useTheme(): ThemeState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
