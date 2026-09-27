import React from 'react';
import {
  FileText,
  Boxes,
  Terminal,
  Play,
  Sparkles,
  GitPullRequest,
  Scale,
  Mail,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  BadgesData,
  BadgeStyle,
  BadgeType,
  BasicInfoData,
  ContactData,
  ContactErrors,
  ContributingData,
  FeaturesData,
  InstallationData,
  LicenseData,
  ReadmeBadge,
  TechCategory,
  TechStackData,
  UsageData,
  ValidationErrors,
} from '@/types';
import { EditorSection } from './EditorSection';
import { BasicInfoForm } from './BasicInfoForm';
import { BadgeBuilder } from './BadgeBuilder';
import { TechStackForm } from './TechStackForm';
import { FeaturesForm } from './FeaturesForm';
import { InstallationForm } from './InstallationForm';
import { UsageForm } from './UsageForm';
import { ContributingForm } from './ContributingForm';
import { LicenseForm } from './LicenseForm';
import { ContactForm } from './ContactForm';

interface EditorPanelProps {
  basicInfo: BasicInfoData;
  badges: BadgesData;
  techStack: TechStackData;
  features: FeaturesData;
  installation: InstallationData;
  usage: UsageData;
  contributing: ContributingData;
  license: LicenseData;
  contact: ContactData;
  errors: ValidationErrors;
  contactErrors: ContactErrors;
  onBasicInfoChange: (field: keyof BasicInfoData, value: string) => void;
  onBasicInfoBlur: (field: keyof BasicInfoData) => void;
  onAddBadge: (
    type: BadgeType,
    label: string,
    message?: string,
    color?: string,
    logo?: string,
    link?: string,
    style?: BadgeStyle
  ) => { success: boolean; error?: string };
  onUpdateBadge: (id: string, updates: Partial<Omit<ReadmeBadge, 'id'>>) => { success: boolean; error?: string };
  onRemoveBadge: (id: string) => void;
  onMoveBadgeUp: (index: number) => void;
  onMoveBadgeDown: (index: number) => void;
  onAddTechnology: (name: string, category: TechCategory) => { success: boolean; error?: string };
  onRemoveTechnology: (id: string) => void;
  onAddFeature: (title: string, description?: string) => { success: boolean; error?: string };
  onUpdateFeature: (id: string, title: string, description: string) => { success: boolean; error?: string };
  onRemoveFeature: (id: string) => void;
  onMoveFeatureUp: (id: string) => void;
  onMoveFeatureDown: (id: string) => void;
  onUpdateInstallationField: (field: keyof Omit<InstallationData, 'setupInstructions'>, value: string) => void;
  onAddInstallationStep: (instruction: string, command?: string) => { success: boolean; error?: string };
  onUpdateInstallationStep: (id: string, instruction: string, command: string) => { success: boolean; error?: string };
  onRemoveInstallationStep: (id: string) => void;
  onMoveInstallationStepUp: (id: string) => void;
  onMoveInstallationStepDown: (id: string) => void;
  onUpdateUsageIntroduction: (introduction: string) => void;
  onAddUsageExample: (
    title: string,
    description?: string,
    code?: string,
    language?: string
  ) => { success: boolean; error?: string };
  onUpdateUsageExample: (
    id: string,
    title: string,
    description: string,
    code: string,
    language: string
  ) => { success: boolean; error?: string };
  onRemoveUsageExample: (id: string) => void;
  onMoveUsageExampleUp: (id: string) => void;
  onMoveUsageExampleDown: (id: string) => void;
  onToggleContributingEnabled: (enabled: boolean) => void;
  onUpdateContributingField: (field: keyof Omit<ContributingData, 'enabled' | 'guidelines'>, value: string) => void;
  onAddGuideline: (text: string) => { success: boolean; error?: string };
  onUpdateGuideline: (index: number, text: string) => { success: boolean; error?: string };
  onRemoveGuideline: (index: number) => void;
  onUpdateLicense: (field: keyof LicenseData, value: string) => void;
  onUpdateContactField: (field: keyof ContactData, value: string) => void;
  onContactBlur: (field: keyof ContactData) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  basicInfo,
  badges,
  techStack,
  features,
  installation,
  usage,
  contributing,
  license,
  contact,
  errors,
  contactErrors,
  onBasicInfoChange,
  onBasicInfoBlur,
  onAddBadge,
  onUpdateBadge,
  onRemoveBadge,
  onMoveBadgeUp,
  onMoveBadgeDown,
  onAddTechnology,
  onRemoveTechnology,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onMoveFeatureUp,
  onMoveFeatureDown,
  onUpdateInstallationField,
  onAddInstallationStep,
  onUpdateInstallationStep,
  onRemoveInstallationStep,
  onMoveInstallationStepUp,
  onMoveInstallationStepDown,
  onUpdateUsageIntroduction,
  onAddUsageExample,
  onUpdateUsageExample,
  onRemoveUsageExample,
  onMoveUsageExampleUp,
  onMoveUsageExampleDown,
  onToggleContributingEnabled,
  onUpdateContributingField,
  onAddGuideline,
  onUpdateGuideline,
  onRemoveGuideline,
  onUpdateLicense,
  onUpdateContactField,
  onContactBlur,
}) => {
  const badgeCount = badges.badges.length;
  const techCount = techStack.technologies.length;
  const featureCount = features.features.length;
  const hasInstallConfig =
    !!installation.prerequisites ||
    !!installation.cloneCommand ||
    !!installation.installCommand ||
    installation.setupInstructions.length > 0;
  const usageCount = usage.examples.length;
  const hasUsageConfig = !!usage.introduction.trim() || usageCount > 0;
  const contributingBadge = !contributing.enabled
    ? 'Disabled'
    : contributing.guidelines.length > 0
    ? `${contributing.guidelines.length} steps`
    : 'Active';
  const hasContactConfig =
    !!contact.email ||
    !!contact.website ||
    !!contact.linkedin ||
    !!contact.twitter ||
    !!contact.additionalLinkUrl;

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Project Details</h2>
            <p className="text-xs text-zinc-500">Configure content blocks for your README</p>
          </div>
        </div>
        <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-1 text-xs font-mono text-zinc-400">
          8 Sections
        </span>
      </div>

      {/* Section List */}
      <div className="mt-4 flex flex-col gap-3">
        {/* Basic Information */}
        <EditorSection
          title="Basic Information"
          description="Project title, summary, repository, and author metadata"
          icon={FileText}
          badge="Active"
          defaultOpen={true}
        >
          <BasicInfoForm
            data={basicInfo}
            errors={errors}
            onChange={onBasicInfoChange}
            onBlur={onBasicInfoBlur}
          />
        </EditorSection>

        {/* Badges Builder */}
        <EditorSection
          title="Badges"
          description="Technology, license, and custom status badges"
          icon={ShieldCheck}
          badge={badgeCount > 0 ? `${badgeCount} badges` : 'Active'}
          defaultOpen={false}
        >
          <BadgeBuilder
            badges={badges}
            techStack={techStack}
            license={license}
            onAddBadge={onAddBadge}
            onUpdateBadge={onUpdateBadge}
            onRemoveBadge={onRemoveBadge}
            onMoveBadgeUp={onMoveBadgeUp}
            onMoveBadgeDown={onMoveBadgeDown}
          />
        </EditorSection>

        {/* Tech Stack */}
        <EditorSection
          title="Tech Stack"
          description="Languages, frameworks, runtimes, and core tools"
          icon={Boxes}
          badge={techCount > 0 ? `${techCount} added` : 'Active'}
          defaultOpen={false}
        >
          <TechStackForm
            technologies={techStack.technologies}
            onAddTechnology={onAddTechnology}
            onRemoveTechnology={onRemoveTechnology}
          />
        </EditorSection>

        {/* Features */}
        <EditorSection
          title="Features"
          description="Key capabilities, highlights, and functional value"
          icon={Sparkles}
          badge={featureCount > 0 ? `${featureCount} added` : 'Active'}
          defaultOpen={false}
        >
          <FeaturesForm
            features={features.features}
            onAddFeature={onAddFeature}
            onUpdateFeature={onUpdateFeature}
            onRemoveFeature={onRemoveFeature}
            onMoveFeatureUp={onMoveFeatureUp}
            onMoveFeatureDown={onMoveFeatureDown}
          />
        </EditorSection>

        {/* Installation */}
        <EditorSection
          title="Installation"
          description="Prerequisites, dependency management, and setup steps"
          icon={Terminal}
          badge={hasInstallConfig ? 'Configured' : 'Active'}
          defaultOpen={false}
        >
          <InstallationForm
            data={installation}
            repositoryUrl={basicInfo.repositoryUrl}
            onUpdateField={onUpdateInstallationField}
            onAddStep={onAddInstallationStep}
            onUpdateStep={onUpdateInstallationStep}
            onRemoveStep={onRemoveInstallationStep}
            onMoveStepUp={onMoveInstallationStepUp}
            onMoveStepDown={onMoveInstallationStepDown}
          />
        </EditorSection>

        {/* Usage */}
        <EditorSection
          title="Usage"
          description="Quickstart code examples and operational guidance"
          icon={Play}
          badge={hasUsageConfig ? (usageCount > 0 ? `${usageCount} added` : 'Configured') : 'Active'}
          defaultOpen={false}
        >
          <UsageForm
            data={usage}
            onUpdateIntroduction={onUpdateUsageIntroduction}
            onAddExample={onAddUsageExample}
            onUpdateExample={onUpdateUsageExample}
            onRemoveExample={onRemoveUsageExample}
            onMoveExampleUp={onMoveUsageExampleUp}
            onMoveExampleDown={onMoveUsageExampleDown}
          />
        </EditorSection>

        {/* Contributing */}
        <EditorSection
          title="Contributing"
          description="Contribution guidelines, issue reporting, and PR rules"
          icon={GitPullRequest}
          badge={contributingBadge}
          defaultOpen={false}
        >
          <ContributingForm
            data={contributing}
            onToggleEnabled={onToggleContributingEnabled}
            onUpdateField={onUpdateContributingField}
            onAddGuideline={onAddGuideline}
            onUpdateGuideline={onUpdateGuideline}
            onRemoveGuideline={onRemoveGuideline}
          />
        </EditorSection>

        {/* License */}
        <EditorSection
          title="License"
          description="Open source or proprietary license selection (MIT, Apache, etc.)"
          icon={Scale}
          badge={license.type}
          defaultOpen={false}
        >
          <LicenseForm
            data={license}
            onUpdateLicense={onUpdateLicense}
          />
        </EditorSection>

        {/* Contact */}
        <EditorSection
          title="Contact"
          description="Author details, social handles, and support links"
          icon={Mail}
          badge={hasContactConfig ? 'Configured' : 'Active'}
          defaultOpen={false}
        >
          <ContactForm
            data={contact}
            errors={contactErrors}
            onUpdateField={onUpdateContactField}
            onBlur={onContactBlur}
          />
        </EditorSection>
      </div>
    </div>
  );
};
