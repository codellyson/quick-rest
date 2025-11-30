'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Users, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useP2PStore } from '../../stores/use-p2p-store';
import { startHostConnection, connectToHost, disconnect, getPeerId } from '../../utils/p2p';
import { useToastStore } from '../../stores/use-toast-store';

interface P2PConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const P2PConnectionModal = ({ isOpen, onClose }: P2PConnectionModalProps) => {
  const { isHost, connectionStatus, clearAllConnections } = useP2PStore();
  const { showToast } = useToastStore();
  const [hostPeerId, setHostPeerId] = useState('');
  const [clientPeerId, setClientPeerId] = useState('');
  const [peerIdCopied, setPeerIdCopied] = useState(false);
  const [isCreatingHost, setIsCreatingHost] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setHostPeerId('');
      setClientPeerId('');
      setPeerIdCopied(false);
    } else {
      // Check if we already have a peer ID
      const currentPeerId = getPeerId();
      if (currentPeerId && isHost) {
        setHostPeerId(currentPeerId);
      }
    }
  }, [isOpen, isHost]);

  const prevStatusRef = useRef(connectionStatus);
  
  // Monitor connection status changes
  useEffect(() => {
    if (connectionStatus !== prevStatusRef.current) {
      prevStatusRef.current = connectionStatus;
      
      if (connectionStatus === 'connected') {
        showToast('success', 'P2P connection established!');
      } else if (connectionStatus === 'disconnected' && (hostPeerId || clientPeerId)) {
        const wasConnecting = prevStatusRef.current === 'connecting';
        if (wasConnecting) {
          showToast('error', 'Connection failed. Please try again.');
        }
      }
    }
  }, [connectionStatus, hostPeerId, clientPeerId, showToast]);

  const handleStartHost = async () => {
    try {
      setIsCreatingHost(true);
      const peerId = await startHostConnection();
      setHostPeerId(peerId);
      showToast('success', 'Host connection created! Share your Peer ID with others.');
    } catch (error) {
      console.error('Failed to create host connection:', error);
      showToast('error', 'Failed to create host connection');
    } finally {
      setIsCreatingHost(false);
    }
  };

  const handleCopyPeerId = async () => {
    if (hostPeerId) {
      await navigator.clipboard.writeText(hostPeerId);
      setPeerIdCopied(true);
      showToast('success', 'Peer ID copied to clipboard!');
      setTimeout(() => setPeerIdCopied(false), 2000);
    }
  };

  const handleConnect = async () => {
    if (!clientPeerId.trim()) {
      showToast('error', 'Please enter a Peer ID');
      return;
    }

    try {
      setIsConnecting(true);
      await connectToHost(clientPeerId.trim());
      showToast('success', 'Connecting to peer...');
    } catch (error) {
      console.error('Failed to connect:', error);
      showToast('error', 'Failed to connect to peer. Make sure the Peer ID is correct.');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    clearAllConnections();
    setHostPeerId('');
    setClientPeerId('');
    showToast('info', 'Disconnected from peer');
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'connecting':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />;
      default:
        return <WifiOff className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Disconnected';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Peer-to-Peer Connection" size="md">
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {getStatusText()}
            </span>
          </div>
          {connectionStatus === 'connected' && (
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </div>

        {/* Host Section */}
        {connectionStatus === 'disconnected' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Start as Host
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                Create a connection and share your Peer ID with others.
              </p>
              <Button
                variant="primary"
                onClick={handleStartHost}
                disabled={isCreatingHost || !!hostPeerId}
                className="w-full"
              >
                {isCreatingHost ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    {hostPeerId ? 'Host Ready' : 'Start as Host'}
                  </>
                )}
              </Button>
            </div>

            {hostPeerId && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Your Peer ID (Share this)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={hostPeerId}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyPeerId}
                  >
                    {peerIdCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Share this Peer ID with others so they can connect to you
                </p>
              </div>
            )}
          </div>
        )}

        {/* Client Section */}
        {connectionStatus === 'disconnected' && (
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Connect as Client
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                Enter the Peer ID from the host to connect.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Host Peer ID
              </label>
              <Input
                value={clientPeerId}
                onChange={(e) => setClientPeerId(e.target.value)}
                placeholder="Enter Peer ID here"
                className="font-mono text-xs"
                disabled={isConnecting}
              />
              <Button
                variant="primary"
                onClick={handleConnect}
                disabled={!clientPeerId.trim() || isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Connected State */}
        {connectionStatus === 'connected' && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✓ Connected! Request configurations will sync in real-time.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            <strong>How it works:</strong> The host creates a connection and gets a Peer ID. 
            Share this Peer ID with others. They can enter it to connect directly. 
            Once connected, request configurations sync in real-time between peers.
          </p>
        </div>
      </div>
    </Modal>
  );
};
