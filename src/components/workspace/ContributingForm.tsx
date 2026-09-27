import React, { useState } from 'react';
import { Plus, AlertCircle, GitPullRequest } from 'lucide-react';
import { ContributingData } from '@/types';
import { GuidelineItem } from './GuidelineItem';

interface ContributingFormProps {
  data: ContributingData;
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateField: (field: keyof Omit<ContributingData, 'enabled' | 'guidelines'>, value: string) => void;
  onAddGuideline: (text: string) => { success: boolean; error?: string };
  onUpdateGuideline: (index: number, text: string) => { success: boolean; error?: string };
  onRemoveGuideline: (index: number) => void;
}

export const ContributingForm: React.FC<ContributingFormProps> = ({
  data,
  onToggleEnabled,
  onUpdateField,
  onAddGuideline,
  onUpdateGuideline,
  onRemoveGuideline,
}) => {
  const [newGuideline, setNewGuideline] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = newGuideline.trim();
    if (!trimmed) {
      setError('Please enter a guideline step.');
      return;
    }

    const result = onAddGuideline(trimmed);
    if (!result.success) {
      setError(result.error || 'Failed to add guideline.');
      return;
    }

    setNewGuideline('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Enable / Disable Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3.5">
        <div>
          <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-200">Include Contributing Section</h4>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {data.enabled
              ? 'This section will appear in your README preview and output.'
              : 'This section is currently hidden from your README.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.enabled}
          onClick={() => onToggleEnabled(!data.enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-950 ${
            data.enabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              data.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {data.enabled && (
        <>
          {/* Introduction */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contributing-intro-input" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Introduction <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
            </label>
            <textarea
              id="contributing-intro-input"
              rows={2}
              placeholder="Contributions are welcome! Please follow these steps before submitting a pull request."
              value={data.introduction}
              onChange={(e) => onUpdateField('introduction', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          {/* Guidelines Builder */}
          <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Contribution Steps / Guidelines</span>
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                {data.guidelines.length} added
              </span>
            </div>

            {/* Input row */}
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Fork the repository"
                  value={newGuideline}
                  onChange={(e) => {
                    setNewGuideline(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 rounded-lg border bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
                    error
                      ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                      : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 shadow-sm shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Guidelines List */}
            {data.guidelines.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                {data.guidelines.map((guideline, idx) => (
                  <GuidelineItem
                    key={idx}
                    guideline={guideline}
                    index={idx}
                    onUpdate={onUpdateGuideline}
                    onRemove={onRemoveGuideline}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 px-3 py-3 text-xs text-zinc-400 dark:text-zinc-500">
                <GitPullRequest className="h-4 w-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
                <span>No guidelines added yet. Add steps like Fork, Branch, Commit, and PR above.</span>
              </div>
            )}
          </div>

          {/* Custom Instructions */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
            <label htmlFor="custom-instructions-input" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Custom Instructions <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
            </label>
            <textarea
              id="custom-instructions-input"
              rows={2}
              placeholder="e.g. Please ensure all tests pass and code is formatted with Prettier before submitting."
              value={data.customInstructions}
              onChange={(e) => onUpdateField('customInstructions', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Extra rules, coding standards, issue template references, or branch naming conventions.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
