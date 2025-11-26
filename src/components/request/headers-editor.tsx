import { useRequestStore } from '../../stores/use-request-store';
import { KeyValueEditor } from '../ui/key-value-editor';

export const HeadersEditor = () => {
  const { headers, setHeaders } = useRequestStore();

  return (
    <KeyValueEditor
      items={headers}
      onChange={setHeaders}
      keyPlaceholder="Header name"
      valuePlaceholder="Value"
    />
  );
};

