"use client";

import { useMemo, useState } from "react";
import type { Card } from "../types";
import type { DriftField } from "../types";
import { useStackStore } from "../use-stack-store";
import { useWorkspaceStore } from "../use-workspace-store";
import { computeFullDiff, formatSize } from "../drift";
import { StatusBadge } from "../../components/ui/status-badge";

interface ResultDiffProps {
  card: Card;
}

const truncate = (s: string, max = 80): string =>
  s.length > max ? s.slice(0, max) + "…" : s;

const formatValue = (v: unknown): string => {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
};

const KIND_GLYPH = {
  added: "+",
  removed: "−",
  changed: "~",
} as const;

const KIND_COLOR = {
  added: "text-success",
  removed: "text-danger",
  changed: "text-warning",
} as const;

const FieldRow = ({ field }: { field: DriftField }) => {
  const [expanded, setExpanded] = useState(false);
  const glyph = KIND_GLYPH[field.kind];
  const color = KIND_COLOR[field.kind];
  const before = formatValue(field.before);
  const after = formatValue(field.after);
  const max = expanded ? 4000 : 100;

  return (
    <div className="grid grid-cols-[16px_minmax(140px,30%)_1fr] gap-2 items-start py-1 px-3 hover:bg-bg/30">
      <span className={`font-mono text-[12px] ${color} select-none`}>
        {glyph}
      </span>
      <span className="font-mono text-[11px] text-secondary truncate" title={field.path}>
        {field.path}
      </span>
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="text-left font-mono text-[11px] text-primary break-all"
        title={expanded ? "Click to collapse" : "Click to expand"}
      >
        {field.kind === "added" && (
          <span className="text-success">{truncate(after, max)}</span>
        )}
        {field.kind === "removed" && (
          <span className="text-danger line-through opacity-80">
            {truncate(before, max)}
          </span>
        )}
        {field.kind === "changed" && (
          <>
            <span className="text-danger line-through opacity-80">
              {truncate(before, max)}
            </span>
            <span className="text-muted mx-1.5">→</span>
            <span className="text-success">{truncate(after, max)}</span>
          </>
        )}
      </button>
    </div>
  );
};

const Stat = ({
  label,
  before,
  after,
  delta,
}: {
  label: string;
  before: string;
  after: string;
  delta?: string;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] uppercase tracking-wide text-muted font-mono">
      {label}
    </span>
    <span className="font-mono text-[12px] text-primary">
      <span className="text-muted">{before}</span>
      <span className="text-muted mx-1.5">→</span>
      <span>{after}</span>
      {delta && (
        <span className="ml-2 text-[11px] text-muted">{delta}</span>
      )}
    </span>
  </div>
);

export const ResultDiff = ({ card }: ResultDiffProps) => {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const allCards = useStackStore((s) => s.cards);

  const prior = useMemo(() => {
    if (!card.response) return null;
    return (
      allCards.find(
        (c) =>
          c.id !== card.id &&
          c.workspaceId === workspaceId &&
          !c.archived &&
          c.method === card.method &&
          c.url === card.url &&
          c.response
      ) ?? null
    );
  }, [allCards, card, workspaceId]);

  const diff = useMemo(() => {
    if (!prior?.response || !card.response) return null;
    return computeFullDiff(prior.response, card.response);
  }, [prior, card]);

  if (!prior || !diff) {
    return (
      <div className="h-full flex items-center justify-center text-center p-6">
        <p className="text-[12px] text-muted font-mono max-w-md">
          No baseline yet. Send this request again — the next response will
          diff against this one.
        </p>
      </div>
    );
  }

  if (diff.identical) {
    return (
      <div className="h-full flex items-center justify-center text-center p-6">
        <p className="text-[12px] text-muted font-mono">
          Identical to previous response.
        </p>
      </div>
    );
  }

  const sizeDeltaStr =
    diff.sizeDelta > 0
      ? `+${formatSize(diff.sizeDelta)}`
      : diff.sizeDelta < 0
      ? formatSize(diff.sizeDelta)
      : "no change";
  const timeDelta = diff.timeAfter - diff.timeBefore;
  const timeDeltaStr =
    timeDelta === 0
      ? "no change"
      : `${timeDelta > 0 ? "+" : ""}${timeDelta}ms`;

  return (
    <div className="h-full overflow-y-auto">
      <section className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-wide text-muted font-mono">
            Baseline
          </span>
          <span className="text-[11px] text-secondary font-mono">
            {new Date(prior.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-muted font-mono">
              Status
            </span>
            <div className="flex items-center gap-2 text-[12px] font-mono">
              <StatusBadge status={diff.statusBefore} />
              <span className="text-muted">→</span>
              <StatusBadge status={diff.statusAfter} />
            </div>
          </div>
          <Stat
            label="Time"
            before={`${diff.timeBefore}ms`}
            after={`${diff.timeAfter}ms`}
            delta={timeDeltaStr}
          />
          <Stat
            label="Size"
            before={formatSize(diff.sizeBefore)}
            after={formatSize(diff.sizeAfter)}
            delta={sizeDeltaStr}
          />
        </div>
      </section>

      {diff.headers.length > 0 && (
        <section className="border-b border-border/40">
          <header className="flex items-center justify-between px-5 pt-3 pb-2">
            <span className="text-[10px] uppercase tracking-wide text-muted font-mono">
              Headers · {diff.headers.length} changed
            </span>
          </header>
          <div className="pb-2">
            {diff.headers.map((h) => (
              <div
                key={h.name}
                className="grid grid-cols-[16px_minmax(140px,30%)_1fr] gap-2 items-start py-1 px-3 hover:bg-bg/30"
              >
                <span
                  className={`font-mono text-[12px] ${KIND_COLOR[h.kind]} select-none`}
                >
                  {KIND_GLYPH[h.kind]}
                </span>
                <span className="font-mono text-[11px] text-secondary truncate">
                  {h.name}
                </span>
                <span className="font-mono text-[11px] text-primary break-all">
                  {h.kind === "added" && (
                    <span className="text-success">{h.after}</span>
                  )}
                  {h.kind === "removed" && (
                    <span className="text-danger line-through opacity-80">
                      {h.before}
                    </span>
                  )}
                  {h.kind === "changed" && (
                    <>
                      <span className="text-danger line-through opacity-80">
                        {h.before}
                      </span>
                      <span className="text-muted mx-1.5">→</span>
                      <span className="text-success">{h.after}</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <header className="flex items-center justify-between px-5 pt-3 pb-2">
          <span className="text-[10px] uppercase tracking-wide text-muted font-mono">
            Body · {diff.fields.length} change
            {diff.fields.length === 1 ? "" : "s"}
            {diff.truncated && (
              <span className="ml-2 text-warning">(truncated)</span>
            )}
          </span>
        </header>
        {diff.fields.length === 0 ? (
          <p className="px-5 py-3 text-[11px] text-muted font-mono">
            No structural body changes.
          </p>
        ) : (
          <div className="pb-4">
            {diff.fields.map((f, i) => (
              <FieldRow key={`${f.path}-${i}`} field={f} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
