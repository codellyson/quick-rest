import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HttpMethod } from '../utils/http';

export interface HistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  timestamp: number;
}

interface HistoryState {
  items: HistoryItem[];
  maxItems: number;
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteItem: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      maxItems: 50,
      addItem: (item) =>
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now(),
          };
          const items = [newItem, ...state.items].slice(0, state.maxItems);
          return { items };
        }),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'history-storage',
    }
  )
);

