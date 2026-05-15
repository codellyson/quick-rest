'use client';

import { Trash2, Copy, Edit2 } from "lucide-react";
import { CollectionItem as CollectionItemType } from "../../stores/use-collections-store";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { useCollectionsStore } from "../../stores/use-collections-store";
import { useState } from "react";
import { methodPillColor } from "../request/method-selector";

interface CollectionItemProps {
  item: CollectionItemType;
  onClick: () => void;
  isActive?: boolean;
}

export const CollectionItem = ({
  item,
  onClick,
  isActive,
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
        "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
        isActive ? "bg-accent/10" : "hover:bg-bg-secondary"
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0",
          methodPillColor[item.method] || "bg-bg-secondary text-muted"
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
            className="text-sm text-primary bg-bg border border-border rounded-md px-1.5 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
        ) : (
          <div className="text-sm text-primary truncate">{item.name}</div>
        )}
        <div className="text-xs text-muted truncate font-mono">
          {item.url || "—"}
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRename(e);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-7 h-7 p-0"
          aria-label="Rename request"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicate(e);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-7 h-7 p-0"
          aria-label="Duplicate request"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            deleteItem(item.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-7 h-7 p-0 text-danger hover:text-danger hover:bg-danger/10"
          aria-label="Delete request"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
