import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { Feature } from '@/types';

interface FeatureItemProps {
  feature: Feature;
  onUpdate: (id: string, title: string, description: string) => { success: boolean; error?: string };
  onRemove: (id: string) => void;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(feature.title);
  const [editDesc, setEditDesc] = useState(feature.description);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setError('Feature title cannot be empty.');
      return;
    }

    const result = onUpdate(feature.id, trimmedTitle, editDesc.trim());
    if (!result.success) {
      setError(result.error || 'Failed to update feature.');
      return;
    }

    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditTitle(feature.title);
    setEditDesc(feature.description);
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2.5 rounded-lg border border-indigo-500/40 bg-zinc-900/90 p-3 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`edit-feature-title-${feature.id}`} className="text-[11px] font-medium text-zinc-300">
            Feature Title <span className="text-indigo-400">*</span>
          </label>
          <input
            id={`edit-feature-title-${feature.id}`}
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (error) setError(null);
            }}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="Feature Title"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`edit-feature-desc-${feature.id}`} className="text-[11px] font-medium text-zinc-400">
            Description <span className="text-zinc-500 text-[10px] font-normal">(optional)</span>
          </label>
          <input
            id={`edit-feature-desc-${feature.id}`}
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="Brief explanation of the feature"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
            <AlertCircle className="h-3 w-3 shrink-0" />
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
    <div className="group flex items-start justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/90">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <h4 className="text-xs font-medium text-zinc-200 tracking-tight truncate">
          {feature.title}
        </h4>
        {feature.description ? (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {feature.description}
          </p>
        ) : (
          <span className="text-[11px] text-zinc-600 italic">No description provided</span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit ${feature.title}`}
          title="Edit feature"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(feature.id)}
          aria-label={`Remove ${feature.title}`}
          title="Remove feature"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
