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

export interface ReadmeData {
  basicInfo: BasicInfoData;
  techStack: TechStackData;
  features: FeaturesData;
}

export type ValidationErrors = Partial<Record<keyof BasicInfoData, string>>;
