# Ghost Code — Overhaul Pass 2: Layout Integrity

**Date:** 2026-06-17
**Branch:** `feat/ghost-code-pass2-layout-2026-06-17` (stacked on the Pass 1 branch; **NOT merged — Sky merges**)
**Scope:** Pass 2 of the overhaul plan (§10 of `~/.claude/plans/opus-4-8-ultracode-nested-parasol.md`). **Layout structure only — no visual modernization** (colors/fonts/glow unchanged; that's Pass 3), **no `localStorage`/schema touch**, no new features.
**Files changed:** `index.html` only (CSS in the inline `<style>`).

---

## The root cause it fixes
The whole play area was **absolutely positioned at fixed pixels** inside `#cabinet` (HUD `top:28`, prompt `top:130`, arena `top:52%`, hint `bottom:92`, bar `bottom:28`), and the **only** responsive breakpoint was `@media (max-width:600px)`. So any viewport that was **wider than 600px but short** fell back to a desktop layout built for ~780px height and **collapsed** (740×380: prompt over Phantom, tokens over the control bar), and small phones with long commands **overlapped** (320×568: N token over E by ~30px, S token over the bar).

## What changed
1. **`#cabinet` → flex column.** The play regions (mode-toggle → HUD → progress bar → prompt → learn-panel → arena → hint → bar) now **stack in normal flow** and can never overlap at any size. DOM order is preserved; visual order is set with `order:`. The arena (`flex:1`) absorbs leftover height. Decorative `.corner` brackets and `.screen` overlays stay absolute (out of flow). (D1, D2, D3, D7, D10)
2. **Learn panel flows *below* the prompt (D6).** Previously the opaque panel covered the question (and `visibility:hidden` hid it on mobile), so learners picked a command for a task they couldn't see. Now the question stays visible with the hint panel beneath it.
3. **Cabinet padding tied to `--cab-pad-*` vars**; `.screen` overlays extend over the padding (negative inset) so title/game-over/pause cover the **full** frame (no cabinet-bg strip), preserving the Pass 1 opacity fix.
4. **Small-screen diamond tuning** (`≤600px`): N/S tokens pushed to the arena edges + command text/padding reduced so even the longest 3-line command (`git reset HEAD index.html`) clears the centered E/W tokens.
5. **New height-keyed media query (`max-height:500px`)** for short landscape / split-screen: the cabinet **scrolls** instead of clipping (nothing unreachable), the diamond gets a full-size arena reached by scroll, and chrome condenses. This is the band the old width-only breakpoint ignored.

## Verification (Chromium headless preview, measured via getBoundingClientRect)
| Case | Before | After |
|---|---|---|
| **740×380** (rotated phone / split-screen) | catastrophic overlap (prompt/Phantom/tokens/bar) | flow stack, **0 token overlap** (longest card), cabinet **scrolls** (556/616px in 357px) — nothing clipped |
| **320×568 + longest card** | N over E ~30px, S over bar | **0 overlap**, 16px token gaps, S clears bar by 37px, **fits in 568px (no scroll)** |
| **768×1024** | mode-toggle over STREAK/SPIRITS (D7) | toggle is its own row above the HUD — **no overlap** |
| **375×812 portrait** | ok | clean, well-spaced |
| **1280×800 desktop** | ok | clean; original composition preserved |
| **Learn mode (D6)** | question hidden behind hint panel | **question visible**, hint panel flows below it |
| **Pause / .screen** | (Pass 1 made opaque) | fully covers cabinet incl. padding; opaque; no bleed |
| **Arcade wrong-answer** | — | hint shows below diamond; layout still fits (no overflow) |

**Green gate: PASS** (`node --check` cards.js + inline `<script>`; 56-card validator). `index.html` only.

## NOT verified / known remnants
- **Chromium-only** — Safari/WebKit, Firefox, and real-device touch unverified (the preview also intermittently renders screenshots at sub-scale after resize+reload; geometry was confirmed numerically via getBoundingClientRect).
- **D8 (cosmetic):** `--cached` still wraps to "-- cached" on the narrowest tokens (hyphen break). Defer to Pass 3, where command text moves to JetBrains Mono and can use `overflow-wrap`/`nowrap` handling.
- **Game-over screen** not re-screenshotted in Pass 2 (it's a `.screen` overlay governed by the same rules verified via pause; its content/markup was untouched; Pass 1 verified its rendering).
- Short-landscape (`max-height:500px`) intentionally **scrolls** — a vertical compass diamond + full chrome can't all fit at ~380px tall; scrolling guarantees nothing is clipped/unreachable (degraded but usable on an unusual orientation for a portrait game).

## DECISIONS FOR SKY
- **Merge is yours.** Branch is stacked on Pass 1 (so merging Pass 2 brings Pass 1 with it, in order). `main` untouched, nothing pushed.
- **Design Compiler (Const. Art. 2.4):** this is a layout/structure pass that does not change the visual identity, but it does alter composition (mode-toggle is now a row above the HUD; learn panel below the prompt). Recommend Dani's Design-Compiler review before UI-DONE.
- **Next:** Pass 3 (visual modernization — the "Terminal not arcade" tokens/type/materiality) per the plan.
