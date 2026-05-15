import { HistoryItem as HistoryItemType } from '../../stores/use-history-store';
import { StatusBadge } from '../ui/status-badge';
import { cn } from '../../utils/cn';
import { methodPillColor } from '../request/method-selector';
import { HttpMethod } from '../../utils/http';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const formatRelative = (timestamp: number): string => {
  const diffSec = Math.round((timestamp - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  return rtf.format(Math.round(diffSec / 86400), 'day');
};

interface HistoryItemProps {
  item: HistoryItemType;
  onClick: () => void;
}

export const HistoryItem = ({ item, onClick }: HistoryItemProps) => {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-bg-secondary transition-colors"
      onClick={onClick}
    >
      <span
        className={cn(
          'px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0',
          methodPillColor[item.method as HttpMethod] || 'bg-bg-secondary text-muted'
        )}
      >
        {item.method}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-primary truncate font-mono">{item.url}</div>
        <div className="text-xs text-muted">{formatRelative(item.timestamp)}</div>
      </div>
      <StatusBadge status={item.status} />
    </div>
  );
};
