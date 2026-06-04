# /new-window Snapshot — pacman-code-trainer — 2026-06-02

---

## 1. CONTEXT SNAPSHOT

Full build burst session on the Pac-Man Code Trainer (`/Users/skypie/Games/pacman-code-trainer`) — a vanilla HTML/JS flashcard game for memorizing Claude Code + Mac terminal commands. Session covered plan mode (3 parallel recon agents + 2 plan agents), Sky's approval, then sequential execution of 6 phases (P0–P5 + P4 50/50 lifeline) on integration branch `burst/pacman-2026-06-02`, plus planning of P6/P7. No TypeScript, no build pipeline. The project was previously parked; this session fully re-activated it.

---

## 2. KEY ACTIONS

- Ran 3 parallel explore agents to map project state (tech stack, git, internals/QA)
- Ran 2 parallel plan agents (execution strategy + feature design)
- Sky approved phased burst plan in plan mode
- Created `burst/pacman-2026-06-02` off `shamus/pm-learning-mode-2026-05-29` (local main + Learning Mode)
- Wrote `PLAN.md` as a persistent living roadmap to the project root
- Established the "green gate" for a no-TypeScript project (`node --check` + browser smoke)
- **P1:** Ran 7-layer Design Compiler on Learning Mode → PASS; fixed focus order, tokenized inline styles, deduped aria-live, folded Taylor aria-labels
- **P2:** Added optional `explain` field; `renderExplain()` via `textContent` only; 12 explanations seeded; panel opacity bump
- **P3:** All 40 cards difficulty-tagged; token badge UI; `pickCard` weighting; ternary→lookup refactor; fixed 2 real decoy bugs
- **P5:** Extended deck validator + adopted CI workflow (files only)
- Delivered Morgan burst briefing via iMessage + `qa-reports/2026-06-02_Burst_Report.md`
- **P4:** 50/50 lifeline — H key, 3 per game, gold ⚡ pip HUD, `useLifeline()`, `.dot.eliminated`, idempotent + restore on nextCard
- Specced P6 (GIT cards) and P7 (game-over review + SR announce) in `PLAN.md`
- Declined Sky's "get gary to merge to main" — Constitution Art. 1 hard stop; provided the git command for Sky to run directly

---

## 3. OUTCOMES

- `burst/pacman-2026-06-02`: 9 commits on top of local `main`, green (0 console errors, validator passes 40 cards)
- Learning Mode: Design Compiler PASS (was blocked without it — couldn't be marked UI DONE)
- All 40 cards tagged with difficulty (15/15/10); 12 cards with `explain`
- 2 real decoy bugs fixed (would have marked correct answers wrong: `cc-resume` / `cc-print` listed their own flag aliases)
- 50/50 lifeline fully functional and QA-verified (10 assertions)
- `test/cards.test.js` + `.github/workflows/ci.yml` added
- `PLAN.md` in project root — persistent burst roadmap
- Design Compiler report: `qa-reports/2026-06-02_DesignCompile_pm-learning-mode.md`
- Burst report: `qa-reports/2026-06-02_Burst_Report.md`
- iMessage briefing sent to Sky
- P6 and P7 fully specced in `PLAN.md` — unblocked, no re-planning needed
- `PROJECT_STATE.md`, `DECISIONS_LOG.md`, `TASK_GRAPH.json` created (first time for this project)
- Memory file created at `~/.claude/projects/-Users-skypie/memory/project_pacman-code-trainer.md` (project re-activated from archive)
- ACTIVE_PROJECT updated to `pacman-code-trainer`

---

## 4. DECISIONS MADE

- [DELIVERY-IMESSAGE] Burst briefings go via iMessage not email (per Sky's explicit in-session choice)
- [GREEN-GATE-NOTS] Green gate: `node --check` on `cards.js` + extracted inline `<script>` (re-derive bounds each step) + `node test/cards.test.js` + browser smoke
- [BRANCH-BASE-SHAMUS] Burst integration branch based on shamus tip (= local main + Learning Mode), NOT origin/main
- [GIT-CARDS-DEFERRED] GIT-cards feature deferred; write cards fresh in P6; do NOT cherry-pick the stale-base UI commit
- [MAIN-SKY-ONLY] Merge to `main` is a Constitution Art. 1 hard stop — not agent-delegable even with Sky's approval
- [PLAN-MD-LIVING] `PLAN.md` in project root is the persistent burst roadmap; read before each burst
- [PERSIST-ADDITIVE] localStorage stays at `pmct.v1`; all new fields additive; no version bump unless forced rename
- [LIFELINE-SESSION-ONLY] `state.lifelinesLeft` is session-only, not persisted
- [EXPLAIN-TEXTCONTENT] Card-derived text uses `textContent` only, never `innerHTML`
- [P6-SPEC] P6 = ~16 GIT cards fresh + GIT button + CATEGORY_LABELS + C-cycle + validator update
- [P7-SPEC] P7 = arcade game-over missed-cards review + `renderCard` SR prompt announce

---

## 5. NEXT ACTIONS

- **Sky:** `git checkout main && git merge --ff-only burst/pacman-2026-06-02 && git checkout burst/pacman-2026-06-02`
- **Sky (optional):** push local `main` to `origin` (local is +21 vs origin/Initial commit)
- **Sky:** decide on P6 (GIT cards) — say the word to start; zero re-planning needed (PLAN.md has the full spec)
- **Next burst:** P6 → P7, reading from `PLAN.md`
- **Gary (pre-P6):** verify empty-deck robustness fix (`3b1de9c`) vs current `nextCard()` guard (relevant since P6 adds a new category that starts empty)

---

## 6. RISKS

- `burst/pacman-2026-06-02` NOT yet merged to `main` — all burst work pending Sky's gate
- Local `main` is +21 vs `origin/main` — remote is stale (Initial commit only)
- Empty-deck guard: `nextCard()` has a guard ("No cards in this category yet"), but the existing fix branch `3b1de9c` may add hardening — verify before P6 adds the GIT category

---

## DECISIONS FOR SKY

1. **Merge the burst:** `git checkout main && git merge --ff-only burst/pacman-2026-06-02`. This also lands Learning Mode (now Design-Compiler PASS) and P1–P5 + P4 lifeline. Nothing was merged without your gate.
2. **GIT-cards fold-in (P6):** Say the word to start; P6 is fully specced in `PLAN.md`. ~16 new GIT command cards + GIT button. No conflicts with current tree.
3. **Push `origin/main`:** local `main` is +21 ahead of the remote (which is still at the Initial commit). No urgency, but the GitHub Pages live URL (`https://skypie99.github.io/pacman-code-trainer/`) will only update once main is pushed.
4. **Stale branch pruning (advisory):** `feat/pacman-premium-polish-2026-05-29`, `feat/pacman-round2-polish-2026-05-29`, `fix/answer-card-contrast-2026-05-29` are fully absorbed into local `main` and safe to delete. `Taylor/a11y/...` is folded into P1 — safe to delete after burst merges.
