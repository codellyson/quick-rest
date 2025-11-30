'use client';

import { Send, Save, Edit, AlertCircle, Share2, Check, Loader2 } from "lucide-react";
import { useRequestStore } from "../../stores/use-request-store";
import { useRequest } from "../../hooks/use-request";
import { useResponseStore } from "../../stores/use-response-store";
import { MethodSelector } from "../request/method-selector";
import { URLInput } from "../request/url-input";
import { Button } from "../ui/button";
import { useCollectionsStore } from "../../stores/use-collections-store";
import { useState, useMemo, useEffect } from "react";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn";
import { generateShareableLink } from "../../utils/sharing";
import { useToastStore } from "../../stores/use-toast-store";
import { useP2PStore } from "../../stores/use-p2p-store";
import { ConnectionIndicator } from "../p2p/connection-indicator";

export const TopBar = () => {
  const { send } = useRequest();
  const { loading } = useResponseStore();
  const { showToast } = useToastStore();
  const {
    method,
    url,
    params,
    headers,
    bodyType,
    body,
    authType,
    authConfig,
    setMethod,
  } = useRequestStore();
  const {
    addItem,
    updateItem,
    items,
    activeCollectionId,
    folders,
    pendingFolderId,
    setPendingFolderId,
  } = useCollectionsStore();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [requestName, setRequestName] = useState(
    useRequestStore.getState().url
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined
  );
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const { connectionStatus } = useP2PStore();

  useEffect(() => {
    const handleOpenSaveModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ folderId?: string }>;
      const folderId = customEvent.detail?.folderId || pendingFolderId;

      if (folderId) {
        setSelectedFolderId(folderId);
        setRequestName(url || "");
        setSaveAsNew(false);
        setShowSaveModal(true);
        setPendingFolderId(null);
      }
    };

    window.addEventListener("openSaveModal", handleOpenSaveModal);
    return () => {
      window.removeEventListener("openSaveModal", handleOpenSaveModal);
    };
  }, [pendingFolderId, url, setPendingFolderId]);

  const activeCollection = items.find((item) => item.id === activeCollectionId);

  const hasUnsavedChanges = useMemo(() => {
    if (!activeCollection) return false;

    return (
      activeCollection.method !== method ||
      activeCollection.url !== url ||
      JSON.stringify(activeCollection.params) !== JSON.stringify(params) ||
      JSON.stringify(activeCollection.headers) !== JSON.stringify(headers) ||
      activeCollection.bodyType !== bodyType ||
      activeCollection.body !== body ||
      activeCollection.authType !== authType ||
      JSON.stringify(activeCollection.authConfig) !== JSON.stringify(authConfig)
    );
  }, [
    activeCollection,
    method,
    url,
    params,
    headers,
    bodyType,
    body,
    authType,
    authConfig,
  ]);

  const hasDuplicate = useMemo(() => {
    if (!showSaveModal || !url.trim()) return false;
    return items.some(
      (item) =>
        item.id !== activeCollectionId &&
        item.method === method &&
        item.url === url
    );
  }, [items, activeCollectionId, method, url, showSaveModal]);

  const handleSave = () => {
    if (!requestName.trim()) return;

    if (activeCollectionId && activeCollection && !saveAsNew) {
      updateItem(activeCollectionId, {
        name: requestName,
        method,
        url,
        params,
        headers,
        bodyType,
        body,
        authType,
        authConfig: authConfig as Record<string, string>,
        folderId: selectedFolderId || activeCollection.folderId,
      });
    } else {
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
        folderId: selectedFolderId,
      });
    }

    setShowSaveModal(false);
    setRequestName("");
    setSaveAsNew(false);
    setSelectedFolderId(undefined);
    setPendingFolderId(null);
  };

  const handleShare = async () => {
    try {
      setIsCreatingShare(true);
      
      try {
        // Always enable P2P for seamless real-time sync
        const { startHostConnection } = await import("../../utils/p2p");
        const peerId = await startHostConnection();
        const shareLink = generateShareableLink(peerId);
        await navigator.clipboard.writeText(shareLink);
        setShareLinkCopied(true);
        showToast("success", "Share link copied!");
        setTimeout(() => setShareLinkCopied(false), 2000);
      } catch (p2pError) {
        // Silent fallback to regular share if P2P fails
        console.error("P2P connection failed, using regular share:", p2pError);
        const shareLink = generateShareableLink();
        await navigator.clipboard.writeText(shareLink);
        setShareLinkCopied(true);
        showToast("success", "Share link copied!");
        setTimeout(() => setShareLinkCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to create share link:", error);
      showToast("error", "Failed to copy share link");
    } finally {
      setIsCreatingShare(false);
    }
  };

  return (
    <>
      <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {activeCollection && (
          <div
            className={cn(
              "px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2",
              hasUnsavedChanges
                ? "bg-amber-50 dark:bg-amber-950/20"
                : "bg-blue-50 dark:bg-blue-950/20"
            )}
          >
            {hasUnsavedChanges ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
            ) : (
              <Edit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                hasUnsavedChanges
                  ? "text-amber-900 dark:text-amber-300"
                  : "text-blue-900 dark:text-blue-300"
              )}
            >
              {hasUnsavedChanges ? "Unsaved changes: " : "Editing: "}
              {activeCollection.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 p-3">
          <MethodSelector value={method} onChange={setMethod} />
          <URLInput />
          <Button
            variant="primary"
            size="sm"
            onClick={send}
            disabled={loading || !url.trim()}
            title="Send request"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            variant={
              hasUnsavedChanges && activeCollection ? "primary" : "secondary"
            }
            size="sm"
            onClick={() => {
              setRequestName(activeCollection?.name || url);
              setSaveAsNew(false);
              setSelectedFolderId(activeCollection?.folderId);
              setShowSaveModal(true);
            }}
            className={cn(
              hasUnsavedChanges && activeCollection && "animate-pulse"
            )}
            title={activeCollection ? "Update request" : "Save request"}
          >
            <Save className="w-4 h-4" />
            {hasUnsavedChanges && activeCollection && (
              <span className="ml-0.5 text-xs">●</span>
            )}
          </Button>
          {activeCollection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRequestName(`${activeCollection.name} (Copy)`);
                setSaveAsNew(true);
                setSelectedFolderId(activeCollection.folderId);
                setShowSaveModal(true);
              }}
              title="Save as new request"
            >
              <span className="text-xs">Save As</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            disabled={isCreatingShare}
            title="Share this request configuration"
            className="relative"
          >
            {isCreatingShare ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : shareLinkCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </Button>
          
          {/* Connection Indicator - only show when there's an error or explicit need */}
          {connectionStatus === 'connecting' && <ConnectionIndicator />}
        </div>
      </div>
      <Modal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSaveAsNew(false);
          setSelectedFolderId(undefined);
          setPendingFolderId(null);
        }}
        title={
          activeCollection && !saveAsNew ? "Update Request" : "Save Request"
        }
        size="sm"
      >
        <div className="space-y-3">
          {activeCollection && !saveAsNew && (
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
              Updating:{" "}
              <span className="font-medium">{activeCollection.name}</span>
            </div>
          )}
          {hasDuplicate && !activeCollection && (
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>A request with this method and URL already exists</span>
            </div>
          )}
          <Input
            label="Request Name"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            placeholder="My API Request"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
          />
          {folders.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">
                Folder (Optional)
              </label>
              <select
                value={selectedFolderId || ""}
                onChange={(e) =>
                  setSelectedFolderId(e.target.value || undefined)
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSaveModal(false);
                setSaveAsNew(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!requestName.trim()}
            >
              {activeCollection && !saveAsNew ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
