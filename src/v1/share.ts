import type { Card } from "./types";
import type { KeyValuePair } from "../components/ui/key-value-editor";
import type { ShareableRequestConfig } from "../utils/sharing";
import { generateShareableLink } from "../utils/sharing";

const headersToKVs = (
  headers: Record<string, string>
): KeyValuePair[] =>
  Object.entries(headers).map(([k, v], i) => ({
    id: String(i + 1),
    key: k,
    value: v,
    enabled: true,
  }));

/**
 * Build a ShareableRequestConfig from a stored card so the share link
 * reproduces the exact request that was sent (method, URL template,
 * headers, body, auth).
 */
export const cardToShareConfig = (card: Card): ShareableRequestConfig => ({
  method: card.request.method,
  url: card.request.urlRaw || card.request.url,
  params: [],
  headers: headersToKVs(card.request.headers),
  bodyType: card.request.bodyType,
  body: card.request.body ?? "",
  authType: card.request.authType,
  authConfig: card.request.authConfig as ShareableRequestConfig["authConfig"],
});

/**
 * Generate a share link for a card and copy it to the clipboard.
 * Returns the link on success, null on failure.
 */
export const shareCard = async (card: Card): Promise<string | null> => {
  try {
    const link = await generateShareableLink(cardToShareConfig(card));
    await navigator.clipboard.writeText(link);
    return link;
  } catch {
    return null;
  }
};
