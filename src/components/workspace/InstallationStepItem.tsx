import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, AlertCircle, Terminal, ArrowUp, ArrowDown } from 'lucide-react';
import { InstallationStep } from '@/types';
import { canMoveDown, canMoveUp } from '@/utils';

interface InstallationStepItemProps {
  step: InstallationStep;
  index: number;
  totalCount: number;
  onUpdate: (id: string, instruction: string, command: string) => { success: boolean; error?: string };
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export const InstallationStepItem: React.FC<InstallationStepItemProps> = ({
  step,
  index,
  totalCount,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editInstruction, setEditInstruction] = useState(step.instruction);
  const [editCommand, setEditCommand] = useState(step.command);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmedInstruction = editInstruction.trim();
    if (!trimmedInstruction) {
      setError('Instruction cannot be empty.');
      return;
    }

    const result = onUpdate(step.id, trimmedInstruction, editCommand.trim());
    if (!result.success) {
      setError(result.error || 'Failed to update step.');
      return;
    }

    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditInstruction(step.instruction);
    setEditCommand(step.command);
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2.5 rounded-lg border border-indigo-200 dark:border-indigo-500/40 bg-white dark:bg-zinc-900/90 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-50 dark:bg-indigo-500/20 px-1.5 py-0.5 text-[11px] font-mono font-medium text-indigo-600 dark:text-indigo-400">
            Step {index + 1}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Edit Step</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`edit-step-inst-${step.id}`} className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            Instruction <span className="text-indigo-600 dark:text-indigo-400">*</span>
          </label>
          <input
            id={`edit-step-inst-${step.id}`}
            type="text"
            value={editInstruction}
            onChange={(e) => {
              setEditInstruction(e.target.value);
              if (error) setError(null);
            }}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="e.g. Configure environment variables"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`edit-step-cmd-${step.id}`} className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            Command <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-normal">(optional)</span>
          </label>
          <input
            id={`edit-step-cmd-${step.id}`}
            type="text"
            value={editCommand}
            onChange={(e) => setEditCommand(e.target.value)}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="e.g. cp .env.example .env"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-3 w-3" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Check className="h-3 w-3" />
            <span>Save</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start justify-between gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 p-3 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-900/90">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            Step {index + 1}
          </span>
          <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-200 tracking-tight truncate">
            {step.instruction}
          </h4>
        </div>

        {step.command && (
          <div className="mt-1 flex items-center gap-1.5 rounded-md bg-zinc-50 dark:bg-zinc-950/80 px-2.5 py-1 border border-zinc-200 dark:border-zinc-800/60 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
            <Terminal className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <code>{step.command}</code>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onMoveUp(step.id)}
          disabled={!canMoveUp(index, totalCount)}
          aria-label={`Move ${step.instruction} step up`}
          title="Move step up"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(step.id)}
          disabled={!canMoveDown(index, totalCount)}
          aria-label={`Move ${step.instruction} step down`}
          title="Move step down"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit step ${index + 1}`}
          title="Edit step"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(step.id)}
          aria-label={`Remove step ${index + 1}`}
          title="Remove step"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
