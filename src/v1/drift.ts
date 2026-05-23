import type { Drift, DriftField } from "./types";
import type { HttpResponse } from "../utils/http";

const MAX_FIELDS = 5;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const diffShape = (
  before: unknown,
  after: unknown,
  path: string,
  out: DriftField[]
): void => {
  if (out.length >= MAX_FIELDS) return;
  if (before === after) return;

  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const k of keys) {
      if (out.length >= MAX_FIELDS) return;
      const next = path ? `${path}.${k}` : k;
      const a = before[k];
      const b = after[k];
      if (!(k in before)) {
        out.push({ path: next, kind: "added", after: b });
      } else if (!(k in after)) {
        out.push({ path: next, kind: "removed", before: a });
      } else {
        diffShape(a, b, next, out);
      }
    }
    return;
  }

  const sameType = typeof before === typeof after;
  if (!sameType || before !== after) {
    out.push({ path, kind: "changed", before, after });
  }
};

export const computeDrift = (
  prev: HttpResponse,
  next: HttpResponse
): Drift => {
  const sizeDelta = next.size - prev.size;

  if (prev.status !== next.status) {
    return {
      kind: "status",
      statusBefore: prev.status,
      statusAfter: next.status,
      sizeDelta,
    };
  }

  const fields: DriftField[] = [];
  diffShape(prev.data, next.data, "", fields);

  if (fields.length > 0) {
    return { kind: "shape", sizeDelta, fields };
  }

  if (sizeDelta !== 0) {
    return { kind: "size", sizeDelta };
  }

  return { kind: "identical" };
};

export const formatSize = (bytes: number): string => {
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${bytes}B`;
  if (abs < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
};

const FULL_MAX_FIELDS = 500;

const diffShapeFull = (
  before: unknown,
  after: unknown,
  path: string,
  out: DriftField[]
): void => {
  if (out.length >= FULL_MAX_FIELDS) return;
  if (before === after) return;

  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const k of keys) {
      if (out.length >= FULL_MAX_FIELDS) return;
      const next = path ? `${path}.${k}` : k;
      const a = before[k];
      const b = after[k];
      if (!(k in before)) {
        out.push({ path: next, kind: "added", after: b });
      } else if (!(k in after)) {
        out.push({ path: next, kind: "removed", before: a });
      } else {
        diffShapeFull(a, b, next, out);
      }
    }
    return;
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    const max = Math.max(before.length, after.length);
    for (let i = 0; i < max; i++) {
      if (out.length >= FULL_MAX_FIELDS) return;
      const next = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= before.length) {
        out.push({ path: next, kind: "added", after: after[i] });
      } else if (i >= after.length) {
        out.push({ path: next, kind: "removed", before: before[i] });
      } else {
        diffShapeFull(before[i], after[i], next, out);
      }
    }
    return;
  }

  out.push({ path: path || "(root)", kind: "changed", before, after });
};

export interface HeaderDiff {
  name: string;
  kind: "added" | "removed" | "changed";
  before?: string;
  after?: string;
}

export interface FullDiff {
  identical: boolean;
  statusBefore: number;
  statusAfter: number;
  timeBefore: number;
  timeAfter: number;
  sizeBefore: number;
  sizeAfter: number;
  sizeDelta: number;
  fields: DriftField[];
  /** True if we hit the FULL_MAX_FIELDS cap (so callers can hint). */
  truncated: boolean;
  headers: HeaderDiff[];
}

const diffHeaders = (
  prev: Record<string, string>,
  next: Record<string, string>
): HeaderDiff[] => {
  const out: HeaderDiff[] = [];
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const k of keys) {
    const a = prev[k];
    const b = next[k];
    if (a === b) continue;
    if (a === undefined) out.push({ name: k, kind: "added", after: b });
    else if (b === undefined)
      out.push({ name: k, kind: "removed", before: a });
    else out.push({ name: k, kind: "changed", before: a, after: b });
  }
  return out;
};

export const computeFullDiff = (
  prev: HttpResponse,
  next: HttpResponse
): FullDiff => {
  const fields: DriftField[] = [];
  diffShapeFull(prev.data, next.data, "", fields);
  return {
    identical:
      fields.length === 0 &&
      prev.status === next.status &&
      prev.size === next.size,
    statusBefore: prev.status,
    statusAfter: next.status,
    timeBefore: prev.time,
    timeAfter: next.time,
    sizeBefore: prev.size,
    sizeAfter: next.size,
    sizeDelta: next.size - prev.size,
    fields,
    truncated: fields.length >= FULL_MAX_FIELDS,
    headers: diffHeaders(prev.headers, next.headers),
  };
};
