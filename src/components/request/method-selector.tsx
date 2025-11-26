import { HttpMethod } from '../../utils/http';
import { cn } from '../../utils/cn';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  className?: string;
}

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700',
  POST: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600',
  PUT: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700',
  PATCH: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800',
  DELETE: 'bg-zinc-900 dark:bg-zinc-300 text-white dark:text-zinc-900 hover:bg-zinc-950 dark:hover:bg-zinc-200',
  HEAD: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700',
  OPTIONS: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800',
};

export const MethodSelector = ({ value, onChange, className }: MethodSelectorProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as HttpMethod)}
      className={cn(
        'px-3 py-2 text-sm font-medium rounded-lg',
        'border-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0',
        methodColors[value],
        className
      )}
    >
      {methods.map((method) => (
        <option key={method} value={method} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
          {method}
        </option>
      ))}
    </select>
  );
};

