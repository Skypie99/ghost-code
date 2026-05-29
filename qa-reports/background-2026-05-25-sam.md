# Sam — Integration Test Audit — Pac-Man Code Trainer — 2026-05-25

```yaml
mode: background
role: sam
project: pacman-code-trainer
cycle_id: sam-integration-pacman-2026-05-25
model_tier: sonnet
date: 2026-05-25
audit_only: true  # change budget used by Prompt Library this cycle
coherence_score: 0.92
state_consistency: pass
duplicate_work_detected: no
drift_risk: low
```

---

## What I read (Gary's prior work)

- `qa-reports/background-2026-05-25-gary-evening.md` — Gary fixed empty-deck robustness (`test/pacman-empty-deck-robustness-2026-05-25`, commit `3b1de9c`). Gary explicitly noted: no test runner appropriate for this project's scope (179-line vanilla HTML/JS game). Gary did NOT recommend adding test infra.

---

## Integration Assessment

Gary is right that a full Jest/Vitest setup would be cargo-cult for this project. However, there IS an integration gap worth documenting for the future:

### Gap 1 — Game loop: card load → question render → answer check → score update → next card

**The chain:**
```
CARDS array (cards.js) 
  → activeDeck() [filters by category]
  → pickCard() [weighted random selection]
  → renderCard() [writes to DOM, sets dataset.value]
  → user clicks dot / presses 1-4
  → answer() [checks chosen vs state.current.answer, updates score/streak]
  → animateCorrect/Wrong()
  → nextCard() [picks next, loops back to renderCard]
```

**What's tested:** Nothing — no test runner.
**What breaks silently:** Gary's empty-deck fix (`state.busy = true` in nextCard) correctly blocks `answer()` when the deck is empty. But the *inverse* — that `state.busy = false` is correctly cleared when the category switches back to a populated deck — is only verified manually (Gary's suggested DevTools repro in his report). If `state.busy` gets stuck true after a category switch, the game silently stops accepting input. No automated test catches this.

### Gap 2 — Category chip → deck switch → state consistency
**The chain:**
```
user clicks [CLAUDE] chip
  → state.persist.category = 'claude'
  → localStorage.setItem (persists across reload)
  → activeDeck() re-evaluated
  → nextCard() called
  → state.current updated
```

**What's tested:** Nothing.
**What breaks silently:** If `state.persist` is written before `activeDeck()` is evaluated, a reload between those two steps (edge case) could leave state inconsistent. Gary's fix made this safer, but persistence timing is unverified.

---

## Test Infra Recommendation (for when the game grows)

If Pac-Man ever gets more than ~500 LOC or multiple files, the right integration test setup is:

```bash
npm init -y
npm install --save-dev vitest @vitest/browser playwright
```

And the game would need to extract its pure logic functions (currently inlined in `index.html`) into importable modules. At that point, Sam would write:
1. `activeDeck(cards, category)` → returns filtered array (pure, testable now if extracted)
2. `pickCard(deck, cardStats)` → returns a card (pure, testable)
3. `answer(chosen, current, state)` → returns new state (pure if extracted)

Until then: **no test infra recommended**. Gary's judgment stands. Manual verification with the DevTools trick Gary documented is the right approach for this project's scale.

---

## Shift note for Gary

**No change applied to Pac-Man this cycle** (Sam's one change went to Prompt Library integration test).
**Gaps documented:** 2 integration gaps (game loop coherence, category switch state consistency). Neither warrants test infra at current project scale.
**Gary's next move:** Nothing needed on Pac-Man this cycle. Gary's empty-deck fix + Casey's README improvement are the right-sized investments. If Sky adds a second category or splits the game into multiple files, revisit test infra at that point.

---

*— Sam, 2026-05-25 (BACKGROUND mode — no external sends)*
