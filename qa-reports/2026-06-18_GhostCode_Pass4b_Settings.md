# Ghost Code — Overhaul Pass 4b: Settings + Difficulty + Review-Missed Drill

**Date:** 2026-06-18
**Branch:** `feat/ghost-code-pass4b-settings-2026-06-18` — **stacked on Sky's Pass 5** (`alex/ghost-pass5-aa-2026-06-18` @ `c5b6514`), which is stacked on local `main` (`3606978` = Passes 1–4a). **NOT merged — Sky merges.**
**Scope:** The remaining Pass 4 UX features (plan §8/§10). `index.html` only. **Additive `localStorage` only** (new keys `soundOn`, `reduceMotion`, `difficultyFilter`; old saves default them — `hi/category/cardStats/mode/bestStreak` untouched). `reviewDeck` is session-only.

## Coordination note (found Sky's parallel Pass 5)
While branching I discovered **Pass 5 (the WCAG AA sweep) already existed** — authored by Sky on the `alex/ghost-pass5-aa` branch. It already delivered: an accessible **modal/dialog pattern** (the `?` shortcuts dialog — focus-trap via `cabinet.inert`, Esc, scrim-click, focus-return), **arrow-key token focus** (improvement #8), **board `inert`** under overlays, and **forced-colors** support. So Pass 4b did **not** re-build a modal primitive or those a11y items — it **reuses** Pass 5's pattern and **extends** it. Pass 4b is stacked on Pass 5 to keep a linear chain and avoid `index.html` conflicts.

## What shipped (3 features)
1. **Settings dialog (#4).** A `SETTINGS` button in the control bar opens a dialog (mirrors the Pass 5 shortcuts modal: `role=dialog` `aria-modal`, `cabinet.inert` focus-trap, Esc / scrim / CLOSE dismiss, focus restored to the trigger). Three segmented controls (`aria-pressed`):
   - **Sound** On/Off → gates `beep()` (default on).
   - **Motion** Full/Reduced → toggles `body.reduce-motion` (new CSS rule mirroring the `prefers-reduced-motion` query).
   - **Difficulty** All/Easy/Medium/Hard → the deck filter (see #2).
   All persisted (additive). Forced-colors block extended to cover the dialog + `.seg__btn`.
2. **Difficulty filter (#7, the useful half).** `activeDeck()` refactored to filter by `difficultyFilter` (using the existing `DIFF()` helper) in addition to category. Lives in Settings (keeps the control bar uncluttered; category stays in the bar). Empty-deck combos fall through to the existing "no commands" guard.
3. **Review-missed drill (#5).** A `DRILL MISSED (n)` button on the results screen sets a session-only `state.reviewDeck` (the run's missed card ids) and starts a focused run via `startGame({review:true})`; `activeDeck()` serves only those cards. **Leak guard:** `startGame()` clears `reviewDeck` unless the `review` flag is set, so a normal start/restart/mode-change returns to full play (click handlers pass a MouseEvent → flag falsy → cleared).

## Verification (Chromium headless preview)
- **Green gate: PASS** (`node --check` cards.js + inline `<script>`; 56-card validator).
- **Settings:** opens (`visible`), `cabinet.inert=true`, focus on CLOSE, rows render with correct defaults (Sound On* / Motion Full* / Difficulty All*). **Esc closes** + clears inert + restores focus. Scrim-click + CLOSE wired.
- **Difficulty:** set **Hard** → started game → current card badge = HARD (deck filtered). Reset to All works.
- **Review drill:** lost a 3-miss run → `DRILL MISSED (3)` present → click → game-over hidden, focused run on a missed card. **Leak guard:** normal RESTART afterward returned a non-missed card (`git-merge`) → review deck cleared.
- Keyboard: Settings guard added to the global `keydown` (Esc closes, Tab traps on CLOSE, game shortcuts swallowed while open) — coexists with Pass 5's shortcuts-dialog guard.

## NOT done / deferred
- **First-run onboarding (#6)** — deferred (the Pass 3 redesign reduced its need; reuses the modal pattern when wanted).
- **Full pre-game title deck-picker redesign** — not done; difficulty lives in Settings and category stays in the bar (lower-risk than an IA overhaul).
- **Sound/Reduced-motion are logic-verified, not sensorially** — headless can't play audio; the reduce-motion CSS mirrors the OS query (the toggle sets `body.reduce-motion`, verified).
- **Chromium-only** — real Safari/iOS + screen-reader pass still needed (carried from Pass 5).

## DECISIONS FOR SKY
- **Merge is yours.** Branch chain: `main 3606978 (P1–4a)` → `c5b6514 (your Pass 5)` → this Pass 4b. Merging Pass 4b brings Pass 5 with it (it's stacked). `origin/main` still `48af607` — live unchanged, nothing pushed.
- **Design Compiler:** new UI (Settings dialog + segmented controls + DRILL button) → route through Dani before UI-DONE.
- **A11y:** the new dialog reuses Pass 5's focus-trap pattern + is in the forced-colors block; a real-device/SR check of the Settings dialog should ride along with Pass 5's pending device check.
- Overhaul status: Passes 1, 2, 3, 4a, 4b + your Pass 5 all built (branches). Remaining: consolidate/merge + Dani Design-Compiler + your Safari/device sign-off before deploy.
