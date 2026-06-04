# Ghost Code Rebrand — Build Report

**Role:** Shamus (Feature Pusher)
**Date:** 2026-06-04
**Branch:** `rebrand/ghost-code-2026-06-04`
**Commit:** `1137243`
**Base:** `24e5fe1` (main)
**Spec:** `dani/ghost-code-concept-2026-06-03:qa-reports/2026-06-03_Dani_GhostCode_Rebrand_Spec.md`

---

## What Was Implemented (mapped to spec)

### 1. Title Treatment
- `<title>`: `PAC-MAN CODE TRAINER` → `Ghost Code`
- Title screen `<h1>`: now uses `.word1 / .word2 / .tagline` spans
- `GHOST` in `Press Start 2P`, 38px, cyan→white→pink horizontal gradient with drop-shadow
- `CODE` in 22px, neon-cyan glow, 10px letter-spacing
- Tagline: `learn commands · haunt the terminal` in VT323, dim color
- Game-over and pause screens share the same `h1` span structure

### 2. The Phantom Mascot (replaces yellow chomper)
- Old: `#pac` + `.pac-body` with `clip-path` mouth + `@keyframes chomp`
- New: `#phantom` containing:
  - `.phantom-cursor-bar` — 3×10px cyan bar above head, `cursor-blink` animation
  - `.phantom-head` — 44×52px teardrop oval, `clip-path: polygon(10%0%,90%0%,…50%100%,…)` for pointed chin (NOT Pac-Man arc), radial-gradient cyan fill, `phantom-float` animation
  - `.phantom-eye-l` / `.phantom-eye-r` — white oval eyes with cyan cursor-square `::after` pupils (no emoji)
  - `.phantom-tail` — 30×34px smooth gradient plume, tapered `clip-path` (NOT scalloped), `phantom-tail-pulse`
- Removed: `@keyframes chomp`, `.pac-body`, all `--pac` / `--pac-glow` CSS variable usage in visible elements
- JS: `DOM.pac` → `DOM.phantom`; rotation transform updated to `DOM.phantom.style.transform`

### 3. Command Tokens (replaces answer dots)
- CSS class: `.dot` → `.token` everywhere (HTML and JS)
- Shape: `border-radius: 8px` rectangular pill (was `border-radius: 18px` blob-round)
- 4-direction color variants: cyan (N), pink (E), purple (S), gold (W) — per spec
- `.token .txt::before { content: "> "; opacity: 0.5; }` — terminal prompt prefix
- "eaten" state: `.dot.eaten` → `.token.captured` with `translateY(-12px)` dissolve-upward
- `DOM.dots` array → `DOM.tokens`; all `querySelector('.dot')` references updated

### 4. Spirit Pips (replaces Pac-Man silhouette life icons)
- Old: `.life` with `clip-path: polygon(100% 50%, …)` Pac-Man wedge, `--pac` yellow
- New: `.spirit-pip` — 8×16px glowing cyan cursor-block, `border-radius: 2px`, `::after` tail drip, `spirit-blink` animation
- HUD label: `LIVES` → `SPIRITS`
- `renderHUD()`: `l.className = 'life'` → `l.className = 'spirit-pip'`

### 5. Danger Flash (replaces ghost enemy spawn)
- Old: `spawnGhost(dotEl)` — created a `.ghost` div (rounded-top + scalloped-bottom + emoji eyes)
- New: `flashDanger(tokenEl)` — adds `.danger-flash` class to the wrong token + `.danger-flash-cabinet` to `#cabinet` for 420ms
- CSS: `@keyframes danger-pulse` box-shadow burst (red), no creature shape
- Removed entirely: `.ghost` CSS rule, `.ghost::before` scalloped bottom, `.ghost::after` emoji, `@keyframes ghost-bob`, `spawnGhost()` function

### 6. Big Button
- Was: `border: 3px solid var(--pac)`, `color: var(--pac)`, yellow glow
- Now: `border: 3px solid var(--neon-cyan)`, `color: var(--neon-cyan)`, `--phantom-glow` cyan glow

### 7. HUD Score Color
- Was: `color: var(--pac)` (yellow) on `.val`
- Now: `color: var(--neon-cyan)` with `var(--phantom-glow)` text-shadow

### 8. JS Renames
- `const waka` → `const zap` (same beep oscillator body)
- `const ghostHit` → `const miss` (same sawtooth body)
- All `waka()` call sites → `zap()`
- All `ghostHit()` call sites → `miss()`
- `learningReveal()` internally calls `miss()` instead of `ghostHit()`

### 9. CSS Variables
- Added `--phantom-core`, `--phantom-glow`, `--phantom-tail`, `--phantom-eye`, `--phantom-eye-dim`, `--danger`, `--danger-glow`
- Removed from visible usage: `--pac`, `--pac-glow`, `--ghost-red`, `--ghost-pink`, `--ghost-cyan`, `--ghost-orange`, `--dot-1/2/3/4`
- Note: old ghost color names do not appear in the new file at all

### 10. UI Copy Changes
| Location | Old | New |
|---|---|---|
| `<title>` | PAC-MAN CODE TRAINER | Ghost Code |
| Title h1 | PAC-MAN / CODE TRAINER | GHOST / CODE |
| Title tagline | (none) | learn commands · haunt the terminal |
| Title p | "Click the correct command-dot. Pac chomps right answers — ghosts steal a life…" | "Guide the Phantom. Capture the right command token. A wrong guess costs a spirit." |
| HUD label | LIVES | SPIRITS |
| JS header comment | PAC-MAN CODE TRAINER | GHOST CODE |
| Arcade mode tooltip | "3 lives, lose one on wrong answer" | "3 spirits, lose one on wrong answer" |
| Learn mode tooltip | "no life loss" | "no spirit loss" |
| aria announcer | "no life loss, hint escalation enabled" | "no spirit loss, hint escalation enabled" |
| Wrong answer aria | "Lives remaining" | "Spirits remaining" |
| Empty deck message | "No cards in this category" | "No commands in this category" |
| Game over review | "Cards you missed" / "REVIEW MISSED CARDS" | "Commands you missed" / "REVIEW MISSED COMMANDS" |
| Learn retry2 panel | "one of the 4 dots" | "one of the 4 tokens" |
| 50/50 aria | "two wrong answers removed" | "two wrong commands removed" |

---

## localStorage Migration

```js
const STORAGE_KEY = 'gc.v1';
const LEGACY_KEY  = 'pmct.v1';

const loadPersist = () => {
  try {
    // [PERSIST-ADDITIVE] Migration: if new key absent but legacy exists, copy it.
    if (!localStorage.getItem(STORAGE_KEY) && localStorage.getItem(LEGACY_KEY)) {
      localStorage.setItem(STORAGE_KEY, localStorage.getItem(LEGACY_KEY));
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }
  catch { return {}; }
};
```

- Runs once on first load after rebrand
- Copies existing hi-score, cardStats, category preference, mode setting intact
- Does NOT delete `pmct.v1` (additive; old key stays harmlessly)
- After migration, all writes go to `gc.v1`

---

## Green Gate Results

```
node --check cards.js              → PASS
inline <script> node --check -     → PASS
node test/cards.test.js            → OK — 56 cards passed all integrity checks.
```

All three checks pass clean.

---

## Grep Confirmation — No Pac-Man Trade Dress Remaining

Searched `index.html` and `README.md` for:
`pac-man`, `pacman`, `pac-dot`, `pacdot`, `pac-body`, `chomp`, `waka`, `ghostHit`, `spawnGhost`, `ghost-red`, `ghost-pink`, `ghost-cyan`, `ghost-orange`, `ghost-bob`, `.pac`, `#pac`, `.life`, `pmct`

**Findings — visible UI / JS code:**
- Zero hits in title, headings, buttons, aria-labels, or user-visible copy
- Zero hits in executable JS logic

**Findings — CSS/JS comments only (non-user-visible):**
- 4 comment lines in CSS explaining what the shapes are NOT (e.g. `/* NOT a Pac-Man arc */`) — these are design rationale notes, not trade dress
- `const LEGACY_KEY = 'pmct.v1'` in JS — intentional for the migration; the string is never shown to users
- `pacman-code-trainer` in the README's `open ~/Games/…` terminal path — this is the folder name on disk, not the game's identity

**Verdict:** No Pac-Man trade dress remains in any user-visible surface.

---

## Mockup Match Assessment

Dani's `ghost-code-concept.html` was the visual target. Match quality:

| Element | Mockup | Implemented | Match |
|---|---|---|---|
| Title gradient | GHOST cyan→pink, CODE cyan | Identical CSS values | EXACT |
| Phantom head shape | Pointed-chin teardrop clip-path | Same polygon points | EXACT |
| Phantom eyes | White oval + cyan cursor ::after | Identical | EXACT |
| Phantom tail | Smooth gradient plume, tapered | Identical | EXACT |
| Cursor bar blink | 3×10px, `cursor-blink` 0.95s | Identical | EXACT |
| Command tokens | 8px radius, "> " prefix, 4-color | Identical | EXACT |
| Spirit pips | 8×16px cursor-block, tail drip | Identical | EXACT |
| Danger flash | danger-pulse + cabinet strobe | Identical | EXACT |
| Big button | Cyan border/text/glow | Identical | EXACT |
| HUD score color | `var(--neon-cyan)` | Identical | EXACT |
| Tagline | "learn commands · haunt the terminal" | Identical | EXACT |

The only intentional delta from the mockup: the mockup uses a standalone `#ghost-code-title` div above the HUD (for layout preview purposes); the real game integrates the title inside the `.screen#title` overlay using `h1 > .word1/.word2/.tagline` spans, which is correct for the game's screen state architecture.

---

## Branch & Main State

- Branch: `rebrand/ghost-code-2026-06-04`
- Commit: `1137243`
- `main` is untouched at `24e5fe1` — confirmed with `git log --oneline -3` and `git branch`
- Files committed by explicit path (`git add index.html README.md`) — no `git add -A`

---

## DECISIONS FOR SKY

None — this is a design-approved implementation. Dani's spec had PASS status before Shamus built it. Ready for Sky's review and merge approval.
