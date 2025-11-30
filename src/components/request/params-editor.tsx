import { useRequestStore } from '../../stores/use-request-store';
import { useP2PStore } from '../../stores/use-p2p-store';
import { KeyValueEditor } from '../ui/key-value-editor';

export const ParamsEditor = () => {
  const { params, setParams } = useRequestStore();
  const { setEditingField } = useP2PStore();

  return (
    <KeyValueEditor
      items={params}
      onChange={setParams}
      onFocus={() => setEditingField('params', true)}
      onBlur={() => setEditingField('params', false)}
      keyPlaceholder="Parameter name"
      valuePlaceholder="Value"
    />
  );
};

