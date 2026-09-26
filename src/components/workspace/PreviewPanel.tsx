import React from 'react';
import { Copy, Download, Eye, FileCode, Github, ExternalLink, User } from 'lucide-react';
import { BasicInfoData } from '@/types';

interface PreviewPanelProps {
  basicInfo: BasicInfoData;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ basicInfo }) => {
  const displayTitle = basicInfo.projectName.trim() || 'Project Name';
  const displayDescription =
    basicInfo.description.trim() || 'Your project description will appear here.';

  const hasRepoUrl = !!basicInfo.repositoryUrl.trim();
  const hasDemoUrl = !!basicInfo.demoUrl.trim();
  const hasAuthor = !!basicInfo.authorName.trim();
  const hasAuthorGithub = !!basicInfo.authorGithub.trim();

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-sm sticky top-20">
      {/* Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Preview</h2>
            <p className="text-xs text-zinc-500">Live markdown representation</p>
          </div>
        </div>

        {/* Future Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Copy functionality will be enabled in a future phase"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-500 cursor-not-allowed transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </button>
          <button
            type="button"
            disabled
            title="Download functionality will be enabled in a future phase"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-500 cursor-not-allowed transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Rendered Markdown Preview Area */}
      <div className="mt-4 flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 font-sans">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-zinc-800/60 text-xs font-mono text-zinc-500">
          <FileCode className="h-3.5 w-3.5 text-zinc-400" />
          <span>README.md</span>
          <span className="ml-auto text-[11px] rounded bg-zinc-800/60 px-1.5 py-0.5 text-zinc-500">
            Live Preview
          </span>
        </div>

        {/* Document Content */}
        <article className="space-y-6 text-zinc-300">
          {/* Project Title & Description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              {displayTitle}
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap">
              {displayDescription}
            </p>

            {/* Quick Links (Repo & Demo) */}
            {(hasRepoUrl || hasDemoUrl) && (
              <div className="mt-4 flex flex-wrap items-center gap-3 pt-2 text-xs">
                {hasRepoUrl && (
                  <a
                    href={basicInfo.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Repository</span>
                  </a>
                )}
                {hasDemoUrl && (
                  <a
                    href={basicInfo.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Features Placeholder */}
          <div className="border-t border-zinc-800/60 pt-5">
            <h2 className="text-lg font-semibold text-zinc-200">Features</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Your project features will appear here.
            </p>
          </div>

          {/* Installation Placeholder */}
          <div className="border-t border-zinc-800/60 pt-5">
            <h2 className="text-lg font-semibold text-zinc-200">Installation</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Installation instructions will appear here.
            </p>
          </div>

          {/* Author Section (Rendered when Author Name is provided) */}
          {hasAuthor && (
            <div className="border-t border-zinc-800/60 pt-5">
              <h2 className="text-lg font-semibold text-zinc-200">Author</h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                <User className="h-4 w-4 text-zinc-500" />
                <span>Created by</span>
                {hasAuthorGithub ? (
                  <a
                    href={basicInfo.authorGithub}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                  >
                    {basicInfo.authorName}
                  </a>
                ) : (
                  <span className="font-medium text-zinc-200">
                    {basicInfo.authorName}
                  </span>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
