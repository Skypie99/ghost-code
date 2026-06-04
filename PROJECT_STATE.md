# PROJECT_STATE — pacman-code-trainer
_Last compiled: 2026-06-03 by /morgan (Phase 1 landed + Phase 2 built & reviewed)_

## Current Status
**P0–P6 are LIVE on `main`** (`3791d6e`, green — "56 cards passed all integrity checks") and **P7 is built + fully reviewed** on `shamus/p7-gameover-a11y-2026-06-03` (ff-clean over main, green). The game spec is effectively complete. Two things remain, both Sky-gated: (1) **push `main` to origin** to publish the features to the live public site, and (2) **merge P7** to main. Neither has happened yet.

## Branch topology (read this before touching git)
- **`main` `3791d6e`** — canonical live code: Learning Mode + P1–P6 + LEARNINGS.md + the P6 Design Compiler report. This is what `git push` would publish.
- **`shamus/p7-gameover-a11y-2026-06-03` `39e7690`+** — the single next-merge branch: P7 code + Shamus/Dani/Alex reports + ALL consolidated bookkeeping (this file, TASK_GRAPH, DECISIONS_LOG, Rory's merge report). Fast-forward-clean over main.
- **`burst/pacman-2026-06-02`** — content-superseded by p7 (its bookkeeping was copied onto p7). Prune with `-D`.
- `origin/main` `5644631` — STALE "Initial commit"; local main is +37 ahead. The public Pages site (skypie99.github.io/pacman-code-trainer/, repo is PUBLIC) is serving this bare base game until Sky pushes.

## Context Snapshot
Vanilla HTML/JS Pac-Man flashcard game for memorizing Claude Code + Mac terminal + Git commands. Single `index.html` (inline CSS+JS) + `cards.js` (**56 cards**). Zero deps, no build, no framework, no TS, **no DB / no network / no auth / no PII**. Green gate = `node --check cards.js` + extracted inline `<script>` + browser smoke + `node test/cards.test.js`. Data = `localStorage['pmct.v1']` only, additive keys.

## Recent Outcomes (this session)
- **P6 GIT cards MERGED** to main via Rory under Sky's scoped Art.1 override (4c853d9 → 3791d6e, ff, +16, green). See DECISIONS_LOG `[ART1-OVERRIDE-2026-06-03]`.
- **P6 Design Compiler = PASS** (Dani, `13dda1e`) — last UI gate cleared.
- **LEARNINGS.md shipped** (Will, `3791d6e`) — 12 lessons, overdue close-out.
- **P7 built + reviewed** (Shamus `9a4c763`; Dani POLISH→PASS `a1fbab1` — fixed `.lp-explain` 26→20px scope bug; Alex PASS-WITH-FIXES `39e7690` — fixed learn-mode SR announcer clobber + scroll-region landmarks + focus management; AA contrast verified).

## Next Actions (Sky-gated)
- **Push origin** (publishes P6 to the live public site): `git push origin main`. EXTERNAL SEND — Sky's explicit word required.
- **Merge P7** to main (another Art.1 decision; the burst override was one-off): `git merge --ff-only shamus/p7-gameover-a11y-2026-06-03`, then push again.
- **Phase 3 governance** (LEARNINGS done): create `qa-reports/INDEX.md` + agent-facing `CLAUDE.md`.
- **Prune**: 4 fully-merged branches → `-d`; `burst` → `-D` (superseded).
- **Phase 4 (optional)**: Quinn grooms spaced-rep / stats screen / new categories.

## Open Risks
- Local `main` +37 vs stale `origin/main` — live public site shows the bare base game until Sky pushes.
- Non-blocking polish: `#bar` has no `flex-wrap` → 6 filter buttons can clip below ~400px (pre-existing; flagged in Dani's P6 report). Phase-4/mobile ticket.
- Governance: `INDEX.md` + `CLAUDE.md` still missing (Phase 3).
