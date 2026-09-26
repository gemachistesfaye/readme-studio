import React from 'react';
import { Plus, Check } from 'lucide-react';
import { TechCategory } from '@/types';
import { QUICK_ADD_OPTIONS } from '@/constants/techStack';

interface QuickAddTechProps {
  existingNames: Set<string>;
  onAdd: (name: string, category: TechCategory) => void;
}

export const QuickAddTech: React.FC<QuickAddTechProps> = ({
  existingNames,
  onAdd,
}) => {
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
        Quick Add Common Technologies
      </span>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_ADD_OPTIONS.map((item) => {
          const isAdded = existingNames.has(item.name.toLowerCase());
          return (
            <button
              key={item.name}
              type="button"
              disabled={isAdded}
              onClick={() => onAdd(item.name, item.category)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors ${
                isAdded
                  ? 'border border-zinc-800/40 bg-zinc-900/30 text-zinc-600 cursor-default'
                  : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer'
              }`}
            >
              {isAdded ? (
                <Check className="h-3 w-3 text-zinc-600" />
              ) : (
                <Plus className="h-3 w-3 text-zinc-500" />
              )}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
