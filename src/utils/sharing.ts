import { AuthType, BodyType, useRequestStore } from '../stores/use-request-store';
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
}

/**
 * Serializes the current request configuration to a shareable URL
 * If peerId is provided, includes it for auto-join P2P connection
 */
export const generateShareableLink = (peerId?: string): string => {
  const state = useRequestStore.getState();
  
  const config: ShareableRequestConfig = {
    method: state.method,
    url: state.url,
    params: state.params,
    headers: state.headers,
    bodyType: state.bodyType,
    body: state.body,
    authType: state.authType,
    authConfig: state.authConfig,
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

  setMethod(config.method as unknown as HttpMethod);
  setUrl(config.url);
  setParams(config.params || []);
  setHeaders(config.headers || []);
  setBodyType(config.bodyType as BodyType);
  setBody(config.body || '');
  setAuthType(config.authType as AuthType);
  setAuthConfig(config.authConfig || {});
};

