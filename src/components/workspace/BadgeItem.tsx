import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Edit2, Check, X, ExternalLink } from 'lucide-react';
import { ReadmeBadge, BadgeStyle } from '@/types';
import { BADGE_STYLES } from '@/constants/badges';
import { buildBadgeImageUrl } from '@/utils/generateBadge';
import { isValidUrl } from '@/utils/validation';

interface BadgeItemProps {
  badge: ReadmeBadge;
  index: number;
  totalCount: number;
  onUpdate: (id: string, updates: Partial<Omit<ReadmeBadge, 'id'>>) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const BadgeItem: React.FC<BadgeItemProps> = ({
  badge,
  index,
  totalCount,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(badge.label);
  const [editMessage, setEditMessage] = useState(badge.message || '');
  const [editColor, setEditColor] = useState(badge.color || '');
  const [editLogo, setEditLogo] = useState(badge.logo || '');
  const [editLink, setEditLink] = useState(badge.link || '');
  const [editStyle, setEditStyle] = useState<BadgeStyle>(badge.style || 'flat');
  const [validationError, setValidationError] = useState<string | null>(null);

  const imageUrl = buildBadgeImageUrl(badge);

  const handleSave = () => {
    const trimmedLabel = editLabel.trim();
    if (!trimmedLabel) {
      setValidationError('Badge label cannot be empty.');
      return;
    }

    if (editLink.trim() && !isValidUrl(editLink.trim())) {
      setValidationError('Please enter a valid link URL (e.g. https://...).');
      return;
    }

    onUpdate(badge.id, {
      label: trimmedLabel,
      message: editMessage.trim() || undefined,
      color: editColor.trim() || undefined,
      logo: editLogo.trim() || undefined,
      link: editLink.trim() || undefined,
      style: editStyle,
    });

    setIsEditing(false);
    setValidationError(null);
  };

  const handleCancel = () => {
    setEditLabel(badge.label);
    setEditMessage(badge.message || '');
    setEditColor(badge.color || '');
    setEditLogo(badge.logo || '');
    setEditLink(badge.link || '');
    setEditStyle(badge.style || 'flat');
    setValidationError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/40 bg-white dark:bg-zinc-900/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Edit Badge</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <Check className="h-3 w-3" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {validationError && (
          <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-2 rounded border border-rose-200 dark:border-rose-500/20">
            {validationError}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-zinc-400 dark:text-zinc-500 mb-1">Label</label>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 dark:text-zinc-500 mb-1">Message</label>
            <input
              type="text"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              placeholder="e.g. v1.0.0, passing"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 dark:text-zinc-500 mb-1">Color / Hex</label>
            <input
              type="text"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              placeholder="e.g. blue, 4F46E5"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 dark:text-zinc-500 mb-1">Style</label>
            <select
              value={editStyle}
              onChange={(e) => setEditStyle(e.target.value as BadgeStyle)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {BADGE_STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-zinc-400 dark:text-zinc-500 mb-1">Link URL (Optional)</label>
            <input
              type="url"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 w-4 text-center">
          {index + 1}
        </span>

        {/* Rendered Badge Image Preview */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-1 rounded-md border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={badge.label}
            className="h-5 max-w-[160px] object-contain rounded"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
              {badge.label}
            </span>
            <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 text-[9px] font-medium text-zinc-500 dark:text-zinc-400 capitalize">
              {badge.type}
            </span>
          </div>

          {badge.link && (
            <a
              href={badge.link}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 mt-0.5 truncate"
            >
              <span className="truncate">{badge.link}</span>
              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Actions: Move Up / Down, Edit, Delete */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          aria-label="Move badge up"
          title="Move up"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={index >= totalCount - 1}
          aria-label="Move badge down"
          title="Move down"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label="Edit badge"
          title="Edit badge"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onRemove(badge.id)}
          aria-label="Remove badge"
          title="Remove badge"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
