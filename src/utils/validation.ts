import { BasicInfoData, ValidationErrors } from '@/types';

export const MAX_DESCRIPTION_LENGTH = 250;

export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateBasicInfo(data: BasicInfoData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.projectName || !data.projectName.trim()) {
    errors.projectName = 'Project name is required';
  }

  if (!data.description || !data.description.trim()) {
    errors.description = 'Short description is required';
  } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  if (data.repositoryUrl && !isValidUrl(data.repositoryUrl)) {
    errors.repositoryUrl = 'Please enter a valid URL (e.g., https://github.com/user/repo)';
  }

  if (data.demoUrl && !isValidUrl(data.demoUrl)) {
    errors.demoUrl = 'Please enter a valid URL (e.g., https://example.com)';
  }

  if (data.authorGithub && !isValidUrl(data.authorGithub)) {
    errors.authorGithub = 'Please enter a valid URL (e.g., https://github.com/username)';
  }

  return errors;
}
