# Ghost Code — Overhaul Pass 3: Visual Modernization ("Terminal, Not Arcade")

**Date:** 2026-06-17
**Branch:** `feat/ghost-code-pass3-visual-2026-06-17` (off merged main `2960280`; **NOT merged — Sky merges**)
**Scope:** Pass 3 of the overhaul plan (§7/§10 of `~/.claude/plans/opus-4-8-ultracode-nested-parasol.md`). The visual identity rewrite. `index.html` only. No `localStorage`/schema change, no game-logic change.
**Design Compiler:** UI-defining change — should route through Dani's 7-layer gate (Const. Art. 2.4) before UI-DONE. Flagged.

---

## What changed — the "cheap/juvenile/hard-on-the-eyes" fix
Recast Ghost Code from an 80s synthwave-arcade skin into a calm, modern dark **developer tool**. Kept the soul (cursor-ghost Phantom, `>` prefix, dark + mono-for-commands); shed the skin.

1. **Typography.** Dropped `Press Start 2P` (the pixel font, the #1 "juvenile" tell, at 8–11px) and `VT323`. New system: **Inter** for all UI/prose, **JetBrains Mono** for command/code text (token text, revealed answer, HUD numbers). Rule: prose = Inter, anything-you-type = mono. No text below ~12px (bumped HUD labels, mode/category buttons, badges from 8–11px → 11–13px).
2. **Palette → graphite + one accent.** New `:root` tokens: graphite surfaces (`#0E1116 / #161B22 / #1C232E`), `text-primary #E6EDF3` / `text-secondary #9DA7B3`, ONE accent `--accent #3DD8C4` (phosphor teal), semantic `success / warning / danger`. Old token names remapped to the new system so all references cascade. **The four token colours collapse to one neutral surface** — direction is encoded by position + number key, not hue.
3. **Killed the glow.** Global `* { text-shadow: none }` removed all text halation (~32 sources). Per-component box-shadow glow replaced with a single elevation shadow; the only surviving glow is one soft accent halo on the Phantom + focused/correct token.
4. **Killed the noise.** Removed the CRT scanlines (`mix-blend multiply` over all text), the vignette, and the animated synthwave sun/neon-grid/twinkling-stars; flat near-dark `#sky`. Dropped the arcade-cabinet chrome (corner brackets) + `backdrop-filter` blur; cabinet is now a quiet bordered card.
5. **Flat materiality.** Tokens, buttons, panels, badges, HUD, progress bar → flat surfaces, 1px borders, design-token radii. Command text is the hero (near-white mono, teal `>` prefix). State colour only: green=correct (✓), red=wrong (✗), teal=focus, amber=streak/lifeline.
6. **Phantom flattened** (calm teal, single soft halo; dropped the multi-stop gradient + heavy glow).
7. **Motion trimmed.** Removed ambient infinite loops (mascot float/tail pulse, star twinkle, grid scroll, spirit-pip blink); kept the cursor blink, aim rotation, press, single correct-bloom, and a softened score pop / title pulse.
8. **Bonus a11y fix:** added the missing `:focus-visible` ring to `.big-btn` (PRESS START / PLAY AGAIN) — closes a §9 finding early.

## Verification (Chromium headless preview)
| Surface | Result |
|---|---|
| Title (1280) | Clean Inter title, teal CTA, flat card — no glow/scanlines/synthwave |
| Arcade (1280) | All four tokens uniform neutral surface, near-white mono, teal `>`; calm HUD |
| State colours | wrong = red border/tint + ✗; correct = green border/tint + ✓ (verified) |
| Mobile 375 | Clean, fits, well-spaced |
| **Mobile 320 + longest card** | **No token overlap** (3-line wrap, 16px gaps), fits — verified after tuning token width/font for the wider mono |
| Short-landscape 740×380 + longest card | No overlap; cabinet scrolls (Pass 2 behavior holds) |
| Learn mode reveal | Question visible (D6 holds), "THE ANSWER IS" green, answer in teal mono rendered intact (Pass 1 holds), explanation grey |

**Green gate: PASS** (`node --check` cards.js + inline `<script>`; 56-card validator). `index.html` only.

**Contrast (designed to AA; Pass 5 re-audits formally):** token command text now `#E6EDF3` on `#1C232E` ≈ 12:1 (was the failing 4.30/4.42 neon); accent/amber/semantic pairs all clear AA. The old pink-text and white-on-pink AA failures are gone by construction.

## NOT verified / deferred
- **Chromium-only** — Safari/WebKit, Firefox, real-device touch unverified. (`background-clip:text` on the title is WebKit-sensitive — check on Safari.) Preview also renders some post-reload screenshots at sub-scale; geometry confirmed numerically.
- **Boot overlay (§8 #10) DEFERRED.** The two new font families load via `display=swap` (immediate fallback → swap), which is acceptable, not broken. A branded boot overlay to fully mask the swap is a discrete follow-up (kept out of this pass to avoid a late regression). Recommend as a small Pass 3.1 or fold into Pass 4.
- **Audio** still the original square-wave beeps (a Pass-3 "polish" note from the plan) — unchanged; fold into Pass 4 (the Settings/mute work) or a follow-up.
- Token command font on the smallest phones (≤~340px) drops to 11px for the single longest command so the diamond clears — a pragmatic exception to the ≥12px rule, only on that edge.

## DECISIONS FOR SKY
- **Merge is yours.** Stacked on the merged main (Pass 1+2). `main` untouched, nothing pushed, live site unchanged.
- **Design Compiler:** this is the visual-identity change — please route through Dani before UI-DONE / live deploy.
- **Live deploy still held** (Chromium-only verification; Safari/WebKit + real-device check recommended first).
- **Next:** Pass 4 (UX/feature layer — results screen, settings, deck picker, etc.) then Pass 5 (WCAG 2.2 AA sweep).
