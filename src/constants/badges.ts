import { BadgeStyle } from '@/types';

export const BADGE_STYLES: { id: BadgeStyle; name: string }[] = [
  { id: 'flat', name: 'Flat' },
  { id: 'flat-square', name: 'Flat Square' },
  { id: 'plastic', name: 'Plastic' },
  { id: 'for-the-badge', name: 'For the Badge' },
];

export interface TechBadgePreset {
  name: string;
  label: string;
  message: string;
  color: string;
  logo: string;
}

export const TECH_BADGE_PRESETS: Record<string, TechBadgePreset> = {
  JavaScript: { name: 'JavaScript', label: 'JavaScript', message: 'ES6+', color: 'F7DF1E', logo: 'javascript' },
  TypeScript: { name: 'TypeScript', label: 'TypeScript', message: '5.x', color: '3178C6', logo: 'typescript' },
  React: { name: 'React', label: 'React', message: '19', color: '61DAFB', logo: 'react' },
  'Node.js': { name: 'Node.js', label: 'Node.js', message: 'LTS', color: '339933', logo: 'node.js' },
  Express: { name: 'Express', label: 'Express', message: 'REST API', color: '000000', logo: 'express' },
  Python: { name: 'Python', label: 'Python', message: '3.x', color: '3776AB', logo: 'python' },
  Java: { name: 'Java', label: 'Java', message: '21', color: 'ED8B00', logo: 'openjdk' },
  'C++': { name: 'C++', label: 'C++', message: '20', color: '00599C', logo: 'c%2B%2B' },
  MySQL: { name: 'MySQL', label: 'MySQL', message: '8.0', color: '4479A1', logo: 'mysql' },
  PostgreSQL: { name: 'PostgreSQL', label: 'PostgreSQL', message: '16', color: '4169E1', logo: 'postgresql' },
  MongoDB: { name: 'MongoDB', label: 'MongoDB', message: '7.0', color: '47A248', logo: 'mongodb' },
  Firebase: { name: 'Firebase', label: 'Firebase', message: 'Backend', color: 'FFCA28', logo: 'firebase' },
  Supabase: { name: 'Supabase', label: 'Supabase', message: 'Database', color: '3ECF8E', logo: 'supabase' },
  Docker: { name: 'Docker', label: 'Docker', message: 'Container', color: '2496ED', logo: 'docker' },
  Git: { name: 'Git', label: 'Git', message: 'VCS', color: 'F05032', logo: 'git' },
  GitHub: { name: 'GitHub', label: 'GitHub', message: 'Repository', color: '181717', logo: 'github' },
  HTML5: { name: 'HTML5', label: 'HTML5', message: 'Standard', color: 'E34F26', logo: 'html5' },
  CSS3: { name: 'CSS3', label: 'CSS3', message: 'Styling', color: '1572B6', logo: 'css3' },
  'Tailwind CSS': { name: 'Tailwind CSS', label: 'Tailwind CSS', message: 'v4', color: '06B6D4', logo: 'tailwindcss' },
  Vite: { name: 'Vite', label: 'Vite', message: 'Fast', color: '646CFF', logo: 'vite' },
};
