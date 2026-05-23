"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { useDraftStore } from "../use-draft-store";
import { useEnvironmentStore } from "../../stores/use-environment-store";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const inputCls =
  "px-2 py-1.5 rounded-md border border-border bg-bg text-[12px] font-mono focus:outline-none focus:border-accent";

export const EnvDrawer = () => {
  const openPopovers = useDraftStore((s) => s.openPopovers);
  const closePopover = useDraftStore((s) => s.closePopover);
  const open = openPopovers.includes("env-manage");

  const environments = useEnvironmentStore((s) => s.environments);
  const activeId = useEnvironmentStore((s) => s.activeEnvironmentId);
  const setActiveId = useEnvironmentStore((s) => s.setActiveEnvironmentId);
  const addEnv = useEnvironmentStore((s) => s.addEnvironment);
  const updateEnv = useEnvironmentStore((s) => s.updateEnvironment);
  const deleteEnv = useEnvironmentStore((s) => s.deleteEnvironment);

  const [selectedId, setSelectedId] = useState<string | null>(
    activeId ?? environments[0]?.id ?? null
  );
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftKey, setDraftKey] = useState("");
  const [draftVal, setDraftVal] = useState("");

  useEffect(() => {
    if (!open) return;
    // Reset focus to the active env when reopening.
    setSelectedId(activeId ?? environments[0]?.id ?? null);
    setRenamingId(null);
    setDraftKey("");
    setDraftVal("");
  }, [open, activeId, environments]);

  const selected = environments.find((e) => e.id === selectedId) ?? null;
  const entries = selected ? Object.entries(selected.variables) : [];

  const handleRename = (id: string, name: string) => {
    const trimmed = name.trim();
    if (trimmed) updateEnv(id, { name: trimmed });
    setRenamingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (environments.length <= 1) return;
    if (!confirm(`Delete environment "${name}"?`)) return;
    deleteEnv(id);
    if (selectedId === id) {
      const remaining = environments.filter((e) => e.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };

  const handleAddVar = () => {
    if (!selected) return;
    const k = draftKey.trim();
    if (!k) return;
    updateEnv(selected.id, {
      variables: { ...selected.variables, [k]: draftVal },
    });
    setDraftKey("");
    setDraftVal("");
  };

  const handleRemoveVar = (key: string) => {
    if (!selected) return;
    const next = { ...selected.variables };
    delete next[key];
    updateEnv(selected.id, { variables: next });
  };

  const handleUpdateVar = (key: string, value: string) => {
    if (!selected) return;
    updateEnv(selected.id, {
      variables: { ...selected.variables, [key]: value },
    });
  };

  const handleRenameVar = (oldKey: string, newKey: string) => {
    if (!selected) return;
    const trimmed = newKey.trim();
    if (!trimmed || trimmed === oldKey) return;
    const next: Record<string, string> = {};
    Object.entries(selected.variables).forEach(([k, v]) => {
      next[k === oldKey ? trimmed : k] = v;
    });
    updateEnv(selected.id, { variables: next });
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) closePopover("env-manage");
      }}
      shouldScaleBackground
      closeThreshold={0.2}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[82dvh] flex-col rounded-t-2xl border border-b-0 border-border bg-bg-secondary shadow-[0_-12px_48px_-12px_rgba(0,0,0,0.45)] outline-none">
          <Drawer.Title className="sr-only">Manage environments</Drawer.Title>

          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border" />

          <header className="flex items-center gap-3 px-5 pt-3 pb-3 shrink-0 border-b border-border/40">
            <span className="text-[10px] uppercase tracking-wide text-muted font-mono">
              Environments
            </span>
            <span className="text-[12px] text-secondary">
              {environments.length}
            </span>
            <div className="flex-1" />
            <span className="text-[10px] text-muted font-mono">
              esc · drag to close
            </span>
          </header>

          <div className="flex items-center gap-1.5 flex-wrap px-5 py-3 shrink-0 border-b border-border/40">
            {environments.map((env) => {
              const active = env.id === activeId;
              const selectedHere = env.id === selectedId;
              const isRenaming = renamingId === env.id;
              return (
                <div
                  key={env.id}
                  className={`group inline-flex items-center gap-1 rounded-md border text-[11px] transition-colors px-1.5 ${
                    selectedHere
                      ? "border-accent/60 bg-accent/10"
                      : "border-border/60 bg-bg-secondary hover:border-border"
                  }`}
                >
                  {active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                      title="Active environment"
                    />
                  )}
                  {isRenaming ? (
                    <input
                      autoFocus
                      defaultValue={env.name}
                      onBlur={(e) => handleRename(env.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleRename(env.id, e.currentTarget.value);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      className="bg-transparent outline-none px-1.5 py-1 font-medium w-24 !outline-none focus:!outline-none"
                      spellCheck={false}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedId(env.id)}
                      onDoubleClick={() => setRenamingId(env.id)}
                      className={`px-1.5 py-1 font-medium ${
                        selectedHere ? "text-accent" : "text-secondary hover:text-primary"
                      }`}
                      title="Click to edit · double-click to rename"
                    >
                      {env.name}
                    </button>
                  )}
                  {selectedHere && !isRenaming && (
                    <>
                      {!active && (
                        <button
                          type="button"
                          onClick={() => setActiveId(env.id)}
                          className="text-muted hover:text-accent pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Set as active"
                          aria-label={`Activate ${env.name}`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setRenamingId(env.id)}
                        className="text-muted hover:text-primary pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Rename"
                        aria-label={`Rename ${env.name}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {environments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(env.id, env.name)}
                          className="text-muted hover:text-danger pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete"
                          aria-label={`Delete ${env.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                const id = addEnv({
                  name: `Env ${environments.length + 1}`,
                  variables: {},
                });
                // addEnv returns void in the legacy store; refetch the last id.
                const state = useEnvironmentStore.getState();
                const newest = state.environments[state.environments.length - 1];
                if (newest) {
                  setSelectedId(newest.id);
                  setRenamingId(newest.id);
                }
                // suppress unused
                void id;
              }}
              className="inline-flex items-center gap-1 rounded-md border border-dashed border-border/60 px-2 py-1 text-[11px] text-muted hover:text-primary hover:border-border transition-colors"
              aria-label="New environment"
            >
              <Plus className="w-3 h-3" />
              new env
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            {!selected ? (
              <p className="text-[12px] text-muted font-mono text-center py-8">
                Select an environment above to edit its variables.
              </p>
            ) : entries.length === 0 ? (
              <p className="text-[12px] text-muted font-mono text-center py-8">
                {selected.name} has no variables yet. Add one below — use{" "}
                <span className="text-secondary">{`{{name}}`}</span> in the URL,
                headers, or body to reference it.
              </p>
            ) : (
              <div className="space-y-1.5">
                {entries.map(([k, v]) => (
                  <div
                    key={k}
                    className="group grid grid-cols-[200px_1fr_auto] gap-2 items-center"
                  >
                    <input
                      defaultValue={k}
                      onBlur={(e) => handleRenameVar(k, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                      className={`${inputCls} truncate`}
                      spellCheck={false}
                    />
                    <input
                      value={v}
                      onChange={(e) => handleUpdateVar(k, e.target.value)}
                      className={`${inputCls} min-w-0`}
                      spellCheck={false}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVar(k)}
                      className="text-[11px] text-muted hover:text-danger w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove variable ${k}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="shrink-0 border-t border-border/40 px-5 py-3">
              <div className="grid grid-cols-[200px_1fr_auto] gap-2 items-center">
                <input
                  value={draftKey}
                  onChange={(e) => setDraftKey(e.target.value)}
                  placeholder="VARIABLE_NAME"
                  className={inputCls}
                  spellCheck={false}
                />
                <input
                  value={draftVal}
                  onChange={(e) => setDraftVal(e.target.value)}
                  placeholder="value"
                  className={`${inputCls} min-w-0`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddVar();
                    }
                  }}
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={handleAddVar}
                  className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-mono px-2"
                >
                  <Plus className="w-3 h-3" />
                  add
                </button>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
