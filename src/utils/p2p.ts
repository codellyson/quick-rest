import Peer from "peerjs";
import type { DataConnection } from "peerjs";
import { useP2PStore } from "../stores/use-p2p-store";
import { ShareableRequestConfig, applySharedConfig } from "./sharing";
import { useRequestStore } from "../stores/use-request-store";

let peerInstance: Peer | null = null;
let dataConnection: DataConnection | null = null;

/**
 * Initializes a PeerJS instance
 */
export const initializePeer = (peerId?: string): Promise<Peer> => {
  return new Promise((resolve, reject) => {
    // Use provided peerId or generate one
    const id = peerId || undefined;

    const peer = new Peer(id!, {
      host: "0.peerjs.com",
      port: 443,
      path: "/",
      secure: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("open", (id: string) => {
      console.log("PeerJS opened with ID:", id);
      peerInstance = peer;
      useP2PStore.getState().setPeerId(id);
      resolve(peer);
    });

    peer.on("error", (error: { type?: string; message?: string }) => {
      console.error("PeerJS error:", error);
      if (error?.type === "peer-unavailable") {
        // Peer ID is already taken, try with a new one
        console.log("Peer ID unavailable, generating new one...");
        peer.destroy();
        initializePeer().then(resolve).catch(reject);
      } else {
        reject(error);
      }
    });

    peer.on("connection", (conn: DataConnection) => {
      console.log("Incoming connection from:", conn.peer);
      handleDataConnection(conn);
    });

    peer.on("close", () => {
      console.log("PeerJS connection closed");
      peerInstance = null;
      useP2PStore.getState().setConnectionStatus("disconnected");
    });

    peer.on("disconnected", () => {
      console.log("PeerJS disconnected, attempting to reconnect...");
      if (!peer.destroyed) {
        peer.reconnect();
      }
    });
  });
};

/**
 * Handles an incoming or outgoing data connection
 */
const handleDataConnection = (conn: DataConnection): void => {
  dataConnection = conn;

  useP2PStore.getState().setConnectionStatus("connecting");

  conn.on("open", () => {
    console.log("Data connection opened");
    useP2PStore.getState().setConnectionStatus("connected");
  });

  conn.on("data", (data: unknown) => {
    try {
      const config = data as ShareableRequestConfig;
      console.log("Received config from peer:", config);
      applySharedConfig(config);
    } catch (error) {
      console.error("Failed to parse data from peer:", error);
    }
  });

  conn.on("close", () => {
    console.log("Data connection closed");
    dataConnection = null;
    useP2PStore.getState().setConnectionStatus("disconnected");
  });

  conn.on("error", (error: Error) => {
    console.error("Data connection error:", error);
    useP2PStore.getState().setConnectionStatus("disconnected");
  });
};

/**
 * Connects to a peer by ID
 */
export const connectToPeer = async (peerId: string): Promise<void> => {
  if (!peerInstance || peerInstance.destroyed) {
    await initializePeer();
  }

  if (!peerInstance) {
    throw new Error("Failed to initialize PeerJS");
  }

  try {
    const conn = peerInstance.connect(peerId, {
      reliable: true,
    });

    handleDataConnection(conn);
  } catch (error) {
    console.error("Failed to connect to peer:", error);
    throw error;
  }
};

/**
 * Gets the current peer ID
 */
export const getPeerId = (): string | null => {
  return peerInstance?.id || null;
};

/**
 * Disconnects and cleans up
 */
export const disconnect = (): void => {
  if (dataConnection) {
    dataConnection.close();
    dataConnection = null;
  }

  if (peerInstance && !peerInstance.destroyed) {
    peerInstance.destroy();
    peerInstance = null;
  }

  useP2PStore.getState().clearAllConnections();
};

/**
 * Sends request configuration to connected peer
 */
export const broadcastRequestConfig = (): void => {
  if (!dataConnection || dataConnection.open !== true) {
    return;
  }

  const state = useRequestStore.getState();

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

  try {
    dataConnection.send(config);
    console.log("Sent config to peer");
  } catch (error) {
    console.error("Failed to send config to peer:", error);
  }
};

/**
 * Starts as host - initializes peer and returns the peer ID
 */
export const startHostConnection = async (): Promise<string> => {
  useP2PStore.getState().setIsHost(true);
  useP2PStore.getState().setConnectionStatus("connecting");

  const peer = await initializePeer();
  return peer.id;
};

/**
 * Connects to a host peer
 */
export const connectToHost = async (hostPeerId: string): Promise<void> => {
  useP2PStore.getState().setIsHost(false);
  useP2PStore.getState().setConnectionStatus("connecting");

  await connectToPeer(hostPeerId);
};
