import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/use-app-store";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { RequestTabs } from "../request/request-tabs";
import { ResponsePanel } from "../response/response-panel";
import { ToastContainer } from "../ui/toast";
import { useToastStore } from "../../stores/use-toast-store";
import { ResizableDivider } from "../ui/resizable-divider";

export const AppLayout = () => {
  const { theme } = useAppStore();
  const { toasts, removeToast } = useToastStore();
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
