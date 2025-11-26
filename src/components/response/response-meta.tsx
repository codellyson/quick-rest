import { HttpResponse } from '../../utils/http';
import { StatusBadge } from '../ui/status-badge';
import { cn } from '../../utils/cn';

interface ResponseMetaProps {
  response: HttpResponse;
}

export const ResponseMeta = ({ response }: ResponseMetaProps) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <StatusBadge status={response.status} />
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span>{response.time}ms</span>
        <span>•</span>
        <span>{formatSize(response.size)}</span>
        <span>•</span>
        <span>{Object.keys(response.headers).length} headers</span>
      </div>
    </div>
  );
};

