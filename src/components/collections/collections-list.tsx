import {
  useCollectionsStore,
  CollectionItem,
} from "../../stores/use-collections-store";
import { useRequestStore } from "../../stores/use-request-store";
import { CollectionItem as CollectionItemComponent } from "./collection-item";
import { Button } from "../ui/button";
import {
  Plus,
  Search,
  FolderPlus,
  Inbox,
  ChevronRight,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableCollectionItemProps {
  item: CollectionItem;
  onClick: () => void;
  isActive: boolean;
}

const SortableCollectionItem = ({
  item,
  onClick,
  isActive,
}: SortableCollectionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `item-${item.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CollectionItemComponent
        item={item}
        onClick={onClick}
        isActive={isActive}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

interface DroppableFolderProps {
  folderId: string;
  isExpanded: boolean;
  folderName: string;
  itemCount: number;
  onToggle: () => void;
  onDelete: () => void;
  onAddItem: () => void;
  children?: React.ReactNode;
}

const DroppableFolder = ({
  folderId,
  isExpanded,
  folderName,
  itemCount,
  onToggle,
  onDelete,
  onAddItem,
  children,
}: DroppableFolderProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folderId}`,
  });

  return (
    <div className="space-y-1">
      <div
        ref={setNodeRef}
        className={cn(
          "group rounded-lg transition-all duration-150",
          isOver &&
            "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400"
        )}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="flex-1 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 px-2 py-1.5 flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="flex-1">{folderName}</span>
            <span className="text-zinc-400 dark:text-zinc-500">
              ({itemCount})
            </span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddItem();
            }}
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700"
            aria-label="Add item to folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 mr-1"
            aria-label="Delete folder"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

interface DroppableRootProps {
  children: React.ReactNode;
}

const DroppableRoot = ({ children }: DroppableRootProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "root",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[20px] rounded-lg transition-all duration-150 p-1",
        isOver &&
          "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-dashed ring-blue-500 dark:ring-blue-400"
      )}
    >
      {children}
    </div>
  );
};

export const CollectionsList = () => {
  const {
    items,
    folders,
    activeCollectionId,
    setActiveCollectionId,
    addFolder,
    updateItem,
    deleteFolder,
    setPendingFolderId,
  } = useCollectionsStore();

  const {
    reset,
    method,
    url,
    params,
    headers,
    bodyType,
    body,
    authType,
    authConfig,
    setMethod,
    setUrl,
    setParams,
    setHeaders,
    setBodyType,
    setBody,
    setAuthType,
    setAuthConfig,
  } = useRequestStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastExpandedRef = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const saved = localStorage.getItem("expanded-folders");
    const lastExpanded = localStorage.getItem("last-expanded-folder");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        const foldersSet = new Set<string>(parsed);
        setExpandedFolders(foldersSet);

        if (lastExpanded && parsed.includes(lastExpanded)) {
          lastExpandedRef.current = lastExpanded;
        } else if (parsed.length > 0) {
          lastExpandedRef.current = parsed[parsed.length - 1];
          if (!foldersSet.has(lastExpandedRef.current)) {
            foldersSet.add(lastExpandedRef.current);
            setExpandedFolders(new Set(foldersSet));
          }
        }
      } catch (e) {
        console.error("Failed to load expanded folders", e);
      }
    }
  }, []);

  useEffect(() => {
    const array = Array.from(expandedFolders);
    localStorage.setItem("expanded-folders", JSON.stringify(array));
    if (lastExpandedRef.current) {
      localStorage.setItem("last-expanded-folder", lastExpandedRef.current);
    }
  }, [expandedFolders]);

  const activeCollection = items.find((item) => item.id === activeCollectionId);

  const hasUnsavedChanges =
    activeCollection &&
    (activeCollection.method !== method ||
      activeCollection.url !== url ||
      JSON.stringify(activeCollection.params) !== JSON.stringify(params) ||
      JSON.stringify(activeCollection.headers) !== JSON.stringify(headers) ||
      activeCollection.bodyType !== bodyType ||
      activeCollection.body !== body ||
      activeCollection.authType !== authType ||
      JSON.stringify(activeCollection.authConfig) !==
        JSON.stringify(authConfig));

  const handleItemClick = (item: CollectionItem) => {
    if (hasUnsavedChanges && activeCollectionId !== item.id) {
      if (
        !confirm(
          "You have unsaved changes. Are you sure you want to switch collections?"
        )
      ) {
        return;
      }
    }
    setActiveCollectionId(item.id);
    setMethod(item.method);
    setUrl(item.url);
    setParams(item.params);
    setHeaders(item.headers);
    setBodyType(item.bodyType);
    setBody(item.body);
    setAuthType(item.authType);
    setAuthConfig(item.authConfig);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rootItems = filteredItems.filter((item) => !item.folderId);
  const rootFolders = folders.filter((folder) => !folder.parentId);

  const handleCreateNewRequest = () => {
    if (hasUnsavedChanges) {
      if (
        !confirm(
          "You have unsaved changes. Are you sure you want to start a new request?"
        )
      ) {
        return;
      }
    }
    reset();
    setActiveCollectionId(null);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const folderName = newFolderName.trim();
    addFolder({
      name: folderName,
    });
    setTimeout(() => {
      const newFolders = useCollectionsStore.getState().folders;
      const newFolder = newFolders.find(
        (f) => f.name === folderName && !f.parentId
      );
      if (newFolder) {
        setExpandedFolders((prev) => new Set(prev).add(newFolder.id));
      }
    }, 0);
    setNewFolderName("");
    setShowFolderInput(false);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
        lastExpandedRef.current = folderId;
      }
      return next;
    });
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    const folderItems = items.filter((item) => item.folderId === folderId);
    const itemCount = folderItems.length;

    const message =
      itemCount > 0
        ? `Delete folder "${folderName}"? This will also delete ${itemCount} item${itemCount > 1 ? "s" : ""} inside it. This cannot be undone.`
        : `Delete folder "${folderName}"? This cannot be undone.`;

    if (confirm(message)) {
      deleteFolder(folderId);
      setExpandedFolders((prev) => {
        const next = new Set(prev);
        next.delete(folderId);
        return next;
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    if (activeId.startsWith("item-")) {
      setActiveId(activeId.replace("item-", ""));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (!activeId.startsWith("item-")) return;

    const itemId = activeId.replace("item-", "");
    const draggedItem = items.find((item) => item.id === itemId);
    if (!draggedItem) return;

    if (overId.startsWith("folder-")) {
      const targetFolderId = overId.replace("folder-", "");
      if (draggedItem.folderId !== targetFolderId) {
        updateItem(itemId, { folderId: targetFolderId });
        setExpandedFolders((prev) => {
          const next = new Set(prev);
          next.add(targetFolderId);
          lastExpandedRef.current = targetFolderId;
          return next;
        });
      }
    } else if (overId === "root") {
      if (draggedItem.folderId) {
        updateItem(itemId, { folderId: undefined });
      }
    } else if (overId.startsWith("item-")) {
      const targetItemId = overId.replace("item-", "");
      const targetItem = items.find((item) => item.id === targetItemId);
      if (targetItem && draggedItem.folderId !== targetItem.folderId) {
        updateItem(itemId, { folderId: targetItem.folderId });
        if (targetItem.folderId) {
          setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.add(targetItem.folderId!);
            lastExpandedRef.current = targetItem.folderId!;
            return next;
          });
        }
      }
    }
  };

  useEffect(() => {
    if (lastExpandedRef.current) {
      setExpandedFolders((prev) => {
        const next = new Set(prev);
        next.add(lastExpandedRef.current!);
        return next;
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-2 border-b border-zinc-200 dark:border-zinc-900">
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateNewRequest}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFolderInput(!showFolderInput)}
            className="px-2"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>

        {showFolderInput && (
          <div className="flex gap-2">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") {
                  setShowFolderInput(false);
                  setNewFolderName("");
                }
              }}
              className="flex-1"
              autoFocus
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              Add
            </Button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {items.length === 0 && folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Inbox className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              No collections yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
              Create your first request collection to get started
            </p>
          </div>
        ) : filteredItems.length === 0 &&
          rootItems.length === 0 &&
          rootFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              No results found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-1">
              {rootFolders.map((folder) => {
                const allFolderItems = items.filter(
                  (item) => item.folderId === folder.id
                );
                const folderItems = filteredItems.filter(
                  (item) => item.folderId === folder.id
                );
                const isExpanded = expandedFolders.has(folder.id);

                return (
                  <DroppableFolder
                    key={folder.id}
                    folderId={folder.id}
                    isExpanded={isExpanded}
                    folderName={folder.name}
                    itemCount={allFolderItems.length}
                    onToggle={() => toggleFolder(folder.id)}
                    onDelete={() => handleDeleteFolder(folder.id, folder.name)}
                    onAddItem={() => {
                      setPendingFolderId(folder.id);
                      const event = new CustomEvent("openSaveModal", {
                        detail: { folderId: folder.id },
                      });
                      window.dispatchEvent(event);
                    }}
                  >
                    {isExpanded && (
                      <>
                        {folderItems.length > 0 ? (
                          <SortableContext
                            items={folderItems.map((item) => `item-${item.id}`)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="pl-4 space-y-1">
                              {folderItems.map((item) => (
                                <SortableCollectionItem
                                  key={item.id}
                                  item={item}
                                  onClick={() => handleItemClick(item)}
                                  isActive={activeCollectionId === item.id}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        ) : allFolderItems.length === 0 ? (
                          <div className="pl-4 py-2 text-xs text-zinc-400 dark:text-zinc-500 italic">
                            Empty folder
                          </div>
                        ) : (
                          <div className="pl-4 py-2 text-xs text-zinc-400 dark:text-zinc-500 italic">
                            No matching items
                          </div>
                        )}
                      </>
                    )}
                  </DroppableFolder>
                );
              })}
              <DroppableRoot>
                <SortableContext
                  items={rootItems.map((item) => `item-${item.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {rootItems.map((item) => (
                    <SortableCollectionItem
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      isActive={activeCollectionId === item.id}
                    />
                  ))}
                </SortableContext>
              </DroppableRoot>
            </div>
            <DragOverlay>
              {activeId ? (
                <div className="opacity-90 rotate-2 shadow-lg">
                  <CollectionItemComponent
                    item={items.find((i) => i.id === activeId)!}
                    onClick={() => {}}
                    isActive={false}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};
