import React from 'react';
import { X } from 'lucide-react';
import { Technology } from '@/types';

interface TechnologyChipProps {
  technology: Technology;
  onRemove: (id: string) => void;
}

export const TechnologyChip: React.FC<TechnologyChipProps> = ({
  technology,
  onRemove,
}) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 pl-2.5 pr-1.5 py-1 text-xs text-zinc-200 transition-colors hover:border-zinc-700">
      <span className="font-medium text-zinc-100">{technology.name}</span>
      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
        {technology.category}
      </span>
      <button
        type="button"
        onClick={() => onRemove(technology.id)}
        aria-label={`Remove ${technology.name}`}
        title={`Remove ${technology.name}`}
        className="flex h-4 w-4 items-center justify-center rounded text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};
