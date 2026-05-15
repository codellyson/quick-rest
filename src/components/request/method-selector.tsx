import { HttpMethod } from '../../utils/http';
import { cn } from '../../utils/cn';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  className?: string;
}

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const methodPillColor: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  POST: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  PUT: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  PATCH: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  DELETE: 'bg-red-500/10 text-red-700 dark:text-red-400',
  HEAD: 'bg-bg-secondary text-muted',
  OPTIONS: 'bg-bg-secondary text-muted',
};

export const MethodSelector = ({ value, onChange, className }: MethodSelectorProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as HttpMethod)}
      className={cn(
        'px-2.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-accent',
        methodPillColor[value],
        className
      )}
    >
      {methods.map((method) => (
        <option key={method} value={method} className="bg-bg text-primary">
          {method}
        </option>
      ))}
    </select>
  );
};
