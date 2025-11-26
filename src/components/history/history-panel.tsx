import { useHistoryStore } from '../../stores/use-history-store';
import { useRequestStore } from '../../stores/use-request-store';
import { HistoryItem as HistoryItemComponent } from './history-item';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { HttpMethod } from '../../utils/http';

export const HistoryPanel = () => {
  const { items, clearAll } = useHistoryStore();
  const { setMethod, setUrl } = useRequestStore();

  const handleItemClick = (item: { method: HttpMethod; url: string }) => {
    setMethod(item.method as HttpMethod);
    setUrl(item.url);
  };

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
        <p className="text-sm">No history yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Recent Requests
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </Button>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <HistoryItemComponent
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

