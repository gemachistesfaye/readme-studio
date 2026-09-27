import React, { useState } from 'react';
import { Plus, AlertCircle, Code2 } from 'lucide-react';
import { UsageData } from '@/types';
import { USAGE_CODE_LANGUAGES, DEFAULT_USAGE_LANGUAGE } from '@/constants/usage';
import { UsageExampleItem } from './UsageExampleItem';

interface UsageFormProps {
  data: UsageData;
  onUpdateIntroduction: (introduction: string) => void;
  onAddExample: (
    title: string,
    description?: string,
    code?: string,
    language?: string
  ) => { success: boolean; error?: string };
  onUpdateExample: (
    id: string,
    title: string,
    description: string,
    code: string,
    language: string
  ) => { success: boolean; error?: string };
  onRemoveExample: (id: string) => void;
}

export const UsageForm: React.FC<UsageFormProps> = ({
  data,
  onUpdateIntroduction,
  onAddExample,
  onUpdateExample,
  onRemoveExample,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(DEFAULT_USAGE_LANGUAGE);
  const [exampleError, setExampleError] = useState<string | null>(null);

  const handleAddExample = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setExampleError('Please enter an example title.');
      return;
    }

    const result = onAddExample(
      trimmedTitle,
      description.trim() || undefined,
      code.trim() || undefined,
      language
    );

    if (!result.success) {
      setExampleError(result.error || 'Failed to add example.');
      return;
    }

    setTitle('');
    setDescription('');
    setCode('');
    setLanguage(DEFAULT_USAGE_LANGUAGE);
    setExampleError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddExample();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Usage Instructions / Introduction */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="usage-instructions-input" className="text-xs font-medium text-zinc-300">
          Usage Instructions <span className="text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <textarea
          id="usage-instructions-input"
          rows={3}
          placeholder="After installation, start the development server and open the application in your browser."
          value={data.introduction}
          onChange={(e) => onUpdateIntroduction(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
        />
        <p className="text-[11px] text-zinc-500">
          Provide high-level guidance or workflow explanation before specific code examples.
        </p>
      </div>

      {/* Usage Examples Builder */}
      <div className="flex flex-col gap-3 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-300">
            Usage Examples & Code Snippets
          </span>
          <span className="font-mono text-[11px] text-zinc-500">
            {data.examples.length} added
          </span>
        </div>

        {/* New Example Form */}
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-usage-title" className="text-[11px] font-medium text-zinc-300">
              Title <span className="text-indigo-400">*</span>
            </label>
            <input
              id="new-usage-title"
              type="text"
              placeholder="e.g. Start Development Server"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (exampleError) setExampleError(null);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full rounded-lg border bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none ${
                exampleError
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                  : 'border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
              }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-usage-desc" className="text-[11px] font-medium text-zinc-400">
              Description <span className="text-zinc-500 text-[10px] font-normal">(optional)</span>
            </label>
            <input
              id="new-usage-desc"
              type="text"
              placeholder="e.g. Run the application locally in development mode."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label htmlFor="new-usage-lang" className="text-[11px] font-medium text-zinc-400">
                Language
              </label>
              <select
                id="new-usage-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              >
                {USAGE_CODE_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="new-usage-code" className="text-[11px] font-medium text-zinc-400">
                Code / Command <span className="text-zinc-500 text-[10px] font-normal">(optional)</span>
              </label>
              <textarea
                id="new-usage-code"
                rows={2}
                placeholder="e.g. npm run dev"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {exampleError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 pt-0.5" role="alert">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{exampleError}</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleAddExample}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Example</span>
            </button>
          </div>
        </div>

        {/* Existing Examples List */}
        {data.examples.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            {data.examples.map((example, idx) => (
              <UsageExampleItem
                key={example.id}
                example={example}
                index={idx}
                onUpdate={onUpdateExample}
                onRemove={onRemoveExample}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-800/80 bg-zinc-950/40 px-3 py-3 text-xs text-zinc-500">
            <Code2 className="h-4 w-4 text-zinc-600 shrink-0" />
            <span>No usage examples added yet. Add common workflows, command examples, or code snippets above.</span>
          </div>
        )}
      </div>
    </div>
  );
};
