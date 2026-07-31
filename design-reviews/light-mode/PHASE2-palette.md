# Phase 2 — The Light Palette · CANDIDATES + CONTRAST + MOCKUP GATE

**Branch:** `theme/light-mode` · **Date:** 2026-07-31 · **Status:** STOPPED for Sky's pick

Three candidate light palettes, designed as full token sets in three genuinely different
directions — not three shades of one idea. Every one keeps the phosphor teal, the mono commands,
the `> ` prefix and the Phantom; every one **darkens** the accent rather than washing it out.

Decision page (mockups + tables, clickable):
https://claude.ai/code/artifact/cd502319-8eac-4d84-9dfd-0408e63900b7

---

## 1. The three directions

| | Direction | The idea |
|---|---|---|
| **A** | **Paper** — warm off-white, ink-on-stock | Greys carry a red-yellow cast. Against warmth the teal reads cooler and more deliberate, so the accent gets *louder without getting brighter*. A printed manual for the terminal. |
| **B** | **Platinum** — cool blue-grey, graphite in daylight | The literal sibling: the shipped base is a blue-*black*, so its twin is a blue-*white*. Conserves the palette — dark's `#0E1116` surface becomes light's **ink**. |
| **C** | **Phosphor** — the glow leaking into the room | Surfaces carry a whisper of brand teal, so the page looks faintly lit by the phosphor. Brand lives in the *surface*, not only the accent. Least generic of the three. |

Token sets: `tools/palettes.mjs` — the single source of truth that both the contrast checker and the
mockup renderer import, so a number in the table is by construction the number that rendered.

## 2. Contrast — measured, never eyeballed

47 pairings, each tied to the `index.html` line it occurs on. WCAG 2.2: 4.5:1 text · 3:1 large text
and UI boundaries (SC 1.4.11). Translucent fills are **flattened against their real backdrop** before
measuring — measuring `rgba()` against nothing would be a lie.

| Theme | Required pairings passing |
|---|---|
| A · Paper | **47 / 47** |
| B · Platinum | **47 / 47** |
| C · Phosphor | **47 / 47** |
| Dark (shipped, untouched) | 46 / 47 |

**Two findings worth stating plainly:**

1. **The tool caught a real failure in my own first draft** — `--border-strong` on `--surface-base`
   came in at ~2:1 in all three candidates. Fixed (3.49–3.71:1) before this document existed, per
   the rule that a failing candidate is fixed or cut before Sky sees it.

2. **The shipped dark theme fails that same pairing at 1.92:1.** Pre-existing, *not* introduced
   here. I did **not** fix it — changing dark would break the byte-identity guarantee Phase 1 is
   sworn to. Parked as **P-5**.

Tightest pairings in each candidate (all clear; least headroom, so first to bite on a future tweak):

| Pairing | A | B | C |
|---|---|---|---|
| Token `>` prefix on token surface | 5.33 | 5.13 | 5.34 |
| Wordmark GHOST · lightest gradient stop | 4.52 | 4.39 | 4.36 |
| Progress fill vs its track | 4.95 | 4.88 | 5.03 |
| ✗ glyph on wrong fill | 5.00 | 4.89 | 4.90 |
| `--border-strong` on base (SC 1.4.11) | 3.71 | 3.54 | 3.49 |

## 3. A latent bug caught by rendering, not by measuring

The contrast table passed while the wordmark was still **wrong**. `--accent-quiet` was doing two
incompatible jobs: the *pale fill* behind `.btn.active`/pressed segments, **and** the *dark end* of
the GHOST wordmark and Phantom-head gradients. In dark those happen to share a value; in light the
fill must go pale (dark ink sits on it) while the gradient's shadow end must stay deep — so fusing
them faded "GHOST" toward near-white at its 100% stop.

Fixed by splitting out **`--accent-deep`** (gradient shadow end) from `--accent-quiet` (fill). In
dark, `--accent-deep: var(--accent-quiet)` — identical by construction, and **re-verified**: the
byte-identity gate was re-run after the split and still reads 14/14 IDENTICAL, 0 DIFFERS.

This is the argument for the mockup gate existing at all: a swatch grid would have shipped it.

## 4. The mockup gate

Each candidate rendered on the **real app** (token block injected into the live page), 9 states ×
4 themes = **36 shots**, dark first in every row for identity comparison:
title · board · correct · wrong · learn-reveal · results · settings · title@375 · board@375.

Also fixed here: the `gameover` driver was answering while `state.busy` was still true, so it
captured mid-play instead of the results screen. Now guarded and polls for the real game-over state
— so the mastery bars, run slivers and missed-review list are actually visible for judging.

Gallery: `captures/mockups/gallery.html` (self-contained). Harness: `tools/mockups.mjs`.

## 5. Gates at this stop

```
node --check cards.js                    OK
inline <script> node --check             OK
node test/cards.test.js                  OK — 56 cards passed
BYTE-IDENTITY vs main@cff5321            IDENTICAL=14  DIFFERS=0
contrast (all 3 candidates)              47/47 each
```

## 6. STOP — what I need from Sky

**Pick A, B or C.** Then Phase 3 builds the winner: `prefers-color-scheme` + explicit toggle +
persistence, no-FOUC pre-paint resolution, and the edges (scrollbars, `::selection`, focus rings,
redesigned shadows, favicon on light tabs, `theme-color` meta, reduced-motion-safe transition).

No light value is committed to `index.html` yet — the candidates live only in `tools/palettes.mjs`.

---

## Parking lot (added this phase)

- **P-5** — shipped dark `--border-strong` (`#3A4453`) on `--surface-base` (`#0E1116`) is **1.92:1**,
  under the 3:1 SC 1.4.11 floor for the `.token:hover` / `.btn:hover` / `kbd` boundary. Pre-existing,
  untouched here because fixing it would move the dark theme. Cheap fix if wanted: lighten to
  ~`#4A5666`.
