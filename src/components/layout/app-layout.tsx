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

export const AppLayout = () => {
  const { theme } = useAppStore();
  const { toasts, removeToast, showToast } = useToastStore();
  const [leftPanelWidth, setLeftPanelWidth] = useState<number | null>(null);

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
    // Load shared request configuration from URL hash
    const sharedConfig = loadConfigFromUrl();
    if (sharedConfig) {
      applySharedConfig(sharedConfig);
      showToast("success", "Shared request configuration loaded!");
      
      // Clean up the URL hash after loading
      if (window.history.replaceState) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  }, []);

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
