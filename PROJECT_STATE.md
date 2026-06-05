# PROJECT_STATE — ghost-code (folder still `pacman-code-trainer` locally)
_Last compiled: 2026-06-04 by /morgan — CUSTOM DOMAIN LIVE_

## Current Status
**LIVE at the custom URL.** The game (rebranded "Ghost Code") now serves at **https://ghostcode.skypistudio.com** with green HTTPS + HSTS, http→https 301, and the old `skypie99.github.io/ghost-code/` URL 301-redirects to the custom domain (good for any inbound links + SEO). `main = origin/main = 7ab62c6`. Portfolio card at `skypistudio.com/work/ghost-code` is updated to point Live demo at the new URL and now correctly shows both GitHub + Live-demo buttons (the `links` field had been silently stripped — caught + restored this cycle).

## Branch topology
- **`main` `7ab62c6`** = `origin/main` — canonical + LIVE. Includes: full Ghost Code rebrand (no Pac-Man trade dress), mobile flex-wrap fix, AA contrast polish, CNAME file for custom domain.
- Stale branches (prune at leisure — none blocking): `Taylor/a11y/category-aria-labels-2026-05-27`, `a11y/auto-2026-05-25`, `community/auto-2026-05-25-casey-readme`, `cycle/auto-2026-05-23-ui`, `dani/ghost-code-concept-2026-06-03` (served), `feat/auto-2026-05-25-shamus-git-cards`, `feat/auto-2026-05-25-shamus-git-ui`, `release/auto-2026-05-25`, `test/pacman-cards-data-validator-2026-05-25`, `test/pacman-empty-deck-robustness-2026-05-25`.
- This cycle: `chore/custom-domain-2026-06-04` + `feat/ghost-code-custom-url-2026-06-04` (portfolio) merged + locally pruned.

## Context Snapshot
**Ghost Code** — original synthwave arcade trainer for memorizing Claude Code + macOS terminal + Git commands. The Phantom mascot, command-token answers, danger-flash (no creature enemies), spirit-pip lives. Single `index.html` (inline CSS+JS) + `cards.js` (**56 cards**). Zero deps, no build, no framework, no TS, **no DB / network / auth / PII**. Green gate = `node --check cards.js` + extracted inline `<script>` + `node test/cards.test.js`. Data = `localStorage['gc.v1']` with one-time migration from legacy `pmct.v1`. GitHub repo: `Skypie99/ghost-code`. Live: `https://ghostcode.skypistudio.com`.

## What shipped (full arc, ledger-style)
- **2026-06-03 evening — Full Pac-Man release shipped:** P0–P7 live (`af4a3ca`), then mobile flex-wrap fix (`24e5fe1`).
- **2026-06-03 night — Legal de-risk:** Jordan flagged Pac-Man as HIGH trademark/trade-dress risk; portfolio card pulled.
- **2026-06-04 — Ghost Code rebrand:** Dani's original "The Phantom" identity (`1912794`) + AA-contrast polish (`dc3c022`); repo renamed `pacman-code-trainer → ghost-code` on GitHub; portfolio re-added under new identity.
- **2026-06-04 — Custom domain wired:** CNAME file (`7ab62c6`); Pages cname=ghostcode.skypistudio.com + https_enforced=true; portfolio `links` restored & repointed (skypistudio.com main `fcb9103`). _(main later advanced to `2743a9d` with HUD-bracket + favicon + OG polish.)_
- **2026-06-05 — Mobile-native + WCAG 2.2 AA + polish (Sky-direct):** branch `feat/ghost-mobile-a11y-2026-06-05`, 6 per-area commits, `index.html` only. Touch tuning (viewport-fit, touch-action, safe-area), fully responsive portrait layout (compass diamond scales/centres, no clipping; mode-toggle↔HUD overlap fixed), **swipe-to-answer** (up/right/down/left → N/E/S/W), on-screen **50/50 button** (was keyboard-only), WCAG 2.2 AA (✓/✗ not-colour-only, flash capped <3/s, targets ≥24px, pause announced). 56-card green gate green throughout; desktop unchanged. Report: `qa-reports/2026-06-05_GhostCode_Mobile_A11y_Polish.md`. Reality clarified: it's a 4-token directional quiz, not a maze. Open follow-up: learn mode hides the question behind the hint panel (pre-existing on desktop too).

## Next Actions (all optional)
- **Phase 4 growth (Quinn):** spaced-repetition / per-category stats / new command categories — gate on Sky's appetite.
- **Branch prune (Rory):** 10 stale branches + the two just-merged feature branches (the 2 local feature branches were pruned this cycle).
- **prompt-library link fix:** `promptlibrary.skypistudio.com` DNS was never set up → broken Live-demo link on portfolio's prompt-library card. Same 3-step pattern as this cycle (Cowork DNS add → CNAME file → Pages config). Out of scope until Sky asks.
- **Legal:** real IP attorney review of the Ghost Code rebrand (Jordan flagged this; one-page summary at `/tmp/Ghost_Code_Legal_Summary.md`).

## Open Risks
- None blocking.
- (Minor) Vercel rebuild lags push by ~1 min; GitHub Pages similar.
- (Latent) Sky's `polish/portfolio-wow-2026-06-04` branch (parallel agent work) — currently converged with main, but worth watching for collisions.
