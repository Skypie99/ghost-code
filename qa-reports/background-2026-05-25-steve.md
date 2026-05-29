# Steve — Pac-Man Code Trainer Security & Robustness Audit
**Date:** 2026-05-25
**Mode:** background · model_tier: opus-4-7 · project: pacman-code-trainer · cycle_id: steve-bg-2026-05-25
**Eligibility:** Eligible for 1 reversible change per Const. 12.3 (not AUDIT-ONLY).
**Status:** No change applied this cycle — see "Why no change" below.

---

## Summary

No urgent security or robustness issues. The game is a single-file static
HTML/CSS/JS app with localStorage persistence and no network calls. Reviewed
the full surface end-to-end; everything user-facing is rendered with
`textContent`, not `innerHTML`. localStorage failures are caught and fall back
to defaults. Audio failures are caught and silenced. Game state is
defensively initialized.

One minor hardening opportunity (CSP meta tag) flagged below as a propose-only
nice-to-have.

---

## Findings (all PASS / observed-and-safe)

### XSS surface — clean

The only `innerHTML` write in the codebase is:

```js
DOM.lives.innerHTML = '';   // index.html:657
```

It clears a node, then `document.createElement('div')` + `appendChild` rebuilds
the life indicators. No user content ever flows through `innerHTML`,
`insertAdjacentHTML`, `document.write`, `eval`, or `new Function`. All card
content — prompt text, answer text, dot labels, category badge, hint text — is
written via `textContent`, which the browser auto-escapes. Even if `cards.js`
ever shipped a card with `<script>` in its `prompt` string, it would render as
literal text.

### Persistent state — robust

```js
const loadPersist = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};

const persist = Object.assign({
  hi: 0,
  category: 'all',
  cardStats: {},
}, loadPersist());
```

- `JSON.parse` failure → empty object, defaults fill in.
- `localStorage` access failure (private mode, quota) → caught by try/catch.
- `Object.assign` ensures every required key is always present, even if the
  saved schema is older or partial.
- `stats[state.current.id]` is defensively re-initialized on each answer
  (`if (!stats[...]) stats[...] = { c: 0, w: 0, total: 0 }`) — no TypeError
  on first-ever answer for a new card.

### Card-data integrity

Inspected all 40 cards in `cards.js`. Every card has exactly 3 decoys (verified
with `grep -E "decoys:\s*\[[^\]]*,[^\]]*,[^\]]*\]" | wc -l` → 40). So
`shuffle([answer, ...decoys])` always produces a 4-element array matching the
4 dots; no `undefined` dot labels possible from current data. Worth a runtime
guard for future contributors, but not urgent today.

### Audio + DOM lifecycle — safe-by-default

- `beep()` wraps every AudioContext call in `try/catch` (line 636-646). User
  interaction with no audio output never blocks gameplay.
- `spawnGhost()` always pairs `appendChild` with a `setTimeout(...remove(), 1700)`
  cleanup. No DOM leaks across long sessions.
- `togglePause()` is gated by `state.playing` — can't pause from the title
  screen.
- `answer()` is gated by `state.busy || !state.playing || state.paused` —
  can't double-fire a dot click, can't answer mid-transition.

### No network / no external dependencies

`grep` returned **zero** matches for `fetch`, `XMLHttpRequest`, `<script src=`
to external origins, or `http://`. The only `<script src="cards.js"></script>`
is local. No CDNs, no analytics, no third-party fonts. Static-hostable as-is.

### No secrets, no API keys

`grep -i "key\|token\|secret\|api"` over both source files returns only
identifier strings ("STORAGE_KEY", "keydown") and nothing exfiltratable.

---

## Propose-only — P1 (nice-to-have, no urgency)

### Add a Content-Security-Policy meta tag

The HTML page has no CSP. For a single-file game with no external resources,
a strict CSP would be cheap insurance and exactly one line:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
```

`'unsafe-inline'` is required for both script and style because the entire
game is inlined in `index.html` — splitting it into external files would let
us drop `'unsafe-inline'` but that's a bigger change with no current security
need.

Why this is propose-only:
- Apply-able anytime, but no exploitable surface today.
- Single-file inline script means `'unsafe-inline'` is needed in the policy,
  which neutralizes most of CSP's protection. The net value is "default-deny
  any future external resource the game accidentally pulls in."

### Add a runtime guard for malformed cards

If a future contributor adds a card with fewer than 3 decoys, dots will show
the literal string "undefined". A 3-line guard in `renderCard`:

```js
const options = shuffle([card.answer, ...card.decoys]);
if (options.length !== 4) {
  DOM.promptText.textContent = `Card "${card.id}" is malformed — needs 1 answer + 3 decoys.`;
  return;
}
```

Trivial, safe, and "fails loud" on developer error. Worth doing but not
urgent — the current 40 cards are all well-formed.

---

## Why no change this cycle

This cycle's single allowed change (Const. 12.3) is going to the project
with the highest-impact eligible issue. Pac-Man is currently the cleanest of
the three change-eligible projects (Pac-Man, Prompt Library, AI Portfolio).
The two propose-only items above are nice-to-haves with no exploitable
surface — they'll be excellent candidates for a future Pac-Man-prioritized
cycle.

---

## Decisions for Sky

None — no urgent items. P1 items are at-leisure improvements.
