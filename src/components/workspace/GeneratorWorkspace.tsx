import React, { useMemo, useState } from 'react';
import { Github, ListOrdered } from 'lucide-react';
import { useReadmeData } from '@/hooks/useReadmeData';
import { generateMarkdown } from '@/utils';
import { README_TEMPLATES } from '@/constants';
import { GitHubImportModal } from '@/components/github';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { TemplateModal } from './TemplateModal';
import { SectionOrderModal } from './SectionOrderModal';

interface GeneratorWorkspaceProps {
  isGitHubImportOpen?: boolean;
  onCloseGitHubImport?: () => void;
  onOpenGitHubImport?: () => void;
}

export const GeneratorWorkspace: React.FC<GeneratorWorkspaceProps> = ({
  isGitHubImportOpen = false,
  onCloseGitHubImport,
  onOpenGitHubImport,
}) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSectionOrderOpen, setIsSectionOrderOpen] = useState(false);
  const [internalGitHubImportOpen, setInternalGitHubImportOpen] = useState(false);

  const isImportModalOpen = isGitHubImportOpen || internalGitHubImportOpen;
  const handleCloseImportModal = () => {
    setInternalGitHubImportOpen(false);
    onCloseGitHubImport?.();
  };

  const {
    data,
    updateBasicInfo,
    touchField,
    addBadge,
    updateBadge,
    removeBadge,
    moveBadgeUp,
    moveBadgeDown,
    addTechnology,
    removeTechnology,
    addFeature,
    updateFeature,
    removeFeature,
    moveFeatureUp,
    moveFeatureDown,
    updateInstallationField,
    addInstallationStep,
    updateInstallationStep,
    removeInstallationStep,
    moveInstallationStepUp,
    moveInstallationStepDown,
    updateUsageIntroduction,
    addUsageExample,
    updateUsageExample,
    removeUsageExample,
    moveUsageExampleUp,
    moveUsageExampleDown,
    toggleContributingEnabled,
    updateContributingField,
    addGuideline,
    updateGuideline,
    removeGuideline,
    updateLicense,
    updateContactField,
    touchContactField,
    applyTemplate,
    importGitHubData,
    currentTemplateId,
    hasUserContent,
    errors,
    contactErrors,
    sectionOrder,
    isSectionOrderDefault,
    moveSectionUp,
    moveSectionDown,
    resetSectionOrder,
  } = useReadmeData();

  // Canonical Markdown is the single source of truth for preview, copy, and export
  const markdown = useMemo(() => generateMarkdown(data), [data]);

  const activeTemplate = useMemo(
    () => README_TEMPLATES.find((t) => t.id === currentTemplateId),
    [currentTemplateId]
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Workspace Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
              Create your README
            </h2>
            {activeTemplate && (
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                {activeTemplate.name} Template
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Build a professional README.md for your project in minutes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSectionOrderOpen(true)}
            aria-haspopup="dialog"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            <ListOrdered className="h-4 w-4 text-zinc-400" />
            Customize Sections
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenGitHubImport) onOpenGitHubImport();
              else setInternalGitHubImportOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            <Github className="h-4 w-4 text-zinc-400" />
            Import from GitHub
          </button>

          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            Choose Template
          </button>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Left Panel: Editor & Configuration */}
        <EditorPanel
          basicInfo={data.basicInfo}
          badges={data.badges}
          techStack={data.techStack}
          features={data.features}
          installation={data.installation}
          usage={data.usage}
          contributing={data.contributing}
          license={data.license}
          contact={data.contact}
          errors={errors}
          contactErrors={contactErrors}
          onBasicInfoChange={updateBasicInfo}
          onBasicInfoBlur={touchField}
          onAddBadge={addBadge}
          onUpdateBadge={updateBadge}
          onRemoveBadge={removeBadge}
          onMoveBadgeUp={moveBadgeUp}
          onMoveBadgeDown={moveBadgeDown}
          onAddTechnology={addTechnology}
          onRemoveTechnology={removeTechnology}
          onAddFeature={addFeature}
          onUpdateFeature={updateFeature}
          onRemoveFeature={removeFeature}
          onMoveFeatureUp={moveFeatureUp}
          onMoveFeatureDown={moveFeatureDown}
          onUpdateInstallationField={updateInstallationField}
          onAddInstallationStep={addInstallationStep}
          onUpdateInstallationStep={updateInstallationStep}
          onRemoveInstallationStep={removeInstallationStep}
          onMoveInstallationStepUp={moveInstallationStepUp}
          onMoveInstallationStepDown={moveInstallationStepDown}
          onUpdateUsageIntroduction={updateUsageIntroduction}
          onAddUsageExample={addUsageExample}
          onUpdateUsageExample={updateUsageExample}
          onRemoveUsageExample={removeUsageExample}
          onMoveUsageExampleUp={moveUsageExampleUp}
          onMoveUsageExampleDown={moveUsageExampleDown}
          onToggleContributingEnabled={toggleContributingEnabled}
          onUpdateContributingField={updateContributingField}
          onAddGuideline={addGuideline}
          onUpdateGuideline={updateGuideline}
          onRemoveGuideline={removeGuideline}
          onUpdateLicense={updateLicense}
          onUpdateContactField={updateContactField}
          onContactBlur={touchContactField}
        />

        {/* Right Panel: Preview Area */}
        <PreviewPanel markdown={markdown} />
      </div>

      {/* Template Selection Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onApplyTemplate={applyTemplate}
        currentTemplateId={currentTemplateId}
        hasUserContent={hasUserContent}
      />

      {/* Public GitHub Repository Import Modal */}
      <GitHubImportModal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
        currentData={data}
        onImport={importGitHubData}
      />

      {/* Section Order Customization Modal */}
      <SectionOrderModal
        isOpen={isSectionOrderOpen}
        sectionOrder={sectionOrder}
        isDefaultOrder={isSectionOrderDefault}
        onClose={() => setIsSectionOrderOpen(false)}
        onMoveSectionUp={moveSectionUp}
        onMoveSectionDown={moveSectionDown}
        onResetOrder={resetSectionOrder}
      />
    </div>
  );
};
