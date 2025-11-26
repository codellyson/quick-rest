import { Trash2, MoreVertical } from 'lucide-react';
import { CollectionItem as CollectionItemType } from '../../stores/use-collections-store';
import { StatusBadge } from '../ui/status-badge';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import { useCollectionsStore } from '../../stores/use-collections-store';

interface CollectionItemProps {
  item: CollectionItemType;
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

export const CollectionItem = ({ item, onClick }: CollectionItemProps) => {
  const { deleteItem } = useCollectionsStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={cn(
        'group flex items-center gap-2 p-2 rounded-lg',
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
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {item.name}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {item.url}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            deleteItem(item.id);
          }}
          className="w-6 h-6 p-0"
          aria-label="Delete request"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

