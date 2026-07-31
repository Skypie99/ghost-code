# Ghost Code — Light Mode · STEP 0 DISCOVERY

**Date:** 2026-07-31 · **Branch:** `theme/light-mode` off `main` @ `cff5321`
**Repo:** `~/Games/pacman-code-trainer` (`Skypie99/ghost-code`) · **Live:** https://ghostcode.skypistudio.com

Banked before any code was touched. Everything below was read out of the repo, not assumed.

---

## 1. Stack & styling mechanism

| Fact | Value |
|---|---|
| Build | **Zero build.** No `package.json`, no bundler, no framework, no TypeScript |
| App | `index.html` — **3030 lines**, inline `<style>` (L46–1635) + inline `<script>` (L1803–3028) |
| Deck | `cards.js` — 56 cards on `window.CARDS`, 284 lines |
| Test | `test/cards.test.js` — zero-dep deck validator |
| Styling mechanism | **CSS custom properties** on `:root` (L74–135) — 52 property definitions |
| Data | `localStorage['gc.v1']` only. No network, no DB |

**This is the single most important discovery: the project is already token-driven.** The
"terminal, not arcade" redesign (Pass 3) lifted the palette into a semantic `:root` block —
surfaces / text / accent / semantic-status — and then *remapped the retired synthwave token
names onto the new ones* (L106–127) so the ~1500 lines of rules below adopted the calm palette
without being rewritten. A light theme is therefore a **token-value override**, not a rewrite.

---

## 2. Full colour census

**70 colour-bearing occurrences** in `index.html` (`#hex`, `rgb()/rgba()`, `hsl()/hsla()`).
Verified by mechanical scan, not by eye. They split three ways:

### 2a. Dead — the retired synthwave layer (25 occurrences, 0 rendered)

L172 is `#stars, #sun, #grid, #scanlines, #vignette { display: none !important; }`. Every
colour inside those five rule bodies is unreachable:

| Lines | What | Count |
|---|---|---|
| L187–196 | `#stars` twinkle gradients (`#fff` ×10) | 10 |
| L212–213 | `#sun` neon glow (`rgba(255,46,149,.55)`, `rgba(255,110,199,.3)`) | 2 |
| L217–222 | `#sun` bar mask (`#000` ×10) | 10 |
| L265–266 | `#scanlines` (`rgba(0,0,0,.18)` ×2) | 2 |
| L276 | `#vignette` (`rgba(0,0,0,.55)`) | 1 |

**Decision: left untouched.** Deleting them is repo cleanup, not light-mode work — that is
scope smuggling. They render nothing in either theme. → **Parking lot P-1.**

### 2b. `:root` tokens (existing) — L74–135

Solid values: `--surface-base #0E1116` · `--surface-raised #161B22` · `--surface-token #1C232E` ·
`--border-subtle #2A323D` · `--border-strong #3A4453` · `--text-primary #E6EDF3` ·
`--text-secondary #9DA7B3` · `--accent #3DD8C4` · `--accent-quiet #1E6F66` ·
`--accent-hover #5FE6D4` · `--accent-subtle #BFF5EE` · `--success #4ADE80` ·
`--warning #FBBF24` · `--danger #F87171` · `--phantom-eye #ffffff`

Alpha-composed values already in `:root` (these are the ones that break under a naive flip —
they are **white lifts** and **black shadows**, both of which invert in meaning on a light surface):

| Token | Dark value | Why it breaks on light |
|---|---|---|
| `--surface-track` | `rgba(255,255,255,0.06)` | a white lift is invisible on a white page |
| `--surface-hover` | `rgba(255,255,255,0.04)` | same |
| `--shadow` | `0 1px 2px rgba(0,0,0,.45), 0 8px 24px rgba(0,0,0,.30)` | 45%/30% black is a bruise on light |
| `--accent-halo` | `0 0 16px rgba(61,216,196,.35)` | a glow reads as blur/haze on light |
| `--neutral-halo` | `0 0 16px rgba(157,167,179,.35)` | same |
| `--danger-glow` | `rgba(248,113,113,0.55)` | same |
| `--phantom-glow` | `rgba(61,216,196,0.35)` | same |
| `--phantom-tail` | `rgba(61,216,196,0.16)` | 16% teal vanishes on white |
| `--phantom-eye-dim` | `rgba(255,255,255,0.55)` | (sits on the teal body — stays white, see §5) |

### 2c. Raw colours in **live** rules — 20 occurrences, the actual Phase 1 work

| Line | Value | Where | Semantic |
|---|---|---|---|
| L176 | `rgba(61,216,196,0.05)` | `#sky` ambient wash | accent @5% |
| L519 | `#fff` | `.phantom-eye-l/-r` fill | **`--phantom-eye` exists and is unused here** |
| L546 | `rgba(61,216,196,0.42)` | `.phantom-tail` gradient near | accent @42% |
| L547 | `rgba(61,216,196,0.14)` | `.phantom-tail` gradient far | accent @14% |
| L661 | `rgba(74,222,128,0.12)` | `.token.correct` fill | success @12% |
| L663 | `rgba(74,222,128,0.35)` | `.token.correct` glow | success @35% |
| L668 | `rgba(248,113,113,0.12)` | `.token.wrong` fill | danger @12% |
| L670 | `rgba(248,113,113,0.30)` | `.token.wrong` glow | danger @30% |
| L681 | `#fff` | `.token.correct/.wrong::after` | **dead** — both overridden at L683/L684 |
| L701 | `rgba(74,222,128,0.5)` | `.token.captured` glow | success @50% |
| L744 | `rgba(74,222,128,0.30)` | `#win-strap` glow | success @30% |
| L756 | `rgba(74,222,128,0.55)` | `@keyframes flash` | success @55% |
| L765 | `rgba(248,113,113,0.35)` | `@keyframes danger-pulse` 0% | danger @35% |
| L766 | `rgba(248,113,113,0.60)` | `@keyframes danger-pulse` 40% | danger @60% |
| L767 | `rgba(248,113,113,0.35)` | `@keyframes danger-pulse` 100% | danger @35% |
| L820 | `rgba(251,191,36,0.12)` | `.btn.lifeline-btn:hover` | warning @12% |
| L1020 | `rgba(61,216,196,0.06)` | `.screen` ambient wash | accent @6% |
| L1267 | `rgba(8, 11, 16, 0.72)` | modal scrim | near-`--surface-base` @72% |
| L1471 | `rgba(61,216,196,.32)` | `.phantom-head` halo @≤600 | accent @32% |
| L8 | `#0E1116` | `<meta name="theme-color">` | **HTML, not CSS** — Phase 3 |

**Gradients / shadows / borders that carry colour:** all live ones resolve through tokens
already, except the phantom tail (L545–548) and the head halo (L1471) listed above. The title
wordmark gradient (L1055) and pause wordmark gradient (L1122) are fully token-driven.

**Colour-carrying binary assets:** `favicon.svg` (dark `#0E1116` tile + `#3DD8C4` Phantom +
`#ffffff` eyes), `favicon-32.png`, `favicon-180.png`, `favicon.ico`, `og-image.png` (1200×630).

---

## 3. Existing theme mechanism

**None.** Verified by scan — zero occurrences of `prefers-color-scheme`, `color-scheme`,
`data-theme`, or any theme class. The app is a single fixed dark theme.

Adjacent media queries that DO exist and must keep working:
`prefers-reduced-motion` (L1368) · `forced-colors: active` (L1394) · `max-width:600px` (L1417,
L1628) · `601–819px` (L1514) · `max-height:500px` (L1527).

Also absent and needed for a complete light theme: **`::selection`** (no rule anywhere) and
**`color-scheme`** (drives UA scrollbars/form controls). No `<input>`/`<select>`/`<textarea>`
exists in the app, so form-control theming is limited to the `color-scheme` declaration itself.

**JS never writes colour.** Every `.style.*` write in the inline script is `width`, `transform`,
`pointerEvents`, `left`, `position`, `top`, or `opacity` — verified line by line. So the theme
cannot be fought by inline styles.

---

## 4. How the theme will be driven

The showcase factory needs a **deterministic** way to set the theme, so it can't be
`prefers-color-scheme`-only. Design:

- `prefers-color-scheme` honoured when the user has expressed no preference.
- An explicit in-project toggle writes `data-theme="light"|"dark"` on `<html>` and persists.
- Persistence goes in the **existing `gc.v1` object** (additive key, per the project's hard rule
  that `gc.v1` keys are never renamed) — with a separate pre-paint mirror, see below.
- **FOUC:** a tiny synchronous script in `<head>`, before the stylesheet paints, resolves and
  stamps the attribute. It must read from a key it can parse *cheaply and synchronously*.

## 5. The identity question (drives Phase 2)

Ghost Code's identity is **one phosphor-teal accent on graphite**, mono commands, a teal
Phantom, and colour reserved for meaning. In light mode:

- `--accent #3DD8C4` on white is **1.9:1** — fails as text/UI. The accent must **darken** for
  light while staying recognisably the same teal. (This is the naive-flip trap.)
- `--success/#4ADE80` (1.7:1 on white), `--warning/#FBBF24` (1.7:1), `--danger/#F87171` (2.9:1)
  all fail on a light surface and must be re-picked, not reused.
- The Phantom's **white eyes stay white** — they sit on the teal body, not on the page surface.
  That is the one white that must NOT invert.
- Glows must become **shadows + borders**; a bloom on light reads as a smudge.

---

## 6. Gates (this is the floor — nothing may regress)

The project has no `tsc` and no lint. The gate is:

```bash
node --check cards.js
open=$(grep -n '<script>' index.html | head -1 | cut -d: -f1)
close=$(grep -n '</script>' index.html | tail -1 | cut -d: -f1)
sed -n "$((open+1)),$((close-1))p" index.html | node --check -
node test/cards.test.js
```

Mirrored in CI at `.github/workflows/ci.yml` (runs on push/PR to `main`), plus a smoke check
that `index.html` still references `cards.js`.

Added for this work (evidence, not a repo gate): a deterministic Playwright capture harness at
`design-reviews/light-mode/tools/capture.mjs`. **Proven deterministic** — two independent runs
of unchanged code produced 14/14 byte-identical PNGs.

## 7. Deploy route (for Sky's merge step)

GitHub Pages serves `main` at the repo root; `CNAME` = `ghostcode.skypistudio.com`. There is no
Pages workflow file — it is the built-in branch deploy. So: **merge to `main` → push → Pages
redeploys automatically** (~50s, per the last ship). CI validates but does not deploy.

---

## Parking lot (found, deliberately not done — not light-mode work)

- **P-1** — the dead synthwave layer (`#stars/#sun/#grid/#scanlines/#vignette` markup at
  L1639–1643 + L1663–1664 and ~95 lines of CSS at L183–279) is `display:none !important` and
  renders nothing. Deleting it would shrink the file and remove 25 dead colours.
- **P-2** — `CLAUDE.md` §"Design Tokens" still lists the **retired synthwave palette**
  (`--neon-pink #e6237f` etc.) as the token list. It carries a self-aware note saying it is
  stale, but it is actively misleading to a new agent.
- **P-3** — `--phantom-eye` is defined in `:root` (L133) but never referenced; `.phantom-eye-l/-r`
  hardcodes `#fff` instead. (Phase 1 closes this one, since it is a tokenization hole.)
- **P-4** — `L681 color:#fff` is a dead declaration, overridden by L683/L684 for both states.
