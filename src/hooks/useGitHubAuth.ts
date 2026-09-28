import { useSyncExternalStore } from 'react';
import {
  disconnectGitHub,
  getGitHubAuthSession,
  GitHubAuthError,
  startGitHubAuthentication,
} from '@/services/githubAuth';
import { GitHubAuthUser } from '@/types';

export type GitHubAuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface GitHubAuthState {
  status: GitHubAuthStatus;
  user: GitHubAuthUser | null;
  error: string | null;
  connect: () => void;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
}

let snapshot: GitHubAuthState;
let initialized = false;
let refreshPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(status: GitHubAuthStatus, user: GitHubAuthUser | null, error: string | null): void {
  snapshot = {
    status,
    user,
    error,
    connect: startGitHubAuthentication,
    disconnect,
    refresh,
  };
  for (const listener of listeners) listener();
}

async function refresh(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  setState('loading', snapshot.user, null);
  refreshPromise = getGitHubAuthSession()
    .then((session) => {
      setState(session.authenticated ? 'authenticated' : 'unauthenticated', session.user, null);
    })
    .catch((error: unknown) => {
      const authError = error instanceof GitHubAuthError ? error : null;
      setState(
        authError?.status === 401 ? 'unauthenticated' : 'error',
        null,
        authError?.message || 'Unable to check GitHub connection.'
      );
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function disconnect(): Promise<void> {
  try {
    await disconnectGitHub();
    setState('unauthenticated', null, null);
  } catch (error: unknown) {
    const authError = error instanceof GitHubAuthError ? error : null;
    setState('error', snapshot.user, authError?.message || 'Unable to disconnect GitHub.');
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    void refresh();
  }
  return () => listeners.delete(listener);
}

function getSnapshot(): GitHubAuthState {
  return snapshot;
}

function getServerSnapshot(): GitHubAuthState {
  return snapshot;
}

setState('loading', null, null);

export function useGitHubAuth(): GitHubAuthState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
