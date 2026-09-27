import React, { useMemo } from 'react';
import { Copy, Download, Eye, FileCode, Github, ExternalLink, Mail, Globe, Linkedin, Twitter, Link2, User } from 'lucide-react';
import {
  BasicInfoData,
  ContactData,
  ContributingData,
  FeaturesData,
  InstallationData,
  LicenseData,
  TechCategory,
  TechStackData,
  UsageData,
} from '@/types';
import { TECH_CATEGORIES } from '@/constants/techStack';
import { LICENSE_OPTIONS } from '@/constants/licenses';

interface PreviewPanelProps {
  basicInfo: BasicInfoData;
  techStack: TechStackData;
  features: FeaturesData;
  installation: InstallationData;
  usage: UsageData;
  contributing: ContributingData;
  license: LicenseData;
  contact: ContactData;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  basicInfo,
  techStack,
  features,
  installation,
  usage,
  contributing,
  license,
  contact,
}) => {
  const displayTitle = basicInfo.projectName.trim() || 'Project Name';
  const displayDescription =
    basicInfo.description.trim() || 'Your project description will appear here.';

  const hasRepoUrl = !!basicInfo.repositoryUrl.trim();
  const hasDemoUrl = !!basicInfo.demoUrl.trim();
  const hasAuthor = !!basicInfo.authorName.trim();
  const hasAuthorGithub = !!basicInfo.authorGithub.trim();

  // Group technologies by category in logical order
  const groupedTech = useMemo(() => {
    const groups: Partial<Record<TechCategory, string[]>> = {};
    for (const cat of TECH_CATEGORIES) {
      const items = techStack.technologies
        .filter((t) => t.category === cat)
        .map((t) => t.name);
      if (items.length > 0) {
        groups[cat] = items;
      }
    }
    return groups;
  }, [techStack.technologies]);

  const hasTech = techStack.technologies.length > 0;
  const hasFeatures = features.features.length > 0;

  // Build ordered installation steps
  const installationSteps = useMemo(() => {
    const steps: { instruction: string; command?: string }[] = [];
    if (installation.cloneCommand.trim()) {
      steps.push({
        instruction: 'Clone the repository',
        command: installation.cloneCommand.trim(),
      });
    }
    if (installation.installCommand.trim()) {
      steps.push({
        instruction: 'Install dependencies',
        command: installation.installCommand.trim(),
      });
    }
    for (const s of installation.setupInstructions) {
      steps.push({
        instruction: s.instruction,
        command: s.command.trim() || undefined,
      });
    }
    return steps;
  }, [installation]);

  const hasPrerequisites = !!installation.prerequisites.trim();
  const hasInstallationContent = hasPrerequisites || installationSteps.length > 0;

  const hasUsageIntro = !!usage.introduction.trim();
  const hasUsageExamples = usage.examples.length > 0;
  const hasUsageContent = hasUsageIntro || hasUsageExamples;

  // Contributing flags
  const hasContributingIntro = !!contributing.introduction.trim();
  const hasContributingGuidelines = contributing.guidelines.length > 0;
  const hasContributingCustom = !!contributing.customInstructions.trim();
  const hasContributingContent =
    contributing.enabled &&
    (hasContributingIntro || hasContributingGuidelines || hasContributingCustom);

  // License flags & content
  const selectedLicense = LICENSE_OPTIONS.find((l) => l.type === license.type) || LICENSE_OPTIONS[0];
  const hasLicenseContent = license.type !== 'None';

  // Contact flags & content
  const hasEmail = !!contact.email.trim();
  const hasWebsite = !!contact.website.trim();
  const hasLinkedin = !!contact.linkedin.trim();
  const hasTwitter = !!contact.twitter.trim();
  const hasAdditionalLink = !!contact.additionalLinkUrl.trim();
  const hasContactContent =
    hasAuthor || hasEmail || hasWebsite || hasLinkedin || hasTwitter || hasAdditionalLink;

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-sm sticky top-20">
      {/* Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Preview</h2>
            <p className="text-xs text-zinc-500">Live markdown representation</p>
          </div>
        </div>

        {/* Future Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Copy functionality will be enabled in a future phase"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-500 cursor-not-allowed transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </button>
          <button
            type="button"
            disabled
            title="Download functionality will be enabled in a future phase"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-500 cursor-not-allowed transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Rendered Markdown Preview Area */}
      <div className="mt-4 flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 font-sans">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-zinc-800/60 text-xs font-mono text-zinc-500">
          <FileCode className="h-3.5 w-3.5 text-zinc-400" />
          <span>README.md</span>
          <span className="ml-auto text-[11px] rounded bg-zinc-800/60 px-1.5 py-0.5 text-zinc-500">
            Live Preview
          </span>
        </div>

        {/* Document Content */}
        <article className="space-y-6 text-zinc-300">
          {/* Project Title & Description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              {displayTitle}
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap">
              {displayDescription}
            </p>

            {/* Quick Links (Repo & Demo) */}
            {(hasRepoUrl || hasDemoUrl) && (
              <div className="mt-4 flex flex-wrap items-center gap-3 pt-2 text-xs">
                {hasRepoUrl && (
                  <a
                    href={basicInfo.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Repository</span>
                  </a>
                )}
                {hasDemoUrl && (
                  <a
                    href={basicInfo.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Tech Stack Section */}
          <div className="border-t border-zinc-800/60 pt-5">
            <h2 className="text-lg font-semibold text-zinc-200">Tech Stack</h2>
            {hasTech ? (
              <div className="mt-3 space-y-3">
                {Object.entries(groupedTech).map(([category, items]) => (
                  <div key={category} className="text-sm">
                    <p className="font-semibold text-zinc-200 text-xs tracking-wide">
                      {category}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      {items.join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-500 italic">
                Technologies added in the Tech Stack section will appear here grouped by category.
              </p>
            )}
          </div>

          {/* Features Section */}
          <div className="border-t border-zinc-800/60 pt-5">
            <h2 className="text-lg font-semibold text-zinc-200">Features</h2>
            {hasFeatures ? (
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc list-inside">
                {features.features.map((feature) => (
                  <li key={feature.id} className="leading-relaxed">
                    <strong className="font-semibold text-zinc-100">{feature.title}</strong>
                    {feature.description ? (
                      <span className="text-zinc-400"> — {feature.description}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-zinc-500 italic">
                Your project features will appear here.
              </p>
            )}
          </div>

          {/* Installation Section */}
          <div className="border-t border-zinc-800/60 pt-5">
            <h2 className="text-lg font-semibold text-zinc-200">Installation</h2>
            {hasInstallationContent ? (
              <div className="mt-3 space-y-4">
                {/* Prerequisites */}
                {hasPrerequisites && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300">Prerequisites</h3>
                    <p className="mt-1 text-sm text-zinc-400 whitespace-pre-wrap">
                      {installation.prerequisites}
                    </p>
                  </div>
                )}

                {/* Setup Steps */}
                {installationSteps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-2">Setup</h3>
                    <ol className="space-y-3 list-decimal list-inside text-sm text-zinc-300">
                      {installationSteps.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="font-medium text-zinc-200">{s.instruction}</span>
                          {s.command && (
                            <div className="mt-1.5 ml-5 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300 overflow-x-auto">
                              <code>{s.command}</code>
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-500 italic">
                Installation instructions will appear here.
              </p>
            )}
          </div>

          {/* Usage Section */}
          <div className="border-t border-zinc-800/60 pt-5">
            <h2 className="text-lg font-semibold text-zinc-200">Usage</h2>
            {hasUsageContent ? (
              <div className="mt-3 space-y-4">
                {/* Introduction */}
                {hasUsageIntro && (
                  <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap">
                    {usage.introduction}
                  </p>
                )}

                {/* Examples */}
                {hasUsageExamples && (
                  <div className="space-y-4">
                    {usage.examples.map((example) => (
                      <div key={example.id} className="space-y-1.5">
                        <h3 className="text-sm font-semibold text-zinc-200">
                          {example.title}
                        </h3>
                        {example.description && (
                          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {example.description}
                          </p>
                        )}
                        {example.code && (
                          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 overflow-x-auto">
                            {example.language && (
                              <div className="text-[10px] text-zinc-500 font-mono mb-1.5 select-none uppercase tracking-wider">
                                {example.language}
                              </div>
                            )}
                            <pre className="whitespace-pre overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-500 italic">
                Usage instructions and examples will appear here.
              </p>
            )}
          </div>

          {/* Contributing Section */}
          {contributing.enabled && (
            <div className="border-t border-zinc-800/60 pt-5">
              <h2 className="text-lg font-semibold text-zinc-200">Contributing</h2>
              {hasContributingContent ? (
                <div className="mt-3 space-y-3.5">
                  {hasContributingIntro && (
                    <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap">
                      {contributing.introduction}
                    </p>
                  )}

                  {hasContributingGuidelines && (
                    <ol className="space-y-2 list-decimal list-inside text-sm text-zinc-300">
                      {contributing.guidelines.map((guideline, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  {hasContributingCustom && (
                    <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap pt-1">
                      {contributing.customInstructions}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-zinc-500 italic">
                  Contribution guidelines will appear here.
                </p>
              )}
            </div>
          )}

          {/* License Section */}
          {hasLicenseContent && (
            <div className="border-t border-zinc-800/60 pt-5">
              <h2 className="text-lg font-semibold text-zinc-200">License</h2>
              <div className="mt-3 text-sm text-zinc-400 leading-relaxed">
                {license.type === 'Proprietary' && (
                  <p>This project is proprietary software. All rights reserved.</p>
                )}
                {license.type === 'Custom' && (
                  <div>
                    <p>
                      This project is licensed under{' '}
                      <strong className="text-zinc-200">
                        {license.customName.trim() || 'a custom license'}
                      </strong>
                      .
                    </p>
                    {license.customText.trim() && (
                      <p className="mt-2 whitespace-pre-wrap text-zinc-400">
                        {license.customText}
                      </p>
                    )}
                  </div>
                )}
                {license.type !== 'Proprietary' && license.type !== 'Custom' && (
                  <p>{selectedLicense.notice}</p>
                )}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {hasContactContent && (
            <div className="border-t border-zinc-800/60 pt-5">
              <h2 className="text-lg font-semibold text-zinc-200">Contact</h2>
              <div className="mt-3 space-y-2 text-sm text-zinc-300">
                {hasAuthor && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span>Created by</span>
                    {hasAuthorGithub ? (
                      <a
                        href={basicInfo.authorGithub}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                      >
                        {basicInfo.authorName}
                      </a>
                    ) : (
                      <span className="font-medium text-zinc-200">{basicInfo.authorName}</span>
                    )}
                  </div>
                )}

                {hasEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span className="text-zinc-400">Email:</span>
                    <a
                      href={`mailto:${contact.email.trim()}`}
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                    >
                      {contact.email.trim()}
                    </a>
                  </div>
                )}

                {hasWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span className="text-zinc-400">Website:</span>
                    <a
                      href={contact.website.trim()}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                    >
                      {contact.website.trim()}
                    </a>
                  </div>
                )}

                {hasLinkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span className="text-zinc-400">LinkedIn:</span>
                    <a
                      href={contact.linkedin.trim()}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                    >
                      {contact.linkedin.trim()}
                    </a>
                  </div>
                )}

                {hasTwitter && (
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span className="text-zinc-400">X / Twitter:</span>
                    {contact.twitter.trim().startsWith('http') ? (
                      <a
                        href={contact.twitter.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                      >
                        {contact.twitter.trim()}
                      </a>
                    ) : (
                      <span className="text-zinc-200">{contact.twitter.trim()}</span>
                    )}
                  </div>
                )}

                {hasAdditionalLink && (
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span className="text-zinc-400">
                      {contact.additionalLinkLabel.trim() || 'Link'}:
                    </span>
                    <a
                      href={contact.additionalLinkUrl.trim()}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                    >
                      {contact.additionalLinkUrl.trim()}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
