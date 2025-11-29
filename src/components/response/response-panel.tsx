import { useState } from 'react';
import { useResponseStore } from '../../stores/use-response-store';
import { ResponseMeta } from './response-meta';
import { ResponseBody } from './response-body';
import { ResponseHeaders } from './response-headers';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

type Tab = 'body' | 'headers';

export const ResponsePanel = () => {
  const { response, loading, error } = useResponseStore();
  const [activeTab, setActiveTab] = useState<Tab>('body');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Sending request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 dark:text-zinc-400">No response yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ResponseMeta response={response} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          {(['body', 'headers'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2',
                activeTab === tab
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          {activeTab === 'body' && <ResponseBody response={response} />}
          {activeTab === 'headers' && <ResponseHeaders response={response} />}
        </div>
      </div>
    </div>
  );
};

