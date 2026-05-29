# Gary — Evening Background QA — Pac-Man Code Trainer

```yaml
mode: background
role: gary
project: pacman-code-trainer
cycle_id: gary-evening-2026-05-25
model_tier: opus
date: 2026-05-25
shift: evening (focus = robustness + clean code + quality infra)
eligible_for_change: true
change_applied: true              # THIS is the one reversible scoped change for the cycle
branch: test/pacman-empty-deck-robustness-2026-05-25
commit: 3b1de9c
merged: false                     # branch stays unmerged — Sky reviews
```

---

## TL;DR

Applied **the cycle's one reversible scoped change** to Pac-Man: a robustness
fix for the empty-deck-after-category-switch state in `nextCard()`. The branch
is `test/pacman-empty-deck-robustness-2026-05-25` (unmerged, single commit
`3b1de9c`, +12 LOC, no LOC removed).

---

## The Bug

**Location:** `index.html` lines 1084–1091 (before fix).

```js
function nextCard() {
  const card = pickCard();
  if (!card) {
    DOM.promptText.textContent = 'No cards in this category yet — add some in cards.js!';
    return;
  }
  renderCard(card);
}
```

### Reproduction (manual)

1. Start the game on a populated category (e.g., `claude`). A card renders.
2. Mid-game, click the `mac` or `all` chip — but imagine a future category
   that has zero cards (or `claude` after all `claude` cards are filtered out
   by future logic).
3. `pickCard()` returns `null` because `activeDeck()` is empty.
4. `nextCard()` writes "No cards in this category yet…" into the prompt area
   and returns **without touching the dots or `state.busy`**.

### What goes wrong

After step 4, the four dots still hold:
- The previous card's `dataset.value`
- The previous card's option text
- `pointerEvents: 'auto'` (since `renderCard` set it for the previous card and
  `answer()` only nulls it during a successful answer's 750-1900ms cooldown)

And `state.current` still points at the previous card object.

Because the keyboard handler at `index.html:1159–1175` and dot click/keydown
handlers at `index.html:1133–1142` only guard on `!state.playing || state.paused
|| state.busy`, **a user pressing 1/2/3/4 (or Enter/Space on a focused dot, or
clicking a dot) will silently call `answer()`** with:

- `chosen` = stale `dataset.value` (previous card's option)
- `state.current.answer` = previous card's answer
- `state.current.id` = previous card's id

This results in:
- A "correct" or "wrong" mark applied to the previous card
- Score and streak updated based on a card the user can no longer see
- `state.persist.cardStats[<previous card id>]` mutated (right/wrong counts
  + total) and saved to localStorage
- HUD updated with the new (illegitimate) score

The "No cards in this category" message stays in the prompt text the whole
time because `nextCard()` is never called again until the user manually
switches category — meaning the user can keep racking up phantom points.

### Why this matters now

In today's shipped `cards.js`, every category (`claude`, `mac`, `all`) is
populated, so this bug is **dormant in current production state**. But:

- It's exactly the kind of brittle-input scenario the task description calls
  out ("unhandled game states, missing edge case guards").
- The next time someone adds a category with zero cards, or filters by
  difficulty/tag, the bug surfaces immediately.
- Future-Sky doing the next `cards.js` edit shouldn't have to remember to
  validate this — the engine should be safe by default.

---

## The Fix

```diff
 function nextCard() {
   const card = pickCard();
   if (!card) {
+    // Block input against the stale previous card while the deck is empty.
+    // Without this, keyboard 1-4 / Enter / Space / click still hit answer()
+    // and score against state.current from the previous category.
+    state.busy = true;
+    DOM.promptTag.textContent  = '';
     DOM.promptText.textContent = 'No cards in this category yet — add some in cards.js!';
+    DOM.hint.textContent       = '';
+    DOM.dots.forEach(d => {
+      d.classList.remove('correct','wrong','eaten','entering','shake');
+      d.querySelector('.txt').textContent = '—';
+      d.dataset.value = '';
+    });
     return;
   }
+  state.busy = false;
   renderCard(card);
 }
```

### Why this is the smallest correct fix

- **`state.busy = true`** in the empty-deck branch: `answer()` already
  short-circuits on `state.busy` (`index.html:985`). Setting it to `true`
  here piggybacks on an existing, well-tested guard rather than introducing
  a new one.

- **`state.busy = false`** in the populated branch: ensures a busy=true flag
  set during an earlier empty-deck call is cleared when the user switches
  back to a populated category. Without this line, the engine would stay
  permanently locked.

- **Clearing dot text + `dataset.value`**: defense in depth. Even if a future
  refactor breaks the `state.busy` guard, the dots' `dataset.value === ''`
  means an answer comparison can't accidentally match the previous answer.

- **Clearing the prompt tag and hint**: cosmetic — keeps the "No cards"
  state visually consistent (no stale `CLAUDE CODE` / `MAC TERMINAL` chip).

### What this fix does NOT do (intentionally)

- Doesn't touch `startGame()`, which has its own latent bug (starting a game
  with an empty active category leaves the title screen hidden but no card
  rendered). Out of scope for the ≤1-change budget. Flagged below.
- Doesn't introduce any new state or top-level variable.
- Doesn't change any visual styles, sounds, or scoring logic.
- Doesn't touch `pickCard()`, which already correctly returns `null` for an
  empty deck.

---

## Verification

- ✅ Diff inspected — only the one function changed.
- ✅ HTML still parses (no orphaned tags or mismatched braces; preview panel
  picked up the change cleanly).
- ⚠️ Pure-JS — no automated test suite exists for this project. Manual
  reproduction requires future cards.js with a 0-card category; Gary did
  not regress-test by temporarily emptying `cards.js` in this cycle.

**Recommendation for Sky**: open `index.html` in a browser, then in DevTools
console do
```js
window.CARDS = window.CARDS.filter(c => c.category !== 'claude');
document.querySelector('[data-cat="claude"]').click();
```
…and verify pressing 1/2/3/4 no longer changes the score or streak. Switch
back to `all` to confirm play resumes normally.

---

## Pass 2 — Clean Code Sweep (Pac-Man)

- **File size**: `index.html` 1183 LOC, `cards.js` 179 LOC. Manageable for a
  single-file game.
- **`console.log`/`debugger`**: zero hits.
- **TODO/FIXME**: zero hits.
- **Event listeners** (`addEventListener`): 14 total, all cleaned up properly
  via `{ once: true }` for animation listeners; the persistent ones (start,
  pause, restart, dots, keyboard, category buttons) belong to a single
  long-lived page and don't leak.
- **`localStorage`**: read/write wrapped in try/catch with a default-state
  fallback — robust.

### Latent (NOT FIXED THIS CYCLE)

| Concern | Severity | Notes |
|---|---|---|
| `startGame()` doesn't guard against empty active deck | LOW | Same empty-deck class of bug; with the `nextCard` fix in place, `startGame → nextCard` now correctly enters busy-state and shows the "No cards" message. So this is partially shielded by today's fix already. |
| Category-cycle keyboard `c`/`C` runs before the `state.playing` guard | LOW | Intentional? Lets the user pre-select a category from the title screen. Marginal but consistent. |
| `pickCard()` weighting `w = masteredScore(c) >= 3 ? 0.3 : 1 + (3 - masteredScore(c))` | LOW | Magic numbers, but documented in nearby code. Future "leitner box" refactor territory. |

None merit a fix this shift.

---

## Pass 3 — Quality Infrastructure Review

- ❌ No tests (project is vanilla HTML/JS, single page).
- ❌ No ESLint, no Prettier, no CI.
- ✅ This is **appropriate for the project's scope** — adding test infra to a
  179-line flashcard game would be cargo-culting. Not a recommended action.

The one piece of infra worth gently considering (PROPOSE-ONLY): a tiny
`.github/workflows/preview.yml` that runs `python -m http.server 8000` against
the repo on PR — but honestly Sky already does this manually. Skip.

---

## Pass 4 — Prior qa-report Follow-up

Recent Pac-Man reports:
- Multiple `cycle-2026-05-25-morgan-pacman-routing.md` — routing/orchestration
- `2026-05-25-morgan-routing-update.md` — routing update
- A11y reports (Alex) — closed (commit `3e9e4bb` fixed WCAG 2.4.3 + 2.4.11)
- `background-2026-05-25-quinn.md` — Quinn backlog

No open robustness items in prior reports — the empty-deck bug surfaced today
in Gary's own audit, not in a prior cycle.

---

## DECISIONS FOR SKY

🟢 **Ready to review:** branch `test/pacman-empty-deck-robustness-2026-05-25`
(single commit, +12 LOC, no removals). Sky merges (or asks for changes).
Suggested merge path:

```bash
cd ~/Games/pacman-code-trainer
git checkout main
git merge --ff-only test/pacman-empty-deck-robustness-2026-05-25
# verify the diff is the one Gary described, then
git push
```

If Sky prefers PR review: `gh pr create --base main --head test/pacman-empty-deck-robustness-2026-05-25 --title "fix(robustness): block input on empty-deck category" --fill`.

If Sky wants to drop the fix: `git branch -D test/pacman-empty-deck-robustness-2026-05-25` — fully reversible, no main impact.

---

## Files Touched

| File | Change | Branch |
|---|---|---|
| `index.html` | +12 LOC (nextCard empty-deck guard + busy state) | `test/pacman-empty-deck-robustness-2026-05-25` |

Commit `3b1de9c` — message starts `fix(robustness): block input on empty-deck`.

---

## Sanity / Mode Compliance

- ✅ `BACKGROUND_HALT` sentinel — not present
- ✅ Mode `background` logged in header
- ✅ No external sends (no PR push, no merge to main, no notifications)
- ✅ Branch prefix `test/` (per Gary's preamble)
- ✅ ≤1 reversible scoped change — THIS one fix
- ✅ Untouched hard-exclusion paths

— Gary
