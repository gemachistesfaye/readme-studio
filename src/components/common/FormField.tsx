import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required,
  hint,
  error,
  counter,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="font-medium text-zinc-700 dark:text-zinc-300">
          {label}{' '}
          {required ? (
            <span className="text-indigo-600 dark:text-indigo-400" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal">(optional)</span>
          )}
        </label>
        {counter && (
          <span
            className={`text-[11px] font-mono ${
              error ? 'text-red-600 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            {counter}
          </span>
        )}
      </div>

      {children}

      {hint && !error && (
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-normal">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 leading-normal" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
