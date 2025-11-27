import { useHistoryStore } from '../../stores/use-history-store';
import { useRequestStore } from '../../stores/use-request-store';
import { HistoryItem as HistoryItemComponent } from './history-item';
import { Button } from '../ui/button';
import { Trash2, Clock } from 'lucide-react';
import { HttpMethod } from '../../utils/http';

export const HistoryPanel = () => {
  const { items, clearAll } = useHistoryStore();
  const { setMethod, setUrl } = useRequestStore();

  const handleItemClick = (item: { method: HttpMethod; url: string }) => {
    setMethod(item.method as HttpMethod);
    setUrl(item.url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Recent Requests
          </h3>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Clock className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              No history yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
              Your request history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <HistoryItemComponent
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

