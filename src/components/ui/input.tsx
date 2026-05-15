import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id: providedId, ...props }, ref) => {
    const id = providedId || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-primary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 rounded-md border text-sm text-primary bg-bg placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-danger focus:ring-danger' : 'border-border',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && errorId ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
