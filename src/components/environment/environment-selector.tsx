'use client';

import { useEnvironmentStore } from '../../stores/use-environment-store';

export const EnvironmentSelector = () => {
  const { environments, activeEnvironmentId, setActiveEnvironmentId } = useEnvironmentStore();

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-secondary">Environment</label>
      <select
        value={activeEnvironmentId || ''}
        onChange={(e) => setActiveEnvironmentId(e.target.value)}
        className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-bg text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
      >
        {environments.map((env) => (
          <option key={env.id} value={env.id}>
            {env.name}
          </option>
        ))}
      </select>
    </div>
  );
};
