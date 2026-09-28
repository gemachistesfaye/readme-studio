import React, { useState } from 'react';
import { FileCode2, Github, LogOut, Terminal } from 'lucide-react';
import { APP_CONFIG } from '@/constants';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  onOpenGitHubImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGitHubImport }) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { status, user, connect, disconnect } = useGitHubAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20 dark:bg-indigo-600/20 dark:text-indigo-400 dark:ring-indigo-500/30">
            <FileCode2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {APP_CONFIG.name}
              </h1>
              <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700/50 dark:bg-zinc-800 dark:text-zinc-400">
                v{APP_CONFIG.version}
              </span>
            </div>
            <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
              Clean, professional GitHub README builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-xs text-zinc-500 md:flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Terminal className="h-3.5 w-3.5 text-orange-600 dark:text-indigo-400" />
            <span>&gt;_ README.md</span>
          </div>

          <ThemeSwitcher />
          {status === 'authenticated' && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
                aria-label={`GitHub account: ${user.login}`}
                className="flex h-9 items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-2.5 text-orange-700 transition-colors hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-5 w-5 rounded-full" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                <span className="hidden max-w-24 truncate text-xs font-medium sm:inline">{user.login}</span>
              </button>

              {isAccountOpen && (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-orange-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountOpen(false);
                      void disconnect();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-orange-50 hover:text-orange-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Disconnect GitHub
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={status === 'loading'}
              aria-label="Connect GitHub"
              className="flex h-9 items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 text-orange-700 transition-colors hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:cursor-wait disabled:opacity-60 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:border-orange-500/50 dark:hover:bg-orange-500/20"
            >
              <Github className="h-4 w-4" />
              <span className="hidden text-xs font-medium sm:inline">Connect GitHub</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenGitHubImport}
            aria-label="Import from GitHub"
            title="Import from GitHub"
            className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Github className="h-4 w-4" />
            <span className="hidden text-xs font-medium sm:inline">Import</span>
          </button>
        </div>
      </div>
    </header>
  );
};
