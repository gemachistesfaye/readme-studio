import React, { useCallback, useEffect, useRef } from 'react';
import { ListOrdered, ArrowUp, ArrowDown, RotateCcw, X, Info } from 'lucide-react';
import { ReadmeSectionId } from '@/types';
import { getSectionMeta } from '@/constants/sections';
import { canMoveDown, canMoveUp, cn } from '@/utils';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface SectionOrderModalProps {
  isOpen: boolean;
  sectionOrder: ReadmeSectionId[];
  isDefaultOrder: boolean;
  onClose: () => void;
  onMoveSectionUp: (sectionId: ReadmeSectionId) => void;
  onMoveSectionDown: (sectionId: ReadmeSectionId) => void;
  onResetOrder: () => void;
}

export const SectionOrderModal: React.FC<SectionOrderModalProps> = ({
  isOpen,
  sectionOrder,
  isDefaultOrder,
  onClose,
  onMoveSectionUp,
  onMoveSectionDown,
  onResetOrder,
}) => {
  useBodyScrollLock(isOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Focus the close control on open and support Escape to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const total = sectionOrder.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm dark:bg-zinc-950/70 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="section-order-modal-title"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ListOrdered className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="section-order-modal-title"
                className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Section Order
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose the order of the sections below your project title.
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close section order modal"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <p className="leading-relaxed">
              Your project title, badges, and description always stay at the top. Empty
              sections are skipped when the README is generated, and reordering never deletes
              any content.
            </p>
          </div>

          <ol className="space-y-2">
            {sectionOrder.map((sectionId, index) => {
              const meta = getSectionMeta(sectionId);

              return (
                <li
                  key={sectionId}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40"
                >
                  <span className="w-5 shrink-0 text-center font-mono text-xs text-zinc-400 dark:text-zinc-500">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {meta.label}
                    </h3>
                    <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {meta.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveSectionUp(sectionId)}
                      disabled={!canMoveUp(index, total)}
                      aria-label={`Move ${meta.label} up`}
                      title="Move up"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onMoveSectionDown(sectionId)}
                      disabled={!canMoveDown(index, total)}
                      aria-label={`Move ${meta.label} down`}
                      title="Move down"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-zinc-200 bg-white px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={onResetOrder}
            disabled={isDefaultOrder}
            aria-label="Reset section order to default"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset order</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
