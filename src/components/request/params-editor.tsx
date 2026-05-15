'use client';

import { useRequestStore } from '../../stores/use-request-store';
import { KeyValueEditor } from '../ui/key-value-editor';

export const ParamsEditor = () => {
  const { params, setParams } = useRequestStore();

  const recentParams = params
    .map(p => p.key)
    .filter(Boolean)
    .filter((key, index, self) => self.indexOf(key) === index);

  return (
    <KeyValueEditor
      items={params}
      onChange={setParams}
      keyPlaceholder="Parameter name"
      valuePlaceholder="Value"
      enableAutocomplete={true}
      suggestions={recentParams}
    />
  );
};
