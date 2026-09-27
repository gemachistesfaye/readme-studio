import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, AlertCircle, Code } from 'lucide-react';
import { UsageExample } from '@/types';
import { USAGE_CODE_LANGUAGES } from '@/constants/usage';

interface UsageExampleItemProps {
  example: UsageExample;
  index: number;
  onUpdate: (
    id: string,
    title: string,
    description: string,
    code: string,
    language: string
  ) => { success: boolean; error?: string };
  onRemove: (id: string) => void;
}

export const UsageExampleItem: React.FC<UsageExampleItemProps> = ({
  example,
  index,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(example.title);
  const [editDescription, setEditDescription] = useState(example.description);
  const [editCode, setEditCode] = useState(example.code);
  const [editLanguage, setEditLanguage] = useState(example.language || 'bash');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setError('Example title cannot be empty.');
      return;
    }

    const result = onUpdate(
      example.id,
      trimmedTitle,
      editDescription.trim(),
      editCode.trim(),
      editLanguage
    );

    if (!result.success) {
      setError(result.error || 'Failed to update example.');
      return;
    }

    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditTitle(example.title);
    setEditDescription(example.description);
    setEditCode(example.code);
    setEditLanguage(example.language || 'bash');
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-indigo-500/40 bg-zinc-900/90 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[11px] font-mono font-medium text-indigo-400">
            Example {index + 1}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Edit Example</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`edit-usage-title-${example.id}`} className="text-[11px] font-medium text-zinc-300">
            Title <span className="text-indigo-400">*</span>
          </label>
          <input
            id={`edit-usage-title-${example.id}`}
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (error) setError(null);
            }}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="e.g. Start Development Server"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`edit-usage-desc-${example.id}`} className="text-[11px] font-medium text-zinc-400">
            Description <span className="text-zinc-500 text-[10px] font-normal">(optional)</span>
          </label>
          <input
            id={`edit-usage-desc-${example.id}`}
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="e.g. Run the application locally in development mode."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label htmlFor={`edit-usage-lang-${example.id}`} className="text-[11px] font-medium text-zinc-400">
              Language
            </label>
            <select
              id={`edit-usage-lang-${example.id}`}
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            >
              {USAGE_CODE_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor={`edit-usage-code-${example.id}`} className="text-[11px] font-medium text-zinc-400">
              Code / Command <span className="text-zinc-500 text-[10px] font-normal">(optional)</span>
            </label>
            <textarea
              id={`edit-usage-code-${example.id}`}
              rows={2}
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="e.g. npm run dev"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 pt-0.5" role="alert">
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
    <div className="group flex items-start justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/90">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
            Example {index + 1}
          </span>
          <h4 className="text-xs font-medium text-zinc-200 tracking-tight truncate">
            {example.title}
          </h4>
          {example.code && (
            <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 text-[10px] font-mono text-indigo-400">
              {example.language || 'bash'}
            </span>
          )}
        </div>

        {example.description && (
          <p className="text-xs text-zinc-400 leading-relaxed">
            {example.description}
          </p>
        )}

        {example.code && (
          <div className="mt-1 flex items-start gap-1.5 rounded-md bg-zinc-950/80 px-2.5 py-2 border border-zinc-800/60 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre">
            <Code className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <code className="text-zinc-300">{example.code}</code>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit example ${index + 1}`}
          title="Edit example"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(example.id)}
          aria-label={`Remove example ${index + 1}`}
          title="Remove example"
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
