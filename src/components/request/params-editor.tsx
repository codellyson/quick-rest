import { useRequestStore } from '../../stores/use-request-store';
import { KeyValueEditor } from '../ui/key-value-editor';

export const ParamsEditor = () => {
  const { params, setParams } = useRequestStore();

  return (
    <KeyValueEditor
      items={params}
      onChange={setParams}
      keyPlaceholder="Parameter name"
      valuePlaceholder="Value"
    />
  );
};

