import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HttpMethod } from '../utils/http';
import { KeyValuePair } from '../components/ui/key-value-editor';

export interface CollectionItem {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: 'json' | 'form-data' | 'raw' | 'none';
  body: string;
  authType: 'none' | 'bearer' | 'basic' | 'api-key';
  authConfig: Record<string, string>;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CollectionFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: number;
}

interface CollectionsState {
  items: CollectionItem[];
  folders: CollectionFolder[];
  activeCollectionId: string | null;
  pendingFolderId: string | null;
  setItems: (items: CollectionItem[]) => void;
  setFolders: (folders: CollectionFolder[]) => void;
  addItem: (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<CollectionItem>) => void;
  deleteItem: (id: string) => void;
  addFolder: (folder: Omit<CollectionFolder, 'id' | 'createdAt'>) => void;
  updateFolder: (id: string, updates: Partial<CollectionFolder>) => void;
  deleteFolder: (id: string) => void;
  setActiveCollectionId: (id: string | null) => void;
  setPendingFolderId: (id: string | null) => void;
  clearAll: () => void;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set) => ({
      items: [],
      folders: [],
      activeCollectionId: null,
      pendingFolderId: null,
      setItems: (items) => set({ items }),
      setFolders: (folders) => set({ folders }),
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: Date.now().toString(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: Date.now() }
              : item
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      addFolder: (folder) =>
        set((state) => ({
          folders: [
            ...state.folders,
            {
              ...folder,
              id: Date.now().toString(),
              createdAt: Date.now(),
            },
          ],
        })),
      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        })),
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          items: state.items.filter((item) => item.folderId !== id),
        })),
      setActiveCollectionId: (id) => set({ activeCollectionId: id }),
      setPendingFolderId: (id) => set({ pendingFolderId: id }),
      clearAll: () => set({ items: [], folders: [], activeCollectionId: null, pendingFolderId: null }),
    }),
    {
      name: 'collections-storage',
    }
  )
);

