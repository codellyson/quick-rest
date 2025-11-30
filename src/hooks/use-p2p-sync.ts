import { useEffect, useRef } from 'react';
import { useRequestStore } from '../stores/use-request-store';
import { useP2PStore } from '../stores/use-p2p-store';
import { broadcastRequestConfig } from '../utils/p2p';

/**
 * Hook to sync request configuration changes via P2P
 * Uses different debounce times for different field types to prevent typing disruption
 */
export const useP2PSync = () => {
  const request = useRequestStore();
  const { connectionStatus, uiState } = useP2PStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastConfigRef = useRef<string>('');

  useEffect(() => {
    // Only sync if connected
    if (connectionStatus !== 'connected') {
      return;
    }

    // Create a snapshot of current config including UI state
    const currentConfig = JSON.stringify({
      method: request.method,
      url: request.url,
      params: request.params,
      headers: request.headers,
      bodyType: request.bodyType,
      body: request.body,
      authType: request.authType,
      authConfig: request.authConfig,
      uiState: {
        activeTab: uiState.activeTab,
        panelWidth: uiState.panelWidth,
      },
    });

    // Skip if config hasn't changed
    if (currentConfig === lastConfigRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Determine debounce time based on field type
    // Text-heavy fields (body, url) need longer debounce to avoid disruption
    // Non-text fields (method, bodyType, authType) can sync immediately
    let debounceTime = 500; // Default
    
    // Check which field changed by comparing with last config
    const lastConfig = lastConfigRef.current ? JSON.parse(lastConfigRef.current) : {};
    
    if (request.body !== lastConfig.body) {
      // Body is text-heavy, use longer debounce
      debounceTime = 1500;
    } else if (request.url !== lastConfig.url) {
      // URL can be long, use medium debounce
      debounceTime = 1000;
    } else if (request.params !== lastConfig.params || request.headers !== lastConfig.headers) {
      // Key-value pairs, medium debounce
      debounceTime = 800;
    } else if (request.method !== lastConfig.method || 
               request.bodyType !== lastConfig.bodyType || 
               request.authType !== lastConfig.authType) {
      // Non-text fields, sync quickly
      debounceTime = 200;
    } else if (uiState.activeTab !== lastConfig.uiState?.activeTab ||
               uiState.panelWidth !== lastConfig.uiState?.panelWidth) {
      // UI state changes sync immediately
      debounceTime = 100;
    }

    // Debounce broadcasts
    timeoutRef.current = setTimeout(() => {
      broadcastRequestConfig();
      lastConfigRef.current = currentConfig;
    }, debounceTime);

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
    uiState.activeTab,
    uiState.panelWidth,
    connectionStatus,
  ]);
};

