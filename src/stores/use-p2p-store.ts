import { create } from 'zustand';

interface P2PState {
  peerId: string | null;
  isHost: boolean;
  connectionStatus: 'disconnected' | 'ready' | 'connecting' | 'connected';
  
  setPeerId: (id: string | null) => void;
  setIsHost: (isHost: boolean) => void;
  setConnectionStatus: (status: P2PState['connectionStatus']) => void;
  clearAllConnections: () => void;
}

export const useP2PStore = create<P2PState>((set) => ({
  peerId: null,
  isHost: false,
  connectionStatus: 'disconnected',
  
  setPeerId: (id) => set({ peerId: id }),
  
  setIsHost: (isHost) => set({ isHost }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  clearAllConnections: () => {
    set({
      peerId: null,
      isHost: false,
      connectionStatus: 'disconnected',
    });
  },
}));

