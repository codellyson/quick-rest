import { HttpResponse } from '../../utils/http';
import { StatusBadge } from '../ui/status-badge';

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
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-bg-secondary">
      <StatusBadge status={response.status} />
      <div className="flex items-center gap-2 text-xs text-secondary">
        <span>{response.time}ms</span>
        <span className="text-muted">·</span>
        <span>{formatSize(response.size)}</span>
        <span className="text-muted">·</span>
        <span>{Object.keys(response.headers).length} headers</span>
      </div>
    </div>
  );
};
