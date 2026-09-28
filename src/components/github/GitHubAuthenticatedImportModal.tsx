import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, FileText, Loader2, X } from "lucide-react";
import {
  AuthenticatedGitHubRepository,
  GitHubImportAnalysis,
  GitHubImportSelection,
} from "@/types";
import {
  getAuthenticatedRepository,
  GitHubAuthError,
  readAuthenticatedReadme,
} from "@/services/githubAuth";
import {
  GITHUB_LANGUAGE_CATEGORY_MAP,
  GITHUB_SPDX_LICENSE_MAP,
} from "@/constants/githubLanguageMap";
import { getOverwritingFields } from "@/utils/githubImport";
import { cn } from "@/utils";

interface GitHubAuthenticatedImportModalProps {
  isOpen: boolean;
  repository: AuthenticatedGitHubRepository | null;
  currentData: import("@/types").ReadmeData;
  onClose: () => void;
  onImport: (
    analysis: GitHubImportAnalysis,
    selection: GitHubImportSelection,
  ) => void;
}

function readIdentity(
  content: string,
  fallbackName: string,
  fallbackDescription: string,
) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title =
    lines
      .find((line) => line.startsWith("# "))
      ?.slice(2)
      .trim() || fallbackName;
  const description =
    lines.find(
      (line) =>
        !line.startsWith("#") && !line.startsWith("!") && !line.startsWith("["),
    ) || fallbackDescription;
  return { title, description };
}

export const GitHubAuthenticatedImportModal: React.FC<
  GitHubAuthenticatedImportModalProps
> = ({ isOpen, repository, currentData, onClose, onImport }) => {
  const [analysis, setAnalysis] = useState<GitHubImportAnalysis | null>(null);
  const [selection, setSelection] = useState<GitHubImportSelection | null>(
    null,
  );
  const [readmePreview, setReadmePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !repository) return;
    setAnalysis(null);
    setSelection(null);
    setReadmePreview("");
    setShowConfirm(false);
    setError(null);
    setIsLoading(true);
    Promise.all([
      getAuthenticatedRepository(repository.owner, repository.name),
      readAuthenticatedReadme(
        repository.owner,
        repository.name,
        repository.defaultBranch,
      ),
    ])
      .then(([details, readme]) => {
        const identity = readIdentity(
          readme.content,
          details.name,
          details.description,
        );
        const languageMapping = details.primaryLanguage
          ? GITHUB_LANGUAGE_CATEGORY_MAP[details.primaryLanguage]
          : undefined;
        const mappedLicense = details.license?.spdxId
          ? GITHUB_SPDX_LICENSE_MAP[details.license.spdxId.toLowerCase()]
          : undefined;
        const nextAnalysis: GitHubImportAnalysis = {
          repoRef: { owner: repository.owner, repo: repository.name },
          name: identity.title,
          description: identity.description,
          repositoryUrl: details.repositoryUrl,
          homepage: details.homepage,
          owner: details.owner,
          primaryLanguage: details.primaryLanguage,
          languages: details.primaryLanguage ? [details.primaryLanguage] : [],
          detectedTechnologies: details.primaryLanguage
            ? [
                {
                  name:
                    languageMapping?.normalizedName || details.primaryLanguage,
                  category: languageMapping?.category || "Other",
                  source: "language",
                },
              ]
            : [],
          license:
            mappedLicense && details.license
              ? {
                  spdxId: details.license.spdxId,
                  name: details.license.name,
                  mappedType: mappedLicense,
                }
              : null,
          hasExistingReadme: true,
          defaultBranch: details.defaultBranch,
        };
        setAnalysis(nextAnalysis);
        setSelection({
          projectName: true,
          description: Boolean(identity.description),
          repositoryUrl: true,
          homepage: Boolean(details.homepage),
          authorName: false,
          authorGithub: false,
          technologies: nextAnalysis.detectedTechnologies.map(
            (technology) => technology.name,
          ),
          license: Boolean(nextAnalysis.license),
        });
        setReadmePreview(readme.content.slice(0, 1200));
      })
      .catch((requestError: unknown) => {
        const authError =
          requestError instanceof GitHubAuthError ? requestError : null;
        setError(
          authError?.message ||
            "Unable to import the selected repository README.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, repository]);

  const conflicts = useMemo(
    () =>
      analysis && selection
        ? getOverwritingFields(currentData, analysis, selection)
        : [],
    [analysis, currentData, selection],
  );

  const confirmImport = () => {
    if (!analysis || !selection) return;
    if (conflicts.length > 0 && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    onImport(analysis, selection);
    onClose();
  };

  if (!isOpen || !repository) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-zinc-950/80 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="authenticated-import-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-orange-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div>
              <h2
                id="authenticated-import-title"
                className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Import README from GitHub
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {repository.fullName} on {repository.defaultBranch}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authenticated import dialog"
            className="rounded-lg p-2 text-zinc-500 hover:bg-orange-50 hover:text-orange-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading repository README...
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {error}
            </p>
          )}
          {analysis && selection && !isLoading && (
            <div className="space-y-4">
              <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                The README identity and supported repository metadata will be
                merged. Your custom section order remains unchanged.
              </div>
              <pre className="max-h-52 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {readmePreview}
              </pre>
              {conflicts.length > 0 && !showConfirm && (
                <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Existing populated fields will be replaced only after
                  confirmation.
                </p>
              )}
              {showConfirm && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  Confirm replacing{" "}
                  {conflicts.map((conflict) => conflict.field).join(", ")}.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2.5 border-t border-orange-100 px-5 py-3.5 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-orange-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmImport}
            disabled={!analysis || !selection || isLoading}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <Check className="h-3.5 w-3.5" />
            {showConfirm ? "Confirm Import" : "Import README"}
          </button>
        </div>
      </div>
    </div>
  );
};
