import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Github,
  Search,
  Loader2,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Code2,
  Scale,
  User,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import {
  ReadmeData,
  GitHubImportAnalysis,
  GitHubImportSelection,
  GitHubImportError,
} from "@/types";
import { analyzePublicRepository } from "@/services/githubApi";
import {
  createDefaultGitHubSelection,
  getOverwritingFields,
} from "@/utils/githubImport";
import { cn } from "@/utils";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ReadmeData;
  onImport: (
    analysis: GitHubImportAnalysis,
    selection: GitHubImportSelection,
  ) => void;
}

export const GitHubImportModal: React.FC<GitHubImportModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onImport,
}) => {
  useBodyScrollLock(isOpen);
  const [repoUrl, setRepoUrl] = useState("");
  const [step, setStep] = useState<
    "input" | "analyzing" | "preview" | "success"
  >("input");
  const [analysis, setAnalysis] = useState<GitHubImportAnalysis | null>(null);
  const [selection, setSelection] = useState<GitHubImportSelection | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens in input step
  useEffect(() => {
    if (isOpen && step === "input") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, step]);

  // Cancel any ongoing fetch on unmount or close
  const handleClose = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setError(null);
    setStep("input");
    setAnalysis(null);
    setSelection(null);
    setShowOverwriteConfirm(false);
    onClose();
  }, [onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleAnalyze = async (urlToAnalyze = repoUrl) => {
    const trimmed = urlToAnalyze.trim();
    if (!trimmed) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setError(null);
    setStep("analyzing");

    try {
      const result = await analyzePublicRepository(trimmed, controller.signal);
      setAnalysis(result);
      setSelection(createDefaultGitHubSelection(result));
      setStep("preview");
      setShowOverwriteConfirm(false);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;

      const ghErr = err as GitHubImportError;
      setError(
        ghErr.message || "Failed to analyze repository. Please try again.",
      );
      setStep("input");
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Toggle individual boolean fields in selection
  const toggleSelectionField = (
    field: keyof Omit<GitHubImportSelection, "technologies">,
  ) => {
    if (!selection) return;
    setSelection({
      ...selection,
      [field]: !selection[field],
    });
  };

  // Toggle technology selection
  const toggleTechnology = (techName: string) => {
    if (!selection) return;
    const isSelected = selection.technologies.includes(techName);
    setSelection({
      ...selection,
      technologies: isSelected
        ? selection.technologies.filter((t) => t !== techName)
        : [...selection.technologies, techName],
    });
  };

  // Select / Deselect all technologies
  const toggleAllTechnologies = () => {
    if (!selection || !analysis) return;
    if (
      selection.technologies.length === analysis.detectedTechnologies.length
    ) {
      setSelection({ ...selection, technologies: [] });
    } else {
      setSelection({
        ...selection,
        technologies: analysis.detectedTechnologies.map((t) => t.name),
      });
    }
  };

  // Count total items selected
  const getSelectedCount = () => {
    if (!selection) return 0;
    let count = 0;
    if (selection.projectName) count++;
    if (selection.description) count++;
    if (selection.repositoryUrl) count++;
    if (selection.homepage) count++;
    if (selection.authorName) count++;
    if (selection.authorGithub) count++;
    if (selection.license) count++;
    count += selection.technologies.length;
    return count;
  };

  // Check conflicts before importing
  const conflicts =
    analysis && selection
      ? getOverwritingFields(currentData, analysis, selection)
      : [];

  const handleConfirmImport = () => {
    if (!analysis || !selection) return;

    if (conflicts.length > 0 && !showOverwriteConfirm) {
      setShowOverwriteConfirm(true);
      return;
    }

    onImport(analysis, selection);
    setStep("success");

    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm dark:bg-zinc-950/80 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-import-title"
    >
      <div
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/90 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="github-import-title"
                className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
              >
                Import from GitHub
                <span className="rounded bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  Public Repositories
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Extract metadata, technologies, and license information without
                signing in.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
          {/* STEP 1: Input URL */}
          {(step === "input" || step === "analyzing") && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="repo-url-input"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2"
                >
                  Repository URL or Slug
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    ref={inputRef}
                    id="repo-url-input"
                    type="text"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && step !== "analyzing") {
                        handleAnalyze();
                      }
                    }}
                    disabled={step === "analyzing"}
                    placeholder="https://github.com/owner/repository or owner/repo"
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/80 py-2.5 pl-9 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>
                <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                  No GitHub account or sign-in required. Only public
                  repositories can be imported.
                </p>
              </div>

              {/* Quick Preset Suggestions */}
              <div>
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Try an example:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {[
                    "facebook/react",
                    "vercel/next.js",
                    "tailwindlabs/tailwindcss",
                    "fastapi/fastapi",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={step === "analyzing"}
                      onClick={() => {
                        setRepoUrl(`https://github.com/${preset}`);
                        handleAnalyze(`https://github.com/${preset}`);
                      }}
                      className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">
                      Import Error
                    </span>
                    {error}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Preview & Selection */}
          {step === "preview" && analysis && selection && (
            <div className="space-y-5">
              {/* Repository Banner Card */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 space-y-2 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {analysis.owner.avatarUrl ? (
                      <img
                        src={analysis.owner.avatarUrl}
                        alt={analysis.owner.username}
                        className="h-10 w-10 rounded-full border border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                        <Github className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {analysis.repoRef.owner}/{analysis.repoRef.repo}
                        </h3>
                        <a
                          href={analysis.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                          title="Open on GitHub"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <span>
                          Branch:{" "}
                          <code className="text-zinc-800 dark:text-zinc-300 font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">
                            {analysis.defaultBranch}
                          </code>
                        </span>
                        {analysis.hasExistingReadme && (
                          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-medium text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                            <BookOpen className="h-2.5 w-2.5" /> README detected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {analysis.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                    {analysis.description}
                  </p>
                )}
              </div>

              {/* Overwrite Warning Banner if conflicts detected */}
              {conflicts.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5 space-y-2 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Existing Content Replacement Notice
                  </div>
                  <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                    Importing selected fields will replace current non-empty
                    values in your README:
                  </p>
                  <ul className="text-[11px] text-amber-900 dark:text-amber-200 space-y-1 pl-4 list-disc">
                    {conflicts.map((c) => (
                      <li key={c.field}>
                        <span className="font-semibold">{c.field}:</span>{" "}
                        Replaces &quot;{c.currentValue}&quot; with &quot;
                        {c.incomingValue}&quot;
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1. Project Information Checkboxes */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Project Information
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.projectName}
                      onChange={() => toggleSelectionField("projectName")}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                        Project Name
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate block max-w-[200px]">
                        {analysis.name}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.repositoryUrl}
                      onChange={() => toggleSelectionField("repositoryUrl")}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                        Repository URL
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate block max-w-[200px]">
                        {analysis.repositoryUrl}
                      </span>
                    </div>
                  </label>

                  {analysis.description && (
                    <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={selection.description}
                        onChange={() => toggleSelectionField("description")}
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                          Project Description
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400 text-[11px] line-clamp-2">
                          {analysis.description}
                        </span>
                      </div>
                    </label>
                  )}

                  {analysis.homepage && (
                    <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={selection.homepage}
                        onChange={() => toggleSelectionField("homepage")}
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                          Live Demo / Homepage URL
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate block max-w-[350px]">
                          {analysis.homepage}
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* 2. Author Checkboxes */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <User className="h-3.5 w-3.5 text-zinc-500" />
                  Author Information
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.authorName}
                      onChange={() => toggleSelectionField("authorName")}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                        Author Name
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                        {analysis.owner.username}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.authorGithub}
                      onChange={() => toggleSelectionField("authorGithub")}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                        Author GitHub
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate block max-w-[200px]">
                        {analysis.owner.profileUrl}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Detected Technologies */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    <Code2 className="h-3.5 w-3.5 text-zinc-500" />
                    Detected Technologies (
                    {analysis.detectedTechnologies.length})
                  </div>
                  {analysis.detectedTechnologies.length > 0 && (
                    <button
                      type="button"
                      onClick={toggleAllTechnologies}
                      className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                    >
                      {selection.technologies.length ===
                      analysis.detectedTechnologies.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                </div>

                {analysis.detectedTechnologies.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic py-1">
                    No languages or framework dependencies detected.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-40 overflow-y-auto pr-1">
                    {analysis.detectedTechnologies.map((tech) => {
                      const isChecked = selection.technologies.includes(
                        tech.name,
                      );
                      return (
                        <button
                          key={tech.name}
                          type="button"
                          onClick={() => toggleTechnology(tech.name)}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-2.5 py-2 text-left transition-all",
                            isChecked
                              ? "border-indigo-500/50 bg-indigo-50 text-indigo-950 dark:bg-indigo-500/10 dark:text-zinc-100"
                              : "border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:border-zinc-700",
                          )}
                        >
                          <div className="truncate pr-1.5">
                            <span className="text-xs font-medium block truncate">
                              {tech.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 block">
                              {tech.category}
                            </span>
                          </div>
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Square className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Imported technologies merge into your Tech Stack without
                  duplicates.
                </p>
              </div>

              {/* 4. License */}
              {analysis.license && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    <Scale className="h-3.5 w-3.5 text-zinc-500" />
                    Detected License
                  </div>
                  <label className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40 p-2.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.license}
                      onChange={() => toggleSelectionField("license")}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-zinc-900 dark:text-zinc-200 block">
                        {analysis.license.name} ({analysis.license.spdxId})
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                        Mapped to README Studio {analysis.license.mappedType}{" "}
                        License
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Success Screen */}
          {step === "success" && (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Repository Imported Successfully!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                Selected fields have been merged into your workspace. The
                preview and editor are up to date.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/90">
          {step === "input" || step === "analyzing" ? (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={step === "analyzing" || !repoUrl.trim()}
                onClick={() => handleAnalyze()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {step === "analyzing" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Analyzing Repository...
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    Analyze Repository
                  </>
                )}
              </button>
            </>
          ) : step === "preview" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("input");
                  setError(null);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Back / Analyze Another
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={getSelectedCount() === 0}
                  onClick={handleConfirmImport}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors",
                    conflicts.length > 0 && showOverwriteConfirm
                      ? "bg-amber-600 hover:bg-amber-500"
                      : "bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {conflicts.length > 0 && showOverwriteConfirm ? (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Confirm Overwrite ({getSelectedCount()})
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Import Selected ({getSelectedCount()})
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
