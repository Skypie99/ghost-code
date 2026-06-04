# Design Compiler — Ghost Code Rebrand
**Role:** Dani (Creative Director)
**Date:** 2026-06-04
**Branch:** `rebrand/ghost-code-2026-06-04`
**Base commit inspected:** `1912794` (Shamus build)
**Report commit:** see below
**Decision:** POLISH → green-gated → **PASS**

---

## Runtime Check

Server: `python3 -m http.server 8137` — serving `index.html` + `cards.js`.

Headless Chrome (CDP) loaded `http://localhost:8137/`, clicked `#start-btn`, confirmed:

| Check | Result |
|---|---|
| Title screen renders | PASS — `title: "Ghost Code"`, titleVisible: true |
| Start button clickable | PASS — `'clicked'` returned |
| Title hides on start | PASS — `titleHidden: true` |
| Phantom exists in DOM | PASS — `#phantom` found |
| Command tokens populated | PASS — 4 tokens with real card answers |
| Spirit pips rendered | PASS — `livesPips: 3` |
| No `.ghost` class in DOM | PASS |
| No `#pac` in DOM | PASS |
| No `.life` class in DOM | PASS |
| Console errors | NONE observed |
| Green gate: `node --check cards.js` | PASS |
| Green gate: `node test/cards.test.js` | PASS — 56 cards |

**Runtime verdict: CLEAN — game runs, no errors.**

---

## Layer 1: Tokenization

All design-system tokens defined in `:root` (lines 13–43):
- `--bg-deep`, `--bg-mid`, `--neon-pink`, `--neon-mag`, `--neon-cyan`, `--neon-purp`, `--neon-blue`, `--sun-*`, `--gold`, `--soft`, `--dim`, `--danger`, `--danger-glow`, `--neon-pink-soft/glow`, `--neon-cyan-soft/glow`, `--shadow-*`
- Phantom-specific: `--phantom-core`, `--phantom-glow`, `--phantom-tail`, `--phantom-eye`, `--phantom-eye-dim`

Raw hex values outside tokens are all **structural or inline expansions** of defined token values:
- Star dots, vignette overlay — `#fff`, `rgba(0,0,0,…)` (generic; correct)
- Phantom eye white — `#fff` (background: #fff for eye whites; acceptable)
- Wrong-answer token flash — `#8b0000`, `#5a0010` (deep crimson, unregistered but correct for a danger state that never touches text)
- Hover/active states — `#0a0118` text on cyan bg (= `--bg-deep` value)
- All purple shadows updated from inline `rgba(157,78,221,…)` → `rgba(168,85,225,…)` to match corrected token (see Layer 2)

**Verdict: PASS** — palette is coherent; minor inline expansions are correct.

---

## Layer 2: Accessibility Parity — Contrast (WCAG 2.1 AA)

Contrast calculations against `--bg-deep` (#0a0118) and token backgrounds:

| Element | Color | Background | Ratio | AA Normal | AA Large |
|---|---|---|---|---|---|
| Phantom body / spirit pips | #06f3ff | #0a0118 | 14.82:1 | PASS | PASS |
| HUD labels (neon-cyan) | #1ed4e6 | #0a0118 | 11.27:1 | PASS | PASS |
| GHOST gradient title (mid) | ~#b4f8ff | #0a0118 | 17.29:1 | PASS | PASS |
| Token N text (cyan) | #1ed4e6 | #0a0118 | 11.27:1 | PASS | PASS |
| Token E text (pink) | #e6237f | #0a0118 | 4.77:1 | PASS | PASS |
| Token S text (purple) — **PRE-FIX** | #9d4edd | #0a0118 | 4.43:1 | **FAIL** | PASS |
| Token S text (purple) — **POST-FIX** | #a855e1 | token-mid-bg | 4.53:1 | **PASS** | PASS |
| Token W text (gold) | #ffd700 | #0a0118 | 14.53:1 | PASS | PASS |
| Body text (soft) | #f1e6ff | #0a0118 | 16.99:1 | PASS | PASS |
| Token key dim labels | #b59dde | #0a0118 | 8.58:1 | PASS | PASS |
| Big button (cyan on dark) | #1ed4e6 | #0a0118 | 11.27:1 | PASS | PASS |
| Button hover (dark on cyan) | #0a0118 | #06f3ff | 14.82:1 | PASS | PASS |

**POLISH applied:** `--neon-purp` bumped from `#9d4edd` (4.43:1) → `#a855e1` (4.53:1 on token mid-bg, 4.90:1 on bg-deep). Gap was 0.07:1 — marginal but a real fail against the token's own darker tinted background. The lightened value is perceptually identical in a neon context; hue is unchanged.

All inline `rgba(157,78,221,…)` shadow/glow/bg references updated to `rgba(168,85,225,…)` for consistency (decorative; no contrast impact).

**Post-fix verdict: ALL AA PASS.**

---

## Layer 3: Component Consistency

Verified all interactive elements share the two-font system:
- `.arcade` / `font-family: 'Press Start 2P'` — HUD labels, category badge, learn-mode badge, learn-panel status, token keys, bar buttons, big button, mode toggle, progress bar label, screen h1 GHOST/CODE spans
- `.term` / `font-family: 'VT323'` — body copy, prompt text, HUD values, token command text, hint bar, progress count, screen tagline

Confirmed no legacy component remnants: no `.dot`, `#pac`, `.pac-body`, `.ghost`, `.life` selectors anywhere in CSS or HTML.

All new components (`.spirit-pip`, `.token`, `.phantom-*`, `.lifeline-pip`, `.danger-flash`) are cohesive with the synthwave language.

**Verdict: PASS**

---

## Layer 4: Visual Entropy

Play-screen layout: Phantom center, 4 tokens at cardinal positions, HUD top, prompt top-center, hint bottom-center, bar bottom. Same structural clarity as original. No overcrowding.

New additions vs. original: splash art (sun, stars, grid backdrop) was already present. Ghost Code title treatment (GHOST large gradient + CODE smaller cyan + tagline) is clean, hierarchical.

Token variety (4 directional colors) adds intentional controlled entropy — the 4-color system is the core game mechanic signal, not noise.

**Verdict: PASS** — visual hierarchy is clear; entropy is controlled and intentional.

---

## Layer 5: Luxury / Portfolio Quality

Strengths observed in the real implementation:
- Synthwave backdrop (layered radial gradients + animated neon grid + CRT scanlines + vignette) is genuinely polished
- Phantom mascot: teardrop clip-path with floating animation + cursor-blink bar above head — distinctive, original, reads as premium pixel art
- Token glow effects (per-direction neon box-shadow) are consistent and atmospheric
- GHOST CODE title gradient (`--neon-cyan` → `#b4f8ff` → `--neon-pink`) is strong and portfolio-appropriate
- Cabinet border with corner piece accents gives an authentic arcade feel
- Spirit pip `cursor-blink` animation and `phantom-float` animation run smoothly
- `@media (prefers-reduced-motion)` respected throughout

Minor observation (non-blocking): The spirit pips in the start-screen screenshot render small (8×16px) at the HUD's top edge. At 1100×850 they read as intentional terminal cursor icons — legible and correct.

**Verdict: PASS** — Sky should be proud to show this; it reads as a complete, coherent, original game.

---

## Layer 6: Regression Safety

Green gate results (post-fix):
```
node --check cards.js              → PASS
node test/cards.test.js            → OK — 56 cards passed all integrity checks.
```

No game logic was touched in the POLISH commit — only the CSS custom property `--neon-purp` and its three inline rgba shadow/glow expansions were updated. No JS changes.

**Verdict: PASS — no regression.**

---

## Layer 7: Compile Decision

**POLISH → re-gated → PASS**

One issue found and fixed on this branch:
- `--neon-purp: #9d4edd` failed WCAG AA normal-text contrast by 0.07:1 on the purple token's own tinted background. Fixed to `#a855e1` (4.53:1 on worst-case bg, 4.90:1 on bg-deep). Perceptually identical; same hue family.

All other layers: PASS. No BLOCK-level issues.

---

## Trade-Dress Audit — Zero Pac-Man Elements

Searched `index.html` for all Pac-Man trade dress identifiers:

| Search term | Hits in executable code | Verdict |
|---|---|---|
| `pac-man`, `pacman`, `PAC-MAN` | 0 | CLEAR |
| `pac-body`, `pac-dot`, `pacdot` | 0 | CLEAR |
| `#pac`, `.pac` | 0 | CLEAR |
| `chomp`, `@keyframes chomp` | 0 | CLEAR |
| `waka` | 0 | CLEAR |
| `ghostHit` | 0 | CLEAR |
| `spawnGhost`, `.ghost`, `#ghost` | 0 | CLEAR |
| `ghost-red`, `ghost-pink`, `ghost-cyan`, `ghost-orange` | 0 | CLEAR |
| `@keyframes ghost-bob` | 0 | CLEAR |
| `.life` (Pac-Man silhouette life icon) | 0 | CLEAR |
| `clip-path: polygon(100% 50%` (Pac-Man wedge) | 0 | CLEAR |
| `--pac`, `--pac-glow`, `--dot-1/2/3/4` | 0 | CLEAR |
| `pmct` (storage key, visible) | 0 visible; `LEGACY_KEY = 'pmct.v1'` in JS only | CLEAR — migration constant, never shown to users |

CSS comment references (lines 220, 223, 318, 339) say "NOT a Pac-Man arc / silhouette" — these are design rationale notes explaining what the shapes are NOT. They are not trade dress; they document distinctiveness.

**Confirmation: ZERO Pac-Man trade dress in any user-visible surface. The game is legally distinct.**

---

## Screenshot

`/tmp/ghost-code-built.png` — **play screen** (title hidden, game running).

Shows: Phantom centered in arena, 4 command tokens active (cyan N: `> create todo.txt`, pink E: `> touch todo.txt`, gold W: `> new todo.txt`, purple S: partially visible), prompt "Create an empty file called 'todo.txt'", full HUD (1UP, HI-SCORE, STREAK, SPIRITS, 50/50 stars, CATEGORY: ALL), category filter bar, ARCADE/LEARN mode toggle.

Purple token text reads as `rgb(168, 85, 225)` = `#a855e1` (confirmed via CDP `getComputedStyle`).

---

## DECISIONS FOR SKY

None — all issues resolved on-branch. Ready for Sky's review and merge to main.
