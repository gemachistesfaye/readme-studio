import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  Download,
  Eye,
  FileCode,
  Code2,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn, copyToClipboard, downloadMarkdown } from "@/utils";

interface PreviewPanelProps {
  markdown: string;
}

export type PreviewMode = "rendered" | "markdown";
export type ActionStatus = "idle" | "success" | "error";

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ markdown }) => {
  const [viewMode, setViewMode] = useState<PreviewMode>("rendered");
  const [copyStatus, setCopyStatus] = useState<ActionStatus>("idle");
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

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
      setCopyStatus("success");
      setStatusMessage("README copied to clipboard");
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus("idle");
        setStatusMessage("");
      }, 2000);
    } else {
      setCopyStatus("error");
      setStatusMessage("Unable to copy. Please copy from the Markdown view.");
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus("idle");
        setStatusMessage("");
      }, 3500);
    }
  };

  const handleDownload = () => {
    if (!hasContent) return;
    if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);

    const success = downloadMarkdown(markdown, "README.md");
    if (success) {
      setDownloadStatus("success");
      setStatusMessage("README.md downloaded successfully");
      downloadTimeoutRef.current = setTimeout(() => {
        setDownloadStatus("idle");
        setStatusMessage("");
      }, 2000);
    } else {
      setDownloadStatus("error");
      setStatusMessage(
        "Unable to download README.md. Please copy from Markdown view.",
      );
      downloadTimeoutRef.current = setTimeout(() => {
        setDownloadStatus("idle");
        setStatusMessage("");
      }, 3500);
    }
  };

  return (
    <div className="sticky top-20 flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60">
      {/* Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Preview
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Live markdown representation
            </p>
          </div>
        </div>

        {/* View Mode Switch & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switch: Rendered | Markdown */}
          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/80">
            <button
              type="button"
              onClick={() => setViewMode("rendered")}
              aria-label="View rendered preview"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                viewMode === "rendered"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Rendered</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("markdown")}
              aria-label="View raw Markdown source"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                viewMode === "markdown"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Markdown</span>
            </button>
          </div>

          {/* Action Buttons: Copy & Download */}
          <div className="flex items-center gap-1.5 border-l border-zinc-200/60 pl-1 dark:border-zinc-800/60">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasContent}
              aria-label={copyStatus === "success" ? "Copied" : "Copy Markdown"}
              title={
                hasContent
                  ? "Copy canonical README markdown source"
                  : "Add project details before copying your README."
              }
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500",
                !hasContent &&
                  "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-500",
                hasContent &&
                  copyStatus === "idle" &&
                  "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-800/80",
                hasContent &&
                  copyStatus === "success" &&
                  "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold",
                hasContent &&
                  copyStatus === "error" &&
                  "border-rose-500/40 bg-rose-500/10 text-rose-400 font-semibold",
              )}
            >
              {copyStatus === "success" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : copyStatus === "error" ? (
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>
                {copyStatus === "success"
                  ? "Copied!"
                  : copyStatus === "error"
                    ? "Error"
                    : "Copy"}
              </span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasContent}
              aria-label={
                downloadStatus === "success"
                  ? "Downloaded"
                  : "Download README.md"
              }
              title={
                hasContent
                  ? "Download README.md file"
                  : "Add project details before downloading your README."
              }
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500",
                !hasContent &&
                  "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-500",
                hasContent &&
                  downloadStatus === "idle" &&
                  "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-800/80",
                hasContent &&
                  downloadStatus === "success" &&
                  "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold",
                hasContent &&
                  downloadStatus === "error" &&
                  "border-rose-500/40 bg-rose-500/10 text-rose-400 font-semibold",
              )}
            >
              {downloadStatus === "success" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : downloadStatus === "error" ? (
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>
                {downloadStatus === "success"
                  ? "Downloaded!"
                  : downloadStatus === "error"
                    ? "Error"
                    : "Download"}
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
            "mt-3 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all",
            copyStatus === "error" || downloadStatus === "error"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
          )}
        >
          {copyStatus === "error" || downloadStatus === "error" ? (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Check className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Preview Content Area */}
      <div className="mt-4 min-h-[420px] flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 p-6 font-sans sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/30">
        {/* Document Tab Header */}
        <div className="mb-6 flex items-center gap-2 border-b border-zinc-200/60 pb-3 font-mono text-xs text-zinc-500 dark:border-zinc-800/60">
          <FileCode className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-400" />
          <span>README.md</span>
          <span className="ml-auto rounded bg-zinc-200 px-2 py-0.5 font-sans text-[11px] text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
            {viewMode === "rendered" ? "Rendered View" : "Raw Markdown"}
          </span>
        </div>

        {/* Content Body */}
        {hasContent ? (
          viewMode === "rendered" ? (
            <MarkdownRenderer content={markdown} />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text">
                <code>{markdown}</code>
              </pre>
            </div>
          )
        ) : (
          /* Empty Project State (UI-only, never in generated Markdown) */
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-200/70 text-indigo-600 ring-1 ring-zinc-300/60 dark:bg-zinc-800/60 dark:text-indigo-400 dark:ring-zinc-700/40">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-200">
              Start adding project details to generate your README.
            </h3>
            <p className="mt-1.5 max-w-sm text-xs text-zinc-500 leading-relaxed">
              Fill in the sections on the left—such as Project Name,
              Description, or Tech Stack—to see your live README take shape.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
