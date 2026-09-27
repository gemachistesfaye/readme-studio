import { GitHubRepositoryReference } from '@/types';

/**
 * Validates and parses a public GitHub repository URL or slug.
 *
 * Supported formats:
 * - https://github.com/owner/repo
 * - http://github.com/owner/repo
 * - https://github.com/owner/repo/
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 * - owner/repo
 *
 * Rejects invalid domains, malformed strings, and URLs missing owner or repository.
 */
export function parseGitHubRepositoryUrl(
  input: string
): { success: true; ref: GitHubRepositoryReference } | { success: false; error: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { success: false, error: 'Please enter a GitHub repository URL.' };
  }

  let cleaned = trimmed;

  // Remove protocol if present
  if (cleaned.startsWith('https://')) {
    cleaned = cleaned.slice(8);
  } else if (cleaned.startsWith('http://')) {
    cleaned = cleaned.slice(7);
  }

  // Check and strip domain if present
  if (cleaned.startsWith('github.com/')) {
    cleaned = cleaned.slice('github.com/'.length);
  } else if (cleaned.includes('/') && cleaned.split('/')[0].includes('.')) {
    // Other domain entered (e.g., gitlab.com, bitbucket.org, example.com)
    return {
      success: false,
      error: 'Only public GitHub repositories (github.com) are supported.',
    };
  }

  // Remove trailing slashes and .git suffix
  cleaned = cleaned.replace(/\/+$/, '');
  if (cleaned.endsWith('.git')) {
    cleaned = cleaned.slice(0, -4);
  }

  const parts = cleaned.split('/').filter(Boolean);

  if (parts.length < 2) {
    return {
      success: false,
      error: 'URL must include both owner and repository name (e.g., facebook/react).',
    };
  }

  const [owner, repo] = parts;

  // Basic validation for owner and repo names (alphanumeric, hyphens, underscores, dots)
  const validSegmentRegex = /^[a-zA-Z0-9_.-]+$/;

  if (!validSegmentRegex.test(owner) || !validSegmentRegex.test(repo)) {
    return {
      success: false,
      error: 'Repository URL contains invalid characters.',
    };
  }

  // Reserved GitHub top-level paths that are not repositories
  const reservedPaths = new Set([
    'features',
    'explore',
    'trending',
    'topics',
    'collections',
    'events',
    'sponsors',
    'settings',
    'notifications',
    'pulls',
    'issues',
    'marketplace',
    'pricing',
    'login',
    'join',
  ]);

  if (reservedPaths.has(owner.toLowerCase()) && parts.length === 2) {
    return {
      success: false,
      error: `"${owner}" is a reserved GitHub path, not a repository owner.`,
    };
  }

  return {
    success: true,
    ref: {
      owner,
      repo,
    },
  };
}
