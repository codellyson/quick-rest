'use client';

import { useRequestStore } from '../../stores/use-request-store';
import { useP2PStore } from '../../stores/use-p2p-store';
import { Input } from '../ui/input';
import { cn } from '../../utils/cn';

export const AuthConfig = () => {
  const { authType, authConfig, setAuthType, setAuthConfig } = useRequestStore();
  const { setEditingField } = useP2PStore();

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['none', 'bearer', 'basic', 'api-key'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setAuthType(type)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
              authType === type
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            )}
          >
            {type === 'api-key' ? 'API Key' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {authType === 'bearer' && (
        <Input
          label="Bearer Token"
          type="password"
          value={authConfig.bearerToken || ''}
          onChange={(e) => setAuthConfig({ bearerToken: e.target.value })}
          onFocus={() => setEditingField('authConfig', true)}
          onBlur={() => setEditingField('authConfig', false)}
          placeholder="Enter bearer token"
        />
      )}
      {authType === 'basic' && (
        <div className="space-y-3">
          <Input
            label="Username"
            value={authConfig.username || ''}
            onChange={(e) => setAuthConfig({ username: e.target.value })}
            onFocus={() => setEditingField('authConfig', true)}
            onBlur={() => setEditingField('authConfig', false)}
            placeholder="Enter username"
          />
          <Input
            label="Password"
            type="password"
            value={authConfig.password || ''}
            onChange={(e) => setAuthConfig({ password: e.target.value })}
            onFocus={() => setEditingField('authConfig', true)}
            onBlur={() => setEditingField('authConfig', false)}
            placeholder="Enter password"
          />
        </div>
      )}
      {authType === 'api-key' && (
        <div className="space-y-3">
          <Input
            label="API Key"
            type="password"
            value={authConfig.apiKey || ''}
            onChange={(e) => setAuthConfig({ apiKey: e.target.value })}
            onFocus={() => setEditingField('authConfig', true)}
            onBlur={() => setEditingField('authConfig', false)}
            placeholder="Enter API key"
          />
          <Input
            label="Header Name"
            value={authConfig.apiKeyHeader || 'X-API-Key'}
            onChange={(e) => setAuthConfig({ apiKeyHeader: e.target.value })}
            onFocus={() => setEditingField('authConfig', true)}
            onBlur={() => setEditingField('authConfig', false)}
            placeholder="X-API-Key"
          />
        </div>
      )}
    </div>
  );
};

