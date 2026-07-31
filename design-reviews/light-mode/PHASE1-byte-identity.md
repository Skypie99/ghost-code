# Phase 1 — Tokenize, Dark-Proof · THE BYTE-IDENTITY GATE

**Branch:** `theme/light-mode` · **Base:** `main` @ `cff5321` · **Date:** 2026-07-31

The guarantee this phase makes: *the light theme cannot cost the dark theme anything, because
after the refactor the dark theme is provably the same pixels.* Below is the proof, not the claim.

---

## 1. What changed

`index.html` only. **67 insertions, 28 deletions.** Every one is a literal-colour → token
substitution, or a new token definition, or a comment. Zero changes to geometry, layout,
markup, JS, or animation timing.

### 1a. New tokens

**Channel triplets** — the alphas in this sheet are load-bearing design decisions (0.12 fill vs
0.35 glow vs 0.55 flash), so they stay per-use. Only the *channels* are shared:

```
--accent-rgb  61,216,196   --success-rgb 74,222,128   --danger-rgb 248,113,113
--warning-rgb 251,191,36   --muted-rgb  157,167,179   --overlay-rgb 255,255,255
--scrim-rgb   8,11,16
```

This is what makes the theme swap safe: 20 alpha-composed colours re-key from 7 declarations,
so none can be missed. `--overlay-rgb` is the important one — it is the *white lift* used by
`--surface-track`/`--surface-hover`, and it is exactly the thing a naive flip leaves white on a
white page.

**Composed tokens** (dark values byte-preserved): `--success-fill/-glow/-glow-soft/-glow-strong/
-glow-flash` · `--danger-fill/-glow-soft/-pulse-lo/-pulse-hi` · `--warning-fill` ·
`--phantom-tail-near/-far` · `--phantom-halo-sm` · `--wash-sky` · `--wash-screen` · `--scrim`

**One new semantic token:** `--ink-on-accent` (dark value `var(--surface-base)`). `.big-btn` and
`.mode-btn.active` previously used `--surface-base` directly as "the ink on my teal fill". Those
are two different ideas that happen to share a value in dark and *must diverge in light* — the
page surface goes near-white while the ink on a teal fill must stay dark. Splitting them now is
what keeps the light theme from having to fight the dark one.

### 1b. Literals lifted (20 sites → 0 remaining)

`#sky` wash · phantom eye fill · phantom tail near/far · `.token.correct` fill+glow ·
`.token.wrong` fill+glow · `::after` dead colour · `.token.captured` glow · `#win-strap` glow ·
`@keyframes flash` · `@keyframes danger-pulse` ×3 · `.btn.lifeline-btn:hover` · `.screen` wash ·
modal scrim · `.phantom-head` halo @≤600 · `.big-btn` ink · `.mode-btn.active` ink.

**Verification — raw colours remaining in live rules: 0.** The only literals left in the file are
(a) the `:root` token *definitions*, which is precisely where a theme overrides them, and (b) the
dead synthwave layer, deliberately untouched (see DISCOVERY §2a / parking lot P-1).

### 1c. Closed en route
- **P-3** — `--phantom-eye` was defined but unused; `.phantom-eye-l/-r` hardcoded `#fff`. Wired.
- **P-4** — `L681 color:#fff` was a dead declaration (both `.correct::after` and `.wrong::after`
  override it). Tokenized for hygiene; provably zero pixel impact, and the gate confirms it.

---

## 2. The gate

### 2a. First — is the instrument trustworthy?

A byte-comparison is only meaningful if the harness is deterministic. Proven before use:

> **Two independent runs of UNCHANGED code → 14/14 byte-identical PNGs.**

Determinism comes from: `Math.random` replaced with a seeded mulberry32 PRNG *before any page
script runs* (so card pick, answer shuffle and 50/50 elimination are fixed); `gc.v1` seeded to a
fixed object (fixed HUD, mastery bars, title stats); `document.fonts.ready` awaited (no
fallback-face capture); `animations:'disabled'` + `caret:'hide'`; `deviceScaleFactor: 1`.

### 2b. Then — the actual proof

14 key screens, captured on the real app at `main`@`cff5321`, then re-captured after the
refactor. Compared with `cmp` (byte comparison of the PNG files, not a perceptual diff).

| Screen | 1440×900 | 375×812 |
|---|---|---|
| Title | IDENTICAL | IDENTICAL |
| Board (arcade play) | IDENTICAL | IDENTICAL |
| Correct feedback | IDENTICAL | — |
| Wrong feedback | IDENTICAL | — |
| Token `:focus-visible` | IDENTICAL | — |
| Learn-mode reveal | IDENTICAL | IDENTICAL |
| Game over / results | IDENTICAL | IDENTICAL |
| Settings modal | IDENTICAL | — |
| Shortcuts modal | IDENTICAL | — |
| Pause | IDENTICAL | — |

```
IDENTICAL = 14        DIFFERS = 0
```

**The diff count is zero.** Not "zero apart from anti-aliasing noise" — there is nothing to
explain away, no crops required. The refactor did not change one pixel of the dark experience.

Console: clean on every capture (the harness fails a screen that logs an error or pageerror).

### 2c. Reproduce it

```bash
cd ~/Games/pacman-code-trainer && python3 -m http.server 8123 --bind 127.0.0.1 &
cd design-reviews/light-mode/tools
node capture.mjs ../captures/check            # current tree
git stash && node capture.mjs ../captures/base && git stash pop
for f in ../captures/base/*.png; do cmp -s "$f" "../captures/check/$(basename $f)" \
  && echo "IDENTICAL $(basename $f)" || echo "DIFFERS $(basename $f)"; done
```

---

## 3. Project gates at this stop

```
node --check cards.js                        OK: cards.js parses
inline <script> node --check                 OK: parses (lines 1842..3067)
node test/cards.test.js                      OK — 56 cards passed all integrity checks
index.html still references cards.js         OK
```

**Green.** This is the project's whole gate — no `tsc`, no lint exists (DISCOVERY §6).

---

## 4. State after this phase

The dark theme is unchanged and now fully token-addressable. **No light value exists yet** —
that is deliberate: the gate above had to run against a tree where a light theme was impossible,
so nothing could be masking a dark regression. Phase 2 designs the light palette.
