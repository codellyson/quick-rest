"use client";

import { useMemo, useState } from "react";
import type { Card } from "../types";
import { Tabs } from "../../components/ui/tabs";
import { SkeletonBody } from "./skeleton-body";
import { ResultBody } from "./result-body";
import { ResultHeaders } from "./result-headers";
import { ResultRequest } from "./result-request";
import { ResultDiff } from "./result-diff";
import { useStackStore } from "../use-stack-store";
import { useWorkspaceStore } from "../use-workspace-store";

type TabId = "body" | "headers" | "request" | "diff";

interface ResultTabsProps {
  card: Card;
}

export const ResultTabs = ({ card }: ResultTabsProps) => {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const allCards = useStackStore((s) => s.cards);

  const hasPrior = useMemo(() => {
    if (!card.response) return false;
    return allCards.some(
      (c) =>
        c.id !== card.id &&
        c.workspaceId === workspaceId &&
        !c.archived &&
        c.method === card.method &&
        c.url === card.url &&
        c.response
    );
  }, [allCards, card, workspaceId]);

  const [active, setActive] = useState<TabId>("body");
  const r = card.response;
  const headerCount = r ? Object.keys(r.headers).length : 0;
  const sentHeaderCount = Object.keys(card.request.headers).length;

  if (card.pending) {
    return <SkeletonBody />;
  }

  if (!r) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm font-mono">
        {card.error ?? "No response."}
      </div>
    );
  }

  // If the user is on the diff tab but no prior exists (e.g. they deleted it),
  // bounce back to body.
  const effectiveActive: TabId =
    active === "diff" && !hasPrior ? "body" : active;

  const items: { id: TabId; label: string; badge?: number | string }[] = [
    { id: "body", label: "Body" },
    { id: "headers", label: "Headers", badge: headerCount },
    { id: "request", label: "Request", badge: sentHeaderCount },
  ];
  if (hasPrior) items.push({ id: "diff", label: "Diff" });

  return (
    <div className="h-full flex flex-col">
      <Tabs<TabId>
        size="sm"
        active={effectiveActive}
        onChange={setActive}
        items={items}
      />
      <div className="flex-1 min-h-0">
        {effectiveActive === "body" && <ResultBody response={r} />}
        {effectiveActive === "headers" && <ResultHeaders response={r} />}
        {effectiveActive === "request" && <ResultRequest card={card} />}
        {effectiveActive === "diff" && <ResultDiff card={card} />}
      </div>
    </div>
  );
};
