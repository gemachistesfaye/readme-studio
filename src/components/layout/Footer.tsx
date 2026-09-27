import React from 'react';
import { APP_CONFIG } from '@/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:flex-row sm:px-6 lg:px-8 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          <span>{APP_CONFIG.name} Architecture Foundation</span>
        </div>
        <p className="text-center sm:text-right">
          Developer-focused studio for generating production-ready READMEs.
        </p>
      </div>
    </footer>
  );
};
