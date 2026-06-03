# Shamus — P6: GIT Command Cards — 2026-06-02

**Branch:** `burst/pacman-2026-06-02`
**Status:** DONE pending Design Compiler

---

## What shipped

### Commit 1 — Robustness pre-condition (`42d3387`)
`fix(robustness): block stale input on empty-deck category`

Ported Gary's `3b1de9c` fix (never-merged) to the burst branch.
Adds `state.busy = true` + dot clearing in the empty-deck branch of `nextCard()`.
Prevents phantom scoring when switching to the new empty GIT category mid-game.

### Commit 2 — P6 feature (`2c91fe1`)
`feat(p6): GIT command cards — 16 cards, GIT button, C-cycle, validator update`

**cards.js** — 16 GIT cards written fresh (not cherry-picked from stale branch):
| Difficulty | Count | Commands |
|---|---|---|
| Easy | 7 | init, clone, status, add, commit, push, pull |
| Medium | 6 | log --oneline, diff, branch, checkout -b, merge, stash |
| Hard | 3 | diff --staged, reset HEAD, rm --cached |

`explain` on 5 cards: pull, stash, diff --staged, reset HEAD, rm --cached.
All decoys verified: no real git aliases used as wrong-answer traps (learned from P3's cc-resume/cc-print bug).

**index.html** — 3 surgical edits:
- `CATEGORY_LABELS` += `git: 'GIT'`
- Bottom bar: GIT button added after TERMINAL (`class="btn"`, `data-cat="git"`, `aria-pressed="false"`, `aria-label="Show Git commands only"`)
- C-key cycle: `['all','claude','mac']` → `['all','claude','mac','git']`

**test/cards.test.js** — `VALID_CATEGORIES` += `"git"`

**Deck size:** 40 → 56 cards. All 56 pass the validator.

---

## Green gate results
```
node --check cards.js              → OK
inline <script> node --check       → OK
node test/cards.test.js            → OK — 56 cards passed all integrity checks.
```

---

## Persist compatibility
`state.persist.category` already stored arbitrary strings. Old saves default to `'all'`
which picks from all 56 cards automatically. No localStorage version bump needed.
Additive per DECISIONS_LOG:[PERSIST-ADDITIVE].

---

## Decoy quality check
Key cards reviewed for alias risk (lesson from P3):
- `git-checkout-b`: `git branch feature` creates but doesn't switch → not an alias ✓
- `git-diff-staged`: `git diff --cached` IS a real alias — NOT used as decoy ✓
- `git-pull`: `git fetch` is not the same (no merge) ✓
- `git-reset-head`: `git restore --staged` IS a real alias — NOT used as decoy ✓

---

## Compile Requested

**Dani — please run the Design Compiler on this surface:**

Branch: `burst/pacman-2026-06-02`
Feature slug: `p6-git-button`
Changed surface: one new `<button class="btn" data-cat="git">` in the bottom filter bar.

**Expected result: COMMIT** — the button is a 1-line reuse of the existing `.btn` component
(identical to CLAUDE and TERMINAL buttons in every attribute, class, and aria pattern).
No new CSS, no new tokens, no new layout. Layer 1 (tokenization) and Layer 3 (component
consistency) should be clean. Layer 2 (a11y) has `aria-pressed` + `aria-label` matching
the existing pattern. Layout change: one extra button in the flex row.

Until COMMIT is received, P6 UI is not marked DONE.

---

## Next
P7 is specced and ready in PLAN.md: arcade game-over missed-cards review + renderCard SR prompt announcements.
