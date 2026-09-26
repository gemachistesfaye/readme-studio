import { TechCategory } from '@/types';

export const TECH_CATEGORIES: TechCategory[] = [
  'Language',
  'Frontend',
  'Backend',
  'Database',
  'AI / ML',
  'DevOps / Cloud',
  'Tools',
  'Other',
];

export interface QuickAddOption {
  name: string;
  category: TechCategory;
}

export const QUICK_ADD_OPTIONS: QuickAddOption[] = [
  { name: 'JavaScript', category: 'Language' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'Python', category: 'Language' },
  { name: 'Java', category: 'Language' },
  { name: 'C++', category: 'Language' },
  { name: 'MySQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Firebase', category: 'Backend' },
  { name: 'Supabase', category: 'Backend' },
  { name: 'Docker', category: 'DevOps / Cloud' },
  { name: 'Git', category: 'Tools' },
  { name: 'GitHub', category: 'Tools' },
];
