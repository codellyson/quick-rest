import { useEnvironmentStore } from '../../stores/use-environment-store';
import { cn } from '../../utils/cn';

export const EnvironmentSelector = () => {
  const { environments, activeEnvironmentId, setActiveEnvironmentId } = useEnvironmentStore();

  // const activeEnv = environments.find((env) => env.id === activeEnvironmentId);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Environment
      </label>
      <select
        value={activeEnvironmentId || ''}
        onChange={(e) => setActiveEnvironmentId(e.target.value)}
        className={cn(
          'w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg',
          'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
          'focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100',
          'transition-colors duration-150'
        )}
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

