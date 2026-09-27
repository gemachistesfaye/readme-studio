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

export type TechCategory =
  | 'Language'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'AI / ML'
  | 'DevOps / Cloud'
  | 'Tools'
  | 'Other';

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
}

export interface TechStackData {
  technologies: Technology[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
}

export interface FeaturesData {
  features: Feature[];
}

export interface InstallationStep {
  id: string;
  instruction: string;
  command: string;
}

export interface InstallationData {
  prerequisites: string;
  cloneCommand: string;
  installCommand: string;
  setupInstructions: InstallationStep[];
}

export interface UsageExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

export interface UsageData {
  introduction: string;
  examples: UsageExample[];
}

export interface ReadmeData {
  basicInfo: BasicInfoData;
  techStack: TechStackData;
  features: FeaturesData;
  installation: InstallationData;
  usage: UsageData;
}

export type ValidationErrors = Partial<Record<keyof BasicInfoData, string>>;
