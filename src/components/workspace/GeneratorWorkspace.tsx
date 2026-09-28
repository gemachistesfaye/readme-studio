import React, { useMemo, useState } from "react";
import { Github, ListOrdered, Upload } from "lucide-react";
import { useReadmeData } from "@/hooks/useReadmeData";
import { useGitHubAuth } from "@/hooks/useGitHubAuth";
import { generateMarkdown } from "@/utils";
import { README_TEMPLATES } from "@/constants";
import { GitHubImportModal } from "@/components/github";
import { GitHubRepositoryPickerModal } from "@/components/github/GitHubRepositoryPickerModal";
import { GitHubSaveModal } from "@/components/github/GitHubSaveModal";
import { GitHubAuthenticatedImportModal } from "@/components/github/GitHubAuthenticatedImportModal";
import { AuthenticatedGitHubRepository } from "@/types";
import { EditorPanel } from "./EditorPanel";
import { PreviewPanel } from "./PreviewPanel";
import { TemplateModal } from "./TemplateModal";
import { SectionOrderModal } from "./SectionOrderModal";
import { NewReadmeModal } from "./NewReadmeModal";

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
  const [isNewReadmeOpen, setIsNewReadmeOpen] = useState(false);
  const [isRepositoryPickerOpen, setIsRepositoryPickerOpen] = useState(false);
  const [isGitHubSaveOpen, setIsGitHubSaveOpen] = useState(false);
  const [isAuthenticatedImportOpen, setIsAuthenticatedImportOpen] = useState(false);
  const [repositoryPickerMode, setRepositoryPickerMode] = useState<"save" | "import">("save");
  const [selectedGitHubRepository, setSelectedGitHubRepository] = useState<AuthenticatedGitHubRepository | null>(null);
  const [internalGitHubImportOpen, setInternalGitHubImportOpen] =
    useState(false);

  const isImportModalOpen = isGitHubImportOpen || internalGitHubImportOpen;
  const handleCloseImportModal = () => {
    setInternalGitHubImportOpen(false);
    onCloseGitHubImport?.();
  };

  const {
    data,
    saveStatus,
    resetReadme,
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
  const { status: githubStatus, connect: connectGitHub } = useGitHubAuth();

  const handleOpenGitHubSave = () => {
    if (githubStatus !== "authenticated") {
      connectGitHub();
      return;
    }
    setIsRepositoryPickerOpen(true);
  };

  const handleOpenAuthenticatedImport = () => {
    if (githubStatus !== "authenticated") {
      connectGitHub();
      return;
    }
    setRepositoryPickerMode("import");
    setIsRepositoryPickerOpen(true);
  };

  // Canonical Markdown is the single source of truth for preview, copy, and export
  const markdown = useMemo(() => generateMarkdown(data), [data]);

  const activeTemplate = useMemo(
    () => README_TEMPLATES.find((t) => t.id === currentTemplateId),
    [currentTemplateId],
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
          <p
            className="mt-2 text-xs text-zinc-500"
            role="status"
            aria-live="polite"
          >
            Draft: {saveStatus}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsNewReadmeOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3.5 py-2 text-sm font-medium text-orange-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:border-orange-500/50 dark:hover:bg-orange-500/20 dark:hover:text-orange-200"
          >
            <span aria-hidden="true">+</span>
            New README
          </button>

          <button
            type="button"
            onClick={handleOpenGitHubSave}
            disabled={!markdown.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-orange-600 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-500/50 dark:bg-orange-600 dark:hover:bg-orange-500"
          >
            <Upload className="h-4 w-4" />
            Save to GitHub
          </button>

          <button
            type="button"
            onClick={handleOpenAuthenticatedImport}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3.5 py-2 text-sm font-medium text-orange-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-orange-500/30 dark:bg-zinc-900 dark:text-orange-300 dark:hover:bg-orange-500/10"
          >
            <Github className="h-4 w-4" />
            Import Repo README
          </button>

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

      <NewReadmeModal
        isOpen={isNewReadmeOpen}
        hasUserContent={hasUserContent}
        onClose={() => setIsNewReadmeOpen(false)}
        onConfirm={() => {
          resetReadme();
          setIsNewReadmeOpen(false);
        }}
      />

      <GitHubRepositoryPickerModal
        isOpen={isRepositoryPickerOpen}
        onClose={() => setIsRepositoryPickerOpen(false)}
        onSelect={(repository) => {
          setSelectedGitHubRepository(repository);
          setIsRepositoryPickerOpen(false);
          if (repositoryPickerMode === "import") {
            setIsAuthenticatedImportOpen(true);
          } else {
            setIsGitHubSaveOpen(true);
          }
        }}
      />

      <GitHubSaveModal
        isOpen={isGitHubSaveOpen}
        repository={selectedGitHubRepository}
        markdown={markdown}
        onClose={() => setIsGitHubSaveOpen(false)}
      />

      <GitHubAuthenticatedImportModal
        isOpen={isAuthenticatedImportOpen}
        repository={selectedGitHubRepository}
        currentData={data}
        onClose={() => setIsAuthenticatedImportOpen(false)}
        onImport={importGitHubData}
      />
    </div>
  );
};
