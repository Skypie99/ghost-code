# Gary QA — Empty-Deck Robustness Verify — 2026-06-02

**Verdict: FAIL — fix required before P6 proceeds**
**Branch examined:** `burst/pacman-2026-06-02`
**Reference fix:** commit `3b1de9c` on `test/pacman-empty-deck-robustness-2026-05-25`

---

## What commit 3b1de9c did

The fix hardened `nextCard()` to block stale input when a category has no cards.
Without it, `nextCard()` returned early (showing "No cards yet" message) but left
`state.busy = false`, so keyboard 1–4 / Enter / dot clicks still fired `answer()`
against `state.current` (the previous card) — scoring right/wrong and awarding
points for a card the player was never shown.

The fix added:
- `state.busy = true` in the empty-deck branch (blocks `answer()`)
- `DOM.promptTag.textContent = ''`, `DOM.hint.textContent = ''` (clears stale UI)
- `DOM.dots.forEach(...)` to clear `.txt` labels and `data-value` (no phantom answers)
- `state.busy = false` before `renderCard(card)` in the normal branch (clean recovery)

---

## Is the fix in the burst branch?

**No.** The current `nextCard()` on `burst/pacman-2026-06-02` (line 1292) is:

```javascript
function nextCard() {
  const card = pickCard();
  if (!card) {
    DOM.promptText.textContent = 'No cards in this category yet — add some in cards.js!';
    return;          // ← state.busy stays false here
  }
  renderCard(card);  // ← no state.busy = false reset here either
}
```

The 12 lines from `3b1de9c` are entirely absent.

The fix branch was never merged to main (commit message says "Not merged") and the
burst branch was based on `shamus/pm-learning-mode-2026-05-29` which also never
received the fix.

---

## Would the empty GIT category trigger this bug?

**Yes — on every category switch while playing.**

Call path when player switches to GIT (empty) mid-game:
```
[data-cat] click handler (line 1368)
  → state.persist.category = 'git'
  → if (state.playing) nextCard()
    → pickCard() → activeDeck() filters to [] → returns null
    → shows "No cards yet" message, returns early
    → state.busy stays false
    → state.current = previous card
    → dots still show previous card's options with data-value intact
→ player presses 1–4 or clicks a dot
  → answer(dot) fires: guard is (state.busy || !state.playing || state.paused)
  → all false → answer() executes against stale state.current ✗
```

**Result:** silent phantom scoring against the wrong card. Player sees "No cards yet"
but the game records right/wrong and awards/deducts points for a card they never
answered. Streaks and stats corrupt silently.

---

## Bonus finding: C-key cycle needs updating in P6

The current C-key cycle array (line 1387):
```javascript
const order = ['all', 'claude', 'mac'];
```

P6 adds a GIT button — but if this array is not updated to `['all', 'claude', 'mac', 'git']`,
the GIT category will be keyboard-inaccessible (click-only). This is already in the P6
spec (`[P6-SPEC]` in DECISIONS_LOG) but flagging explicitly so it's not missed.
Category `CATEGORY_LABELS` dict (line 985) also needs `git: 'GIT COMMANDS'` (or
equivalent label) added alongside the button.

---

## Fix — exact patch to apply before P6

Apply to `burst/pacman-2026-06-02`. This is identical to `3b1de9c` rebased:

```diff
 function nextCard() {
   const card = pickCard();
   if (!card) {
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

**Size:** 7 lines added. Zero logic change to the happy path.

**Suggested commit message:**
```
fix(robustness): block stale input on empty-deck category (port 3b1de9c to burst)

Ports the guard from the never-merged test/pacman-empty-deck-robustness-2026-05-25
branch. Without it, switching to an empty GIT category mid-game leaves state.busy=false,
dots hold the previous card's data-value, and answer() fires against stale state.current.
Pre-P6 gate — verified by Gary QA 2026-06-02.
```

---

## Unblock condition for P6

Apply the patch above as a commit on `burst/pacman-2026-06-02` before Shamus starts P6.
Shamus may apply it directly (it's a pre-condition commit, not a feature).

P6 checklist addendum (add to PLAN.md §P6):
- [ ] Add `git: 'GIT COMMANDS'` to `CATEGORY_LABELS` dict
- [ ] Update C-key cycle array: `['all', 'claude', 'mac', 'git']`
- [ ] Add `'git'` to `VALID_CATEGORIES` in `test/cards.test.js` validator

---

## Recommendation to add regression test

`test/cards.test.js` is data-only (no DOM). Suggest adding a comment/note that this
guard cannot be covered by the current zero-dep validator, but the manual smoke test
sequence should include: start game → switch to GIT category → verify dots are cleared
and key presses do nothing. Document this in the green gate checklist.

---

**Routed by:** Morgan (pre-P6 gate)
**Authored by:** Gary, QA Engineer
