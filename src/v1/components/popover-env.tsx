"use client";

import { useEnvironmentStore } from "../../stores/use-environment-store";
import { useDraftStore } from "../use-draft-store";
import { PopoverSection } from "./popover-section";
import { Settings2 } from "lucide-react";

export const PopoverEnv = () => {
  const environments = useEnvironmentStore((s) => s.environments);
  const activeId = useEnvironmentStore((s) => s.activeEnvironmentId);
  const setActiveId = useEnvironmentStore((s) => s.setActiveEnvironmentId);
  const togglePopover = useDraftStore((s) => s.togglePopover);
  const closePopover = useDraftStore((s) => s.closePopover);

  const openManager = () => {
    closePopover("env");
    togglePopover("env-manage");
  };

  const activeEnv = environments.find((e) => e.id === activeId);
  const varCount = activeEnv
    ? Object.keys(activeEnv.variables).length
    : 0;

  return (
    <PopoverSection popoverKey="env" label="Environment">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {environments.map((env) => (
            <label
              key={env.id}
              className="flex items-center gap-1.5 text-[12px] cursor-pointer"
            >
              <input
                type="radio"
                name="env"
                checked={activeId === env.id}
                onChange={() => setActiveId(env.id)}
                className="accent-[rgb(var(--accent))]"
              />
              {env.name}
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
          <span className="text-[10px] text-muted font-mono">
            {activeEnv?.name ?? "—"} ·{" "}
            {varCount} variable{varCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={openManager}
            className="inline-flex items-center gap-1.5 text-[11px] text-accent hover:underline font-mono"
          >
            <Settings2 className="w-3 h-3" />
            Manage variables
          </button>
        </div>
      </div>
    </PopoverSection>
  );
};
