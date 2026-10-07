import {
  BasicInfoData,
  BadgesData,
  ContactData,
  ContributingData,
  FeaturesData,
  GithubStatsData,
  InstallationData,
  LicenseData,
  ReadmeData,
  ReadmeSectionId,
  TechStackData,
  UsageData,
} from '@/types';
import { TECH_CATEGORIES } from '@/constants/techStack';
import { LICENSE_OPTIONS } from '@/constants/licenses';
import { getSectionMeta } from '@/constants/sections';
import { generateBadgesRow } from './generateBadge';
import { normalizeSectionOrder } from './sectionOrder';

/**
 * Formats a code block with backtick-safe fences.
 * If code contains 3 backticks, it uses 4 backticks (or more) so fences remain valid Markdown.
 */
export function formatFencedCode(code: string, language = ''): string {
  const normalized = code.replace(/\r\n/g, '\n').trim();
  const maxConsecutiveBackticks = (normalized.match(/`+/g) || []).reduce(
    (max, m) => Math.max(max, m.length),
    0
  );
  const fenceLength = Math.max(3, maxConsecutiveBackticks + 1);
  const fence = '`'.repeat(fenceLength);
  const lang = language.trim();
  return `${fence}${lang}\n${normalized}\n${fence}`;
}

/**
 * 1. Basic Information Section (with Badges placed directly beneath title)
 */
export function generateBasicInfoSection(basicInfo: BasicInfoData, badges?: BadgesData): string {
  const parts: string[] = [];

  const name = basicInfo.projectName.trim();
  if (name) {
    parts.push(`# ${name}`);
  }

  // Badges appear directly beneath project title
  if (badges && badges.badges.length > 0) {
    const badgeRow = generateBadgesRow(badges.badges);
    if (badgeRow) {
      parts.push(badgeRow);
    }
  }

  const desc = basicInfo.description.trim();
  if (desc) {
    parts.push(desc);
  }

  const repo = basicInfo.repositoryUrl.trim();
  const demo = basicInfo.demoUrl.trim();
  const links: string[] = [];
  if (repo) {
    links.push(`[Repository](${repo})`);
  }
  if (demo) {
    links.push(`[Live Demo](${demo})`);
  }
  if (links.length > 0) {
    parts.push(links.join(' • '));
  }

  return parts.join('\n\n');
}

/**
 * 2. Tech Stack Section
 */
export function generateTechStackSection(techStack: TechStackData): string {
  if (techStack.technologies.length === 0) {
    return '';
  }

  const lines: string[] = [];

  // Group technologies according to standard category order
  for (const cat of TECH_CATEGORIES) {
    const items = techStack.technologies
      .filter((t) => t.category === cat)
      .map((t) => t.name.trim())
      .filter(Boolean);

    if (items.length > 0) {
      lines.push(`**${cat}:** ${items.join(', ')}`);
    }
  }

  if (lines.length === 0) {
    return '';
  }

  return `## Tech Stack\n\n${lines.join('\n')}`;
}

/**
 * 3. Features Section
 */
export function generateFeaturesSection(features: FeaturesData): string {
  if (features.features.length === 0) {
    return '';
  }

  const items = features.features
    .map((f) => {
      const title = f.title.trim();
      const desc = f.description.trim();
      if (!title) return '';
      if (desc) {
        return `- **${title}** — ${desc}`;
      }
      return `- **${title}**`;
    })
    .filter(Boolean);

  if (items.length === 0) {
    return '';
  }

  return `## Features\n\n${items.join('\n')}`;
}

/**
 * 4. Installation Section
 */
export function generateInstallationSection(installation: InstallationData): string {
  const parts: string[] = [];

  const prereqs = installation.prerequisites.trim();
  if (prereqs) {
    parts.push(`### Prerequisites\n\n${prereqs}`);
  }

  const stepLines: string[] = [];
  let stepIndex = 1;

  if (installation.cloneCommand.trim()) {
    stepLines.push(
      `${stepIndex}. Clone the repository\n${formatFencedCode(installation.cloneCommand, 'bash')}`
    );
    stepIndex++;
  }

  if (installation.installCommand.trim()) {
    stepLines.push(
      `${stepIndex}. Install dependencies\n${formatFencedCode(installation.installCommand, 'bash')}`
    );
    stepIndex++;
  }

  for (const s of installation.setupInstructions) {
    const inst = s.instruction.trim();
    if (!inst) continue;

    const cmd = s.command.trim();
    if (cmd) {
      stepLines.push(`${stepIndex}. ${inst}\n${formatFencedCode(cmd, 'bash')}`);
    } else {
      stepLines.push(`${stepIndex}. ${inst}`);
    }
    stepIndex++;
  }

  if (stepLines.length > 0) {
    parts.push(`### Setup\n\n${stepLines.join('\n\n')}`);
  }

  if (parts.length === 0) {
    return '';
  }

  return `## Installation\n\n${parts.join('\n\n')}`;
}

/**
 * 5. Usage Section
 */
export function generateUsageSection(usage: UsageData): string {
  const parts: string[] = [];

  const intro = usage.introduction.trim();
  if (intro) {
    parts.push(intro);
  }

  for (const ex of usage.examples) {
    const title = ex.title.trim();
    if (!title) continue;

    const exParts: string[] = [`### ${title}`];
    const desc = ex.description.trim();
    if (desc) {
      exParts.push(desc);
    }
    const code = ex.code.trim();
    if (code) {
      exParts.push(formatFencedCode(code, ex.language || 'bash'));
    }
    parts.push(exParts.join('\n\n'));
  }

  if (parts.length === 0) {
    return '';
  }

  return `## Usage\n\n${parts.join('\n\n')}`;
}

/**
 * 6. Contributing Section
 */
export function generateContributingSection(contributing: ContributingData): string {
  if (!contributing.enabled) {
    return '';
  }

  const parts: string[] = [];

  const intro = contributing.introduction.trim();
  if (intro) {
    parts.push(intro);
  }

  const guidelines = contributing.guidelines
    .map((g) => g.trim())
    .filter(Boolean);

  if (guidelines.length > 0) {
    const list = guidelines.map((g, idx) => `${idx + 1}. ${g}`).join('\n');
    parts.push(list);
  }

  const custom = contributing.customInstructions.trim();
  if (custom) {
    parts.push(custom);
  }

  if (parts.length === 0) {
    return '';
  }

  return `## Contributing\n\n${parts.join('\n\n')}`;
}

/**
 * 7. License Section
 */
export function generateLicenseSection(license: LicenseData): string {
  if (license.type === 'None') {
    return '';
  }

  if (license.type === 'Proprietary') {
    return '## License\n\nThis project is proprietary software. All rights reserved.';
  }

  if (license.type === 'Custom') {
    const name = license.customName.trim() || 'Custom License';
    const text = license.customText.trim();
    if (text) {
      return `## License\n\nThis project is licensed under the ${name}.\n\n${text}`;
    }
    return `## License\n\nThis project is licensed under the ${name}.`;
  }

  const option = LICENSE_OPTIONS.find((l) => l.type === license.type);
  const notice = option?.notice || `This project is licensed under the ${license.type} License.`;
  return `## License\n\n${notice}`;
}

/**
 * 8. Contact Section
 */
export function generateContactSection(contact: ContactData, basicInfo?: BasicInfoData): string {
  const parts: string[] = [];

  const authorName = basicInfo?.authorName?.trim() || '';
  if (authorName) {
    parts.push(authorName);
  }

  const items: string[] = [];

  const authorGithub = basicInfo?.authorGithub?.trim() || '';
  if (authorGithub) {
    items.push(`- GitHub: [Profile](${authorGithub})`);
  }

  const email = contact.email.trim();
  if (email) {
    items.push(`- Email: [${email}](mailto:${email})`);
  }

  const website = contact.website.trim();
  if (website) {
    const display = website.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    items.push(`- Website: [${display}](${website})`);
  }

  const linkedin = contact.linkedin.trim();
  if (linkedin) {
    items.push(`- LinkedIn: [Profile](${linkedin})`);
  }

  const twitter = contact.twitter.trim();
  if (twitter) {
    if (twitter.startsWith('http://') || twitter.startsWith('https://')) {
      items.push(`- X / Twitter: [Profile](${twitter})`);
    } else {
      const handle = twitter.startsWith('@') ? twitter : `@${twitter}`;
      items.push(`- X / Twitter: ${handle}`);
    }
  }

  const customUrl = contact.additionalLinkUrl.trim();
  if (customUrl) {
    const label = contact.additionalLinkLabel.trim() || 'Link';
    items.push(`- ${label}: [${label}](${customUrl})`);
  }

  if (items.length > 0) {
    parts.push(items.join('\n'));
  }

  if (parts.length === 0) {
    return '';
  }

  return `## Contact\n\n${parts.join('\n\n')}`;
}

/**
 * Markdown builders for every reorderable README section, keyed by section id.
 *
 * A single registry keeps section generation defined in exactly one place —
 * changing the layout never duplicates generation logic.
 */
function hasContentBeforeLicense(data: ReadmeData): boolean {
  const basicInfo = data.basicInfo;
  return Boolean(
    basicInfo.projectName.trim() ||
      basicInfo.description.trim() ||
      basicInfo.repositoryUrl.trim() ||
      basicInfo.demoUrl.trim() ||
      basicInfo.authorName.trim() ||
      basicInfo.authorGithub.trim() ||
      data.badges.badges.length ||
      data.techStack.technologies.length ||
      data.features.features.length ||
      data.installation.prerequisites.trim() ||
      data.installation.cloneCommand.trim() ||
      data.installation.installCommand.trim() ||
      data.installation.setupInstructions.length ||
      data.usage.introduction.trim() ||
      data.usage.examples.length ||
      data.contributing.introduction.trim() ||
      data.contributing.guidelines.length ||
      data.contributing.customInstructions.trim() ||
      data.contact.email.trim() ||
      data.contact.website.trim() ||
      data.contact.linkedin.trim() ||
      data.contact.twitter.trim() ||
      data.contact.additionalLinkLabel.trim() ||
      data.contact.additionalLinkUrl.trim()
  );
}

export function generateGithubStatsSection(stats?: GithubStatsData): string {
  if (!stats || !stats.enabled || !stats.username.trim()) return '';
  const username = stats.username.trim();
  const theme = stats.theme || 'github_dark';
  const parts: string[] = [];

  if (stats.showStats) {
    parts.push(
      `![${username}'s GitHub Stats](https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(username)}&show_icons=true&theme=${theme})`
    );
  }
  if (stats.showTopLangs) {
    parts.push(
      `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(username)}&layout=compact&theme=${theme})`
    );
  }
  if (stats.showStreak) {
    parts.push(
      `![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${encodeURIComponent(username)}&theme=${theme})`
    );
  }

  if (parts.length === 0) return '';
  return `## GitHub Stats\n\n<p align="center">\n  ${parts.join('\n  ')}\n</p>`;
}

const SECTION_BUILDERS: Record<ReadmeSectionId, (data: ReadmeData) => string> = {
  techStack: (data) => generateTechStackSection(data.techStack),
  features: (data) => generateFeaturesSection(data.features),
  installation: (data) => generateInstallationSection(data.installation),
  usage: (data) => generateUsageSection(data.usage),
  contributing: (data) => generateContributingSection(data.contributing),
  license: (data) => {
    const isDefaultBlankLicense =
      data.license.type === 'MIT' &&
      !data.license.customName.trim() &&
      !data.license.customText.trim() &&
      !hasContentBeforeLicense(data);
    return isDefaultBlankLicense ? '' : generateLicenseSection(data.license);
  },
  contact: (data) => generateContactSection(data.contact, data.basicInfo),
  githubStats: (data) => generateGithubStatsSection(data.githubStats),
};

/**
 * Canonical Markdown Generation Engine
 *
 * Pure, deterministic, strongly typed conversion of ReadmeData into valid README.md markdown.
 *
 * The project identity header (title, badges, description, repository/demo links)
 * is always emitted first. Reorderable sections follow in the user-configured
 * `data.layout.sectionOrder`, each appearing at most once. Empty sections are
 * omitted regardless of their configured position.
 */
export function generateMarkdown(data: ReadmeData): string {
  const sections: string[] = [];

  // Fixed identity area: title, badge row, description, repository/demo links
  const basic = generateBasicInfoSection(data.basicInfo, data.badges);
  if (basic) sections.push(basic);

  // Reorderable sections, rendered in the configured order
  const order = normalizeSectionOrder(data.layout?.sectionOrder);
  const renderedSections: { id: ReadmeSectionId; content: string }[] = [];

  for (const sectionId of order) {
    const markdown = SECTION_BUILDERS[sectionId](data);
    if (markdown) {
      renderedSections.push({ id: sectionId, content: markdown });
    }
  }

  // Optional Table of Contents
  if (data.layout?.includeToc && renderedSections.length > 0) {
    const tocItems = renderedSections.map((s) => {
      const meta = getSectionMeta(s.id);
      const slug = meta.label.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return `- [${meta.label}](#${slug})`;
    });
    sections.push(`## 📋 Table of Contents\n\n${tocItems.join('\n')}`);
  }

  for (const s of renderedSections) {
    sections.push(s.content);
  }

  if (sections.length === 0) {
    return '';
  }

  // Join sections with double newline and end with exactly one newline
  return sections.join('\n\n') + '\n';
}
