"use client";

import { useMemo, useState } from "react";
import type { HttpMethod } from "../../utils/http";
import type { BodyType } from "../../stores/use-request-store";
import { useStackStore } from "../use-stack-store";
import { useWorkspaceStore } from "../use-workspace-store";
import { sendDirect } from "../use-v1-send";
import { MethodPill } from "./method-pill";

const HIDE_AT_CARD_COUNT = 3;
const HIDE_STORAGE_KEY = "justapi-examples-hidden";

interface Example {
  label: string;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  bodyType?: BodyType;
}

const EXAMPLES: Example[] = [
  {
    label: "GitHub user",
    method: "GET",
    url: "https://api.github.com/users/torvalds",
  },
  {
    label: "Posts list",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts",
  },
  {
    label: "Next.js repo",
    method: "GET",
    url: "https://api.github.com/repos/vercel/next.js",
    headers: { Accept: "application/vnd.github+json" },
  },
  {
    label: "Echo POST",
    method: "POST",
    url: "https://httpbin.org/post",
    body: '{\n  "hello": "world",\n  "n": 42\n}',
    bodyType: "json",
    headers: { "Content-Type": "application/json" },
  },
];

export const ExamplePills = () => {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const allCards = useStackStore((s) => s.cards);

  const cardCount = useMemo(
    () =>
      allCards.filter(
        (c) =>
          c.workspaceId === workspaceId && !c.archived && c.inStack
      ).length,
    [allCards, workspaceId]
  );

  const [hidden, setHidden] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(HIDE_STORAGE_KEY) === "1";
  });

  const [pending, setPending] = useState<string | null>(null);

  if (hidden) return null;
  if (cardCount >= HIDE_AT_CARD_COUNT) return null;

  const fireExample = async (ex: Example) => {
    setPending(ex.url);
    try {
      await sendDirect(ex);
    } finally {
      setPending(null);
    }
  };

  const dismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(HIDE_STORAGE_KEY, "1");
    }
    setHidden(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] uppercase tracking-wide text-muted font-mono self-center mr-1">
          Try
        </span>
        {EXAMPLES.map((ex) => {
          const isPending = pending === ex.url;
          return (
            <button
              key={ex.url}
              type="button"
              disabled={isPending}
              onClick={() => fireExample(ex)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-bg-secondary px-2 py-1 text-[11px] hover:border-accent transition-colors disabled:opacity-60"
              title={`${ex.method} ${ex.url}`}
            >
              <MethodPill method={ex.method} />
              <span className="font-mono text-secondary">{ex.label}</span>
              {isPending && (
                <span className="text-muted animate-pulse">·</span>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={dismiss}
          className="ml-1 text-[10px] text-muted hover:text-primary font-mono"
          title="Hide example requests"
        >
          ✕ hide
        </button>
      </div>
    </div>
  );
};
