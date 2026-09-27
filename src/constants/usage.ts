export interface CodeLanguageOption {
  value: string;
  label: string;
}

export const USAGE_CODE_LANGUAGES: CodeLanguageOption[] = [
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'text', label: 'Plain Text' },
];

export const DEFAULT_USAGE_LANGUAGE = 'bash';
