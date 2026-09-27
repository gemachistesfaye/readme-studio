import React from 'react';
import { useReadmeData } from '@/hooks/useReadmeData';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';

export const GeneratorWorkspace: React.FC = () => {
  const {
    data,
    updateBasicInfo,
    touchField,
    addTechnology,
    removeTechnology,
    addFeature,
    updateFeature,
    removeFeature,
    updateInstallationField,
    addInstallationStep,
    updateInstallationStep,
    removeInstallationStep,
    updateUsageIntroduction,
    addUsageExample,
    updateUsageExample,
    removeUsageExample,
    toggleContributingEnabled,
    updateContributingField,
    addGuideline,
    updateGuideline,
    removeGuideline,
    updateLicense,
    updateContactField,
    touchContactField,
    errors,
    contactErrors,
  } = useReadmeData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Workspace Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
          Create your README
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Build a professional README.md for your project in minutes.
        </p>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Left Panel: Editor & Configuration */}
        <EditorPanel
          basicInfo={data.basicInfo}
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
          onAddTechnology={addTechnology}
          onRemoveTechnology={removeTechnology}
          onAddFeature={addFeature}
          onUpdateFeature={updateFeature}
          onRemoveFeature={removeFeature}
          onUpdateInstallationField={updateInstallationField}
          onAddInstallationStep={addInstallationStep}
          onUpdateInstallationStep={updateInstallationStep}
          onRemoveInstallationStep={removeInstallationStep}
          onUpdateUsageIntroduction={updateUsageIntroduction}
          onAddUsageExample={addUsageExample}
          onUpdateUsageExample={updateUsageExample}
          onRemoveUsageExample={removeUsageExample}
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
        <PreviewPanel
          basicInfo={data.basicInfo}
          techStack={data.techStack}
          features={data.features}
          installation={data.installation}
          usage={data.usage}
          contributing={data.contributing}
          license={data.license}
          contact={data.contact}
        />
      </div>
    </div>
  );
};
