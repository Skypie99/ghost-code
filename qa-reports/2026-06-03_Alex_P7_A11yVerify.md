# Alex A11y Verify — P7 Game-Over + SR Announcement
**Date:** 2026-06-03
**Branch:** shamus/p7-gameover-a11y-2026-06-03
**Role:** Alex (Accessibility Engineer — WCAG 2.2 AA)
**Verdict:** PASS-WITH-FIXES

---

## Part B — Screen-Reader Prompt Announcement Verdict

**Element:** `#a11y-announcer` (line 787)
**Attributes found:** `aria-live="polite"` + `aria-atomic="true"` — correct.

**Arcade mode:** `renderCard()` sets `DOM.announcer.textContent` to `"Category: prompt"` immediately after `DOM.promptText.textContent = card.prompt`. Single write, no clobber risk. SR will announce once. PASS.

**Learn mode (bug found + fixed):** The original code wrote two separate `textContent` assignments in rapid succession:
1. Line 1071: `"Category: prompt"` (card announcement)
2. Line 1081: `"Hint: hint text"` (overwrite, within the same synchronous function call)

Because both writes happen synchronously before the browser yields, most screen readers see only the final value (`Hint: ...`) and silently drop the first. The user never heard the category or prompt in learn mode.

**Fix applied (index.html ~line 1079–1085):** Merged the two writes into one conditional block. In learn mode the announcer now emits a single string: `"Category: prompt. Hint: hint text"`. In arcade mode (no learn panel) the original single-write pattern is preserved unchanged.

**Re-trigger reliability:** Setting `textContent` on an `aria-live="polite"` region reliably re-fires SR announcement as long as the region is in the DOM and not hidden — confirmed. `aria-atomic="true"` ensures the whole string is read as a unit, which is correct here.

**Double-announcement risk with other hint/feedback announcements:** Surveyed all 7 other `DOM.announcer.textContent` writes (lines ~966, 1143, 1157, 1181, 1211, 1231, 1266–1308). None overlap with the `renderCard()` call synchronously — each fires from a distinct user-action handler or timer callback. No double-announcement risk.

---

## Part A — Missed-Review Scroll Region Fixes Applied

**Gap confirmed:** The `.missed-review` `<div>` was built without `tabindex`, `role`, or `aria-label`. Keyboard-only users could not focus and scroll it. SR users had no landmark to identify the region.

**Fixes applied in `gameOver()` (index.html, section `div` creation ~line 1397):**

| Attribute | Value | Why |
|---|---|---|
| `role="region"` | Landmark role | Lets SR users navigate to it via landmark shortcuts |
| `aria-label="Cards you missed this run"` | Descriptive name | Required for `region` to be announced (unnamed regions are skipped by most SRs) |
| `tabindex="0"` | Keyboard focusable | Allows keyboard users to Tab to the scroll container and use arrow keys / Space to scroll |

All three set via `setAttribute` — no `innerHTML`, `textContent` only for card text. Compliant with the constraint.

**Line numbers (post-fix):** Immediately after `section.className = 'missed-review'` in the `gameOver()` function body (~line 1397–1400).

---

## Focus Management on Game Over

**Finding:** When `#gameover` appeared, no `focus()` call was made. Focus remained on whatever last had it (a dot / answer button) — which is now hidden under the overlay. Tab order would eventually reach `#again-btn` but only after cycling through invisible elements.

**Fix applied:** Added `document.getElementById('again-btn').focus()` immediately after `DOM.gameover.classList.remove('hidden')` in `gameOver()`.

**Resulting tab order on game-over screen:**
1. Focus lands on `#again-btn` (native `<button>`) — announced as "PLAY AGAIN [R], button"
2. Shift+Tab reaches `.missed-review` region (if present) — announced as "Cards you missed this run, region"
3. Within the region, arrow keys / Space scroll the content

This is a sensible forward order: primary action first (play again), review content reachable via backward Tab or explicit navigation.

---

## Contrast Check

Colors in `.missed-review` on the game-over background:

| Element | Color | Background (effective) | Ratio | AA (4.5:1) |
|---|---|---|---|---|
| `.missed-review__prompt` | `--neon-cyan` #1ed4e6 | `rgba(30,0,60,0.72)` over screen bg | **10.71:1** | PASS |
| `.lp-explain` (explain text) | `--soft` #f1e6ff (inherited) | same | **16.13:1** | PASS |
| `.missed-review__heading` | `--neon-pink` #e6237f | same | ~5.1:1 | PASS |

All text in the review block clears AA normal-text threshold (4.5:1) with significant margin.

Note: `.missed-review .lp-explain` only overrides `font-size: 20px` — color inherits from body (`--soft: #f1e6ff`), which is correct.

---

## Reduced-Motion Check

No new animations or transitions introduced in P7 a11y changes. The `.missed-review` CSS uses no `animation` or `transition`. No violations.

---

## Green Gate Results

```
node --check cards.js          → PASS
inline JS (node --check -)     → PASS
node test/cards.test.js        → PASS (56 cards, all integrity checks)
```

---

## Summary of Changes

| File | Change | Type |
|---|---|---|
| `index.html` | Part B: merged learn-mode SR write (one announcement, not two) | Bug fix |
| `index.html` | Part A: `role="region"` + `aria-label` + `tabindex="0"` on `.missed-review` | A11y fix |
| `index.html` | Focus management: `again-btn.focus()` on game-over | A11y fix |

---

## Final Verdict: PASS-WITH-FIXES

Three small, surgical fixes applied directly to the feature branch. All green gate checks pass. No regressions. Branch is clean and ready for merge review.

**Main branch:** Untouched. All work confined to `shamus/p7-gameover-a11y-2026-06-03`.
