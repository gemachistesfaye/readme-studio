import React from 'react';
import { Scale, Info } from 'lucide-react';
import { LicenseData, LicenseType } from '@/types';
import { LICENSE_OPTIONS } from '@/constants/licenses';

interface LicenseFormProps {
  data: LicenseData;
  onUpdateLicense: (field: keyof LicenseData, value: string) => void;
}

export const LicenseForm: React.FC<LicenseFormProps> = ({
  data,
  onUpdateLicense,
}) => {
  const selectedOption = LICENSE_OPTIONS.find((opt) => opt.type === data.type) || LICENSE_OPTIONS[0];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateLicense('type', e.target.value as LicenseType);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* License Selector */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="license-type-select" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Select License
        </label>
        <select
          id="license-type-select"
          value={data.type}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
        >
          {LICENSE_OPTIONS.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description Card */}
      <div className="flex items-start gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3.5 text-xs">
        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedOption.name}</span>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{selectedOption.description}</p>
        </div>
      </div>

      {/* Custom License Fields */}
      {data.type === 'Custom' && (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom-license-name" className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
              Custom License Name <span className="text-indigo-600 dark:text-indigo-400">*</span>
            </label>
            <input
              id="custom-license-name"
              type="text"
              placeholder="e.g. My Organization Commercial License"
              value={data.customName}
              onChange={(e) => onUpdateLicense('customName', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom-license-text" className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Custom License Notice / Description <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-normal">(optional)</span>
            </label>
            <textarea
              id="custom-license-text"
              rows={3}
              placeholder="e.g. Copyright (c) 2026. All rights reserved. Commercial use requires a valid license key."
              value={data.customText}
              onChange={(e) => onUpdateLicense('customText', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      )}

      {/* Proprietary Notice Info */}
      {data.type === 'Proprietary' && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
          <Scale className="h-4 w-4 shrink-0" />
          <span>
            A proprietary notice (&ldquo;This project is proprietary software. All rights reserved.&rdquo;) will be rendered in the README.
          </span>
        </div>
      )}

      {/* None Info */}
      {data.type === 'None' && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-3 text-xs text-zinc-400 dark:text-zinc-500">
          <span>No License section will be included in the generated README.</span>
        </div>
      )}
    </div>
  );
};
