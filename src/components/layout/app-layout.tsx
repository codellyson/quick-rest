'use client';

import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/use-app-store";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { RequestTabs } from "../request/request-tabs";
import { ResponsePanel } from "../response/response-panel";
import { ToastContainer } from "../ui/toast";
 import { ResizableDivider } from "../ui/resizable-divider";
import { loadConfigFromUrl, applySharedConfig } from "../../utils/sharing";
import { useToastStore } from "../../stores/use-toast-store";
import { useP2PStore } from "../../stores/use-p2p-store";
import { useP2PSync } from "../../hooks/use-p2p-sync";
import { connectToHost } from "../../utils/p2p";

export const AppLayout = () => {
  const { theme } = useAppStore();
  const { toasts, removeToast, showToast } = useToastStore();
  const { uiState, setUIState, connectionStatus, peerColor } = useP2PStore();
  const [leftPanelWidth, setLeftPanelWidth] = useState<number | null>(null);
  
  // Enable P2P sync
  useP2PSync();
  
  // Sync panel width with P2P store
  useEffect(() => {
    if (uiState.panelWidth !== null && uiState.panelWidth !== leftPanelWidth) {
      setLeftPanelWidth(uiState.panelWidth);
    }
  }, [uiState.panelWidth]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  useEffect(() => {
    const savedWidth = localStorage.getItem("panel-width");
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      setLeftPanelWidth(width);
      setUIState({ panelWidth: width });
    }
  }, [setUIState]);

  useEffect(() => {
    // Load shared request configuration and peer ID from URL hash
    const sharedData = loadConfigFromUrl();
    if (sharedData) {
      const { config, peerId } = sharedData;
      
      // Apply the shared configuration silently
      applySharedConfig(config);
      
      // Auto-connect to peer if peer ID is provided (silently in background)
      if (peerId) {
        setTimeout(() => {
          connectToHost(peerId).catch((error) => {
            console.error("Failed to connect to peer:", error);
            // Only show error if connection fails
            showToast("warning", "Connection failed. You can still use the request.");
          });
        }, 500);
      }
      
      // Clean up the URL hash after loading
      if (window.history.replaceState) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  }, [showToast]);

  const handleResize = (width: number) => {
    setLeftPanelWidth(width);
    setUIState({ panelWidth: width });
    localStorage.setItem("panel-width", width.toString());
  };

  const isConnected = connectionStatus === 'connected';
  const outlineStyle = isConnected && peerColor 
    ? { 
        outline: `2px solid ${peerColor}`,
        outlineOffset: '-2px',
        boxShadow: `0 0 0 1px ${peerColor}20`,
      } 
    : {};

  return (
    <div 
      className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-300"
      style={outlineStyle}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 flex overflow-hidden relative">
          <div
            className="flex flex-col overflow-hidden"
            style={{
              width: leftPanelWidth ? `${leftPanelWidth}px` : "50%",
            }}
          >
            <RequestTabs className="flex-1" />
          </div>
          <ResizableDivider onResize={handleResize} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <ResponsePanel />
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
