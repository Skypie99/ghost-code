# PROJECT_STATE — pacman-code-trainer
_Last compiled: 2026-06-03 by /morgan — SHIPPED LIVE_

## Current Status
**SHIPPED. 🎉** The full game — Learning Mode + P1–P7 + LEARNINGS + governance docs — is **live on `main` and pushed to the public origin** (`af4a3ca`). `origin/main == local main`, green gate passing. GitHub Pages is serving it at **https://skypie99.github.io/pacman-code-trainer/** (rebuilds async after each push). The 4-phase plan from this session's review is complete; only optional growth (Phase 4) remains.

## Branch topology
- **`main` `af4a3ca`** = `origin/main` — canonical + LIVE. P0–P7 + LEARNINGS.md + CLAUDE.md + qa-reports/INDEX.md + all reports.
- `shamus/p7-gameover-a11y-2026-06-03` — merged into main; **prunable** (`git branch -d` whenever).
- Older stale branches still present (`Taylor/…`, `a11y/auto-…`, `community/…`, `cycle/auto-…`, `feat/auto-…git-*`, `release/auto-…`, `test/…`) — superseded, prune at leisure (some need `-D`).
- Pruned this release: premium-polish, round2-polish, contrast-fix, shamus/pm-learning-mode (`-d`) + `burst/pacman-2026-06-02` (`-D`).

## Context Snapshot
Vanilla HTML/JS Pac-Man flashcard game for memorizing Claude Code + Mac terminal + Git commands. Single `index.html` (inline CSS+JS) + `cards.js` (**56 cards**). Zero deps, no build, no framework, no TS, **no DB / network / auth / PII**. Green gate = `node --check cards.js` + extracted inline `<script>` + browser smoke + `node test/cards.test.js`. Data = `localStorage['pmct.v1']`, additive keys.

## What shipped this session (full arc)
- **P6 GIT cards** (16 cards + GIT button, deck 40→56) — Design Compiler PASS.
- **P7** — arcade game-over missed-cards review + screen-reader prompt announcements. Review gates caught 2 real bugs (a CSS-scope regression + a learn-mode SR-announcer clobber) before they shipped.
- **LEARNINGS.md** (12 lessons), **CLAUDE.md** (agent context), **qa-reports/INDEX.md** (PM triage).
- Merged to main + pushed live under Sky's eyes-open, scoped Art.1 override + "ship it all" (DECISIONS_LOG `[ART1-OVERRIDE-2026-06-03]`). CONSTITUTION.md unedited.

## Next Actions (all optional)
- **Phase 4 (optional growth):** Quinn grooms spaced-repetition / per-category stats screen / new command categories — grounded in Riley's friction research. Only if Sky wants to keep investing.
- **Mobile polish:** `#bar` needs `flex-wrap` (6 filter buttons clip below ~400px) — flagged in Dani's P6 report.
- **Tidy:** prune the remaining stale branches + the merged `shamus/p7-…` branch.

## Open Risks
- None blocking. Game is live and green.
- (Minor) live Pages content lags a push by ~1 min while it rebuilds.
