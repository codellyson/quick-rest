import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Users, X, Copy, Check, Loader2 } from 'lucide-react';
import { useP2PStore } from '../../stores/use-p2p-store';
import { disconnect, getPeerId } from '../../utils/p2p';
import { useToastStore } from '../../stores/use-toast-store';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

export const ConnectionIndicator = () => {
  const { connectionStatus, peerId: storePeerId, isHost } = useP2PStore();
  const { showToast } = useToastStore();
  const [showDetails, setShowDetails] = useState(false);
  const [currentPeerId, setCurrentPeerId] = useState<string | null>(storePeerId);
  const [copied, setCopied] = useState(false);

  // Sync peer ID from store and getPeerId function
  useEffect(() => {
    const updatePeerId = () => {
      const id = storePeerId || getPeerId();
      setCurrentPeerId(id);
    };
    
    updatePeerId();
    const interval = setInterval(updatePeerId, 500);
    return () => clearInterval(interval);
  }, [storePeerId]);

  // Auto-hide details after connection
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const timer = setTimeout(() => setShowDetails(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

  if (connectionStatus === 'disconnected' && !currentPeerId) {
    return null;
  }

  // Show indicator if we have a peer ID or are connected/connecting/ready
  if (!currentPeerId && connectionStatus === 'disconnected') {
    return null;
  }

  const handleDisconnect = () => {
    disconnect(true);
    setShowDetails(false);
    showToast('info', 'Disconnected from peer');
  };

  const handleCopyPeerId = async () => {
    if (currentPeerId) {
      await navigator.clipboard.writeText(currentPeerId);
      setCopied(true);
      showToast('success', 'Peer ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusDot = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        );
      case 'connecting':
        return <Loader2 className="w-3 h-3 animate-spin text-blue-500" />;
      case 'ready':
        return (
          <div className="relative">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </div>
        );
      default:
        return <div className="w-2 h-2 bg-zinc-400 rounded-full" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          'border',
          connectionStatus === 'connected'
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/40'
            : connectionStatus === 'connecting'
            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/40'
            : connectionStatus === 'ready'
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40'
            : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400',
          'shadow-sm hover:shadow'
        )}
      >
        {getStatusDot()}
        <span className="font-semibold">
          {connectionStatus === 'connected' 
            ? 'Live' 
            : connectionStatus === 'connecting' 
            ? 'Connecting...' 
            : connectionStatus === 'ready'
            ? 'Ready'
            : 'Offline'}
        </span>
        {isHost && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
            Host
          </span>
        )}
      </button>

      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : connectionStatus === 'ready' ? (
                    <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {connectionStatus === 'connected' 
                        ? 'Live Sync Active' 
                        : connectionStatus === 'ready'
                        ? 'Waiting for connection'
                        : 'Connecting...'}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {isHost ? 'You are the host' : 'Connected as client'}
                    </div>
                  </div>
                </div>
                {connectionStatus === 'connected' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    className="h-7 w-7 p-0"
                    title="Disconnect"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Peer ID Section */}
              {currentPeerId && (
                <div className="space-y-2 p-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {isHost ? 'Your Peer ID' : 'Host Peer ID'}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPeerId}
                      className="h-6 px-2 text-xs"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 break-all bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                    {currentPeerId}
                  </div>
                </div>
              )}

              {/* Status Info */}
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {connectionStatus === 'connected'
                    ? 'Real-time synchronization enabled'
                    : 'Establishing connection...'}
                </span>
              </div>

              {/* Connection Status */}
              {connectionStatus === 'ready' && (
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>Share your Peer ID to allow connections</span>
                </div>
              )}
              {connectionStatus === 'connecting' && (
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Establishing connection...</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
