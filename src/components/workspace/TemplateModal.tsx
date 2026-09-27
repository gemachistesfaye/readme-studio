import React, { useState } from 'react';
import { LayoutTemplate, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import { ReadmeTemplate, TemplateId } from '@/types';
import { README_TEMPLATES } from '@/constants/templates';
import { cn } from '@/utils';

interface TemplateModalProps {
  isOpen: boolean;
  currentTemplateId: TemplateId;
  hasUserContent: boolean;
  onClose: () => void;
  onApplyTemplate: (templateId: TemplateId) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  currentTemplateId,
  hasUserContent,
  onClose,
  onApplyTemplate,
}) => {
  const [selectedId, setSelectedId] = useState<TemplateId>(currentTemplateId);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<TemplateId | null>(null);

  if (!isOpen) return null;

  const handleSelect = (template: ReadmeTemplate) => {
    setSelectedId(template.id);
  };

  const handleApplyClick = () => {
    // If user has existing content and is switching to a different template
    if (hasUserContent && selectedId !== currentTemplateId) {
      setPendingTemplateId(selectedId);
      setShowConfirm(true);
    } else {
      onApplyTemplate(selectedId);
      onClose();
    }
  };

  const handleConfirmApply = () => {
    if (pendingTemplateId) {
      onApplyTemplate(pendingTemplateId);
    }
    setShowConfirm(false);
    setPendingTemplateId(null);
    onClose();
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPendingTemplateId(null);
  };

  const selectedTemplate = README_TEMPLATES.find((t) => t.id === selectedId) || README_TEMPLATES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h2 id="template-modal-title" className="text-base font-semibold text-zinc-100">
                README Templates
              </h2>
              <p className="text-xs text-zinc-400">
                Choose a structured starter layout for your project.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close template modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Confirmation Overlay */}
        {showConfirm ? (
          <div className="py-8 px-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">
              Apply this template?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-400">
              Applying a new template will configure starter sections and guidance. Your project name, repository URL, and author credentials will be preserved.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Apply Template
              </button>
            </div>
          </div>
        ) : (
          /* Normal Template Selector Body */
          <div className="mt-4 space-y-4">
            {/* Grid of Templates */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-h-[340px] overflow-y-auto pr-1">
              {README_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedId;
                const isCurrent = tmpl.id === currentTemplateId;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelect(tmpl)}
                    className={cn(
                      'flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer relative',
                      isSelected
                        ? 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                        : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                        {tmpl.name}
                        {isCurrent && (
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-normal">
                            Active
                          </span>
                        )}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                    </div>

                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                      {tmpl.description}
                    </p>

                    {/* Section tags preview */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {tmpl.sections.map((sec, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded bg-zinc-800/60 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Template Summary */}
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-3 text-xs text-zinc-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  Selected: <strong className="text-zinc-200">{selectedTemplate.name}</strong>
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">
                {selectedTemplate.sections.length} structured sections
              </span>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyClick}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Apply Selected Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
