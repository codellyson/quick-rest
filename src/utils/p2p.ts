import { useP2PStore, PeerConnection } from '../stores/use-p2p-store';
import { ShareableRequestConfig } from './sharing';
import { useRequestStore } from '../stores/use-request-store';

// STUN servers for NAT traversal (free public servers)
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

/**
 * Generates a random peer ID
 */
export const generatePeerId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Creates a new WebRTC peer connection
 */
export const createPeerConnection = (): RTCPeerConnection => {
  return new RTCPeerConnection(ICE_SERVERS);
};

/**
 * Creates a data channel for sending/receiving messages
 */
export const createDataChannel = (
  connection: RTCPeerConnection,
  label: string = 'request-sync'
): RTCDataChannel => {
  const channel = connection.createDataChannel(label, {
    ordered: true,
  });
  return channel;
};

/**
 * Sets up data channel event handlers
 */
export const setupDataChannel = (
  channel: RTCDataChannel,
  peerId: string,
  onMessage: (data: ShareableRequestConfig) => void
): void => {
  channel.onopen = () => {
    console.log(`Data channel opened with peer ${peerId}`);
    useP2PStore.getState().updatePeerConnection(peerId, {
      isConnected: true,
      dataChannel: channel,
    });
    useP2PStore.getState().setConnectionStatus('connected');
  };

  channel.onclose = () => {
    console.log(`Data channel closed with peer ${peerId}`);
    useP2PStore.getState().updatePeerConnection(peerId, {
      isConnected: false,
      dataChannel: null,
    });
  };

  channel.onerror = (error) => {
    console.error(`Data channel error with peer ${peerId}:`, error);
  };

  channel.onmessage = (event) => {
    try {
      const config = JSON.parse(event.data) as ShareableRequestConfig;
      onMessage(config);
    } catch (error) {
      console.error('Failed to parse message from peer:', error);
    }
  };
};

/**
 * Creates an offer for WebRTC connection (host side)
 */
export const createOffer = async (
  connection: RTCPeerConnection,
  dataChannel: RTCDataChannel
): Promise<RTCSessionDescriptionInit> => {
  const offer = await connection.createOffer();
  await connection.setLocalDescription(offer);
  return offer;
};

/**
 * Creates an answer for WebRTC connection (client side)
 */
export const createAnswer = async (
  connection: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> => {
  await connection.setRemoteDescription(offer);
  const answer = await connection.createAnswer();
  await connection.setLocalDescription(answer);
  return answer;
};

/**
 * Sets remote description and completes connection
 */
export const setRemoteDescription = async (
  connection: RTCPeerConnection,
  description: RTCSessionDescriptionInit
): Promise<void> => {
  await connection.setRemoteDescription(description);
};

/**
 * Sends request configuration to all connected peers
 */
export const broadcastRequestConfig = (): void => {
  const state = useRequestStore.getState();
  const p2pState = useP2PStore.getState();
  
  const config: ShareableRequestConfig = {
    method: state.method,
    url: state.url,
    params: state.params,
    headers: state.headers,
    bodyType: state.bodyType,
    body: state.body,
    authType: state.authType,
    authConfig: state.authConfig,
  };

  const message = JSON.stringify(config);
  
  p2pState.peerConnections.forEach((peer) => {
    if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
      try {
        peer.dataChannel.send(message);
      } catch (error) {
        console.error(`Failed to send message to peer ${peer.id}:`, error);
      }
    }
  });
};

/**
 * Initiates a P2P connection as host
 */
export const startHostConnection = async (
  onPeerConnected?: (peerId: string) => void
): Promise<string> => {
  const peerId = generatePeerId();
  const connection = createPeerConnection();
  const dataChannel = createDataChannel(connection);
  
  useP2PStore.getState().setPeerId(peerId);
  useP2PStore.getState().setIsHost(true);
  useP2PStore.getState().setConnectionStatus('connecting');
  
  // Handle ICE candidates
  connection.onicecandidate = (event) => {
    if (event.candidate) {
      // In a real implementation, you'd send this to the peer via signaling
      // For now, we'll use a simpler approach with offer/answer exchange
    }
  };
  
  // Handle incoming data channel (for when peer connects)
  connection.ondatachannel = (event) => {
    const channel = event.channel;
    const newPeerId = generatePeerId(); // In real scenario, get from signaling
    setupDataChannel(channel, newPeerId, handleIncomingConfig);
    
    const peerConnection: PeerConnection = {
      id: newPeerId,
      connection,
      dataChannel: channel,
      isConnected: false,
      isConnecting: true,
    };
    
    useP2PStore.getState().addPeerConnection(newPeerId, peerConnection);
    if (onPeerConnected) {
      onPeerConnected(newPeerId);
    }
  };
  
  // Create offer
  const offer = await createOffer(connection, dataChannel);
  setupDataChannel(dataChannel, peerId, handleIncomingConfig);
  
  const peerConnection: PeerConnection = {
    id: peerId,
    connection,
    dataChannel,
    isConnected: false,
    isConnecting: true,
  };
  
  useP2PStore.getState().addPeerConnection(peerId, peerConnection);
  
  // Return offer as base64 for sharing
  return btoa(JSON.stringify(offer));
};

/**
 * Connects to a host peer
 */
export const connectToHost = async (
  offerBase64: string,
  onConnected?: () => void
): Promise<string> => {
  try {
    const offer = JSON.parse(atob(offerBase64)) as RTCSessionDescriptionInit;
    const connection = createPeerConnection();
    const peerId = generatePeerId();
    
    useP2PStore.getState().setPeerId(peerId);
    useP2PStore.getState().setIsHost(false);
    useP2PStore.getState().setConnectionStatus('connecting');
    
    // Handle incoming data channel
    connection.ondatachannel = (event) => {
      const channel = event.channel;
      setupDataChannel(channel, 'host', handleIncomingConfig);
      
      const peerConnection: PeerConnection = {
        id: 'host',
        connection,
        dataChannel: channel,
        isConnected: false,
        isConnecting: true,
      };
      
      useP2PStore.getState().addPeerConnection('host', peerConnection);
      if (onConnected) {
        onConnected();
      }
    };
    
    // Create answer
    const answer = await createAnswer(connection, offer);
    
    // Return answer as base64
    return btoa(JSON.stringify(answer));
  } catch (error) {
    console.error('Failed to connect to host:', error);
    throw error;
  }
};

/**
 * Handles incoming request configuration from peer
 */
const handleIncomingConfig = (config: ShareableRequestConfig): void => {
  const { applySharedConfig } = require('./sharing');
  applySharedConfig(config);
};

/**
 * Completes connection setup with answer (host side)
 */
export const completeConnection = async (answerBase64: string): Promise<void> => {
  try {
    const answer = JSON.parse(atob(answerBase64)) as RTCSessionDescriptionInit;
    const state = useP2PStore.getState();
    const connections = Array.from(state.peerConnections.values());
    
    if (connections.length > 0) {
      await setRemoteDescription(connections[0].connection, answer);
    }
  } catch (error) {
    console.error('Failed to complete connection:', error);
    throw error;
  }
};

