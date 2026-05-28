import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: number;
  text?: string;
  className?: string;
}

const getStatusStyles = (code: number) => {
  if (code === 0) return 'bg-danger/10 text-danger';
  if (code >= 200 && code < 300) return 'bg-success/10 text-success';
  if (code >= 300 && code < 400) return 'bg-accent/10 text-accent';
  if (code >= 400 && code < 500) return 'bg-warning/10 text-warning';
  if (code >= 500) return 'bg-danger/10 text-danger';
  return 'bg-bg-secondary text-muted';
};

export const StatusBadge = ({ status, text, className }: StatusBadgeProps) => {
  // Status 0 is the "no real response" case (network error, abort, CORS,
  // etc.). Rendering it as a literal `0` reads like "zero failures" and
  // looks broken next to a real status code. Surface a label instead.
  const label =
    text !== undefined
      ? text
      : status === 0
      ? 'Failed'
      : String(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        getStatusStyles(status),
        className
      )}
    >
      {label}
    </span>
  );
};
