'use client';

import { useRequestStore } from '../../stores/use-request-store';
import { KeyValueEditor } from '../ui/key-value-editor';

export const HeadersEditor = () => {
  const { headers, setHeaders } = useRequestStore();

  const recentHeaders = headers
    .map(h => h.key)
    .filter(Boolean)
    .filter((key, index, self) => self.indexOf(key) === index);

  return (
    <KeyValueEditor
      items={headers}
      onChange={setHeaders}
      keyPlaceholder="Header name"
      valuePlaceholder="Value"
      enableAutocomplete={true}
      suggestions={recentHeaders}
    />
  );
};
