import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, GitBranch, Lock, Search, X } from 'lucide-react';
import { AuthenticatedGitHubRepository } from '@/types';
import { GitHubAuthError, listAuthenticatedRepositories } from '@/services/githubAuth';

interface GitHubRepositoryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (repository: AuthenticatedGitHubRepository) => void;
}

export const GitHubRepositoryPickerModal: React.FC<GitHubRepositoryPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [repositories, setRepositories] = useState<AuthenticatedGitHubRepository[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setRepositories([]);
    setPage(1);
    setSearch('');
    setError(null);
    setIsLoading(true);
    listAuthenticatedRepositories(1)
      .then((result) => {
        setRepositories(result.repositories);
        setHasNextPage(result.hasNextPage);
      })
      .catch((requestError: unknown) => {
        const authError = requestError instanceof GitHubAuthError ? requestError : null;
        setError(authError?.message || 'Unable to load your GitHub repositories.');
      })
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return repositories;
    return repositories.filter((repository) => repository.fullName.toLowerCase().includes(query));
  }, [repositories, search]);

  const loadPage = (nextPage: number) => {
    setIsLoading(true);
    setError(null);
    listAuthenticatedRepositories(nextPage)
      .then((result) => {
        setRepositories(result.repositories);
        setPage(result.page);
        setHasNextPage(result.hasNextPage);
      })
      .catch((requestError: unknown) => {
        const authError = requestError instanceof GitHubAuthError ? requestError : null;
        setError(authError?.message || 'Unable to load that repository page.');
      })
      .finally(() => setIsLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-zinc-950/80 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-repository-picker-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-orange-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2 id="github-repository-picker-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Choose a GitHub repository
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Repositories you can access are listed securely through your connected account.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close repository picker" className="rounded-lg p-2 text-zinc-500 hover:bg-orange-50 hover:text-orange-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search repositories"
              aria-label="Search repositories"
              className="w-full rounded-lg border border-orange-200 bg-orange-50/40 py-2.5 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
          {isLoading && <p className="py-8 text-center text-sm text-zinc-500">Loading repositories...</p>}
          {!isLoading && filteredRepositories.length === 0 && !error && <p className="py-8 text-center text-sm text-zinc-500">No matching repositories found.</p>}

          <div className="space-y-2">
            {filteredRepositories.map((repository) => (
              <button
                key={repository.id}
                type="button"
                onClick={() => onSelect(repository)}
                className="flex w-full items-center gap-3 rounded-lg border border-orange-100 bg-white px-3 py-3 text-left transition-colors hover:border-orange-300 hover:bg-orange-50/60 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {repository.private ? <Lock className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" /> : <GitBranch className="h-4 w-4 shrink-0 text-zinc-400" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{repository.fullName}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span>{repository.visibility}</span>
                    <span>branch: {repository.defaultBranch}</span>
                    {repository.permissions.push && <span className="text-orange-600 dark:text-orange-400">can write</span>}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-orange-100 px-5 py-3 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">Page {page}</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => loadPage(page - 1)} disabled={page <= 1 || isLoading} aria-label="Previous repository page" className="rounded-md border border-orange-200 p-1.5 text-zinc-600 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => loadPage(page + 1)} disabled={!hasNextPage || isLoading} aria-label="Next repository page" className="rounded-md border border-orange-200 p-1.5 text-zinc-600 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
