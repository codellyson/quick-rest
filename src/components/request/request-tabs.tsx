'use client';

import { useState } from "react";
import { cn } from "../../utils/cn";
import { ParamsEditor } from "./params-editor";
import { HeadersEditor } from "./headers-editor";
import { BodyEditor } from "./body-editor";
import { AuthConfig } from "./auth-config";

type Tab = "params" | "headers" | "body" | "auth";

interface RequestTabsProps {
  className?: string;
}

export const RequestTabs = ({ className }: RequestTabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("params");

  const tabs: { id: Tab; label: string }[] = [
    { id: "params", label: "Params" },
    { id: "headers", label: "Headers" },
    { id: "body", label: "Body" },
    { id: "auth", label: "Auth" },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-accent text-primary"
                : "border-transparent text-secondary hover:text-primary"
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
