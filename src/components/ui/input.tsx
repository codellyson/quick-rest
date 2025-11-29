import { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg',
          'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
          'placeholder:text-zinc-400',
          'focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100',
          'transition-colors duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error && 'border-red-600 dark:border-red-500 focus:ring-red-600 focus:border-red-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

