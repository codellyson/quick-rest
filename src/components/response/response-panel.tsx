'use client';

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
          <Loader2 className="w-6 h-6 animate-spin text-muted" />
          <p className="text-sm text-secondary">Sending request…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full px-6">
        <p className="text-sm text-danger font-medium text-center">{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted">No response yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ResponseMeta response={response} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-border">
          {(['body', 'headers'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab
                  ? 'border-accent text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
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

