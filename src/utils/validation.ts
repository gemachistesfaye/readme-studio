import { BasicInfoData, ContactData, ContactErrors, ValidationErrors } from '@/types';

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

export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
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

export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address (e.g., name@example.com)';
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'Please enter a valid URL (e.g., https://example.com)';
  }

  if (data.linkedin && !isValidUrl(data.linkedin)) {
    errors.linkedin = 'Please enter a valid URL (e.g., https://linkedin.com/in/username)';
  }

  if (data.twitter && data.twitter.trim().startsWith('http') && !isValidUrl(data.twitter)) {
    errors.twitter = 'Please enter a valid URL or handle';
  }

  if (data.additionalLinkUrl && !isValidUrl(data.additionalLinkUrl)) {
    errors.additionalLinkUrl = 'Please enter a valid URL (e.g., https://example.com)';
  }

  return errors;
}
