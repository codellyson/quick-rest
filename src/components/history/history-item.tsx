import { DateTime } from 'luxon';
import { HistoryItem as HistoryItemType } from '../../stores/use-history-store';
import { StatusBadge } from '../ui/status-badge';
import { cn } from '../../utils/cn';

interface HistoryItemProps {
  item: HistoryItemType;
  onClick: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
  POST: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200',
  PUT: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
  PATCH: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500',
  DELETE: 'bg-zinc-900 dark:bg-zinc-300 text-white dark:text-zinc-900',
  HEAD: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500',
  OPTIONS: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-600',
};

export const HistoryItem = ({ item, onClick }: HistoryItemProps) => {
  const timeAgo = DateTime.fromMillis(item.timestamp).toRelative();

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg',
        'hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer',
        'transition-colors'
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'px-2.5 py-1 rounded-md text-xs font-medium',
          methodColors[item.method] || 'bg-zinc-500 text-white'
        )}
      >
        {item.method}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
          {item.url}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {timeAgo}
        </div>
      </div>
      <StatusBadge status={item.status} />
    </div>
  );
};

