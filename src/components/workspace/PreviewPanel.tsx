import React, { useState, useRef, useEffect } from 'react';
import { Copy, Download, Eye, FileCode, Code2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn, copyToClipboard, downloadMarkdown } from '@/utils';

interface PreviewPanelProps {
  markdown: string;
}

export type PreviewMode = 'rendered' | 'markdown';
export type ActionStatus = 'idle' | 'success' | 'error';

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ markdown }) => {
  const [viewMode, setViewMode] = useState<PreviewMode>('rendered');
  const [copyStatus, setCopyStatus] = useState<ActionStatus>('idle');
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const downloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safely cleanup any pending timer resets on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);
    };
  }, []);

  const hasContent = markdown.trim().length > 0;

  const handleCopy = async () => {
    if (!hasContent) return;
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);

    const success = await copyToClipboard(markdown);
    if (success) {
      setCopyStatus('success');
      setStatusMessage('README copied to clipboard');
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus('idle');
        setStatusMessage('');
      }, 2000);
    } else {
      setCopyStatus('error');
      setStatusMessage('Unable to copy. Please copy from the Markdown view.');
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus('idle');
        setStatusMessage('');
      }, 3500);
    }
  };

  const handleDownload = () => {
    if (!hasContent) return;
    if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);

    const success = downloadMarkdown(markdown, 'README.md');
    if (success) {
      setDownloadStatus('success');
      setStatusMessage('README.md downloaded successfully');
      downloadTimeoutRef.current = setTimeout(() => {
        setDownloadStatus('idle');
        setStatusMessage('');
      }, 2000);
    } else {
      setDownloadStatus('error');
      setStatusMessage('Unable to download README.md. Please copy from Markdown view.');
      downloadTimeoutRef.current = setTimeout(() => {
        setDownloadStatus('idle');
        setStatusMessage('');
      }, 3500);
    }
  };

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

        {/* View Mode Switch & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switch: Rendered | Markdown */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('rendered')}
              aria-label="View rendered preview"
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                viewMode === 'rendered'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Rendered</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('markdown')}
              aria-label="View raw Markdown source"
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                viewMode === 'markdown'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Markdown</span>
            </button>
          </div>

          {/* Action Buttons: Copy & Download */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-800/60">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasContent}
              aria-label={copyStatus === 'success' ? 'Copied' : 'Copy Markdown'}
              title={
                hasContent
                  ? 'Copy canonical README markdown source'
                  : 'Add project details before copying your README.'
              }
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500',
                !hasContent && 'border-zinc-800 bg-zinc-900/60 text-zinc-500 cursor-not-allowed',
                hasContent &&
                  copyStatus === 'idle' &&
                  'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 active:bg-zinc-800/80 cursor-pointer',
                hasContent &&
                  copyStatus === 'success' &&
                  'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold',
                hasContent &&
                  copyStatus === 'error' &&
                  'border-rose-500/40 bg-rose-500/10 text-rose-400 font-semibold'
              )}
            >
              {copyStatus === 'success' ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : copyStatus === 'error' ? (
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>
                {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Error' : 'Copy'}
              </span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasContent}
              aria-label={downloadStatus === 'success' ? 'Downloaded' : 'Download README.md'}
              title={
                hasContent
                  ? 'Download README.md file'
                  : 'Add project details before downloading your README.'
              }
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500',
                !hasContent && 'border-zinc-800 bg-zinc-900/60 text-zinc-500 cursor-not-allowed',
                hasContent &&
                  downloadStatus === 'idle' &&
                  'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 active:bg-zinc-800/80 cursor-pointer',
                hasContent &&
                  downloadStatus === 'success' &&
                  'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold',
                hasContent &&
                  downloadStatus === 'error' &&
                  'border-rose-500/40 bg-rose-500/10 text-rose-400 font-semibold'
              )}
            >
              {downloadStatus === 'success' ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : downloadStatus === 'error' ? (
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>
                {downloadStatus === 'success'
                  ? 'Downloaded!'
                  : downloadStatus === 'error'
                  ? 'Error'
                  : 'Download'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Inline Status Alert (Live Region) */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'mt-3 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all',
            copyStatus === 'error' || downloadStatus === 'error'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          )}
        >
          {copyStatus === 'error' || downloadStatus === 'error' ? (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Check className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Preview Content Area */}
      <div className="mt-4 flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 font-sans min-h-[420px]">
        {/* Document Tab Header */}
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-zinc-800/60 text-xs font-mono text-zinc-500">
          <FileCode className="h-3.5 w-3.5 text-zinc-400" />
          <span>README.md</span>
          <span className="ml-auto text-[11px] rounded bg-zinc-800/60 px-2 py-0.5 text-zinc-400 font-sans">
            {viewMode === 'rendered' ? 'Rendered View' : 'Raw Markdown'}
          </span>
        </div>

        {/* Content Body */}
        {hasContent ? (
          viewMode === 'rendered' ? (
            <MarkdownRenderer content={markdown} />
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
              <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text">
                <code>{markdown}</code>
              </pre>
            </div>
          )
        ) : (
          /* Empty Project State (UI-only, never in generated Markdown) */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/60 text-indigo-400 ring-1 ring-zinc-700/40 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">
              Start adding project details to generate your README.
            </h3>
            <p className="mt-1.5 max-w-sm text-xs text-zinc-500 leading-relaxed">
              Fill in the sections on the left—such as Project Name, Description, or Tech Stack—to see your live README take shape.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
