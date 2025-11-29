import { create } from 'zustand';

export interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
  isConnecting: boolean;
}

interface P2PState {
  peerId: string | null;
  peerConnections: Map<string, PeerConnection>;
  isHost: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  
  setPeerId: (id: string | null) => void;
  addPeerConnection: (id: string, connection: PeerConnection) => void;
  removePeerConnection: (id: string) => void;
  updatePeerConnection: (id: string, updates: Partial<PeerConnection>) => void;
  setIsHost: (isHost: boolean) => void;
  setConnectionStatus: (status: P2PState['connectionStatus']) => void;
  clearAllConnections: () => void;
}

export const useP2PStore = create<P2PState>((set, get) => ({
  peerId: null,
  peerConnections: new Map(),
  isHost: false,
  connectionStatus: 'disconnected',
  
  setPeerId: (id) => set({ peerId: id }),
  
  addPeerConnection: (id, connection) => {
    const connections = new Map(get().peerConnections);
    connections.set(id, connection);
    set({ peerConnections: connections });
  },
  
  removePeerConnection: (id) => {
    const connections = new Map(get().peerConnections);
    const peer = connections.get(id);
    if (peer) {
      peer.connection.close();
      if (peer.dataChannel) {
        peer.dataChannel.close();
      }
    }
    connections.delete(id);
    set({ peerConnections: connections });
  },
  
  updatePeerConnection: (id, updates) => {
    const connections = new Map(get().peerConnections);
    const existing = connections.get(id);
    if (existing) {
      connections.set(id, { ...existing, ...updates });
      set({ peerConnections: connections });
    }
  },
  
  setIsHost: (isHost) => set({ isHost }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  clearAllConnections: () => {
    const connections = get().peerConnections;
    connections.forEach((peer) => {
      peer.connection.close();
      if (peer.dataChannel) {
        peer.dataChannel.close();
      }
    });
    set({
      peerConnections: new Map(),
      peerId: null,
      isHost: false,
      connectionStatus: 'disconnected',
    });
  },
}));

