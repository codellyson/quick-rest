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

type CompactKV = { k: string; v?: string };
type CompactWire = {
  m?: string;            // method (omitted when GET)
  u: string;             // url
  p?: CompactKV[];       // params
  h?: CompactKV[];       // headers
  bt?: string;           // bodyType (omitted when none)
  b?: string;            // body
  at?: string;           // authType (omitted when none)
  ac?: ShareableRequestConfig['authConfig'];
};

const compactKVs = (items: KeyValuePair[]): CompactKV[] =>
  items
    .filter((it) => it.enabled && it.key)
    .map((it) => (it.value ? { k: it.key, v: it.value } : { k: it.key }));

const expandKVs = (items: CompactKV[] | undefined): KeyValuePair[] =>
  (items || []).map((it, i) => ({
    id: String(i + 1),
    key: it.k,
    value: it.v || '',
    enabled: true,
  }));

const compact = (cfg: ShareableRequestConfig): CompactWire => {
  const wire: CompactWire = { u: cfg.url };
  if (cfg.method && cfg.method !== 'GET') wire.m = cfg.method;
  const params = compactKVs(cfg.params);
  if (params.length) wire.p = params;
  const headers = compactKVs(cfg.headers);
  if (headers.length) wire.h = headers;
  if (cfg.bodyType && cfg.bodyType !== 'none') wire.bt = cfg.bodyType;
  if (cfg.body) wire.b = cfg.body;
  if (cfg.authType && cfg.authType !== 'none') wire.at = cfg.authType;
  if (cfg.authConfig && Object.keys(cfg.authConfig).length > 0) {
    wire.ac = cfg.authConfig;
  }
  return wire;
};

const expand = (wire: CompactWire): ShareableRequestConfig => ({
  method: wire.m || 'GET',
  url: wire.u || '',
  params: expandKVs(wire.p),
  headers: expandKVs(wire.h),
  bodyType: wire.bt || 'none',
  body: wire.b || '',
  authType: wire.at || 'none',
  authConfig: wire.ac || {},
});

const toBase64Url = (str: string): string => {
  const b64 = typeof btoa === 'function'
    ? btoa(unescape(encodeURIComponent(str)))
    : Buffer.from(str, 'utf-8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (str: string): string => {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return typeof atob === 'function'
    ? decodeURIComponent(escape(atob(padded)))
    : Buffer.from(padded, 'base64').toString('utf-8');
};

function currentWire(): { config: ShareableRequestConfig; wire: CompactWire } {
  const state = useRequestStore.getState();
  const config: ShareableRequestConfig = {
    method: state.method,
    url: state.url,
    params: state.params,
    headers: state.headers,
    bodyType: state.bodyType,
    body: state.body,
    authType: state.authType,
    authConfig: state.authType === 'none' ? state.authConfig : {},
  };
  return { config, wire: compact(config) };
}

function fragmentLink(wire: CompactWire): string {
  return `${window.location.origin}/playground#s=${toBase64Url(JSON.stringify(wire))}`;
}

/**
 * Tries the share API first for a short `?s=ID` URL on the playground.
 * Falls back to a self-contained fragment URL on any failure (offline,
 * API down, no storage configured), so the user always gets a working
 * link.
 *
 * Accepts an optional `config` so any caller — not just the legacy
 * draft store — can produce a share link. With no argument it reads the
 * current legacy draft as before, preserving existing call sites.
 */
export const generateShareableLink = async (
  config?: ShareableRequestConfig
): Promise<string> => {
  const wire = config ? compact(config) : currentWire().wire;
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wire),
    });
    if (res.ok) {
      const { id } = (await res.json()) as { id?: string };
      if (id) return `${window.location.origin}/playground?s=${id}`;
    }
  } catch {
    /* fall through */
  }
  return fragmentLink(wire);
};

export const loadConfigFromUrl = async (): Promise<ShareableRequestConfig | null> => {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const shareId = url.searchParams.get('s');
  if (shareId) {
    try {
      const res = await fetch(`/api/share/${encodeURIComponent(shareId)}`);
      if (res.ok) {
        const wire = (await res.json()) as CompactWire;
        return expand(wire);
      }
    } catch (error) {
      console.error('Failed to fetch shared request:', error);
    }
    return null;
  }

  const hash = window.location.hash;
  const compactMatch = hash.match(/^#s=([^&]+)/);
  const legacyMatch = hash.match(/^#share=([^&]+)/);
  try {
    if (compactMatch) {
      const json = fromBase64Url(compactMatch[1]);
      const wire = JSON.parse(json) as CompactWire;
      return expand(wire);
    }
    if (legacyMatch) {
      const decoded = decodeURIComponent(legacyMatch[1]);
      return JSON.parse(decoded) as ShareableRequestConfig;
    }
  } catch (error) {
    console.error('Failed to decode shared request config:', error);
  }
  return null;
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
