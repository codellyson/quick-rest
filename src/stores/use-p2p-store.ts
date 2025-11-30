import { create } from 'zustand';

interface EditingState {
  url: boolean;
  body: boolean;
  params: boolean;
  headers: boolean;
  authConfig: boolean;
}

interface UIState {
  activeTab: 'params' | 'headers' | 'body' | 'auth';
  panelWidth: number | null;
}

interface P2PState {
  peerId: string | null;
  isHost: boolean;
  connectionStatus: 'disconnected' | 'ready' | 'connecting' | 'connected';
  editingFields: EditingState;
  lastEditTime: Record<keyof EditingState, number>;
  uiState: UIState;
  peerColor: string | null;
  
  setPeerId: (id: string | null) => void;
  setIsHost: (isHost: boolean) => void;
  setConnectionStatus: (status: P2PState['connectionStatus']) => void;
  setEditingField: (field: keyof EditingState, isEditing: boolean) => void;
  isFieldEditing: (field: keyof EditingState) => boolean;
  setUIState: (state: Partial<UIState>) => void;
  setPeerColor: (color: string | null) => void;
  clearAllConnections: () => void;
}

export const useP2PStore = create<P2PState>((set, get) => ({
  peerId: null,
  isHost: false,
  connectionStatus: 'disconnected',
  editingFields: {
    url: false,
    body: false,
    params: false,
    headers: false,
    authConfig: false,
  },
  lastEditTime: {
    url: 0,
    body: 0,
    params: 0,
    headers: 0,
    authConfig: 0,
  },
  uiState: {
    activeTab: 'params',
    panelWidth: null,
  },
  peerColor: null,
  
  setPeerId: (id) => {
    set({ peerId: id });
    // Generate color from peer ID when peer ID is set
    if (id) {
      const color = generateColorFromPeerId(id);
      set({ peerColor: color });
    } else {
      set({ peerColor: null });
    }
  },
  
  setIsHost: (isHost) => set({ isHost }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setEditingField: (field, isEditing) => {
    set((state) => ({
      editingFields: {
        ...state.editingFields,
        [field]: isEditing,
      },
      lastEditTime: {
        ...state.lastEditTime,
        [field]: isEditing ? Date.now() : state.lastEditTime[field],
      },
    }));
  },
  
  isFieldEditing: (field) => {
    const state = get();
    const isEditing = state.editingFields[field];
    const lastEdit = state.lastEditTime[field];
    // Consider field as editing if actively editing or edited within last 2 seconds
    return isEditing || (Date.now() - lastEdit < 2000);
  },
  
  setUIState: (state) => {
    set((current) => ({
      uiState: {
        ...current.uiState,
        ...state,
      },
    }));
  },
  
  setPeerColor: (color) => set({ peerColor: color }),
  
  clearAllConnections: () => {
    set({
      peerId: null,
      isHost: false,
      connectionStatus: 'disconnected',
      editingFields: {
        url: false,
        body: false,
        params: false,
        headers: false,
        authConfig: false,
      },
      uiState: {
        activeTab: 'params',
        panelWidth: null,
      },
      peerColor: null,
    });
  },
}));

/**
 * Generates a consistent color from a peer ID
 * Uses a hash function to ensure the same peer ID always gets the same color
 */
function generateColorFromPeerId(peerId: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < peerId.length; i++) {
    hash = peerId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL color with good saturation and lightness for visibility
  const hue = Math.abs(hash) % 360;
  // Use high saturation (70-90%) and medium lightness (50-60%) for good visibility
  const saturation = 70 + (Math.abs(hash) % 20);
  const lightness = 50 + (Math.abs(hash) % 10);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

