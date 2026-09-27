import { TechCategory, LicenseType } from './index';

export interface GitHubRepositoryReference {
  owner: string;
  repo: string;
}

export interface GitHubRawOwner {
  login: string;
  html_url: string;
  avatar_url?: string;
  type?: string;
}

export interface GitHubRawLicense {
  key: string;
  name: string;
  spdx_id: string;
  url?: string;
}

export interface GitHubRawRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  default_branch: string;
  owner: GitHubRawOwner;
  license: GitHubRawLicense | null;
  topics?: string[];
  archived?: boolean;
  fork?: boolean;
}

export type GitHubRawLanguages = Record<string, number>;

export interface GitHubDetectedTechnology {
  name: string;
  category: TechCategory;
  source: 'language' | 'package.json' | 'config';
}

export interface GitHubImportAnalysis {
  repoRef: GitHubRepositoryReference;
  name: string;
  description: string;
  repositoryUrl: string;
  homepage: string;
  owner: {
    username: string;
    profileUrl: string;
    avatarUrl?: string;
  };
  primaryLanguage: string | null;
  languages: string[];
  detectedTechnologies: GitHubDetectedTechnology[];
  license: {
    spdxId: string;
    name: string;
    mappedType: LicenseType;
  } | null;
  hasExistingReadme: boolean;
  defaultBranch: string;
}

export interface GitHubImportSelection {
  projectName: boolean;
  description: boolean;
  repositoryUrl: boolean;
  homepage: boolean;
  authorName: boolean;
  authorGithub: boolean;
  technologies: string[];
  license: boolean;
}

export type GitHubImportErrorKind =
  | 'invalid_url'
  | 'not_found'
  | 'rate_limited'
  | 'network_error'
  | 'forbidden'
  | 'unknown';

export interface GitHubImportError {
  kind: GitHubImportErrorKind;
  message: string;
  status?: number;
  resetAt?: number;
}
