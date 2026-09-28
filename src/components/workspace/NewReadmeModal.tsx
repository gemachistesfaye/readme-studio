import React, { useEffect, useRef } from 'react';
import { FilePlus2, X } from 'lucide-react';

interface NewReadmeModalProps {
  isOpen: boolean;
  hasUserContent: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const NewReadmeModal: React.FC<NewReadmeModalProps> = ({
  isOpen,
  hasUserContent,
  onClose,
  onConfirm,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-zinc-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-readme-title"
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <h2 id="new-readme-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                New README
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {hasUserContent
                  ? 'Your current draft will be replaced with a blank README.'
                  : 'Start with a fresh blank README.'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close new README dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {hasUserContent && (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            This action clears the current README draft. Your separately saved theme preference will not be changed.
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            Start New README
          </button>
        </div>
      </div>
    </div>
  );
};
