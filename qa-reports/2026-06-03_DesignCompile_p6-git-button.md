# Design Compiler Report — P6 `p6-git-button`
**Date:** 2026-06-03  
**Branch:** `burst/pacman-2026-06-02`  
**Commit audited:** `2c91fe1`  
**Feature slug:** `p6-git-button`  
**Compiler:** Dani (Creative Director, v1.11, Constitution Art. 2.4)

---

## Final Decision: PASS

All 7 layers green. No code changes required. Merge gate CLEARED.

---

## Layer 1 — Tokenization

**Finding: PASS**

The GIT button markup (line 807) carries `class="btn"` and zero `style=` attributes. All visual properties — border (`var(--neon-cyan)`), background, color (`var(--soft)`), padding, font (`Press Start 2P`), focus ring, active state (`var(--neon-pink)`) — are inherited from the shared `.btn` ruleset (lines 431–458). No raw hex values, no raw `px` padding, no inline styles introduced by the P6 commit. `CATEGORY_LABELS` at line 986 adds `git: 'GIT'` as a plain string label (no color tokens needed there — it's display copy only).

---

## Layer 2 — Accessibility Parity

**Finding: PASS**

The four category buttons compared side-by-side (lines 804–807):

| Button | class | data-cat | aria-pressed | aria-label |
|--------|-------|----------|--------------|------------|
| ALL | `btn` | `all` | `false` | "Show all command categories" |
| CLAUDE | `btn` | `claude` | `false` | "Show Claude Code commands only" |
| TERMINAL | `btn` | `mac` | `false` | "Show Mac terminal commands only" |
| **GIT** | **`btn`** | **`git`** | **`false`** | **"Show Git commands only"** |

Pattern is identical. `aria-pressed` starts `false` and is managed by the generic `querySelectorAll('[data-cat]')` handler (lines 1369–1384), which sets `aria-pressed="true"` on the active button and `false` on all others — `git` is picked up automatically because it shares the `data-cat` attribute selector.

The C-key cycle (lines 1395–1399) dispatches `.click()` on the resolved button, which triggers the same handler and updates `aria-pressed` identically. The `#a11y-announcer` aria-live region (line 742, `aria-live="polite" aria-atomic="true"`) is not wired to category-change events — but this is a **pre-existing condition** on all four buttons, not a regression introduced by P6. The category name is surfaced in the `#prompt-tag` element on card load, which is visible and sufficient for the arcade context.

`:focus-visible` ring is `.btn:focus-visible` (lines 449–452, `outline: 3px solid var(--neon-cyan); outline-offset: 4px`) — applies to GIT identically via class inheritance.

---

## Layer 3 — Component Consistency

**Finding: PASS**

The GIT button is not a fork. It is a verbatim reuse of the `.btn` component pattern established by ALL/CLAUDE/TERMINAL. Identical class, identical attribute shape, identical DOM position inside `#bar` (line 807 follows line 806 in sequence). No new CSS selector, no new ID, no JS special-casing of `git` outside the `CATEGORY_LABELS` label string and the C-cycle `order` array.

---

## Layer 4 — Visual Entropy

**Finding: PASS with note**

`#bar` is declared (lines 426–430):
```css
#bar {
  position: absolute; bottom: 28px; left: 0; right: 0;
  display: flex; gap: 14px; justify-content: center; align-items: center;
  z-index: 6;
}
```

No `flex-wrap` is set, so the bar does **not** wrap. With six items (ALL · CLAUDE · TERMINAL · GIT · PAUSE · RESTART), each button at ~`11px` Press Start 2P + `padding: 12px 16px`, the total flex row is approximately 480–520px. The game arena is fixed at `600px` wide (standard) narrowing to `340px` on `≤700px` viewports.

At 340px, six buttons without wrap is tight but the bar is `left:0; right:0` and `justify-content: center` — buttons may visually clip at extreme narrow viewport. However: (a) this is a desktop-first arcade game with a fixed canvas, (b) the mobile media query (lines 720–730) does not adjust `#bar` and never did, meaning this was an **existing risk** present before P6 with five buttons (ALL · CLAUDE · TERMINAL · PAUSE · RESTART). P6 adds one button of comparable width ("GIT" = 3 chars vs "ALL" = 3 chars) — the entropic delta is minimal.

**Note for Sky:** The six-button bar may be visually tight on very narrow mobile viewports. This is a pre-existing condition, not introduced by P6. A future P7+ could add `flex-wrap: wrap` and a `@media` bar adjustment if mobile support becomes a goal.

---

## Layer 5 — Luxury UI Score

**Finding: PASS**

The GIT button holds the retro-arcade quality bar:
- `Press Start 2P` monospace font, `font-size: 11px`, `letter-spacing: 1px` — matches siblings.
- Neon-cyan border + glow on idle, neon-pink active state — same treatment as ALL/CLAUDE/TERMINAL.
- Three-char label "GIT" — consistent density with "ALL" (3 chars). No visual weight imbalance.
- No new decorative elements, no color deviation, no spacing deviation.

The button is arcade-correct and indistinguishable in quality from its siblings.

---

## Layer 6 — Regression Safety (Green Gate)

**Finding: PASS — all three checks exit 0**

```
node --check cards.js
→ Exit 0 (syntax clean)

open=$(grep -n '<script>' index.html | head -1 | cut -d: -f1)
close=$(grep -n '</script>' index.html | tail -1 | cut -d: -f1)
sed -n "$((open+1)),$((close-1))p" index.html | node --check -
→ Exit 0 (syntax clean)

node test/cards.test.js
→ OK — 56 cards passed all integrity checks.
```

The C-cycle `order` array `['all','claude','mac','git']` (line 1396) correctly matches all four `data-cat` values in the DOM. `document.querySelector('[data-cat="git"]')` will resolve to line 807. No dead entries in the order array; no orphaned `data-cat` buttons outside the order.

---

## Layer 7 — Compile Decision

**PASS**

- No raw tokens introduced.
- Accessibility parity confirmed against all siblings.
- Identical component pattern — zero fork.
- Visual entropy delta is negligible; narrow-viewport bar crowding is pre-existing.
- Luxury bar maintained.
- All three green-gate checks exit 0, 56 cards pass.

Shamus's prediction was correct. The GIT button is a clean 1-button reuse. No fixes required.

---

## Decisions for Sky

None. No blockers, no escalations.

**Optional future note (not blocking):** `#bar` has no `flex-wrap`, so at very narrow viewports (< ~400px) the six-button row may clip. Not a regression from P6 — present with five buttons since the bar was built. Worth a `flex-wrap: wrap` pass in a dedicated polish ticket if mobile is ever targeted.
