export interface AppConfig {
  name: string;
  version: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface BasicInfoData {
  projectName: string;
  description: string;
  repositoryUrl: string;
  demoUrl: string;
  authorName: string;
  authorGithub: string;
}

export interface ReadmeData {
  basicInfo: BasicInfoData;
}

export type ValidationErrors = Partial<Record<keyof BasicInfoData, string>>;
