'use client';

import { useRequestStore } from '../../stores/use-request-store';
import { Input } from '../ui/input';
import { cn } from '../../utils/cn';

export const AuthConfig = () => {
  const { authType, authConfig, setAuthType, setAuthConfig } = useRequestStore();

  return (
    <div className="space-y-3">
      <div className="inline-flex p-0.5 bg-bg-secondary rounded-md">
        {(['none', 'bearer', 'basic', 'api-key'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setAuthType(type)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              authType === type
                ? 'bg-bg text-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            )}
          >
            {type === 'api-key' ? 'API key' : type === 'none' ? 'None' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {authType === 'bearer' && (
        <Input
          label="Bearer Token"
          type="password"
          value={authConfig.bearerToken || ''}
          onChange={(e) => setAuthConfig({ bearerToken: e.target.value })}
          placeholder="Enter bearer token"
        />
      )}
      {authType === 'basic' && (
        <div className="space-y-3">
          <Input
            label="Username"
            value={authConfig.username || ''}
            onChange={(e) => setAuthConfig({ username: e.target.value })}
            placeholder="Enter username"
          />
          <Input
            label="Password"
            type="password"
            value={authConfig.password || ''}
            onChange={(e) => setAuthConfig({ password: e.target.value })}
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
            placeholder="Enter API key"
          />
          <Input
            label="Header Name"
            value={authConfig.apiKeyHeader || 'X-API-Key'}
            onChange={(e) => setAuthConfig({ apiKeyHeader: e.target.value })}
            placeholder="X-API-Key"
          />
        </div>
      )}
    </div>
  );
};
