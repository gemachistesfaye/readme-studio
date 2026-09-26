import React, { useState } from 'react';
import { Plus, AlertCircle, Terminal, Link2 } from 'lucide-react';
import { InstallationData } from '@/types';
import { InstallationStepItem } from './InstallationStepItem';

interface InstallationFormProps {
  data: InstallationData;
  repositoryUrl?: string;
  onUpdateField: (field: keyof Omit<InstallationData, 'setupInstructions'>, value: string) => void;
  onAddStep: (instruction: string, command?: string) => { success: boolean; error?: string };
  onUpdateStep: (id: string, instruction: string, command: string) => { success: boolean; error?: string };
  onRemoveStep: (id: string) => void;
}

export const InstallationForm: React.FC<InstallationFormProps> = ({
  data,
  repositoryUrl,
  onUpdateField,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
}) => {
  const [instruction, setInstruction] = useState('');
  const [command, setCommand] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);

  const handleUseRepoUrl = () => {
    if (!repositoryUrl) return;
    const trimmed = repositoryUrl.trim();
    const formattedUrl = trimmed.endsWith('.git') ? trimmed : `${trimmed}.git`;
    onUpdateField('cloneCommand', `git clone ${formattedUrl}`);
  };

  const handleAddStep = () => {
    const trimmedInstruction = instruction.trim();
    if (!trimmedInstruction) {
      setStepError('Please enter a step instruction.');
      return;
    }

    const result = onAddStep(trimmedInstruction, command.trim());
    if (!result.success) {
      setStepError(result.error || 'Failed to add step.');
      return;
    }

    setInstruction('');
    setCommand('');
    setStepError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStep();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Prerequisites */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="prerequisites-input" className="text-xs font-medium text-zinc-300">
          Prerequisites <span className="text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <textarea
          id="prerequisites-input"
          rows={2}
          placeholder="Node.js 18+ and npm"
          value={data.prerequisites}
          onChange={(e) => onUpdateField('prerequisites', e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
        />
        <p className="text-[11px] text-zinc-500">
          Required system software, minimum runtimes, or environment tools.
        </p>
      </div>

      {/* Clone Command */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="clone-command-input" className="text-xs font-medium text-zinc-300">
            Clone Command <span className="text-zinc-500 text-[11px] font-normal">(optional)</span>
          </label>
          {repositoryUrl && repositoryUrl.trim() && (
            <button
              type="button"
              onClick={handleUseRepoUrl}
              className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Link2 className="h-3 w-3" />
              <span>Use repository URL</span>
            </button>
          )}
        </div>
        <div className="relative">
          <input
            id="clone-command-input"
            type="text"
            placeholder="git clone https://github.com/username/project.git"
            value={data.cloneCommand}
            onChange={(e) => onUpdateField('cloneCommand', e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Install Dependencies Command */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="install-command-input" className="text-xs font-medium text-zinc-300">
          Install Command <span className="text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <input
          id="install-command-input"
          type="text"
          placeholder="npm install"
          value={data.installCommand}
          onChange={(e) => onUpdateField('installCommand', e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
        />
        <p className="text-[11px] text-zinc-500">
          e.g. npm install, pnpm install, yarn, pip install -r requirements.txt, or composer install.
        </p>
      </div>

      {/* Additional Installation Steps */}
      <div className="flex flex-col gap-3 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-300">
            Additional Setup Steps
          </span>
          <span className="font-mono text-[11px] text-zinc-500">
            {data.setupInstructions.length} added
          </span>
        </div>

        {/* Step Inputs */}
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="step-instruction-input" className="text-[11px] font-medium text-zinc-300">
              Instruction <span className="text-indigo-400">*</span>
            </label>
            <input
              id="step-instruction-input"
              type="text"
              placeholder="e.g. Configure environment variables"
              value={instruction}
              onChange={(e) => {
                setInstruction(e.target.value);
                if (stepError) setStepError(null);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full rounded-lg border bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none ${
                stepError
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                  : 'border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
              }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="step-command-input" className="text-[11px] font-medium text-zinc-400">
              Command <span className="text-zinc-500 text-[10px] font-normal">(optional)</span>
            </label>
            <input
              id="step-command-input"
              type="text"
              placeholder="e.g. cp .env.example .env"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          {stepError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 pt-0.5" role="alert">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{stepError}</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Step</span>
            </button>
          </div>
        </div>

        {/* Steps List */}
        {data.setupInstructions.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            {data.setupInstructions.map((step, idx) => (
              <InstallationStepItem
                key={step.id}
                step={step}
                index={idx}
                onUpdate={onUpdateStep}
                onRemove={onRemoveStep}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-800/80 bg-zinc-950/40 px-3 py-3 text-xs text-zinc-500">
            <Terminal className="h-4 w-4 text-zinc-600" />
            <span>No custom setup steps added yet. Add extra steps like env setup or database migration above.</span>
          </div>
        )}
      </div>
    </div>
  );
};
