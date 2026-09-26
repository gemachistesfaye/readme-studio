import React from 'react';
import {
  FileText,
  AlignLeft,
  Boxes,
  Terminal,
  Play,
  Sparkles,
  GitPullRequest,
  Scale,
  Mail,
  SlidersHorizontal,
} from 'lucide-react';
import { BasicInfoData, TechCategory, TechStackData, ValidationErrors } from '@/types';
import { EditorSection } from './EditorSection';
import { BasicInfoForm } from './BasicInfoForm';
import { TechStackForm } from './TechStackForm';

interface EditorPanelProps {
  basicInfo: BasicInfoData;
  techStack: TechStackData;
  errors: ValidationErrors;
  onBasicInfoChange: (field: keyof BasicInfoData, value: string) => void;
  onBasicInfoBlur: (field: keyof BasicInfoData) => void;
  onAddTechnology: (name: string, category: TechCategory) => { success: boolean; error?: string };
  onRemoveTechnology: (id: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  basicInfo,
  techStack,
  errors,
  onBasicInfoChange,
  onBasicInfoBlur,
  onAddTechnology,
  onRemoveTechnology,
}) => {
  const futureSections = [
    {
      title: 'Description',
      description: 'Extended project background and comprehensive overview',
      icon: AlignLeft,
      badge: 'Upcoming',
    },
    {
      title: 'Installation',
      description: 'Prerequisites, dependency management, and setup steps',
      icon: Terminal,
    },
    {
      title: 'Usage',
      description: 'Quickstart code examples and operational guidance',
      icon: Play,
    },
    {
      title: 'Features',
      description: 'Bulleted list of key capabilities and highlights',
      icon: Sparkles,
    },
    {
      title: 'Contributing',
      description: 'Contribution guidelines, issue reporting, and PR rules',
      icon: GitPullRequest,
    },
    {
      title: 'License',
      description: 'Open source or proprietary license selection (MIT, Apache, etc.)',
      icon: Scale,
    },
    {
      title: 'Contact',
      description: 'Author details, social handles, and support links',
      icon: Mail,
    },
  ];

  const techCount = techStack.technologies.length;

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
          9 Sections
        </span>
      </div>

      {/* Section List */}
      <div className="mt-4 flex flex-col gap-3">
        {/* Basic Information - Functional Form */}
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

        {/* Tech Stack - Functional Form */}
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

        {/* Future Sections */}
        {futureSections.map((section) => (
          <EditorSection
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            badge={section.badge}
            defaultOpen={false}
          />
        ))}
      </div>
    </div>
  );
};
