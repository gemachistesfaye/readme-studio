import React, { useRef, useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { ReadmeData } from '@/types';
import { normalizeReadmeData } from '@/utils/readmeDraftStorage';

interface ExportImportPanelProps {
  data: ReadmeData;
  onImport: (data: ReadmeData) => void;
}

export const ExportImportPanel: React.FC<ExportImportPanelProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState<ReadmeData | null>(null);

  const handleExport = () => {
    const payload = {
      _readme_studio_backup: true,
      exportedAt: new Date().toISOString(),
      data: normalizeReadmeData(data),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `readme-studio-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    setImportError(null);
    setImportSuccess(false);

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string);
        const source =
          raw && typeof raw === 'object' && raw._readme_studio_backup ? raw.data : raw;
        const normalized = normalizeReadmeData(source);
        setShowConfirm(normalized);
      } catch {
        setImportError('Invalid backup file. Please select a valid README Studio export (.json).');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!showConfirm) return;
    onImport(showConfirm);
    setShowConfirm(null);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Export */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Export Backup</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Download your entire README Studio project as a <code>.json</code> file. You can re-import it
          anytime to restore all your content.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          <Download className="h-4 w-4" />
          Export Backup (.json)
        </button>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700" />

      {/* Import */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Import Backup</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Load a previously exported <code>.json</code> backup. Your current content will be replaced
          after confirmation.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
        >
          <Upload className="h-4 w-4" />
          Import Backup (.json)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Import README Studio backup file"
        />
      </div>

      {/* Error */}
      {importError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-700 dark:text-red-400">{importError}</p>
        </div>
      )}

      {/* Success */}
      {importSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            ✓ Backup imported successfully!
          </p>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Replace current content?
              </p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                Project: <strong>{showConfirm.basicInfo.projectName || '(unnamed)'}</strong>
                {' · '}
                {showConfirm.features.features.length} feature(s)
                {' · '}
                {showConfirm.techStack.technologies.length} tech(s)
              </p>
              <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-500">
                This will overwrite all your current README content.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmImport}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              Yes, import it
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(null)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

