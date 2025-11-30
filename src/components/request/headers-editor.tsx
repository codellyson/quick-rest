import { useRequestStore } from '../../stores/use-request-store';
import { useP2PStore } from '../../stores/use-p2p-store';
import { KeyValueEditor } from '../ui/key-value-editor';

export const HeadersEditor = () => {
  const { headers, setHeaders } = useRequestStore();
  const { setEditingField } = useP2PStore();

  // Get recently used headers from existing items
  const recentHeaders = headers
    .map(h => h.key)
    .filter(Boolean)
    .filter((key, index, self) => self.indexOf(key) === index);

  return (
    <KeyValueEditor
      items={headers}
      onChange={setHeaders}
      onFocus={() => setEditingField('headers', true)}
      onBlur={() => setEditingField('headers', false)}
      keyPlaceholder="Header name"
      valuePlaceholder="Value"
      enableAutocomplete={true}
      suggestions={recentHeaders}
    />
  );
};

