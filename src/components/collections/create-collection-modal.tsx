import { useState } from "react";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCollectionsStore } from "../../stores/use-collections-store";
import { useRequestStore } from "../../stores/use-request-store";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCollectionModal = ({
  isOpen,
  onClose,
}: CreateCollectionModalProps) => {
  const { addItem } = useCollectionsStore();
  const { method, url, params, headers, bodyType, body, authType, authConfig } =
    useRequestStore();
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    addItem({
      name,
      method,
      url,
      params,
      headers,
      bodyType,
      body,
      authType,
      authConfig: authConfig as Record<string, string>,
    });
    setName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Request" size="sm">
      <div className="space-y-3">
        <Input
          label="Request Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My API Request"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
