import { useEffect } from 'react';
import { useAppStore } from '../../stores/use-app-store';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { RequestTabs } from '../request/request-tabs';
import { ResponsePanel } from '../response/response-panel';
import { ToastContainer } from '../ui/toast';
import { useToastStore } from '../../stores/use-toast-store';

export const AppLayout = () => {
  const { theme } = useAppStore();
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <RequestTabs className="flex-1" />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <ResponsePanel />
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

