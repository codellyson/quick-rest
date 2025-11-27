import { DateTime } from 'luxon';
import { HistoryItem as HistoryItemType } from '../../stores/use-history-store';
import { StatusBadge } from '../ui/status-badge';
import { cn } from '../../utils/cn';

interface HistoryItemProps {
  item: HistoryItemType;
  onClick: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  POST: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  PUT: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  PATCH: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  DELETE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  HEAD: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
  OPTIONS: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
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
          'px-2.5 py-1 rounded-md text-xs font-medium shrink-0',
          methodColors[item.method] || 'bg-zinc-500 text-white'
        )}
      >
        {item.method}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
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

