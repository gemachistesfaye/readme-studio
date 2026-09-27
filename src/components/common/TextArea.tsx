import React from 'react';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  className = '',
  hasError,
  rows = 3,
  ...props
}) => {
  return (
    <textarea
      rows={rows}
      className={`w-full resize-y rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none leading-relaxed ${
        hasError
          ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
          : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
      } ${className}`}
      {...props}
    />
  );
};
