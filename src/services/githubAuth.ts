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

const SESSION_STORAGE_KEY = 'readme_studio_session_token';

export function getStoredSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_STORAGE_KEY);
}

export function setStoredSessionToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

// Check URL for session token returned from OAuth
if (typeof window !== 'undefined') {
  try {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setStoredSessionToken(tokenFromUrl);
      params.delete('token');
      const newQuery = params.toString() ? `?${params.toString()}` : '';
      window.history.replaceState({}, '', `${window.location.pathname}${newQuery}`);
    }
  } catch {
    // Ignore URL parse errors
  }
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = getApiUrl(url);
  const token = getStoredSessionToken();
  const response = await fetch(fullUrl, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function disconnectGitHub(): Promise<GitHubAuthSession> {
  const result = await requestJson<GitHubAuthSession>('/api/auth/disconnect', { method: 'POST' });
  setStoredSessionToken(null);
  return result;
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
