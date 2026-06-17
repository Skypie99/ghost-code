# Ghost Code — Overhaul Pass 1: Defect Repair

**Date:** 2026-06-17
**Branch:** `fix/ghost-code-pass1-defects-2026-06-17` (off `main`; **NOT merged — Sky merges**)
**Scope:** Pass 1 of the overhaul mapped in `~/.claude/plans/opus-4-8-ultracode-nested-parasol.md` (§10). Correctness/defect fixes only — no visual modernization, no `localStorage`/schema touch, no new features.
**Files changed:** `index.html` only.

---

## What changed (3 fixes)

### D5 🔴 — Learn-panel `innerHTML` → `createElement`/`textContent` (correctness + security)
`showLearningPanel()` built its markup with `innerHTML` template strings interpolating `${card.hint}` / `${card.answer}`. Any card text containing an angle-bracket placeholder was silently destroyed — `git clone <url>` rendered as **"git clone"** because `<url>` parsed as an empty HTML element. This **taught an incomplete command** in exactly the screen Learn mode exists for, and violated CLAUDE.md load-bearing gotcha #1 ("all card-derived text via `textContent`, NEVER `innerHTML`"; also a latent XSS vector if cards ever become user-authored).
**Fix:** rewrote the function to build every node with `createElement` + `textContent` (matching the existing `renderExplain()` pattern), with small local builders (`p`, `btn`, `actions`, `hintLine`). All classes, ids, `aria-label`s, event listeners, and focus calls preserved; phase order unchanged.
**Affected cards:** `git-clone` (`git clone <url>`), `git-rm-cached` (`git rm --cached <file>`).

### D4 🟠 — Opaque `.screen` overlays (no more bleed-through)
`.screen` used `rgba(10,1,24,0.94)` (6% transparent), so the live HUD / prompt / token outlines ghosted through the title, game-over, and pause screens (e.g. game-over "00" collided with the previous question).
**Fix:** changed the base layer to the opaque token `var(--bg-deep)`; the pink radial gradient remains as a tint *on top* of the opaque base.

### #9 🟡 — Missing-`CARDS` guard
`cards.js` is a plain `<script>`; if it failed to load, `window.CARDS` is `undefined` and the first `nextCard()` would throw on `activeDeck()`, freezing the board.
**Fix:** an init-time guard (`!Array.isArray(window.CARDS) || length === 0`) that disables START → "DECK UNAVAILABLE", sets a calm prompt message, and announces the error via `#a11y-announcer`.

---

## Verification

**Green gate — PASS:**
- `node --check cards.js` → OK
- inline `<script>` extracted (lines 1215..1946) + `node --check -` → OK
- `node test/cards.test.js` → "OK — 56 cards passed all integrity checks."

**Rendered (Chromium headless preview — single engine):**
- **D5:** forced `git-clone` in Learn mode → reveal panel `lp-answer.textContent === "git clone <url>"` (`answerIntact: true`), shown intact on screen; correct token gold-✓, wrong token red-✗. _Before the fix the same path returned "git clone " (truncated) — reproduced, then fixed._
- **D4:** title screen now renders opaque — no HUD/bar ghosting (vs. the pre-fix bleed).
- **#9:** guard effect renders cleanly — START → disabled "DECK UNAVAILABLE", announcer message set. _Caveat: the true cold-load 404 was not reproducible in-preview because the dev server's heuristic HTTP cache kept serving the stale `cards.js`; the guard is green-gate-clean, logically trivial, and its effect path was exercised. **Confirm on the live site / with cache disabled.**_
- **Regression:** Arcade start + correct-answer capture works; Learn pre-hint / retry / reveal / correct phases all render via the new code; 56 cards load.

**NOT verified (carry-over from the critique's coverage gaps):** Safari/WebKit + Firefox, real-device touch, audio, live screen-reader output. Single-engine Chromium only.

---

## DECISIONS FOR SKY
- **Merge is yours.** This branch is proposed, not merged (`main` untouched, nothing pushed).
- **Design Compiler (Const. Art. 2.4):** D4 is a UI-touching change (overlay opacity). It's a defect fix, not new visual design, but per the gate it should get Dani's Design-Compiler review before being marked UI-DONE. D5 changes *how* nodes are built with no visual change; #9 is a degraded-state guard. Flagging D4 for the gate.
- **Minor follow-up:** with the now-opaque title, the #9 guard's `#prompt-text` message sits behind the title screen; the user-facing signal is the disabled "DECK UNAVAILABLE" button + the announcer (which is sufficient). Could move the message onto the title surface in a later polish pass.
- **Next:** Pass 2 (layout integrity) is the recommended follow-on per the plan.
