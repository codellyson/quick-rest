import { useEffect, useRef } from 'react';
import { useRequestStore } from '../stores/use-request-store';
import { useP2PStore } from '../stores/use-p2p-store';
import { broadcastRequestConfig } from '../utils/p2p';

/**
 * Hook to sync request configuration changes via P2P
 * Debounces changes to avoid excessive broadcasts
 */
export const useP2PSync = () => {
  const request = useRequestStore();
  const { connectionStatus } = useP2PStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastConfigRef = useRef<string>('');

  useEffect(() => {
    // Only sync if connected
    if (connectionStatus !== 'connected') {
      return;
    }

    // Create a snapshot of current config
    const currentConfig = JSON.stringify({
      method: request.method,
      url: request.url,
      params: request.params,
      headers: request.headers,
      bodyType: request.bodyType,
      body: request.body,
      authType: request.authType,
      authConfig: request.authConfig,
    });

    // Skip if config hasn't changed
    if (currentConfig === lastConfigRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce broadcasts (wait 500ms after last change)
    timeoutRef.current = setTimeout(() => {
      broadcastRequestConfig();
      lastConfigRef.current = currentConfig;
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    request.method,
    request.url,
    request.params,
    request.headers,
    request.bodyType,
    request.body,
    request.authType,
    request.authConfig,
    connectionStatus,
  ]);
};

