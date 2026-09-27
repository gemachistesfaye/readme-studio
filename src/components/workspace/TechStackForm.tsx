import React, { useState } from 'react';
import { Plus, AlertCircle, Layers } from 'lucide-react';
import { TechCategory, Technology } from '@/types';
import { TECH_CATEGORIES } from '@/constants/techStack';
import { TechnologyChip } from './TechnologyChip';
import { QuickAddTech } from './QuickAddTech';

interface TechStackFormProps {
  technologies: Technology[];
  onAddTechnology: (name: string, category: TechCategory) => { success: boolean; error?: string };
  onRemoveTechnology: (id: string) => void;
}

export const TechStackForm: React.FC<TechStackFormProps> = ({
  technologies,
  onAddTechnology,
  onRemoveTechnology,
}) => {
  const [techName, setTechName] = useState('');
  const [category, setCategory] = useState<TechCategory>('Frontend');
  const [error, setError] = useState<string | null>(null);

  const existingNames = new Set(technologies.map((t) => t.name.toLowerCase()));

  const handleAdd = () => {
    const trimmed = techName.trim();
    if (!trimmed) {
      setError('Please enter a technology name.');
      return;
    }

    const result = onAddTechnology(trimmed, category);
    if (!result.success) {
      setError(result.error || 'Failed to add technology.');
      return;
    }

    setTechName('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleQuickAdd = (name: string, cat: TechCategory) => {
    const result = onAddTechnology(name, cat);
    if (!result.success) {
      setError(result.error || 'Failed to add technology.');
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input & Category Selection Form */}
      <div className="flex flex-col gap-2">
        <label htmlFor="tech-name-input" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Add Technology
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="tech-name-input"
            type="text"
            placeholder="e.g. React, Docker, Python..."
            value={techName}
            onChange={(e) => {
              setTechName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            className={`flex-1 rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
              error
                ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />

          <div className="flex gap-2">
            <select
              aria-label="Technology Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TechCategory)}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            >
              {TECH_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200">
                  {cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 shadow-sm whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Selected Technologies List */}
      <div className="flex flex-col gap-2 pt-1 border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium">Selected Technologies</span>
          <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
            {technologies.length} added
          </span>
        </div>

        {technologies.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {technologies.map((tech) => (
              <TechnologyChip
                key={tech.id}
                technology={tech}
                onRemove={onRemoveTechnology}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 px-3 py-3 text-xs text-zinc-400 dark:text-zinc-500">
            <Layers className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
            <span>No technologies added yet. Use the input above or quick-add below.</span>
          </div>
        )}
      </div>

      {/* Quick Add Bar */}
      <QuickAddTech
        existingNames={existingNames}
        onAdd={handleQuickAdd}
      />
    </div>
  );
};
