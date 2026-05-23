# JUSTAPI v1 — Design Spec

Source of truth for the v1 rewrite. Decisions here are locked unless explicitly revisited.

## Vision

A conversation thread with an API. Type a URL, hit Enter, response becomes a permanent card. The stack grows. No sidebars, no tabs, no composer screen. The input is always at the top; everything else is consequence.

## Core invariants

1. **One input.** Always at the top after the first send. Never duplicated.
2. **Every send produces a permanent card.** Nothing edits in place.
3. **The stack is history.** No separate History or Collections panel.
4. **Modifier popovers, never panels.** Inline-expanding, stackable.
5. **No mobile concern for v1.** Desktop only.

## Landing state

First visit, empty localStorage.

- Centered single input bar.
- Three chips beneath: `METHOD`, `BODY` (visible when method requires), `AUTH`, plus `ENV` showing current env name.
- **Cursor-blink demo**: ~600ms after page load, `GET https://api.github.com/users/torvalds` types itself into the bar at ~35ms per char. Modifier chips update live as the URL completes. After typing completes, "press Enter to try it" pulses below.
  - Any keystroke aborts the demo and takes over.
  - Pressing Enter completes the demo and fires the request for real.
  - `justapi-demo-seen` flag in localStorage suppresses replay.

## Send loop

1. User presses Enter.
2. Input glides up to its sticky position at the top of the workspace.
3. A **skeleton card** materializes immediately below the input with the locked URL bar and chips visible, body area shimmering.
4. When the response lands, body fills in.
5. **Input retains the last request** (URL, method, body, auth, env). Next keystroke edits in place.

## Card anatomy

| Section | Contents |
|---|---|
| Header row | method pill · URL (locked) · relative timestamp (`5s ago`) |
| Chip strip | `ENV prod · AUTH bearer · BODY JSON 95B` — frozen at send time |
| Status row | status badge + statusText · time · size |
| Body | Adaptive height — see below |
| Footer | `↗ Expand` · `F Fork` · timestamp absolute |

**Adaptive body height**

- Short responses (≤10 lines): rendered in full.
- Long responses: first ~10 lines + `↓ Show full (N more lines)` link.
- Binary: `(image · 47KB)` thumbnail when applicable.

## Stack model

- One stack. **Infinite scroll, every card stays full-size forever.**
- **Auto-grouped by host**: consecutive same-host cards visually cluster.
  - Sticky host strip above each group (`api.stripe.com`).
  - 12px gap + 1px divider between groups.
  - Each host gets a derived accent color stripe on the card's left edge (consistent across sessions).
- Within a group: tight stacking, drift lines between adjacent same-URL cards.
- Newest card always at the top of the stack.

## Drift line

Rendered in the gap between two adjacent same-URL cards:

- `status 200 → 500` (status change → **red**)
- `+ field "license" · ~ field "stargazers_count" 1842 → 1851` (shape change → **amber**)
- `size +204B` (size only)
- `Identical to previous` (no real change)

## Modifier popovers

- **Anchor**: inline expansion. Chip stays put; popover content pushes the stack down.
- **Stackable**: multiple open at once. Each is a labeled section.
- **AUTH**: radio of `None / Bearer / Basic / API key` + single field for the chosen type.
- **BODY** (POST/PUT/PATCH only): JSON-only CodeMirror editor (existing theme). `[ format ]` and `[ copy ]` actions in the section header. Multipart/raw/file deferred — escape via `/expand` if needed.
- **ENV**: radio of available envs (switch only). Variable editing happens via `/env` slash command.

## URL bar autocomplete

- Focus + type → dropdown beneath the input lists matching past cards from the stack.
- Each suggestion: method pill · URL · status · time-ago.
- Arrow keys + Enter to select (fills input — does **not** send).
- **Source: stack history only.** No saved-template suggestions inline.

## Slash commands (typed in URL bar starting with `/`)

| Command | Action |
|---|---|
| `/save` | Save current input as a template (lives only in palette, not the stack) |
| `/env <name>` | Open env-management editor (full editor for vars) |
| `/captures` | Swap the stack view to extension-captured requests |
| `/headers` | Inline header editor below the bar |
| `/expand` | Open current draft in legacy full composer (escape hatch) |
| `/curl` | Copy current draft as cURL |
| `/share` | Copy short share link |
| `/clear` | Archive entire stack |
| `/archive` | View archived cards |

## Palette (`⌘K`)

- Spotlight for saved requests, captures, and commands.
- Empty-state shows recents (top) + saved templates (below) without typing.
- Type to filter across both.
- Selecting a saved template fills the input (does not send).

## Persistence

Full restore on reload: stack, input contents, open popovers, env selection. localStorage-backed.

## Keyboard map

| Key | Action |
|---|---|
| `Enter` | Send |
| `Esc` | Close popover / blur input / cancel demo |
| `⌘K` | Open palette |
| `⌘Z` | Undo last input replacement (e.g., after click-to-refill) |
| `⌘L` | Copy share link of current input |
| `⌘S` | Save current input as template |
| `F` (focused on card) | Fill input with this card's request (fork) |
| `⌘↑` / `⌘↓` | Scroll between host groups |

## Visual style

- Workspace bg: theme primary (`#0d1117` dark / `#ffffff` light, via CSS variables).
- Cards: `bg-secondary`, 8px radius, 1px border. Subtle host-color left stripe (3px).
- Method pills: existing color scheme (GET indigo, POST green, etc.).
- Drift line: amber for shape/size, red for status.
- Typography: Geist Sans 13px base, Geist Mono for URLs and bodies.
- Skeleton shimmer: subtle gradient sweep at 0.15 opacity over body area.

## Empty / edge states

- **Brand new user**: landing with demo (as above).
- **All cards archived**: centered input returns (same as landing) but no demo.
- **Network failure on send**: card persists with `status 0`, error message in body, red status badge.
- **In-flight request**: skeleton card stays until response/abort. `Esc` on input cancels.
- **Identical consecutive send**: card still spawns, drift line reads "Identical to previous."

## Mock priorities (in order)

1. **Landing state mid-demo** — cursor-blink animation halfway through typing.
2. **Post-first-send** — input at top + one card below.
3. **Active workspace** — 2-3 host groups, several cards each, one with a drift line.
4. **Body popover expanded** — JSON editor inline, showing the push-down effect.
5. **URL autocomplete dropdown** — focused input with 3 history matches.
6. **Palette `⌘K`** — empty state showing recents + saved.

## Decisions log

| # | Decision | Choice |
|---|---|---|
| 1 | Result reveal direction | Input glides up, result fills below |
| 2 | Input after send | Moves into result pane immediately |
| 3 | Previous results | Stacked visibly |
| 4 | Input between sends | Keeps last request |
| 5 | Click old card | Refills input, with `⌘Z` undo |
| 6 | Card default height | Adaptive (compact + excerpt for long, full for short) |
| 7 | Drift line | Yes, inline between adjacent same-URL cards |
| 8 | Loading state | Skeleton card appears immediately |
| 9 | Landing onboarding | Cursor-blink demo |
| 10 | Popover anchor | Inline expansion |
| 11 | Multiple popovers | Stackable |
| 12 | Body editor | JSON CodeMirror only |
| 13 | Saved requests | Palette only (`⌘K` / `/save`) |
| 14 | Multi-thread | Single stack, auto-grouped by host |
| 15 | Extension captures | Palette only (`/captures`) |
| 16 | Env management | Chip switches, `/env` palette manages |
| 17 | Mobile | Not in v1 |
| 18 | Persistence | Full restore on reload |
| 19 | Stack scale | Infinite scroll, every card full-size |
| 20 | URL autocomplete source | Stack history only |
