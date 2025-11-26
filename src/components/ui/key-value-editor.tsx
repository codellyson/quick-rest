import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../../utils/cn';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  className?: string;
}

export const KeyValueEditor = ({
  items,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  className,
}: KeyValueEditorProps) => {
  const updateItem = (id: string, updates: Partial<KeyValuePair>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: Date.now().toString(),
        key: '',
        value: '',
        enabled: true,
      },
    ]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>{keyPlaceholder}</div>
        <div>{valuePlaceholder}</div>
        <div className="text-center">Enabled</div>
        <div></div>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center"
        >
          <Input
            value={item.key}
            onChange={(e) => updateItem(item.id, { key: e.target.value })}
            placeholder={keyPlaceholder}
            className="text-sm"
          />
          <Input
            value={item.value}
            onChange={(e) => updateItem(item.id, { value: e.target.value })}
            placeholder={valuePlaceholder}
            className="text-sm"
          />
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) =>
                updateItem(item.id, { enabled: e.target.checked })
              }
              className="w-4 h-4 text-zinc-900 dark:text-zinc-100 rounded focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="w-8 h-8 p-0"
            aria-label="Remove row"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Row
      </Button>
    </div>
  );
};

