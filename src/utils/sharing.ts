import { AuthType, BodyType, useRequestStore } from '../stores/use-request-store';
import { useP2PStore } from '../stores/use-p2p-store';
import { KeyValuePair } from '../components/ui/key-value-editor';
import { HttpMethod } from './http';

export interface ShareableRequestConfig {
  method: string;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: string;
  body: string;
  authType: string;
  authConfig: {
    bearerToken?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  uiState?: {
    activeTab?: 'params' | 'headers' | 'body' | 'auth';
    panelWidth?: number | null;
  };
}

/**
 * Serializes the current request configuration to a shareable URL
 * If peerId is provided, includes it for auto-join P2P connection
 * Excludes auth config when authentication is added (to protect sensitive data)
 */
export const generateShareableLink = (peerId?: string): string => {
  const state = useRequestStore.getState();
  const { uiState } = useP2PStore.getState();
  
  const config: ShareableRequestConfig = {
    method: state.method,
    url: state.url,
    params: state.params,
    headers: state.headers,
    bodyType: state.bodyType,
    body: state.body,
    authType: state.authType,
    // Only share auth config if no authentication is set (authType === 'none')
    // Once auth is added, exclude sensitive credentials from sharing
    authConfig: state.authType === 'none' ? state.authConfig : {},
    uiState: {
      activeTab: uiState.activeTab,
      panelWidth: uiState.panelWidth,
    },
  };

  // Encode the config as base64 JSON
  const encoded = btoa(JSON.stringify(config));
  
  // Always point to /app route for sharing
  const baseUrl = window.location.origin + '/app';
  
  // Include peer ID if provided for auto-join
  if (peerId) {
    return `${baseUrl}#share=${encoded}&peer=${peerId}`;
  }
  
  // Use hash to avoid URL length limits
  return `${baseUrl}#share=${encoded}`;
};

/**
 * Loads request configuration and peer ID from URL hash
 */
export const loadConfigFromUrl = (): { config: ShareableRequestConfig; peerId?: string } | null => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  // Match both share=config and optional peer=peerId
  // Format: #share=base64config&peer=peerId or #share=base64config
  const shareMatch = hash.match(/^#share=([^&]+)/);
  
  if (!shareMatch) return null;
  
  try {
    const decoded = atob(shareMatch[1]);
    const config = JSON.parse(decoded) as ShareableRequestConfig;
    
    // Extract peer ID if present
    const peerMatch = hash.match(/&peer=([^&]+)/);
    const peerId = peerMatch ? peerMatch[1] : undefined;
    
    return { config, peerId };
  } catch (error) {
    console.error('Failed to decode shared request config:', error);
    return null;
  }
};
    
/**
 * Applies a shared request configuration to the store
 * Skips fields that are currently being edited to prevent typing disruption
 */
export const applySharedConfig = (config: ShareableRequestConfig): void => {
  const {
    setMethod,
    setUrl,
    setParams,
    setHeaders,
    setBodyType,
    setBody,
    setAuthType,
    setAuthConfig,
  } = useRequestStore.getState();
  
  // Check editing state to prevent disrupting active typing
  const { isFieldEditing } = useP2PStore.getState();

  // Always update method and types (non-text fields)
  setMethod(config.method as unknown as HttpMethod);
  setBodyType(config.bodyType as BodyType);
  setAuthType(config.authType as AuthType);
  
  // Only update text fields if not currently being edited
  if (!isFieldEditing('url')) {
    setUrl(config.url);
  }
  
  if (!isFieldEditing('body')) {
    setBody(config.body || '');
  }
  
  if (!isFieldEditing('params')) {
    setParams(config.params || []);
  }
  
  if (!isFieldEditing('headers')) {
    setHeaders(config.headers || []);
  }
  
  if (!isFieldEditing('authConfig')) {
    setAuthConfig(config.authConfig || {});
  }
  
  // Apply UI state if provided
  if (config.uiState) {
    const { setUIState } = useP2PStore.getState();
    setUIState(config.uiState);
  }
};

