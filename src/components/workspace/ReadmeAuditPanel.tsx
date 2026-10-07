import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { ReadmeData } from '@/types';

interface ReadmeAuditPanelProps {
  data: ReadmeData;
}

interface AuditItem {
  label: string;
  points: number;
  earned: boolean;
  hint: string;
}

function computeAudit(data: ReadmeData): AuditItem[] {
  const { basicInfo, techStack, features, installation, usage, license, contact, badges } = data;

  return [
    {
      label: 'Project name',
      points: 10,
      earned: basicInfo.projectName.trim().length > 0,
      hint: 'Fill in the Project Name field in Basic Information.',
    },
    {
      label: 'Description',
      points: 15,
      earned: basicInfo.description.trim().length >= 20,
      hint: 'Write a description of at least 20 characters.',
    },
    {
      label: 'Tech stack (≥ 2 items)',
      points: 10,
      earned: techStack.technologies.length >= 2,
      hint: 'Add at least 2 technologies in the Tech Stack section.',
    },
    {
      label: 'Features (≥ 2 listed)',
      points: 10,
      earned: features.features.length >= 2,
      hint: 'Add at least 2 features to the Features section.',
    },
    {
      label: 'Installation steps',
      points: 15,
      earned:
        installation.cloneCommand.trim().length > 0 ||
        installation.installCommand.trim().length > 0 ||
        installation.setupInstructions.length > 0,
      hint: 'Fill in the Installation section with clone/install commands.',
    },
    {
      label: 'Usage examples',
      points: 10,
      earned: usage.examples.length > 0 || usage.introduction.trim().length > 0,
      hint: 'Add at least one usage example or introduction text.',
    },
    {
      label: 'License set',
      points: 10,
      earned: license.type !== 'None',
      hint: 'Choose a license type in the License section.',
    },
    {
      label: 'Contact info',
      points: 10,
      earned:
        contact.email.trim().length > 0 ||
        contact.website.trim().length > 0 ||
        contact.linkedin.trim().length > 0 ||
        basicInfo.authorGithub.trim().length > 0,
      hint: 'Add at least one contact method (email, website, LinkedIn, or GitHub).',
    },
    {
      label: 'Badges added',
      points: 5,
      earned: badges.badges.length > 0,
      hint: 'Add status badges in the Badges section.',
    },
    {
      label: 'Demo / repo URL',
      points: 5,
      earned: basicInfo.demoUrl.trim().length > 0 || basicInfo.repositoryUrl.trim().length > 0,
      hint: 'Add a Demo URL or Repository URL in Basic Information.',
    },
  ];
}

export const ReadmeAuditPanel: React.FC<ReadmeAuditPanelProps> = ({ data }) => {
  const items = useMemo(() => computeAudit(data), [data]);
  const totalPoints = items.reduce((sum, i) => sum + i.points, 0);
  const earnedPoints = items.reduce((sum, i) => sum + (i.earned ? i.points : 0), 0);
  const score = Math.round((earnedPoints / totalPoints) * 100);

  const barColor =
    score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  const scoreLabel =
    score >= 80 ? 'Great!' : score >= 50 ? 'Good — keep going' : 'Needs work';

  const unmet = items.filter((i) => !i.earned);

  return (
    <div className="space-y-4">
      {/* Score bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            README Quality Score
          </span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {score}%{' '}
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              ({earnedPoints}/{totalPoints} pts) — {scoreLabel}
            </span>
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {item.earned ? (
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-medium ${
                  item.earned
                    ? 'text-zinc-700 dark:text-zinc-300'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {item.label}{' '}
                <span className="font-normal text-zinc-400 dark:text-zinc-500">
                  (+{item.points} pts)
                </span>
              </p>
              {!item.earned && (
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{item.hint}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary quick-fix */}
      {unmet.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {unmet.length === 1
              ? `1 improvement remaining. Complete it to reach ${Math.min(100, score + unmet[0].points)}%!`
              : `${unmet.length} improvements can boost your score to 100%.`}
          </p>
        </div>
      )}

      {score === 100 && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Perfect score! Your README is thorough and well-structured. 🎉
          </p>
        </div>
      )}
    </div>
  );
};

