import React from 'react';

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  className = '',
  hasError,
  ...props
}) => {
  return (
    <input
      className={`w-full rounded-lg border bg-zinc-50 dark:bg-zinc-900/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm transition-colors outline-none ${
        hasError
          ? 'border-red-300 dark:border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
          : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
      } ${className}`}
      {...props}
    />
  );
};
