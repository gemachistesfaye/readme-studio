import React, { useEffect, useState } from "react";
import { Check, ExternalLink, GitBranch, Loader2, X } from "lucide-react";
import { AuthenticatedGitHubRepository, GitHubSaveResult } from "@/types";
import {
  GitHubAuthError,
  listAuthenticatedBranches,
  readAuthenticatedContent,
  saveAuthenticatedReadme,
} from "@/services/githubAuth";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface GitHubSaveModalProps {
  isOpen: boolean;
  repository: AuthenticatedGitHubRepository | null;
  markdown: string;
  onClose: () => void;
}

export const GitHubSaveModal: React.FC<GitHubSaveModalProps> = ({
  isOpen,
  repository,
  markdown,
  onClose,
}) => {
  useBodyScrollLock(isOpen);
  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");
  const [path, setPath] = useState("README.md");
  const [sha, setSha] = useState<string | undefined>();
  const [fileExists, setFileExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GitHubSaveResult | null>(null);

  useEffect(() => {
    if (!isOpen || !repository) return;
    setBranches([]);
    setBranch(repository.defaultBranch);
    setPath("README.md");
    setSha(undefined);
    setFileExists(false);
    setShowConfirm(false);
    setError(null);
    setResult(null);
    setIsLoading(true);
    listAuthenticatedBranches(repository.owner, repository.name)
      .then((response) => {
        setBranches(response.branches);
        setBranch(
          response.branches.includes(repository.defaultBranch)
            ? repository.defaultBranch
            : response.branches[0] || repository.defaultBranch,
        );
      })
      .catch((requestError: unknown) => {
        const authError =
          requestError instanceof GitHubAuthError ? requestError : null;
        setError(authError?.message || "Unable to load repository branches.");
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, repository]);

  useEffect(() => {
    if (!isOpen || !repository || !branch || !path.trim()) return;
    setSha(undefined);
    setFileExists(false);
    setError(null);
    readAuthenticatedContent(repository.owner, repository.name, branch, path)
      .then((content) => {
        setFileExists(content.exists);
        setSha(content.sha || undefined);
      })
      .catch((requestError: unknown) => {
        const authError =
          requestError instanceof GitHubAuthError ? requestError : null;
        setError(authError?.message || "Unable to inspect the target file.");
      });
  }, [isOpen, repository, branch, path]);

  const handleSave = async () => {
    if (!repository || !branch || !path.trim() || !markdown.trim()) return;
    if (fileExists && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const saved = await saveAuthenticatedReadme({
        owner: repository.owner,
        repo: repository.name,
        branch,
        path: path.trim(),
        markdown,
        sha,
      });
      setResult(saved);
      setShowConfirm(false);
    } catch (requestError: unknown) {
      const authError =
        requestError instanceof GitHubAuthError ? requestError : null;
      setError(
        authError?.message ||
          "GitHub could not save the README. Refresh and try again.",
      );
      if (
        authError?.code === "sha_conflict" ||
        authError?.code === "file_state_changed"
      ) {
        setShowConfirm(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !repository) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm dark:bg-zinc-950/80 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-save-title"
    >
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-orange-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="github-save-title"
              className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Save README to GitHub
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {repository.fullName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close GitHub save dialog"
            className="rounded-lg p-2 text-zinc-500 hover:bg-orange-50 hover:text-orange-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="text-xs leading-relaxed">
                README {result.updated ? "updated" : "created"} on{" "}
                {result.repository} ({result.branch}, {result.path}).
              </div>
            </div>
            <a
              href={result.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-700 underline underline-offset-2 dark:text-orange-300"
            >
              Open saved file <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <>
            <div className="mt-5 space-y-3">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Branch
                <span className="relative mt-1.5 block">
                  <GitBranch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <select
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-orange-200 bg-orange-50/40 py-2.5 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    {branches.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Target file path
                <input
                  value={path}
                  onChange={(event) => setPath(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-orange-200 bg-orange-50/40 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
            </div>

            {fileExists && !showConfirm && (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                An existing file will be replaced. The current SHA will be
                checked before writing.
              </p>
            )}
            {showConfirm && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                Confirm replacing {path} on branch {branch}. A concurrent change
                will be rejected.
              </div>
            )}
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-orange-100 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-orange-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isLoading ||
                  isSaving ||
                  !branch ||
                  !path.trim() ||
                  !markdown.trim()
                }
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {showConfirm
                  ? "Confirm Save"
                  : fileExists
                    ? "Review Replacement"
                    : "Save README"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
