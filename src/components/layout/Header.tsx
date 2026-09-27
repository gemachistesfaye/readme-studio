import React from 'react';
import { FileCode2, Github, Terminal } from 'lucide-react';
import { APP_CONFIG, REPO_URL } from '@/constants';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <FileCode2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-zinc-100">
                {APP_CONFIG.name}
              </h1>
              <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-700/50">
                v{APP_CONFIG.version}
              </span>
            </div>
            <p className="hidden text-xs text-zinc-400 sm:block">
              Clean, professional GitHub README builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-400 border border-zinc-800 md:flex">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>&gt;_ README.md</span>
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
