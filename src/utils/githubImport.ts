import {
  ReadmeData,
  GitHubImportAnalysis,
  GitHubImportSelection,
  Technology,
} from '@/types';

/**
 * Creates recommended default import selections for a newly analyzed repository.
 */
export function createDefaultGitHubSelection(
  analysis: GitHubImportAnalysis
): GitHubImportSelection {
  return {
    projectName: true,
    description: Boolean(analysis.description),
    repositoryUrl: true,
    homepage: Boolean(analysis.homepage),
    authorName: false, // Default to unselected since username may not be full name
    authorGithub: false,
    technologies: analysis.detectedTechnologies.map((t) => t.name),
    license: Boolean(analysis.license),
  };
}

export interface OverwriteConflict {
  field: string;
  currentValue: string;
  incomingValue: string;
}

/**
 * Detects whether any selected import field will replace non-empty existing data in the workspace.
 */
export function getOverwritingFields(
  currentData: ReadmeData,
  analysis: GitHubImportAnalysis,
  selection: GitHubImportSelection
): OverwriteConflict[] {
  const conflicts: OverwriteConflict[] = [];

  if (selection.projectName && currentData.basicInfo.projectName.trim() && currentData.basicInfo.projectName.trim() !== analysis.name) {
    conflicts.push({
      field: 'Project Name',
      currentValue: currentData.basicInfo.projectName,
      incomingValue: analysis.name,
    });
  }

  if (selection.description && currentData.basicInfo.description.trim() && currentData.basicInfo.description.trim() !== analysis.description) {
    conflicts.push({
      field: 'Description',
      currentValue: currentData.basicInfo.description,
      incomingValue: analysis.description,
    });
  }

  if (selection.repositoryUrl && currentData.basicInfo.repositoryUrl.trim() && currentData.basicInfo.repositoryUrl.trim() !== analysis.repositoryUrl) {
    conflicts.push({
      field: 'Repository URL',
      currentValue: currentData.basicInfo.repositoryUrl,
      incomingValue: analysis.repositoryUrl,
    });
  }

  if (selection.homepage && analysis.homepage && currentData.basicInfo.demoUrl.trim() && currentData.basicInfo.demoUrl.trim() !== analysis.homepage) {
    conflicts.push({
      field: 'Live Demo URL',
      currentValue: currentData.basicInfo.demoUrl,
      incomingValue: analysis.homepage,
    });
  }

  if (selection.authorName && currentData.basicInfo.authorName.trim() && currentData.basicInfo.authorName.trim() !== analysis.owner.username) {
    conflicts.push({
      field: 'Author Name',
      currentValue: currentData.basicInfo.authorName,
      incomingValue: analysis.owner.username,
    });
  }

  if (selection.authorGithub && currentData.basicInfo.authorGithub.trim() && currentData.basicInfo.authorGithub.trim() !== analysis.owner.profileUrl) {
    conflicts.push({
      field: 'Author GitHub',
      currentValue: currentData.basicInfo.authorGithub,
      incomingValue: analysis.owner.profileUrl,
    });
  }

  if (selection.license && analysis.license && currentData.license.type !== 'None' && currentData.license.type !== analysis.license.mappedType) {
    conflicts.push({
      field: 'License',
      currentValue: currentData.license.type,
      incomingValue: analysis.license.mappedType,
    });
  }

  return conflicts;
}

/**
 * Pure transform: Merges selected GitHub repository data into existing ReadmeData.
 */
export function mapGitHubImportToReadmeData(
  currentData: ReadmeData,
  analysis: GitHubImportAnalysis,
  selection: GitHubImportSelection
): ReadmeData {
  // 1. Basic Info Merge
  const updatedBasicInfo = {
    ...currentData.basicInfo,
    ...(selection.projectName ? { projectName: analysis.name } : {}),
    ...(selection.description ? { description: analysis.description } : {}),
    ...(selection.repositoryUrl ? { repositoryUrl: analysis.repositoryUrl } : {}),
    ...(selection.homepage && analysis.homepage ? { demoUrl: analysis.homepage } : {}),
    ...(selection.authorName ? { authorName: analysis.owner.username } : {}),
    ...(selection.authorGithub ? { authorGithub: analysis.owner.profileUrl } : {}),
  };

  // 2. Tech Stack Merge (Deduplicated case-insensitively)
  const existingTechs = [...currentData.techStack.technologies];
  const selectedTechObjects = analysis.detectedTechnologies.filter((dt) =>
    selection.technologies.includes(dt.name)
  );

  for (const newTech of selectedTechObjects) {
    const isAlreadyPresent = existingTechs.some(
      (t) => t.name.toLowerCase() === newTech.name.toLowerCase()
    );

    if (!isAlreadyPresent) {
      const techItem: Technology = {
        id: `tech-gh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: newTech.name,
        category: newTech.category,
      };
      existingTechs.push(techItem);
    }
  }

  // 3. License Merge
  const updatedLicense = { ...currentData.license };
  if (selection.license && analysis.license) {
    updatedLicense.type = analysis.license.mappedType;
  }

  return {
    ...currentData,
    basicInfo: updatedBasicInfo,
    techStack: {
      technologies: existingTechs,
    },
    license: updatedLicense,
  };
}
