import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: number;
  text?: string;
  className?: string;
}

export const StatusBadge = ({ status, text, className }: StatusBadgeProps) => {
  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) {
      return 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900';
    }
    if (code >= 300 && code < 400) {
      return 'bg-zinc-500 text-white';
    }
    if (code >= 400 && code < 500) {
      return 'bg-zinc-600 text-white';
    }
    if (code >= 500) {
      return 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900';
    }
    return 'bg-zinc-500 text-white';
  };

  return (
    <span
      className={cn(
        'px-2.5 py-1 rounded-md text-xs font-medium',
        getStatusColor(status),
        className
      )}
    >
      {text || status}
    </span>
  );
};

