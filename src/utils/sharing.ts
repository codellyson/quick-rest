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
    // Exclude credentials from shared links when auth is configured
    authConfig: state.authType === 'none' ? state.authConfig : {},
  };

  const encoded = encodeURIComponent(JSON.stringify(config));
  return `${window.location.origin}/#share=${encoded}`;
};

export const loadConfigFromUrl = (): ShareableRequestConfig | null => {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  const shareMatch = hash.match(/^#share=([^&]+)/);
  if (!shareMatch) return null;

  try {
    const decoded = decodeURIComponent(shareMatch[1]);
    return JSON.parse(decoded) as ShareableRequestConfig;
  } catch (error) {
    console.error('Failed to decode shared request config:', error);
    return null;
  }
};

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
  setBodyType(config.bodyType as BodyType);
  setAuthType(config.authType as AuthType);
  setUrl(config.url);
  setBody(config.body || '');
  setParams(config.params || []);
  setHeaders(config.headers || []);
  setAuthConfig(config.authConfig || {});
};
