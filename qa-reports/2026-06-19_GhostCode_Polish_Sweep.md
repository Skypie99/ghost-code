# Ghost Code — Deep UI Polish Sweep (the craft layer)

> **UPDATE 2026-06-19: MERGED + LIVE** — the craft sweep is on origin/main (`a2cbc23`); markers verified live. The "Awaiting … Sky review + merge" status below is superseded — kept for history.

**Date:** 2026-06-19 · **Branch:** `feat/ghostcode-polish` (off `main`/`origin/main` `0a1cada`) · **File:** `index.html`
**Status:** BUILT + verified (green gate + built output). **Awaiting Dani Design-Compiler review → Sky review + merge (Sky-only, Const. Art. 1).**
**Plan:** `~/.claude/plans/opus-4-8-ultracode-steady-shell.md` (Ghost Code section)

## Method + headline finding
3 independent read-only critiques (spacing/layout · type/color/motion · detail/states/a11y). **Ghost Code is already genuinely well-built** — single calm dark theme, **zero layout breaks** at 320–1280 + 150% font + landscape, AA contrast throughout, token-driven, reduced-motion present, and (verified) the tokens' `aria-label` is set dynamically to `"Answer N of 4: <command>"` so screen-reader users *do* hear each command. So the right sweep here is small and precise — the craft is in filtering, not churning.

## Changed (each verified in built output; green gate green)
1. **A11y — attribution links** (`#title`): added `aria-label`s — "Sky Halisky — portfolio (opens in new tab)" and "Ghost Code source code on GitHub (opens in new tab)" (was bare "Source" with no destination/new-tab cue). Verified present.
2. **A11y — live announcer**: modernized the visually-hidden clip (`clip:rect(0,0,0,0)` → added `clip-path:inset(100%)`). No behavior change; removes a deprecated-property reliance.
3. **Material — modal scrim**: `rgba(8,11,16,0.82)` → `0.72` so the board keeps spatial context behind the settings/shortcuts modal. Verified (computed `0.72`).
4. **Consistency — segmented controls**: `.seg__btn` now `text-transform:uppercase` + `letter-spacing:0.04em` so ON/OFF/FULL/REDUCED/EASY/MEDIUM/HARD match the app's pervasive uppercase terminal labels (SOUND/CATEGORY/ALL/CLAUDE…). Verified uppercase render.
5. **Micro-interaction**: added a hover state for the *selected* segment (`[aria-pressed="true"]:hover` keeps the accent edge + brightness 1.1) — previously hovering a pressed segment downgraded its border to the inactive color.

## Verified-good → NO change (the sweep's "confirm" half)
- **Token wrap (AC3):** the longest real command ("git rm --cached index.html") wraps **at the space**, not mid-word, at 320px. No change.
- **Prompt measure (AC2):** longest prompt is 65 chars (already 2 lines at 680px); tightening would only add wraps. Declined.
- **Token a11y:** command is in each token's dynamic `aria-label` (JS line ~1725). Fine.
- **Reduced-motion (AC6):** global `0.01ms + iteration-count:1` rests decorative loops at a correct state; answer-direction end-state preserved. Correct as-is.
- **HUD stat numbers:** single-line tabular-nums; `line-height:1` is fine (no wrap). No change.

## Deliberately declined (with rationale)
- **The "replace tuned px with clamp()" cluster** (phantom 64→42 at 600px, HUD gap, etc.) — imperceptible at real use; risks perturbing tuned board geometry.
- **`.mode-btn.active` recolor** — the bright-teal active ARCADE/LEARN segment reads *well* as a segmented control (clear active mode, AAA contrast). Keeping it.
- **Phantom halo increase** — the "terminal, not arcade" identity deliberately minimizes glow; increasing it fights that decision.
- **Learn-panel feedback recolor** — amber=not-quite / teal=reveal / green=success is a defensible progression.

## Gates
- **Green gate GREEN:** `node --check cards.js` OK · inline `<script>` `node --check` OK · `node test/cards.test.js` = 56 cards pass.
- **Built output:** console clean; **no horizontal overflow at 320px** in title / settings-modal / playing — even at 150% font scaling. Identity ("GHOST"/"CODE", "Built by Sky Halisky") intact.
- **Scope:** CSS + static HTML attributes only — no JS logic, no card data, no localStorage schema touched (textContent/additive gotchas N/A).

## NEEDS-SKY / process
- **Design Compiler:** this is a UI change → routes to **Dani's 7-layer gate** before UI-DONE (Const. Art. 2.4). Changes are token-respecting + minor; expect PASS/POLISH.
- **Real iPhone Safari (AC7, engine-sensitive — NOT changed blind):** the title `background-clip:text` gradient (has an `@supports not()` fallback) and the phantom clip-path edges — confirm they read crisp.

## Review / merge (Sky-only)
```bash
cd ~/Games/pacman-code-trainer && git checkout feat/ghostcode-polish && python3 -m http.server 8000   # review
git checkout main && git merge --ff-only feat/ghostcode-polish && git push origin main                # ship (rollback: 0a1cada)
```
