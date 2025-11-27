import { Trash2, Copy, Edit2, CircleDot, GripVertical } from "lucide-react";
import { CollectionItem as CollectionItemType } from "../../stores/use-collections-store";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { useCollectionsStore } from "../../stores/use-collections-store";
import { useState } from "react";

interface CollectionItemProps {
  item: CollectionItemType;
  onClick: () => void;
  isActive?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

const methodColors: Record<string, string> = {
  GET: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  POST: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  PUT: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  PATCH:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  DELETE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  HEAD: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
  OPTIONS: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
};

export const CollectionItem = ({
  item,
  onClick,
  isActive,
  dragHandleProps,
}: CollectionItemProps) => {
  const { deleteItem, addItem, updateItem } = useCollectionsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      name: `${item.name} (Copy)`,
      method: item.method,
      url: item.url,
      params: item.params,
      headers: item.headers,
      bodyType: item.bodyType,
      body: item.body,
      authType: item.authType,
      authConfig: item.authConfig,
      folderId: item.folderId,
    });
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    if (editName.trim()) {
      updateItem(item.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      setEditName(item.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg relative",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        "transition-colors border-l-3",
        isActive
          ? "bg-blue-50 dark:bg-blue-950/20 border-l-blue-600 dark:border-l-blue-500"
          : "border-l-transparent"
      )}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-l-lg" />
      )}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-100 transition-opacity touch-none"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </div>
      )}
      <span
        className={cn(
          "px-2.5 py-1 rounded-md text-xs font-medium shrink-0",
          methodColors[item.method] || "bg-zinc-500 text-white"
        )}
      >
        {item.method}
      </span>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-1 w-full focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {item.name}
            </div>
            {isActive && (
              <CircleDot className="w-3 h-3 text-blue-600 dark:text-blue-500 shrink-0" />
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {item.url}
          </div>
          {item.updatedAt !== item.createdAt && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
              • {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRename(e);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-6 h-6 p-0"
          aria-label="Rename request"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicate(e);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-6 h-6 p-0"
          aria-label="Duplicate request"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            deleteItem(item.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
          aria-label="Delete request"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
