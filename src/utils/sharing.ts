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
 */
export const generateShareableLink = (): string => {
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
  
  // Use hash to avoid URL length limits
  return `${baseUrl}#share=${encoded}`;
};

/**
 * Loads request configuration from URL hash
 */
export const loadConfigFromUrl = (): ShareableRequestConfig | null => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  const match = hash.match(/^#share=(.+)$/);
  
  if (!match) return null;
  
  try {
    const decoded = atob(match[1]);
    const config = JSON.parse(decoded) as ShareableRequestConfig;
    return config;
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

