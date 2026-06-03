# QA Report — Pac-Man Learning Mode

**Date:** 2026-05-29
**Role:** Shamus (Feature Pusher)
**Branch:** `shamus/pm-learning-mode-2026-05-29`
**Commit:** `83a63eb`
**Source research:** `qa-reports/2026-05-29_Riley_PacManFlashcardLearnerFrictionResearch.md`
**Files changed:** `index.html` only (444 insertions, 66 deletions)

---

## Feature: Learning Mode (First Cut)

Per Riley's Priority 1 + 2 recommendations: separate Learning Mode with no life loss, hint escalation, and answer reveal before advancing.

---

## What Was Built

### Mode Toggle

- ARCADE / LEARN toggle rendered as a button group in the HUD bar (centered top).
- `role="group" aria-label="Game mode"` on the container.
- Each button: `aria-pressed` toggled on switch.
- `L` key toggles mode from keyboard; persisted to `localStorage` under existing `pmct.v1` key.
- Switching mode mid-game restarts the session (clean slate, no state bleed).

### Learning Mode Behaviour

| Scenario | Arcade (unchanged) | Learning |
|---|---|---|
| Pre-hint | Hidden until wrong | Shown before first click |
| Wrong answer | -1 life, hint in bar, next card | No life lost; enter retry panel |
| Attempt 1 wrong | — | "NOT QUITE — TRY AGAIN" + hint, Try Again / Show Answer buttons |
| Attempt 2 wrong | — | "STILL NOT IT" + hint, Try Again / Show Answer buttons |
| Attempt 3 wrong | — | Auto-reveal (same as Show Answer) |
| Show Answer | N/A | Reveals correct answer + hint text, highlights correct dot, Next Card button |
| Correct | Pac chomps, score, streak | Same + CORRECT! panel shows hint, mastered counter increments |

### Mastery Progress Bar

- Shown only in Learning Mode below the prompt area.
- Tracks `learnMastered.size / activeDeck().length` per session.
- Fills with cyan→purple gradient, live-updating on correct answers.

### Visual/Accessibility

- `#learn-panel` has `aria-live="polite"` and `role="region"`.
- `#hint` upgraded with `aria-live="polite"`.
- `#lives-stat` hidden via CSS in learning mode (lives HUD not relevant).
- `#learn-badge` badge shown in HUD when in learning mode.
- All panel buttons use existing `.btn` class (focus-visible ring, hover states, colour contrast meets existing design system).
- `prefers-reduced-motion` honoured via existing global `@media` rule — no new animations added.

---

## Test / Smoke Results

All tests run against live `http://localhost:8123/index.html` via Chrome browser automation.

### Static validation (28 checks)
```
ALL PASS — no check failures
```

### Browser smoke test results

| Test | Result |
|---|---|
| Page loads, no console errors | PASS |
| Arcade mode active on load | PASS (`aria-pressed=true`, body no `.learning-mode`) |
| Switch to Learn mode | PASS (`body.learning-mode`, `aria-pressed` flips) |
| Start game in Learn mode | PASS (playing=true, pre-hint panel visible) |
| Wrong answer — lives unchanged | PASS (lives=3 after wrong click) |
| Attempt 1 wrong panel | PASS ("NOT QUITE — TRY AGAIN", Try Again + Show Answer buttons) |
| Try Again re-enables dots | PASS (busy=false, pre-hint restored, attempt=1) |
| Attempt 2 wrong panel | PASS ("STILL NOT IT", attempt=2, lives=3) |
| Show Answer → reveal | PASS (correct answer "/cost" shown, Next Card button, lives=3) |
| Next Card advances | PASS (new card loads, attempt=0, revealed=false, busy=false) |
| Correct answer in Learn mode | PASS (mastered=1, "CORRECT!" panel, lives=3) |
| Switch back to Arcade, wrong | PASS (lives=2, hint in bar, learn panel hidden, no `.learning-mode`) |
| Zero JS console errors | PASS |

### Arcade mode regression
- Life loss on wrong answer: confirmed (3→2)
- Hint text shown in bottom hint bar: confirmed
- Ghost spawned on wrong: confirmed (ghostHit() called)
- Game Over fires at 0 lives: unchanged code path, not regressed

---

## Design Compiler Gate

UI surfaces changed: mode toggle buttons, learning panel, progress bar, learn badge.

## Compile Requested

**Dani + Alex — please run the Design Compiler on this branch.**

- Branch: `shamus/pm-learning-mode-2026-05-29`
- Commit: `83a63eb`
- Feature slug: `pm-learning-mode`
- New surfaces: `#mode-toggle` (mode-btn styles), `#learn-panel` (lp-* styles), `#learn-progress-bar`, `#learn-badge`
- Existing surfaces unchanged: dots, HUD, arena, hint bar, screens
- Concern area: `#learn-panel` uses inline `style=` for colour overrides on `.lp-status` — flag if Layer 1 (Token Drift) catches that as a violation; I can pull those to CSS vars.

Expected output: `qa-reports/2026-05-29_DesignCompile_pm-learning-mode.md`

Shamus may NOT mark UI DONE until compiler result = COMMIT.

---

## Decisions for Sky

None — no new dependencies, no schema changes, no auth changes. Pure CSS/JS in `index.html`. No external calls.

---

## Not Built (Nice-to-Have — Future)

Per Riley, these are lower priority and not in this first cut:

- Lifelines (50/50, audience poll)
- Confidence self-assessment after correct answer
- Decoy explanations ("Why the others are wrong")
- Mastery decay / re-teaching cards on later sessions
- Difficulty tags on cards (easy / medium / hard)

These can be separate feature requests if Sky wants them.
