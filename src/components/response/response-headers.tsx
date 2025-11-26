import { HttpResponse } from '../../utils/http';
import { Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

interface ResponseHeadersProps {
  response: HttpResponse;
}

export const ResponseHeaders = ({ response }: ResponseHeadersProps) => {
  const handleCopy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(`${key}: ${value}`);
  };

  return (
    <div className="p-4">
      <div className="space-y-1">
        {Object.entries(response.headers).map(([key, value]) => (
          <div
            key={key}
            className="flex items-start gap-2 p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {key}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 break-all">
                {value}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(key, value)}
              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Copy header"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

