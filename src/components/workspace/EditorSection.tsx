import React, { useState } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface EditorSectionProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{title}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-0.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-300' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-200 dark:border-zinc-800/60">
          {children ? (
            children
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 px-3 py-2.5 text-xs text-zinc-500 dark:text-zinc-600">
              Configuration options will be available in subsequent phases.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
