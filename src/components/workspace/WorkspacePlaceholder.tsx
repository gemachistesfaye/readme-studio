import React from 'react';
import { Layers, Sparkles, Code2, Cpu } from 'lucide-react';

export const WorkspacePlaceholder: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-300 ring-1 ring-zinc-700/50 mb-6">
          <Layers className="h-7 w-7 text-indigo-400" />
        </div>

        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          Workspace Ready
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-400">
          The foundation for README Studio is initialized. Interactive builder tools, section editors, and live Markdown preview will be enabled in subsequent phases.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left">
            <Code2 className="h-5 w-5 text-indigo-400 mb-2" />
            <h3 className="text-xs font-semibold text-zinc-200">Component Architecture</h3>
            <p className="mt-1 text-xs text-zinc-500">Modular design system ready for form inputs & preview panels.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left">
            <Cpu className="h-5 w-5 text-indigo-400 mb-2" />
            <h3 className="text-xs font-semibold text-zinc-200">TypeScript Scaffolding</h3>
            <p className="mt-1 text-xs text-zinc-500">Strict mode typing for schema definitions and document state.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left">
            <Sparkles className="h-5 w-5 text-indigo-400 mb-2" />
            <h3 className="text-xs font-semibold text-zinc-200">Tailwind Engine</h3>
            <p className="mt-1 text-xs text-zinc-500">Clean, responsive styling with developer-centric theme variables.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
