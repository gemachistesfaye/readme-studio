import React, { useState } from 'react';
import { BarChart2, Eye, EyeOff } from 'lucide-react';
import { GithubStatsData } from '@/types';

interface GitHubStatsFormProps {
  data: GithubStatsData;
  onChange: (updates: Partial<GithubStatsData>) => void;
}

const STATS_THEMES = [
  { value: 'default', label: 'Default (Light)' },
  { value: 'github_dark', label: 'GitHub Dark' },
  { value: 'radical', label: 'Radical' },
  { value: 'merko', label: 'Merko' },
  { value: 'gruvbox', label: 'Gruvbox' },
  { value: 'tokyonight', label: 'Tokyo Night' },
  { value: 'onedark', label: 'One Dark' },
  { value: 'cobalt', label: 'Cobalt' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'highcontrast', label: 'High Contrast' },
  { value: 'dracula', label: 'Dracula' },
];

export const GitHubStatsForm: React.FC<GitHubStatsFormProps> = ({ data, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);
  const username = data.username.trim();
  const theme = data.theme || 'github_dark';

  const statsUrl = username
    ? `https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(username)}&show_icons=true&theme=${theme}`
    : null;

  const langsUrl = username
    ? `https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(username)}&layout=compact&theme=${theme}`
    : null;

  const streakUrl = username
    ? `https://github-readme-streak-stats.herokuapp.com/?user=${encodeURIComponent(username)}&theme=${theme}`
    : null;

  return (
    <div className="space-y-4">
      {/* Enable toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          role="checkbox"
          aria-checked={data.enabled}
          tabIndex={0}
          onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onChange({ enabled: !data.enabled })}
          onClick={() => onChange({ enabled: !data.enabled })}
          className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer ${
            data.enabled
              ? 'bg-indigo-600 border-indigo-600'
              : 'bg-zinc-200 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              data.enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Include GitHub Stats in README
        </span>
      </label>

      {data.enabled && (
        <>
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              GitHub Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => onChange({ username: e.target.value })}
              placeholder="e.g. gemachistesfaye"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Theme */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Widget Theme</label>
            <select
              value={theme}
              onChange={(e) => onChange({ theme: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {STATS_THEMES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Widget toggles */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Widgets to include</p>
            {[
              { key: 'showStats', label: 'GitHub Stats Card' },
              { key: 'showTopLangs', label: 'Top Languages Card' },
              { key: 'showStreak', label: 'GitHub Streak Card' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data[key as keyof GithubStatsData] as boolean}
                  onChange={(e) => onChange({ [key]: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-800"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
              </label>
            ))}
          </div>

          {/* Live Preview toggle */}
          {username && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPreview ? 'Hide Preview' : 'Show Live Preview'}
              </button>

              {showPreview && (
                <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Live preview (may take a moment to load):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.showStats && statsUrl && (
                      <img
                        src={statsUrl}
                        alt="GitHub Stats"
                        className="max-w-full rounded"
                        loading="lazy"
                      />
                    )}
                    {data.showTopLangs && langsUrl && (
                      <img
                        src={langsUrl}
                        alt="Top Languages"
                        className="max-w-full rounded"
                        loading="lazy"
                      />
                    )}
                    {data.showStreak && streakUrl && (
                      <img
                        src={streakUrl}
                        alt="GitHub Streak"
                        className="max-w-full rounded"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!data.enabled && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
          <BarChart2 className="h-4 w-4 shrink-0 text-zinc-400" />
          Enable to add GitHub Stats, Top Languages, and Streak widgets to your README.
        </div>
      )}
    </div>
  );
};

