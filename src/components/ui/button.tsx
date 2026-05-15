import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'border border-border bg-bg text-primary hover:bg-bg-secondary',
    danger: 'bg-danger text-white hover:bg-danger/90',
    ghost: 'text-secondary hover:bg-bg-secondary hover:text-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
