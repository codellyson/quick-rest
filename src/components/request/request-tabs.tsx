import { useEffect } from "react";
import { cn } from "../../utils/cn";
import { useP2PStore } from "../../stores/use-p2p-store";
import { ParamsEditor } from "./params-editor";
import { HeadersEditor } from "./headers-editor";
import { BodyEditor } from "./body-editor";
import { AuthConfig } from "./auth-config";

type Tab = "params" | "headers" | "body" | "auth";

interface RequestTabsProps {
  className?: string;
}

export const RequestTabs = ({ className }: RequestTabsProps) => {
  const { uiState, setUIState } = useP2PStore();
  const activeTab = uiState.activeTab || "params";
  
  const setActiveTab = (tab: Tab) => {
    setUIState({ activeTab: tab });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "params", label: "Params" },
    { id: "headers", label: "Headers" },
    { id: "body", label: "Body" },
    { id: "auth", label: "Auth" },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2",
              activeTab === tab.id
                ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === "params" && <ParamsEditor />}
        {activeTab === "headers" && <HeadersEditor />}
        {activeTab === "body" && <BodyEditor />}
        {activeTab === "auth" && <AuthConfig />}
      </div>
    </div>
  );
};
