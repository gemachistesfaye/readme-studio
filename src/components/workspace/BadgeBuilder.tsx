import React, { useState } from 'react';
import { Plus, Shield, Cpu, Tag, AlertCircle } from 'lucide-react';
import {
  BadgesData,
  BadgeStyle,
  BadgeType,
  LicenseData,
  ReadmeBadge,
  TechStackData,
} from '@/types';
import { BADGE_STYLES, TECH_BADGE_PRESETS } from '@/constants/badges';
import { BadgeItem } from './BadgeItem';
import { isValidUrl } from '@/utils/validation';
import { cn } from '@/utils';

interface BadgeBuilderProps {
  badges: BadgesData;
  techStack: TechStackData;
  license: LicenseData;
  onAddBadge: (
    type: BadgeType,
    label: string,
    message?: string,
    color?: string,
    logo?: string,
    link?: string,
    style?: BadgeStyle
  ) => { success: boolean; error?: string };
  onUpdateBadge: (id: string, updates: Partial<Omit<ReadmeBadge, 'id'>>) => { success: boolean; error?: string };
  onRemoveBadge: (id: string) => void;
  onMoveBadgeUp: (index: number) => void;
  onMoveBadgeDown: (index: number) => void;
}

export const BadgeBuilder: React.FC<BadgeBuilderProps> = ({
  badges,
  techStack,
  license,
  onAddBadge,
  onUpdateBadge,
  onRemoveBadge,
  onMoveBadgeUp,
  onMoveBadgeDown,
}) => {
  const [activeTab, setActiveTab] = useState<'tech' | 'license' | 'custom'>('tech');

  // Custom Badge Inputs
  const [customLabel, setCustomLabel] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customColor, setCustomColor] = useState('blue');
  const [customLogo, setCustomLogo] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [customStyle, setCustomStyle] = useState<BadgeStyle>('flat');
  const [customError, setCustomError] = useState<string | null>(null);

  // Filter available technologies in Tech Stack not already added as a badge
  const availableTechs = techStack.technologies.filter(
    (t) => !badges.badges.some((b) => b.type === 'technology' && b.label.toLowerCase() === t.name.toLowerCase())
  );

  const hasLicenseBadge = badges.badges.some((b) => b.type === 'license');

  const handleAddTechBadge = (techName: string) => {
    const preset = TECH_BADGE_PRESETS[techName] || {
      name: techName,
      label: techName,
      message: 'tech',
      color: 'blue',
      logo: techName.toLowerCase().replace(/[^a-z0-9]/g, ''),
    };

    onAddBadge(
      'technology',
      preset.label,
      preset.message,
      preset.color,
      preset.logo,
      undefined,
      'flat'
    );
  };

  const handleAddLicenseBadge = () => {
    if (license.type === 'None') return;

    const licenseMessage = license.type === 'Custom' ? (license.customName || 'Custom') : license.type;
    const color = license.type === 'MIT' ? 'yellow' : license.type === 'Apache-2.0' ? 'blue' : 'green';

    onAddBadge(
      'license',
      'License',
      licenseMessage,
      color,
      undefined,
      undefined,
      'flat'
    );
  };

  const handleAddCustomBadge = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    const trimmedLabel = customLabel.trim();
    if (!trimmedLabel) {
      setCustomError('Badge label is required.');
      return;
    }

    if (customLink.trim() && !isValidUrl(customLink.trim())) {
      setCustomError('Please enter a valid link URL (e.g. https://...).');
      return;
    }

    const res = onAddBadge(
      'custom',
      trimmedLabel,
      customMessage.trim() || undefined,
      customColor.trim() || 'blue',
      customLogo.trim() || undefined,
      customLink.trim() || undefined,
      customStyle
    );

    if (!res.success) {
      setCustomError(res.error || 'Failed to add badge.');
      return;
    }

    // Reset inputs
    setCustomLabel('');
    setCustomMessage('');
    setCustomColor('blue');
    setCustomLogo('');
    setCustomLink('');
    setCustomStyle('flat');
    setCustomError(null);
  };

  return (
    <div className="space-y-5">
      {/* Category Tabs */}
      <div className="flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('tech')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors',
            activeTab === 'tech'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>From Tech Stack</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('license')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors',
            activeTab === 'license'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>License Badge</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors',
            activeTab === 'custom'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Tag className="h-3.5 w-3.5" />
          <span>Custom Badge</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'tech' && (
        <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-zinc-200">
              Technologies in your project
            </h4>
            <span className="text-[11px] text-zinc-500">
              {techStack.technologies.length} added in Tech Stack
            </span>
          </div>

          {techStack.technologies.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-2">
              No technologies added yet. Add technologies in the Tech Stack section on the left to create one-click badges here.
            </p>
          ) : availableTechs.length === 0 ? (
            <p className="text-xs text-emerald-400/90 py-2">
              All technologies from your Tech Stack have been added as badges!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {availableTechs.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleAddTechBadge(tech.name)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{tech.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'license' && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-zinc-200">
              Project License Badge
            </h4>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 font-mono">
              {license.type}
            </span>
          </div>

          {license.type === 'None' ? (
            <p className="text-xs text-zinc-500 italic">
              Your license is currently set to &quot;None&quot;. Choose a license in the License section to enable this badge.
            </p>
          ) : hasLicenseBadge ? (
            <p className="text-xs text-emerald-400/90">
              A license badge for &quot;{license.type}&quot; is active.
            </p>
          ) : (
            <div>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                Add an official license badge displaying &quot;{license.type}&quot; to your README top banner.
              </p>
              <button
                type="button"
                onClick={handleAddLicenseBadge}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add {license.type} Badge</span>
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <form onSubmit={handleAddCustomBadge} className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-200">
            Create Custom Badge
          </h4>

          {customError && (
            <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{customError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">
                Label <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Build, Version, PRs"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Message</label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g. passing, v1.0.0"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Color / Hex</label>
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="e.g. blue, green, 4F46E5"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Style</label>
              <select
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value as BadgeStyle)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {BADGE_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">SimpleIcon Logo (Optional)</label>
              <input
                type="text"
                value={customLogo}
                onChange={(e) => setCustomLogo(e.target.value)}
                placeholder="e.g. github, npm, docker"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Link URL (Optional)</label>
              <input
                type="url"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Badge</span>
            </button>
          </div>
        </form>
      )}

      {/* Configured Badges List with Ordering */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h4 className="text-xs font-semibold text-zinc-200">
            Active README Badges ({badges.badges.length})
          </h4>
          <span className="text-[11px] text-zinc-500">
            Rendered beneath project title
          </span>
        </div>

        {badges.badges.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-2 text-center">
            No badges configured. Add badges from your Tech Stack, License, or Custom tabs above.
          </p>
        ) : (
          <div className="space-y-2">
            {badges.badges.map((badge, idx) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
                index={idx}
                totalCount={badges.badges.length}
                onUpdate={onUpdateBadge}
                onRemove={onRemoveBadge}
                onMoveUp={onMoveBadgeUp}
                onMoveDown={onMoveDown}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
