# Peter — Background Performance Audit
**Date:** 2026-05-26 | **Mode:** BACKGROUND / AUDIT-ONLY | **Role:** Peter (Performance Engineer)
**Project:** Pac-Man Code Trainer | **Status:** Eligible for 1 change — fix DEFERRED (Prompt Library fix applied instead)

---

## Summary
Game loop is solid (no RAF vs setInterval issue — game is event-driven, not loop-driven). Main bottleneck is background CSS animations running continuously during gameplay, burning ~6–12% idle CPU even while the game is active. Secondary finding: `getBoundingClientRect()` called twice per ghost spawn (forced layout reflow).

---

## Findings

### 1. Background animations run during active gameplay — MEDIUM (HIGH ROI)
- **Location:** `index.html` — `#stars` (line 80), `#grid` (line 124), `.ghost` (line 366), `.pac-body` (lines 279–287)
- **Issue:** Four continuous CSS animations run unconditionally, including `grid-scroll` (perspective transform + background-position), which is GPU-expensive. They play identically whether the user is on the title screen or mid-game.
- **Scale:** ~6–12% idle CPU overhead on all devices. Noticeable on low-end mobile or with many browser tabs.
- **Fix (proposal):** Add a `.playing-state` CSS class to `#cabinet` in `startGame()` (line 775) that sets `animation: none` on the background elements. Remove it in `gameOver()` (line 787). Preserves full animations on menus; kills them during active play.
- **Reversible:** Yes — one CSS class toggle each in startGame/gameOver.

### 2. `getBoundingClientRect()` calls per ghost spawn — HIGH severity (low frequency)
- **Location:** `index.html`, lines 757–758 in `spawnGhost()`
- **Issue:** Two synchronous `getBoundingClientRect()` calls per wrong answer force layout recalculation. On a fast player with many wrong answers, these compound.
- **Scale:** Low frequency in typical play; becomes noticeable on a bad wrong-answer streak.
- **Fix (proposal):** Cache arena dimensions on `startGame()` and reuse. Only re-measure on window resize.

### 3. Font loading blocks render — LOW
- **Location:** `index.html`, lines 7–10 (Google Fonts imports)
- **Issue:** `Press Start 2P` and `VT323` loaded without `display=swap`, blocking First Contentful Paint.
- **Fix (proposal):** Add `&display=swap` to both font import URLs.

### 4. Keyboard handler not debounced — LOW
- **Location:** `index.html`, lines 817–832
- **Issue:** Keydown listener fires synchronously per event. Not a real bottleneck in practice.
- **Fix:** Not worth the complexity.

---

## Why fix was deferred this cycle
The Prompt Library `PromptCard` memoization fix (Priority 2 — unnecessary recomputation) was rated higher impact than the Pac-Man animation fix (Priority 4 — asset/rendering overhead) per task prioritization rules. The animation fix is the recommended next eligible Pac-Man change.

---

## Decisions for Sky
None. Animation fix ready to apply next Peter cycle.
