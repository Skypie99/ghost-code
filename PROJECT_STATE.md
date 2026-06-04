# PROJECT_STATE — pacman-code-trainer
_Last compiled: 2026-06-03 by /morgan (Sky re-engaged from hold)_

## Current Status
Build burst on `burst/pacman-2026-06-02` is **+13 commits** ahead of local `main` (fast-forward clean — verified `main 4c853d9` is an ancestor of burst). Branch is **green** (0 console errors, validator: "56 cards passed all integrity checks"). Phases **P0–P6 + Learning Mode DONE** (7 of 8). One gate outstanding before a clean merge: **P6's UI (GIT filter button) has not passed the Design Compiler** (Const Art 2.4) — Shamus predicts COMMIT. P7 is specced and unbuilt. Awaiting Sky's merge gate.

## Context Snapshot
`/Users/skypie/Games/pacman-code-trainer` is a vanilla HTML/JS flashcard game (Pac-Man themed) for memorizing Claude Code + Mac terminal + Git commands. Single-file: `index.html` (~1.4k lines, inline CSS+JS, script lines 841–1412) + `cards.js` (**56 cards**). No TypeScript, no build, no framework, **zero deps, no DB, no network, no auth**. Green gate = `node --check cards.js` + extracted inline `<script>` + browser smoke + `node test/cards.test.js`. Data layer is `localStorage['pmct.v1']` only — additive keys, no migrations.

## Recent Outcomes (delta since 2026-06-02 cycle)
- **EMPTY-DECK-VERIFY (DONE):** Gary's pre-P6 gate FAILED → fix `3b1de9c` ported to burst as **`42d3387`**. Prevents phantom scoring when switching to the empty GIT category mid-game.
- **P6 (DONE — pending compile):** 16 GIT cards written fresh (`2c91fe1`) — 7 easy / 6 medium / 3 hard; `explain` on 5 trickier cards. GIT button added to bottom bar (`.btn` reuse), C-cycle `['all','claude','mac','git']`, `CATEGORY_LABELS.git`, validator `VALID_CATEGORIES += git`. **Deck 40 → 56**, all pass. No localStorage bump (additive).
- **P0–P5 + Learning Mode:** unchanged — see prior cycle / `2026-06-02_Burst_Report.md`.
- **Loose files committed:** DECISIONS_LOG.md + PROJECT_STATE.md + 3 qa-reports were untracked on burst; committed this cycle so they travel with the merge.

## Next Actions (phased plan)
- **Phase 1 (land burst):** Dani runs P6 Design Compiler → Sky `git merge --ff-only burst/pacman-2026-06-02` → optional `git push origin main` → Rory-confirmed stale-branch prune.
- **Phase 2 (P7):** arcade game-over missed-cards review + renderCard SR prompt announce — specced in PLAN.md, index.html only.
- **Phase 3 (governance):** Will writes LEARNINGS.md + CLAUDE.md; create qa-reports/INDEX.md.
- **Phase 4 (optional growth):** Quinn grooms spaced-repetition / stats screen / new categories from Riley's friction research.

## Open Risks
- P6 UI un-compiled — last gate before clean merge (low: predicted COMMIT).
- `burst/pacman-2026-06-02` NOT merged — 13 commits pending Sky's gate.
- Local `main` +21 vs `origin/main` (stale at Initial commit) — GitHub Pages not live until pushed.
- **Governance gaps:** LEARNINGS.md, qa-reports/INDEX.md, CLAUDE.md all missing (LEARNINGS routed to Will twice, never done).
