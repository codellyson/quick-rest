import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Settings, Moon, Sun, History, Folder, Globe } from "lucide-react";
import { useAppStore } from "../../stores/use-app-store";
import { CollectionsList } from "../collections/collections-list";
import { HistoryPanel } from "../history/history-panel";
import { EnvironmentSelector } from "../environment/environment-selector";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { SettingsModal } from "./settings-modal";

type SidebarSection = "collections" | "history" | "environments";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppStore();
  const [activeSection, setActiveSection] =
    useState<SidebarSection>("collections");
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (collapsed) {
    return (
      <div className="w-16 border-r border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="w-10 h-10"
        >
          <Folder className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="w-10 h-10"
        >
          <History className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="w-10 h-10"
        >
          <Globe className="w-5 h-5" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-10 h-10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="w-10 h-10"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to home"
          >
            <Logo variant="default" className="h-11" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
            className="w-8 h-8 p-0"
            aria-label="Collapse sidebar"
          >
            <span className="text-zinc-600 dark:text-zinc-400">←</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeSection === "collections" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveSection("collections")}
            className="flex-1"
          >
            <Folder className="w-4 h-4 mr-1" />
            Collections
          </Button>
          <Button
            variant={activeSection === "history" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveSection("history")}
            className="flex-1"
          >
            <History className="w-4 h-4 mr-1" />
            History
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {activeSection === "collections" && <CollectionsList />}
        {activeSection === "history" && <HistoryPanel />}
      </div>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-900 space-y-2">
        <EnvironmentSelector />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex-1"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex-1"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};
