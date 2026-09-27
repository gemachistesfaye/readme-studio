import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';

interface GuidelineItemProps {
  guideline: string;
  index: number;
  onUpdate: (index: number, newText: string) => { success: boolean; error?: string };
  onRemove: (index: number) => void;
}

export const GuidelineItem: React.FC<GuidelineItemProps> = ({
  guideline,
  index,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(guideline);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setError('Guideline cannot be empty.');
      return;
    }

    const result = onUpdate(index, trimmed);
    if (!result.success) {
      setError(result.error || 'Failed to update guideline.');
      return;
    }

    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditText(guideline);
    setError(null);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-indigo-500/40 bg-zinc-900/90 p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[11px] font-mono font-medium text-indigo-400">
            Step {index + 1}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Edit Guideline</span>
        </div>

        <input
          type="text"
          value={editText}
          onChange={(e) => {
            setEditText(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
          placeholder="e.g. Fork the repository"
        />

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
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
    <div className="group flex items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-3 py-2 transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/90">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 shrink-0">
          {index + 1}
        </span>
        <span className="text-xs text-zinc-200 tracking-tight truncate">
          {guideline}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit guideline ${index + 1}`}
          title="Edit guideline"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove guideline ${index + 1}`}
          title="Remove guideline"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
