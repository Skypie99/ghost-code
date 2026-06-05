# Ghost Code — Mobile-Native + WCAG 2.2 AA + Polish Pass

**Date:** 2026-06-05 · **Scope:** `index.html` only (`cards.js` untouched) · **Branch:** `feat/ghost-mobile-a11y-2026-06-05`
**Trigger:** Sky — "full mobile-native optimization + accessibility pass + upgrade/polish on Ghost Code, same as the Prompt Library."

---

## TL;DR

Ghost Code was already *technically* tappable on a phone, but the layout clipped, had no touch tuning, and one action (the 50/50 lifeline) was keyboard-only. This pass made it genuinely phone-native (responsive compass diamond + swipe-to-answer + touch tuning), closed the remaining WCAG 2.2 AA gaps, and polished the feel — in 6 small, per-area commits, green gate green throughout, desktop layout preserved.

## Reality check (verified, contradicts the brief's framing)

The brief described a moving-maze Pac-Man (arrow keys, swipe-to-turn, d-pad, "queue next turn", responsive maze grid). **Ghost Code is not that** — it's a **4-choice directional quiz**: the Phantom sits centre, four command tokens sit at N/E/S/W, you pick the right command and the Phantom rotates to aim at it. Tokens already had a `click` handler (a tap registered), and input was `1`–`4` + letter shortcuts — **not** arrow keys, **not** keyboard-only. So the work was layout + touch tuning + a few a11y items, and the requested "swipe" was adapted to the game that exists: **swipe up/right/down/left selects the N/E/S/W token** (no d-pad — the tokens *are* the directional targets). Confirmed with Sky before building.

## What changed (per commit)

| Commit | Area | Summary |
|---|---|---|
| `bdca032` | Mobile foundation | `viewport-fit=cover` (pinch-zoom still allowed); `overscroll-behavior:none`; `touch-action:manipulation`; `-webkit-tap-highlight` off; `#arena{touch-action:none}` for swipe; safe-area-inset padding; kept `.missed-review`/`.screen` touch-scrollable |
| `435c95e` | Responsive scale | arena/token/prompt sizes fluid via `clamp()/min()` (desktop values = the upper bound, so **desktop unchanged**); replaced the one crude breakpoint with a full portrait layout — mode toggle no longer overlaps the HUD, compass diamond centred & scaled so N/E/S/W never clip, hint sits above the bar, learn-mode panels re-anchored under the taller HUD and capped so long reveal phases scroll |
| `6407b3d` | Swipe + feedback | swipe-to-answer on `#arena` → N/E/S/W via existing `answer()`; tap still works (sub-28px drag falls through); `.token:active` brightness pop + depress; subtle `navigator.vibrate` (reduced-motion-aware) |
| `d649ccc` | Control parity | added the **50/50 lifeline button** to the bar (was keyboard-only `H`), gold-accented, disabled w/ aria when none left; title hint line swaps to TAP/SWIPE wording on touch devices |
| `5fd6af0` | WCAG 2.2 AA | **1.4.1** ✓/✗ glyph on correct/wrong (shape, not colour-only); **2.3.1** correct-token flash cut from `0.4s ×3` (~7.5/s) to one `0.5s` bloom; **2.5.8** mode-toggle ≥28px (all controls ≥24px); pause/resume announced via live region |
| _(this)_ | Polish + docs | button `:active` press feedback (consistent with tokens); PLAN/PROJECT_STATE/LEARNINGS updated; this report |

## WCAG 2.2 AA coverage

- **1.4.1 Use of Color** — fixed: ✓ / ✗ glyph distinguishes correct vs wrong independent of colour.
- **1.4.3 Contrast** — held: palette was AA-audited; new glyphs are white (#fff) on either token bg + dark-edge shadow; gold 50/50 button text ≈14:1 on the dark bar. No existing colours changed.
- **2.3.1 Three Flashes** — fixed: single bloom, < 3 flashes/sec, true even with reduced-motion off.
- **2.5.7 Dragging Movements** — met: swipe is an alternative; a single tap on a token is always a full path.
- **2.5.8 Target Size (Minimum)** — met: every control ≥24px (mode toggle 28px, bar buttons ~38px, tokens large). _Note: bar buttons are ~38px, above the 24px AA floor but below the 44px "ideal" — going to 44px pushed the 7-button bar into a 3rd row that collided with the hint, so the AA-compliant size was kept._
- **2.4.7 Focus Visible / keyboard** — held: existing focus-visible rings intact; no trap; Esc pauses; game-over focuses Play Again; pause announces and keeps focus on the trigger.
- **prefers-reduced-motion** — held: global rule neutralises animation/transition; new `:active` feedback snaps (no motion travel); haptics suppressed under reduced-motion.

## Verification

- **Green gate** after every commit: `node --check cards.js`, inline `<script>` re-derived + `node --check`, `node test/cards.test.js` → **56 cards pass**, 0 console errors.
- **Real device emulation** (Chrome DevTools `Emulation.setDeviceMetricsOverride`, 390×844 @2x — not raw `--window-size`, which crops < 500px): portrait fit confirmed with **no clipping / no horizontal scroll** across arcade, learn (pre + reveal), title, game-over. Element rects measured to confirm zero collisions, incl. the deck's longest prompt (clears N by 21px) and the tall reveal panel (NEXT button on-screen).
- **Touch exercised** via synthetic `touchstart/touchend`: all four swipe directions map correctly (up→N 270°, right→E 0°, down→S 90°, left→W 180°); sub-threshold drag ignored; tap still answers; 50/50 button eliminates exactly 2 wrong tokens (correct survives), 3→2, idempotent per card.
- **Before/after** real PNGs captured at true device width (delivered to Sky).

## Observations / follow-ups (out of scope this pass)

1. **Learn mode hides the question.** In learn mode the opaque hint panel covers the prompt — on **desktop too** (pre-existing). The player sees the hint + 4 options but not the task description. Mobile matches that behaviour here (prompt hidden so a short hint can't let it peek). Worth deciding whether to surface the question in learn mode (would be a small, separate UX change to both desktop + mobile).
2. **Bar buttons ~38px** (AA-compliant, below the 44px touch ideal) — see 2.5.8 note. A future "condensed HUD / fewer bar buttons" pass could free room for 44px.

## Ship

Merge `feat/ghost-mobile-a11y-2026-06-05` → `main`, push → live at ghostcode.skypistudio.com (GitHub Pages). Rollback: `git revert -m 1 <merge-sha> && git push`.
