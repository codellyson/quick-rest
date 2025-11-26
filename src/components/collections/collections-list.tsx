import { useCollectionsStore, CollectionItem } from '../../stores/use-collections-store';
import { useRequestStore } from '../../stores/use-request-store';
import { CollectionItem as CollectionItemComponent } from './collection-item';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateCollectionModal } from './create-collection-modal';

export const CollectionsList = () => {
  const { items, folders, setActiveCollectionId } = useCollectionsStore();
  const { reset, setMethod, setUrl, setParams, setHeaders, setBodyType, setBody, setAuthType, setAuthConfig } = useRequestStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleItemClick = (item: CollectionItem) => {
    reset();
    setMethod(item.method);
    setUrl(item.url);
    setParams(item.params);
    setHeaders(item.headers);
    setBodyType(item.bodyType);
    setBody(item.body);
    setAuthType(item.authType);
    setAuthConfig(item.authConfig);
    setActiveCollectionId(item.id);
  };

  const rootItems = items.filter((item) => !item.folderId);
  const rootFolders = folders.filter((folder) => !folder.parentId);

  return (
    <div className="p-4 space-y-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => setShowCreateModal(true)}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Request
      </Button>
      <div className="space-y-1 mt-4">
        {rootFolders.map((folder) => (
          <div key={folder.id} className="space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1">
              {folder.name}
            </div>
            {items
              .filter((item) => item.folderId === folder.id)
              .map((item) => (
                <CollectionItemComponent
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
          </div>
        ))}
        {rootItems.map((item) => (
          <CollectionItemComponent
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

