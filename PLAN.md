# Pac-Man Code Trainer — Roadmap (PLAN.md)

> Living roadmap for build bursts. Each burst continues here instead of re-deciding.
> Owner: Morgan (planning) → roles execute. **Never merge to `main` — Sky's gate.**
> Last reconciled: **2026-06-02** (burst `burst/pacman-2026-06-02`).

## What this project is
A vanilla HTML/JS **flashcard game** (Pac-Man themed) for memorizing Claude Code + Mac
terminal commands. Single file `index.html` (~1.3k lines, inline CSS+JS) + `cards.js`
(`window.CARDS`). **Zero deps, no build, no framework, no TypeScript.**

## Green gate (the "type check" equivalent — run after every step)
```
node --check cards.js                                    # exit 0
open=$(grep -n '<script>' index.html | head -1 | cut -d: -f1)
close=$(grep -n '</script>' index.html | tail -1 | cut -d: -f1)
sed -n "$((open+1)),$((close-1))p" index.html | node --check -   # exit 0
# then: serve :8080, 0 console errors, smoke (start · 4 dots · correct/wrong · C · L · localStorage)
```
Data layer = `localStorage['pmct.v1']` only. **No DB, no migrations.** Keep persist changes
additive (new keys on the `Object.assign({defaults}, loadPersist())` default) — never rename
`hi/category/cardStats/mode`; bump to `pmct.v2` only with a migration if a rename is ever forced.

## Design tokens (design to these — no new colors)
`--neon-pink #e6237f` · `--neon-cyan #1ed4e6` · `--neon-purp` · `--pac #ffe600` ·
`--dot-1..4` · `--gold #ffd700` · `--soft #f1e6ff` (text) · `--dim` · ghost colors ·
`--shadow-sm/md/glow`. Fonts: `Press Start 2P` (headers), `VT323` (body).
A11y baseline: `#a11y-announcer` aria-live · aria-labels · `aria-pressed` toggles ·
`:focus-visible` rings · `prefers-reduced-motion`.

---

## Phases

| # | Phase | Roles | Status |
|---|---|---|---|
| P0 | Foundation & reconciliation | Morgan, Gary | **DONE 2026-06-02** |
| P1 | Learning Mode Design Compiler gate + a11y fold-in | Dani, Alex, Shamus | this burst |
| P2 | Card-level explanations (Riley P3) | Quinn, Dani, Dana, Shamus, QA, Gary | this burst |
| P3 | Difficulty tags + content quality | Dani, Dana, Shamus, QA, Gary | this burst |
| P4 | Lifelines / confidence self-assessment | Dani, Shamus, QA | **QUEUED** (next burst) |
| P5 | Card-validation test + CI adoption (infra) | Gary, Rory | this burst if capacity |

Strict sequence — never parallel (every phase edits the same 2 files). One commit per phase.

### P1 — Learning Mode Design Compiler gate + a11y fold-in
Learning Mode is built + smoke-tested but never passed the 7-layer Design Compiler (its report
is absent → can't be marked UI DONE). Run the gate; apply predicted polish:
- **L1 token:** move `#learn-panel` inline `style=` colors/sizes → modifier classes.
- **L2 focus:** focus `#lp-retry` on retry inject, `#lp-next` on reveal (keyboard users currently stuck on the disabled dot).
- Fold in Taylor's 3 category-chip `aria-label`s (keep existing `aria-pressed`).
- Output: `qa-reports/2026-06-02_DesignCompile_pm-learning-mode.md`.

### P2 — Card-level explanations
Optional `explain` string on cards; fallback `card.explain || card.hint || ''`. `renderExplain()`
via **`textContent` only**. Surface in Learn reveal/correct (convert those branches off
`innerHTML`) + Arcade hint line. Reuses pre-built `.lp-explain` CSS. No schema bump.

### P3 — Difficulty tags + content quality
Optional `difficulty: easy|medium|hard` (missing → medium). Token-only badge (easy→cyan,
medium→gold, hard→pink) with text label + `aria-label` (not color-only). P3 owns the prompt-tag
`ternary → tagLabels` refactor. Optional `pickCard` weighting `{easy:1.2,medium:1,hard:0.7}`.
Rewrite oblique hints.

### P4 — Lifelines / confidence (QUEUED)
50/50 (drop two decoys) or post-answer confidence → mastery. Additive persist keys; touches
`answer()`/`startGame()` so it follows P2/P3.

### P5 — Card-validation test + CI adoption (infra)
Cherry-pick **only** `test/cards.test.js` (`cd84dc9`) — zero-dep validator. Adopt CI workflow
file (`dfe352d`, runs `node --check cards.js`) **as files only** (no Actions enablement).

---

## Merge queue (advisory — Sky gates `main`; agents delete/merge nothing)
**Ready / Design-PASS:**
- `burst/pacman-2026-06-02` (headline — contains `main` + Learning Mode + this burst's P1–P3/P5).
- CI workflow `dfe352d` (clean new files) — folded into P5 / or merge separately.

**Needs a decision:**
- **GIT-cards feature** (`feat/auto-2026-05-25-shamus-git-*`, ~16 cards + UI) — stale base, UI wiring conflicts with P3's ternary. **Deferred** to a follow-up burst by default; say the word to fold into P3.
- `Taylor/a11y/category-aria-labels-2026-05-27` — folded into P1; prune after burst merges.

**Already absorbed into local `main` (safe to prune):**
- `feat/pacman-premium-polish-2026-05-29`, `feat/pacman-round2-polish-2026-05-29`, `fix/answer-card-contrast-2026-05-29` (0 unique commits vs main).

**Stale `*/auto-*` (old base — prune at discretion):**
- `a11y/auto-2026-05-25`, `cycle/auto-2026-05-23-ui`, `community/auto-2026-05-25-casey-readme`,
  `release/auto-2026-05-25` (keep until its CI commit is taken), the two `test/*` branches
  (cherry-pick the test file only — they revert `index.html` / delete qa-reports wholesale).

**Note:** local `main` is +21 vs `origin/main` (origin still at Initial commit). Review with
`git diff main..burst/pacman-2026-06-02` (local main = clean). Pushing `main` to origin is Sky's call.
