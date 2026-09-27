import React, { useEffect, useRef, useState } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { THEME_OPTIONS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { ThemePreference } from '@/types/theme';

const THEME_ICONS: Record<ThemePreference, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const THEME_LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/**
 * Compact theme control for the header. Selecting an option updates the
 * in-memory theme store immediately; the "System" option stays in sync with
 * OS-level colour scheme changes while it is selected.
 */
export const ThemeSwitcher: React.FC = () => {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    containerRef.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus();
  }, [isOpen]);

  const ActiveIcon = themePreference === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  const activeLabel =
    themePreference === 'system' ? `System (${THEME_LABELS[resolvedTheme]})` : THEME_LABELS[themePreference];

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Theme: ${activeLabel}`}
        title={`Theme: ${activeLabel}`}
        className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        <ActiveIcon className="h-4 w-4" />
        <span className="hidden text-xs font-medium sm:inline">{activeLabel}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Interface theme"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40"
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = THEME_ICONS[option.id];
            const isSelected = option.id === themePreference;

            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setThemePreference(option.id);
                  setIsOpen(false);
                  buttonRef.current?.focus();
                }}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800"
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {option.label}
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
