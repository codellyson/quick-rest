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
import { useP2PSync } from "../../hooks/use-p2p-sync";
import { connectToHost } from "../../utils/p2p";

export const AppLayout = () => {
  const { theme } = useAppStore();
  const { toasts, removeToast, showToast } = useToastStore();
  const [leftPanelWidth, setLeftPanelWidth] = useState<number | null>(null);
  
  // Enable P2P sync
  useP2PSync();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  useEffect(() => {
    const savedWidth = localStorage.getItem("panel-width");
    if (savedWidth) {
      setLeftPanelWidth(parseInt(savedWidth, 10));
    }
  }, []);

  useEffect(() => {
    // Load shared request configuration and peer ID from URL hash
    const sharedData = loadConfigFromUrl();
    if (sharedData) {
      const { config, peerId } = sharedData;
      
      // Apply the shared configuration
      applySharedConfig(config);
      showToast("success", "Shared request configuration loaded!");
      
      // Auto-connect to peer if peer ID is provided
      if (peerId) {
        // Small delay to ensure UI is ready
        setTimeout(() => {
          showToast("info", "Connecting to peer for real-time sync...");
          connectToHost(peerId)
            .then(() => {
              showToast("success", "Connected! Real-time sync enabled.");
            })
            .catch((error) => {
              console.error("Failed to connect to peer:", error);
              showToast("warning", "Config loaded, but connection failed. You can still use the request.");
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
    localStorage.setItem("panel-width", width.toString());
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
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
