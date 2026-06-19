# Attribution Pass — Ghost Code

> **UPDATE 2026-06-19: MERGED + LIVE.** Attribution shipped (commit `b44e232` on origin/main, byline "Built by Sky Halisky" live); origin/main is now `a2cbc23`. The "QUEUED FOR SKY" status and "live origin/main `8496cd2`" lines below are superseded — kept for history.

**Date:** 2026-06-18
**Branch:** `attribution/ghost-code-credit-2026-06-18` (commit `b44e232`, off local `main` 90ae9de)
**Status:** ✅ Verified · **QUEUED FOR SKY** (public claim → Sky-only `git merge --ff-only`)
**Surface:** ghostcode.skypistudio.com (live origin/main `8496cd2`; local main is 1 docs-only commit ahead)

---

## Why
Cold-eye review: Ghost Code "loads instantly, tasteful — then no name, no source link, no backlink, no about." Anonymous + orphaned → does zero career work standalone. Fix: a tasteful credit on the start screen + author meta, so it reads as Sky's and links home to the hub.

## What changed (1 file: `index.html`)
1. **Start-screen credit** — below `PRESS START`: `Built by Sky Halisky` (→ https://skypistudio.com) · `Source` (→ github.com/Skypie99/ghost-code), styled with existing tokens (`--text-secondary` / `--font-ui` / `--accent` over a `--border-subtle` top rule). Links **underlined** (`text-underline-offset:3px`) so they're distinguishable by more than color (WCAG 1.4.1).
2. **`<meta name="author" content="Sky Halisky">`** added to `<head>`.

og:image was already present and correct — left untouched.

## Constraints honored
- **Attribution only** — no game logic, no inline `<script>`, no `cards.js` touched.
- **Design tokens only** — reused the real "terminal not arcade" tokens (`--accent` #3DD8C4 ≈9.8:1 / `--text-secondary` #9DA7B3 ≈6.5:1 on `--surface-base`, both ≥AA).
- **main untouched** — branch only; Sky merges ff-only (Const. Art.1 / project CLAUDE.md).

## Verification
- **Green gate passes:** `node --check cards.js` OK · inline `<script>` parses · `node test/cards.test.js` → 56 cards pass.
- Served file (this is a single static `index.html`, served directly) contains: the byline + backlink, the Source link, and `author` meta. og:image intact.

## DECISIONS FOR SKY
1. **Approve** the start-screen credit wording + **merge** `attribution/ghost-code-credit-2026-06-18` (ff-only), then `git push origin main` to deploy.
2. Engine note: shipped Chromium-only; the credit uses standard CSS (no `background-clip` tricks) so it's low-risk, but a quick glance on iPhone Safari is welcome.

## Out of scope (flagged, not done here)
- `CLAUDE.md` is **stale** (still describes the old Pac-Man arcade theme / Press Start 2P / neon tokens) — Morgan's review already flagged this for a separate doc-refresh pass; not touched here.

## Post-verification note (branch hygiene)
The independent audit caught that a **concurrent agent** committed Morgan's separately-queued Ghost Code work (CLAUDE.md/README rebrand + HUD `1UP→SCORE`/`HI-SCORE→BEST` relabel + the `@supports` invisible-wordmark fallback) **on top of** this attribution branch. To keep Sky's attribution branch clean and reviewable, I separated them:
- `attribution/ghost-code-credit-2026-06-18` → reset to **`b44e232`** = my credit change **only** (`index.html`, +6 lines). Re-verified: diff vs `main` is `index.html` only.
- `identity/ghost-code-terminal-rebrand-2026-06-18` → **`771bbd9`**, preserving the concurrent agent's rebrand work for Sky to review/merge separately (no data lost).
