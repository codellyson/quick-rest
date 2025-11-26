import { Send, Save } from 'lucide-react';
import { useRequestStore } from '../../stores/use-request-store';
import { useRequest } from '../../hooks/use-request';
import { useResponseStore } from '../../stores/use-response-store';
import { MethodSelector } from '../request/method-selector';
import { URLInput } from '../request/url-input';
import { Button } from '../ui/button';
import { useCollectionsStore } from '../../stores/use-collections-store';
import { useState } from 'react';
import { Modal } from '../ui/modal';
import { Input } from '../ui/input';

export const TopBar = () => {
  const { send } = useRequest();
  const { loading } = useResponseStore();
  const { method, url, params, headers, bodyType, body, authType, authConfig, setMethod } = useRequestStore();
  const { addItem } = useCollectionsStore();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [requestName, setRequestName] = useState('');

  const handleSave = () => {
    if (!requestName.trim()) return;
    addItem({
      name: requestName,
      method,
      url,
      params,
      headers,
      bodyType,
      body,
      authType,
      authConfig: authConfig as Record<string, string>,
    });
    setShowSaveModal(false);
    setRequestName('');
  };

  return (
    <>
      <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <MethodSelector value={method} onChange={setMethod} />
        <URLInput />
        <Button
          variant="primary"
          onClick={send}
          disabled={loading || !url.trim()}
        >
          <Send className="w-4 h-4" />
          Send
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowSaveModal(true)}
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Request"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Request Name"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            placeholder="My API Request"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowSaveModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!requestName.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

