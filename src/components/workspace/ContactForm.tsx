import React from 'react';
import { Mail, Globe, Linkedin, Twitter, Link2, AlertCircle, Info } from 'lucide-react';
import { ContactData, ContactErrors } from '@/types';

interface ContactFormProps {
  data: ContactData;
  errors: ContactErrors;
  onUpdateField: (field: keyof ContactData, value: string) => void;
  onBlur: (field: keyof ContactData) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  data,
  errors,
  onUpdateField,
  onBlur,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Informational notice */}
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3 text-xs text-zinc-500 dark:text-zinc-400">
        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span>
          Author Name and GitHub configured in Basic Information will automatically be included in your Contact section.
        </span>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Email <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
            <Mail className="h-4 w-4" />
          </div>
          <input
            id="contact-email"
            type="email"
            placeholder="name@example.com"
            value={data.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            onBlur={() => onBlur('email')}
            className={`w-full rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 pl-9.5 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
              errors.email
                ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Website */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-website" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Website <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
            <Globe className="h-4 w-4" />
          </div>
          <input
            id="contact-website"
            type="url"
            placeholder="https://example.com"
            value={data.website}
            onChange={(e) => onUpdateField('website', e.target.value)}
            onBlur={() => onBlur('website')}
            className={`w-full rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 pl-9.5 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
              errors.website
                ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />
        </div>
        {errors.website && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.website}</span>
          </div>
        )}
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-linkedin" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          LinkedIn <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
            <Linkedin className="h-4 w-4" />
          </div>
          <input
            id="contact-linkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={data.linkedin}
            onChange={(e) => onUpdateField('linkedin', e.target.value)}
            onBlur={() => onBlur('linkedin')}
            className={`w-full rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 pl-9.5 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
              errors.linkedin
                ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />
        </div>
        {errors.linkedin && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.linkedin}</span>
          </div>
        )}
      </div>

      {/* X / Twitter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-twitter" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          X / Twitter <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
            <Twitter className="h-4 w-4" />
          </div>
          <input
            id="contact-twitter"
            type="text"
            placeholder="@username or https://x.com/username"
            value={data.twitter}
            onChange={(e) => onUpdateField('twitter', e.target.value)}
            onBlur={() => onBlur('twitter')}
            className={`w-full rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 pl-9.5 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
              errors.twitter
                ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />
        </div>
        {errors.twitter && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.twitter}</span>
          </div>
        )}
      </div>

      {/* Additional Link */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Additional Link</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-addl-label" className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Link Label <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-normal">(optional)</span>
            </label>
            <input
              id="contact-addl-label"
              type="text"
              placeholder="e.g. Discord Community"
              value={data.additionalLinkLabel}
              onChange={(e) => onUpdateField('additionalLinkLabel', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-addl-url" className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Link URL <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-normal">(optional)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                <Link2 className="h-3.5 w-3.5" />
              </div>
              <input
                id="contact-addl-url"
                type="url"
                placeholder="https://discord.gg/example"
                value={data.additionalLinkUrl}
                onChange={(e) => onUpdateField('additionalLinkUrl', e.target.value)}
                onBlur={() => onBlur('additionalLinkUrl')}
                className={`w-full rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
                  errors.additionalLinkUrl
                    ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                    : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
                }`}
              />
            </div>
            {errors.additionalLinkUrl && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-0.5" role="alert">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.additionalLinkUrl}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
