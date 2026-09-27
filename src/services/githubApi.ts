import {
  GitHubRawRepository,
  GitHubRawLanguages,
  GitHubImportAnalysis,
  GitHubImportError,
  GitHubDetectedTechnology,
} from '@/types';
import { parseGitHubRepositoryUrl } from '@/utils/parseGitHubUrl';
import {
  GITHUB_LANGUAGE_CATEGORY_MAP,
  PACKAGE_JSON_TECH_MAP,
  GITHUB_SPDX_LICENSE_MAP,
} from '@/constants/githubLanguageMap';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Creates standardized headers for public GitHub API requests.
 */
function getGitHubHeaders(): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
  };
}

/**
 * Parses rate limit or error details from a failed GitHub response.
 */
function parseGitHubError(status: number, headers: Headers, data?: { message?: string }): GitHubImportError {
  const remaining = headers.get('x-ratelimit-remaining');
  const resetTimeStr = headers.get('x-ratelimit-reset');
  const resetAt = resetTimeStr ? parseInt(resetTimeStr, 10) * 1000 : undefined;

  if (status === 403 || status === 429 || remaining === '0') {
    return {
      kind: 'rate_limited',
      message: "GitHub's public API rate limit has been reached. Please try again later.",
      status,
      resetAt,
    };
  }

  if (status === 404) {
    return {
      kind: 'not_found',
      message: "We couldn't find that public GitHub repository. Please verify the owner and repository name.",
      status,
    };
  }

  return {
    kind: 'unknown',
    message: data?.message || `GitHub API request failed with status ${status}.`,
    status,
  };
}

/**
 * Fetches primary metadata for a public repository.
 */
export async function fetchRepositoryMetadata(
  owner: string,
  repo: string,
  signal?: AbortSignal
): Promise<GitHubRawRepository> {
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getGitHubHeaders(),
    signal,
  });

  if (!response.ok) {
    let errorData: { message?: string } | undefined;
    try {
      errorData = await response.json();
    } catch {
      // Ignored
    }
    throw parseGitHubError(response.status, response.headers, errorData);
  }

  return response.json();
}

/**
 * Fetches languages breakdown for a public repository.
 */
export async function fetchRepositoryLanguages(
  owner: string,
  repo: string,
  signal?: AbortSignal
): Promise<GitHubRawLanguages> {
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getGitHubHeaders(),
    signal,
  });

  if (!response.ok) {
    return {};
  }

  return response.json();
}

/**
 * Checks whether the repository has an existing README file.
 */
export async function checkExistingReadme(
  owner: string,
  repo: string,
  signal?: AbortSignal
): Promise<boolean> {
  try {
    const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getGitHubHeaders(),
      signal,
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Optionally inspects package.json dependencies for framework/tool suggestions.
 */
export async function detectPackageJsonTechnologies(
  owner: string,
  repo: string,
  defaultBranch: string,
  signal?: AbortSignal
): Promise<GitHubDetectedTechnology[]> {
  try {
    const url = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(defaultBranch)}/package.json`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return [];
    }

    const pkg = await response.json();
    const detected: GitHubDetectedTechnology[] = [];
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    for (const [depName, mapping] of Object.entries(PACKAGE_JSON_TECH_MAP)) {
      if (allDeps[depName]) {
        // Avoid duplicate additions
        if (!detected.some((d) => d.name.toLowerCase() === mapping.name.toLowerCase())) {
          detected.push({
            name: mapping.name,
            category: mapping.category,
            source: 'package.json',
          });
        }
      }
    }

    return detected;
  } catch {
    return [];
  }
}

/**
 * Main orchestrator: Analyzes a public GitHub repository from its URL.
 */
export async function analyzePublicRepository(
  inputUrl: string,
  signal?: AbortSignal
): Promise<GitHubImportAnalysis> {
  const parseResult = parseGitHubRepositoryUrl(inputUrl);

  if (!parseResult.success) {
    throw {
      kind: 'invalid_url',
      message: parseResult.error,
    } as GitHubImportError;
  }

  const { owner, repo } = parseResult.ref;

  try {
    // 1. Fetch metadata
    const metadata = await fetchRepositoryMetadata(owner, repo, signal);

    // 2. Fetch languages in parallel with README check
    const [rawLanguages, hasReadme] = await Promise.all([
      fetchRepositoryLanguages(owner, repo, signal).catch(() => ({})),
      checkExistingReadme(owner, repo, signal).catch(() => false),
    ]);

    // 3. Map detected languages
    const detectedTechList: GitHubDetectedTechnology[] = [];
    const languageNames = Object.keys(rawLanguages);

    for (const lang of languageNames) {
      const mapping = GITHUB_LANGUAGE_CATEGORY_MAP[lang];
      if (mapping) {
        detectedTechList.push({
          name: mapping.normalizedName || lang,
          category: mapping.category,
          source: 'language',
        });
      } else {
        detectedTechList.push({
          name: lang,
          category: 'Other',
          source: 'language',
        });
      }
    }

    // 4. Inspect package.json if JavaScript/TypeScript is present
    const hasJsOrTs = languageNames.some((l) => ['TypeScript', 'JavaScript'].includes(l));
    if (hasJsOrTs) {
      const packageTechs = await detectPackageJsonTechnologies(
        owner,
        repo,
        metadata.default_branch || 'main',
        signal
      );

      for (const pTech of packageTechs) {
        if (!detectedTechList.some((d) => d.name.toLowerCase() === pTech.name.toLowerCase())) {
          detectedTechList.push(pTech);
        }
      }
    }

    // 5. Map License
    let mappedLicense: GitHubImportAnalysis['license'] = null;
    if (metadata.license?.spdx_id) {
      const spdxLower = metadata.license.spdx_id.toLowerCase();
      const mappedType = GITHUB_SPDX_LICENSE_MAP[spdxLower];
      if (mappedType) {
        mappedLicense = {
          spdxId: metadata.license.spdx_id,
          name: metadata.license.name || metadata.license.spdx_id,
          mappedType,
        };
      }
    }

    // 6. Homepage validation
    const homepage = metadata.homepage?.trim() || '';
    const validHomepage =
      homepage.startsWith('http://') || homepage.startsWith('https://') ? homepage : '';

    return {
      repoRef: { owner, repo },
      name: metadata.name || repo,
      description: metadata.description?.trim() || '',
      repositoryUrl: metadata.html_url || `https://github.com/${owner}/${repo}`,
      homepage: validHomepage,
      owner: {
        username: metadata.owner?.login || owner,
        profileUrl: metadata.owner?.html_url || `https://github.com/${owner}`,
        avatarUrl: metadata.owner?.avatar_url,
      },
      primaryLanguage: metadata.language || (languageNames.length > 0 ? languageNames[0] : null),
      languages: languageNames,
      detectedTechnologies: detectedTechList,
      license: mappedLicense,
      hasExistingReadme: hasReadme,
      defaultBranch: metadata.default_branch || 'main',
    };
  } catch (err: unknown) {
    if (signal?.aborted) {
      throw {
        kind: 'unknown',
        message: 'Analysis was cancelled.',
      } as GitHubImportError;
    }

    // If it is already a structured GitHubImportError
    if (err && typeof err === 'object' && 'kind' in err) {
      throw err as GitHubImportError;
    }

    // Network or fetch exceptions
    throw {
      kind: 'network_error',
      message: 'Network error: Unable to reach GitHub. Please check your internet connection.',
    } as GitHubImportError;
  }
}
