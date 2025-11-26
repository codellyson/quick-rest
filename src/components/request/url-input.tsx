import { useRequestStore } from '../../stores/use-request-store';
import { useEnvironmentStore } from '../../stores/use-environment-store';
import { extractVariables } from '../../utils/variables';
import { Input } from '../ui/input';
import { cn } from '../../utils/cn';

export const URLInput = () => {
  const { url, setUrl } = useRequestStore();
  const { getVariables } = useEnvironmentStore();
  const variables = getVariables();
  const extractedVars = extractVariables(url);

  return (
    <div className="flex-1 relative">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://api.example.com/users"
        className={cn(
          'font-mono text-sm',
          'pr-4'
        )}
      />
      {extractedVars.length > 0 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {extractedVars.map((varName) => (
            <span
              key={varName}
              className={cn(
                'px-1.5 py-0.5 text-xs rounded',
                variables[varName]
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500'
              )}
              title={variables[varName] ? `Value: ${variables[varName]}` : 'Variable not set'}
            >
              {`{{${varName}}}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

