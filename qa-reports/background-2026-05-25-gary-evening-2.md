# Gary — Background QA Cycle (Pac-Man Code Trainer)

- **Date:** 2026-05-25
- **Mode:** background
- **Model tier:** opus
- **Project:** Pac-Man Code Trainer
- **Cycle ID:** gary-test-coverage-and-qa / 2026-05-25T14:32Z
- **Branch:** `test/pacman-cards-data-validator-2026-05-25` (off main)
- **Result:** PASS — one reversible change committed

---

## Pass 1 — Test coverage audit

Status before this cycle: **zero tests**. Pure vanilla HTML/CSS/JS, no test framework, no `package.json`. Game logic lives in `index.html` (deck-picking, scoring, streak math) and card data lives in `cards.js`.

Highest-leverage testable surface:
1. **`cards.js` deck data** — 40 cards, fully declarative. Easy to assert structural invariants (unique ids, correct decoy count, no answer-in-decoys, valid categories). Catches the most common bug class: copy-paste a card and forget to change a field.
2. Pure-ish functions inside `index.html` (`activeDeck`, `masteredScore`, `pickCard`, `shuffle`) — all tightly coupled to globals (`window.CARDS`, `state`, `Math.random`). Would require refactor before they can be unit-tested cleanly. Out of scope for one-change-per-cycle.

## Pass 1 fix — added `test/cards.test.js` (committed)

**File:** `test/cards.test.js` — 103 lines, zero dependencies, pure Node.

**Run:** `node test/cards.test.js` → exit 0 on pass, exit 1 on first failure (so it can drop into pre-commit later).

**Checks per card:**
- required fields present (`id`, `category`, `prompt`, `answer`, `decoys`, `hint`)
- `id` is a non-empty whitespace-free string, **unique across the deck**
- `category` ∈ `{claude, mac}`
- `prompt`, `answer`, `hint` are non-empty strings
- `decoys` is an array of exactly 3 non-empty strings
- decoys do NOT duplicate the answer and do NOT duplicate each other

**Result on the current deck:** `OK — 40 cards passed all integrity checks.`

**Negative-tested** against a corrupted 4-card deck (duplicate id, answer-as-decoy, duplicate decoys, missing category, too-few decoys). Validator flagged 7 distinct issues across the 4 cards and exited 1. Restored deck, re-ran, exits 0.

**Commit:** `cd84dc9 test(cards): add zero-dep data integrity validator for the deck`

## Pass 2 — Clean code sweep

`cards.js` itself: clean. Comment header documents the schema. 40 cards in two well-balanced groups (20 claude + 20 mac). No drift between comment "20+20" and actual count — the new validator now enforces structural correctness; a separate count assertion would be over-engineering.

`index.html`: large single file (~1200 lines) but well-organized by section (palette → backdrop → cabinet → HUD → game logic). Not a refactor candidate; the inline structure is part of the "zero dependencies" ethos.

## Pass 3 — Future work flagged (no action this cycle)

- **Extract pure functions to a module** — `activeDeck`, `masteredScore`, `pickCard`, and `shuffle` could move to a `game.js` ES module so they can be unit tested. This would let us assert: `pickCard` always returns a card from `activeDeck`; `masteredScore >= 3` cards get the 0.3 weight; `shuffle` is a permutation of its input. Not now — that's a Shamus-class refactor, not a Gary safety-net addition.
- **Pre-commit hook** — once Sky is comfortable, hook `node test/cards.test.js` into a `.git/hooks/pre-commit` so any deck edit is validated before commit. Trivial to add later.
- **GitHub Actions** — same script could run on PR via `actions/setup-node` + one `run:` line. Adds CI coverage with zero deps. Worth doing the next time a deck edit lands.

## Verdict

Pac-Man went from **0 tests** → **1 fast deterministic validator** covering the entire deck. Foundation laid; future additions can follow the same zero-deps pattern.

## Branch + next step

- Branch: `test/pacman-cards-data-validator-2026-05-25`
- Commit: `cd84dc9`
- Not merged — per Constitution, only Sky merges to main. Morgan will pick this up.
