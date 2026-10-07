import {
  AuthenticatedReadme,
  AuthenticatedContent,
  AuthenticatedRepositoryPage,
  AuthenticatedRepositoryDetails,
  GitHubAuthSession,
  GitHubSaveResult,
} from '@/types';

const API_BASE = (import.meta.env.VITE_GITHUB_API_BASE_URL || '').replace(/\/$/, '');

function getApiUrl(path: string): string {
  if (API_BASE) {
    return `${API_BASE}${path}`;
  }
  return path;
}

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

export class GitHubAuthError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code = 'request_failed', status?: number) {
    super(message);
    this.name = 'GitHubAuthError';
    this.code = code;
    this.status = status;
  }
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = getApiUrl(url);
  const response = await fetch(fullUrl, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options?.headers || {}),
    },
  });

  let body: T | ApiErrorBody | null = null;
  try {
    body = await response.json();
  } catch {
    // The API may return an empty body for some failures.
  }

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;
    throw new GitHubAuthError(
      errorBody?.error?.message || `GitHub request failed with status ${response.status}.`,
      errorBody?.error?.code || 'request_failed',
      response.status
    );
  }

  return body as T;
}

export function startGitHubAuthentication(): void {
  window.location.assign(getApiUrl('/api/auth/github/start'));
}

export function getGitHubAuthSession(): Promise<GitHubAuthSession> {
  return requestJson<GitHubAuthSession>('/api/auth/session');
}

export function disconnectGitHub(): Promise<GitHubAuthSession> {
  return requestJson<GitHubAuthSession>('/api/auth/disconnect', { method: 'POST' });
}

export function listAuthenticatedRepositories(
  page = 1,
  perPage = 50
): Promise<AuthenticatedRepositoryPage> {
  return requestJson<AuthenticatedRepositoryPage>(
    `/api/github/repos?page=${page}&per_page=${perPage}`
  );
}

export function listAuthenticatedBranches(owner: string, repo: string): Promise<{ branches: string[] }> {
  return requestJson<{ branches: string[] }>(
    `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`
  );
}

export function getAuthenticatedRepository(
  owner: string,
  repo: string
): Promise<AuthenticatedRepositoryDetails> {
  return requestJson<AuthenticatedRepositoryDetails>(
    `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
}

export function readAuthenticatedReadme(
  owner: string,
  repo: string,
  branch?: string
): Promise<AuthenticatedReadme> {
  const query = branch ? `?branch=${encodeURIComponent(branch)}` : '';
  return requestJson<AuthenticatedReadme>(
    `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme${query}`
  );
}

export function readAuthenticatedContent(
  owner: string,
  repo: string,
  branch: string,
  path: string
): Promise<AuthenticatedContent> {
  return requestJson<AuthenticatedContent>(
    `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/content?branch=${encodeURIComponent(branch)}&path=${encodeURIComponent(path)}`
  );
}

export function saveAuthenticatedReadme(input: {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  markdown: string;
  sha?: string;
}): Promise<GitHubSaveResult> {
  return requestJson<GitHubSaveResult>('/api/github/save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
}
