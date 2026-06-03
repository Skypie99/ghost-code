# Pac-Man Code Trainer — Burst Report (2026-06-02)

**Integration branch:** `burst/pacman-2026-06-02` (based on `shamus/pm-learning-mode-2026-05-29` = local `main` + Learning Mode)
**Phases shipped this burst:** P0, P1, P2, P3, P5 ✅ · **Queued:** P4
**Green gate:** green after every step. **Console errors:** 0. **No merge to `main`.**

---

## ⭐ DECISIONS FOR SKY (read first — I built around all of these)

1. **Nothing merged to `main`.** All work is stacked on `burst/pacman-2026-06-02` for your gate. Review, then you decide what merges.
2. **The burst branch now contains the previously-unmerged Learning Mode feature** (commit `83a63eb`) — it had **never passed the Design Compiler**, so it couldn't ship. P1 ran the gate → **PASS**. So merging the burst also lands Learning Mode (Design-approved).
3. **Local `main` is +21 vs `origin/main`** (origin is still the Initial commit). Review against **local** `main`: `git diff main..burst/pacman-2026-06-02` is clean and phase-by-phase. Pushing local `main` to `origin` is your call — I touched no remote.
4. **GIT-cards feature deferred** (~16 git-command cards on `feat/auto-2026-05-25-shamus-git-*`). Its stale base + UI wiring collide with P3's refactor. I took the safe path and **deferred** it — say the word to fold it into a follow-up burst.
5. **No database migrations.** The data layer is `localStorage['pmct.v1']` only; every change this burst is additive and backward-compatible. **Nothing to apply.**
6. **CI workflow added as a file only** (`.github/workflows/ci.yml`). It runs *only* when GitHub Actions executes it (push/PR to `main`) — adding the file triggered nothing. Enabling Actions / pushing is yours.
7. **Empty-deck robustness fix exists** on `test/pacman-empty-deck-robustness-2026-05-25` (`3b1de9c`, +12 lines to `index.html`). Current `nextCard()` already guards an empty category ("No cards in this category yet"), so I left it — flag to verify/fold next burst.
8. **Branch pruning is advisory — I deleted nothing.** Already-absorbed polish branches + stale `*/auto-*` branches can be pruned at your discretion (list below).
9. **Delivery = iMessage + this saved report**, per your choice. Email stays disabled.

*None of these blocked forward progress.*

---

## How to review
```
cd /Users/skypie/Games/pacman-code-trainer
git log  --oneline main..burst/pacman-2026-06-02      # one commit per phase
git diff main..burst/pacman-2026-06-02                # LOCAL main → clean
node --check cards.js && node test/cards.test.js      # green gate (parse + deck integrity)
python3 -m http.server 8080                           # open localhost:8080 — play both modes
```
**Migrations to apply: NONE** (no database; localStorage changes are additive).

Commits (top = newest):
- `32f8d73` P5 — extend deck validator (difficulty/explain) + CI workflow
- `a8cd6be` (cherry-pick) adopt zero-dep deck validator (Gary 2026-05-25)
- `525e6ef` P3 — difficulty tags + content quality
- `f3a3964` P2 — card-level explanations
- `7a4e478` P1 — Learning Mode Design Compiler gate (PASS)
- `022a97a` P0 — burst foundation (PLAN.md + prior QA reports)
- `83a63eb` Learning Mode feature (pre-burst, was unmerged)

---

## What shipped, phase by phase

**P0 — Foundation.** Created the integration branch; wrote `PLAN.md` (living roadmap so future bursts continue this plan); defined the green gate for a no-TypeScript project (`node --check` on `cards.js` + the extracted inline `<script>`, plus a browser smoke); committed 8 prior QA reports that were sitting untracked.

**P1 — Learning Mode Design Compiler gate → PASS.** Full report: `qa-reports/2026-06-02_DesignCompile_pm-learning-mode.md`. Two POLISH items fixed in-gate on the branch:
- *Tokenization:* 4 inline `style=` color overrides → modifier classes (`.lp-kicker`, `.lp-hint--cyan`, `.lp-status--cyan/--gold`); the cyan/gold status text now carries a matching glow (was mismatched pink).
- *Accessibility:* keyboard focus was stranded on the disabled answer-dot when the retry/reveal panels appeared → now focuses the action button (`#lp-retry` / `#lp-next`). Removed a redundant `aria-live` on the panel (the dedicated `#a11y-announcer` is the single source) and restored the pre-hint announce. Folded in Taylor's 3 category-chip `aria-label`s.

**P2 — Card-level explanations** (Riley P3, "transfer learning"). Optional `explain` field on cards; `renderExplain()` builds the "why" node via **`textContent` only** (injection-safe) and shows it in Learn Mode's reveal panel above NEXT CARD. 10 distinction-teaching explanations authored (clear vs compact, rm -r vs rmdir, less vs more, grep vs find, …). Backward-compatible — cards without it render nothing. Bumped panel opacity 0.88→0.96 so prose reads on a clean surface.

**P3 — Difficulty tags + content quality.** Difficulty on all 40 cards (15 easy / 15 medium / 10 hard) with a token-colored badge (cyan/gold/pink) that always carries a **text label + `aria-label`** (never color-only). `pickCard` now applies a gentle difficulty ramp (`easy 1.2 / medium 1.0 / hard 0.7`). Refactored the category prompt-tag ternary → a `CATEGORY_LABELS` lookup. **Content correctness fixes:** removed two decoys that were actually correct aliases of their answers (`cc-resume` listed `claude -r`; `cc-print` listed `claude -p`) — these would have marked a right answer wrong — and reworked `cc-resume`'s prompt to match `--resume`'s picker behavior; rewrote the oblique `cc-status` hint; +2 explanations on the flag-nuance cards.

**P5 — Infra (validator + CI).** Adopted the zero-dep deck validator (`test/cards.test.js`) and extended it to check the new optional fields; added `.github/workflows/ci.yml` mirroring the local green gate. The validator passes on the deck (40 cards, 0 issues) and its difficulty check is negative-tested (corrupting the 10 hard cards flags all 10).

---

## QA findings
- **Steve (security/robustness):** explanation text renders via `textContent` only — verified live that no markup is injected (`children.length === 0`, `innerHTML === textContent`). The deck validator now guards the "answer listed as its own decoy" bug class (which P3 fixed in two real cards).
- **Alex (accessibility):** focus order fixed (biggest a11y win); announcements de-duplicated to one source; category `aria-label`s added; difficulty badge is text + `aria-label`, not color-only; all new colors meet WCAG AA on the dark surfaces (badge floor pink ≈ 5:1, explanation `--soft` ≈ 15:1).
- **Peter (performance):** negligible — vanilla JS, no new dependencies, no new loops. `pickCard` ran 600 draws instantly; `renderExplain` adds at most one conditional DOM node.
- **Gary (QA/CI):** green gate green after every step; validator passes; end-to-end smoke (arcade correct + wrong, learn flow, category filter, localStorage persistence) all pass with **0 console errors**. CI workflow added for future runs.

---

## Merge queue (advisory — you gate `main`; agents prune/merge nothing)
- **Merge first:** `burst/pacman-2026-06-02` (contains Learning Mode + P1–P3/P5).
- **Already absorbed into local `main` → safe to prune:** `feat/pacman-premium-polish-2026-05-29`, `feat/pacman-round2-polish-2026-05-29`, `fix/answer-card-contrast-2026-05-29`.
- **Folded in / prune after merge:** `Taylor/a11y/category-aria-labels-2026-05-27` (its labels are in P1).
- **Decide later:** GIT-cards feature (deferred); empty-deck robustness fix.
- **Stale `*/auto-*`** (old base): `a11y/auto-2026-05-25`, `cycle/auto-2026-05-23-ui`, `community/auto-2026-05-25-casey-readme`, `release/auto-2026-05-25` (keep until its CI commit is taken — already adapted into P5), the two `test/*` branches (validator already adopted).

## Queued for the next burst (unblocked, ready to pick up)
1. **P4 — Lifelines / confidence self-assessment** (50/50 or post-answer confidence → mastery). Additive `persist` keys; touches `answer()`/`startGame()`.
2. **GIT-cards fold-in** decision (~16 cards) — if you want them.
3. **Empty-deck robustness** — verify the existing guard vs. `3b1de9c`, fold if needed.
4. **Optional:** surface explanations in Arcade game-over review; announce card prompts in both modes (pre-existing cross-mode a11y gap).

The integration branch is green and unblocked — the next burst starts immediately.
