'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-bg border border-border text-success',
  error: 'bg-bg border border-danger/30 text-danger',
  warning: 'bg-bg border border-warning/30 text-warning',
  info: 'bg-bg border border-border text-accent',
};

export const ToastItem = ({ toast, onClose }: ToastProps) => {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-md shadow-lg',
        'min-w-[280px] max-w-md',
        styles[toast.type],
        'animate-in slide-in-from-top-5'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-primary">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-muted hover:text-primary transition-colors"
        aria-label="Close toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
