# P7 — Arcade Game-Over Missed-Cards Review + renderCard SR Announce
**Role:** Shamus (Feature Pusher)
**Date:** 2026-06-03
**Branch:** `shamus/p7-gameover-a11y-2026-06-03`
**Commit:** `9a4c763`
**Base:** `main` @ `3791d6e`
**File changed:** `index.html` only (+92 lines)

---

## Part A — Arcade game-over "missed cards" review

### What changed

| Location | Line (post-edit) | Change |
|---|---|---|
| `state` object literal | ~905 | Added `missedThisRun: new Set()` |
| `startGame()` | ~1323 | Reset `state.missedThisRun = new Set()` alongside `learnMastered`/`learnSeen` |
| `answer()` arcade wrong branch | ~1260 | Added `state.missedThisRun.add(state.current.id)` immediately after `stats[id].c = 0` (the life-losing path only — learning mode is a separate `if/else` branch above) |
| `gameOver()` | ~1336–1382 | Build scrollable `.missed-review` block; inserted before `#again-btn`; capped at last 8 misses from the Set |
| CSS (`.screen` section) | ~677–715 | Added `.missed-review`, `.missed-review__heading`, `.missed-review__list`, `.missed-review__item`, `.missed-review__prompt` rules |

### Exact insertion point for `state.missedThisRun.add()`

The `answer()` function has two branches at the top level of the `} else {` (wrong answer) block:

```
if (isLearnMode()) {
  // No life loss — learnAttempt logic
} else {
  // Arcade mode: lose a life   ← insertion is HERE
  stats[state.current.id].c = 0;
  state.missedThisRun.add(state.current.id);  // ← added
  state.lives--;
  ...
}
```

Learning mode wrong answers do NOT add to `missedThisRun` — correct per spec (Part A is arcade-only).

### Review block details

- Uses `CARDS` global (defined in `cards.js`) to look up card objects by id.
- Renders `card.prompt` as `.missed-review__prompt` via `textContent`.
- Renders `card.explain || card.hint || ''` as `.lp-explain` via `textContent` — reuses existing class with correct contrast and VT323 font.
- Falls back gracefully: if a card has neither explain nor hint, the explain `<p>` is omitted entirely.
- Scoped `max-height: 220px` + `overflow-y: auto` keeps the game-over screen readable.
- No new localStorage keys. No schema bump.

---

## Part B — Card-prompt screen-reader announcement in `renderCard()`

### What changed

`renderCard()` — one line added immediately after `DOM.promptText.textContent = card.prompt` (was line 1024, now ~1026 post-Part A edits):

```js
if (DOM.announcer) DOM.announcer.textContent = `${CATEGORY_LABELS[card.category] || card.category}: ${card.prompt}`;
```

### Real identifiers confirmed

| Spec identifier | Actual identifier | Match? |
|---|---|---|
| `DOM.announcer` | `document.getElementById('a11y-announcer')` mapped to `DOM.announcer` in `const DOM = {...}` | Yes |
| `CATEGORY_LABELS` | `const CATEGORY_LABELS = { claude: 'CLAUDE CODE', mac: 'MAC TERMINAL', git: 'GIT' }` | Yes |

No renames needed — spec identifiers were accurate.

### Why this closes the gap

Previously `DOM.announcer` was only written in: mode toggle, lifeline use, correct answer, wrong answer, and reveal. Card prompts themselves — the question the player must answer — were never announced. In arcade mode especially, a screen-reader user had no way to hear the new question without tabbing into the arena. This line fires on every `renderCard()` call (both modes), announcing `"CLAUDE CODE: What flag shows git log as a graph?"` etc. before the answer dots are populated.

---

## Green Gate Results

```
node --check cards.js        → OK (no output, exit 0)
inline JS node --check -     → OK (no output, exit 0)
node test/cards.test.js      → OK — 56 cards passed all integrity checks.
```

All three pass. No regressions.

---

## Spec deviations / notes

- None. All identifiers matched the spec exactly.
- The spec said "last 5–8 misses" — implemented as `slice(-8)` (up to 8), consistent with the upper bound.
- The `.lp-explain` class is scoped to `#learn-panel .lp-explain` in the existing CSS. The gameover-screen `.lp-explain` elements are outside `#learn-panel`, so they pick up the base font/color tokens but not the panel-specific overrides — visual result is clean VT323 off-white text, which is correct for readability.

---

## Gate flags for downstream roles

- **Part A adds a UI surface (game-over missed-cards block)** → needs **Dani's Design Compiler** (7-layer gate before merge to main).
- **Part B is an a11y change (SR announcement in renderCard)** → needs **Alex's verify** before merge to main.

---

## main status

`main` is at `3791d6e` — untouched. This branch diverges cleanly from that tip.
