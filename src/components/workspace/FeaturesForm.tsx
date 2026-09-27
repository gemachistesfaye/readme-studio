import React, { useState } from 'react';
import { Plus, AlertCircle, Sparkles } from 'lucide-react';
import { Feature } from '@/types';
import { FeatureItem } from './FeatureItem';

interface FeaturesFormProps {
  features: Feature[];
  onAddFeature: (title: string, description?: string) => { success: boolean; error?: string };
  onUpdateFeature: (id: string, title: string, description: string) => { success: boolean; error?: string };
  onRemoveFeature: (id: string) => void;
  onMoveFeatureUp: (id: string) => void;
  onMoveFeatureDown: (id: string) => void;
}

export const FeaturesForm: React.FC<FeaturesFormProps> = ({
  features,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onMoveFeatureUp,
  onMoveFeatureDown,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a feature title.');
      return;
    }

    const result = onAddFeature(trimmedTitle, description.trim());
    if (!result.success) {
      setError(result.error || 'Failed to add feature.');
      return;
    }

    setTitle('');
    setDescription('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add New Feature Inputs */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="feature-title-input" className="text-xs font-medium text-zinc-300">
            Feature Title <span className="text-indigo-400">*</span>
          </label>
          <input
            id="feature-title-input"
            type="text"
            placeholder="e.g. Live Markdown Preview, Syntax Highlighting..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-lg border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none ${
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="feature-desc-input" className="text-xs font-medium text-zinc-400">
            Description <span className="text-zinc-500 text-[11px] font-normal">(optional)</span>
          </label>
          <input
            id="feature-desc-input"
            type="text"
            placeholder="e.g. Preview README content instantly while editing."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 pt-0.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Feature</span>
          </button>
        </div>
      </div>

      {/* Added Features List */}
      <div className="flex flex-col gap-2 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium">Project Features</span>
          <span className="font-mono text-[11px] text-zinc-500">
            {features.length} added
          </span>
        </div>

        {features.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            {features.map((feature, idx) => (
              <FeatureItem
                key={feature.id}
                feature={feature}
                index={idx}
                totalCount={features.length}
                onUpdate={onUpdateFeature}
                onRemove={onRemoveFeature}
                onMoveUp={onMoveFeatureUp}
                onMoveDown={onMoveFeatureDown}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-800/80 bg-zinc-950/40 px-3 py-3 text-xs text-zinc-500">
            <Sparkles className="h-4 w-4 text-zinc-600" />
            <span>No features added yet. Add your first project highlight above.</span>
          </div>
        )}
      </div>
    </div>
  );
};
