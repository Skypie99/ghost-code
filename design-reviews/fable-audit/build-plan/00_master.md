# Ghost Code UPLIFT — Build-Plan Master
**The phased execution of the Fable-audit improvement slate.**

- **Design authority (read-first in every phase):** `/Users/skypie/Games/pacman-code-trainer/design-reviews/fable-audit/2026-07-10_GhostCode_Design_Review.md` — the Part-3 synthesis report; 19 presentation-only proposals (S1–S3, M1–M6, Q1–Q10). The report's recorded taste is law; no phase re-opens a decision the report made.
- **Audited SHA:** `9789d1a` (main == origin, 2026-07-03 capture; re-confirmed HEAD == `9789d1a` at plan-authoring, 2026-07-16). **Version handshake:** Phase 1 pre-flights HEAD against this SHA; meaningful drift in `index.html` / `cards.js` / `og-image.png` / `favicon.svg` → STOP and flag Sky (never build against drift).
- **Provenance:** plan + phase prompts authored by **Claude Fable 5 (max effort), 2026-07-16**, in the same session that authored the Part-3 report (report dated 2026-07-10). **Execution: Opus 4.8 ultracode MAX EFFORT, all sub-agents max effort** — Sky's standing directive for this train; she fires each phase window herself (= Sky-initiated Opus per the global model rule).
- **Scope law:** this plan schedules ONLY the audited slate. Anything new that occurred during planning is in the PARKING LOT — never a phase. Gameplay-mechanics and curriculum items remain fenced to the report's Sky-Decision Notes.
- **Files here:** `00_master.md` (this map — read, don't fire) · `DECISIONS.md` (cross-window ledger) · `HANDOFF.md` (checkpoint state) · **the six copy-paste phase prompts `1.md` → `6.md`** (fire in order) · `reports/` (per-phase evidence + captures) · `DEVICE-GATE-CHECKLIST.md` (P6 close-out: consolidated on-device pass, 28 items, nothing checked off yet) · `DEPLOY-CHECKLIST.md` (P6 close-out: ordered merge→push→verify→re-scrape→device-session steps, nothing executed yet). Prompt→phase: `1.md`=P1 Floor · `2.md`=P2 Front Door · `3.md`=P3 Winning · `4.md`=P4 Study Report · `5.md`=P5 Ghost · `6.md`=P6 Close-Out.

---

## 1 · The train at a glance

| # | Phase · branch | Slate items | Effort · budget tag | Gates in-phase |
|---|---|---|---|---|
| P1 | **The Floor** · `uplift/p1-floor` (base: `main` @ handshake) | **M1, M2, Q3, Q9** — closes all 5 CRITICALs | M–L · **JUDGMENT-HEAVY** — fire on a fresh budget | M1 de-collision mockup gate (2–3 within-diamond candidates = Fork E's UI half) · Fork E FYI at pre-flight |
| P2 | **The Front Door** · `uplift/p2-frontdoor` (base: P1 tip) | **M5, M4, Q1, Q2, Q4, Q5, Q10** | M (7 small items) · MECHANICAL-leaning | OG-card composition gate (gates ONLY the og-image export) · Fork C surfaced (Q1 builds on silence) · Fork D surfaced (decision only) |
| P3 | **Winning, Authored** · `uplift/p3-winbeat` (base: P2 tip) | **S1, Q6, Q7, Q8** | M · **JUDGMENT-HEAVY** — heaviest window; mid-phase checkpoint likely | Fork A gate (S1 is the gated item; Q6/Q7/Q8 proceed) · Q7 glyph light gate |
| P4 | **The Study Report, Cashed** · `uplift/p4-studyreport` (base: P3 tip) | **M3, M6, S3** — one coordinated game-over pass | S–M · MECHANICAL-leaning | Fork F gate (M6 is the gated item; a mechanics pick DROPS M6 → FORKED). S3 weighting NOT gated — report-decided |
| P5 | **The Ghost Is Real** · `uplift/p5-ghost` (base: P4 tip) | **S2** | M · **JUDGMENT-HEAVY** | Fork B gate, front-loaded (the whole phase is the gated item; candidates are code-free mocks) |
| P6 | **Close-Out** · `uplift/p6-closeout` (base: P5 tip) | none — whole-train gates, conservation → ACTUAL, consolidated device gate + deploy checklist, merge-order note | S · MECHANICAL | — |

**MINIMUM-VIABLE CUT:** **P1 → P2 → P3.** That fast path closes all five CRITICALs, regenerates the recruiter handshake, and lands the flagship signature (the authored win beat) — the report's thesis delivered even if the train stops there.

**Serial per project:** phases run strictly one-at-a-time (same repo, stacked bases). One phase per fresh window.

---

## 2 · Deviations from the report's candidate phases (all reasoned, nothing silent)

The report's §"Candidate mockup-gated phases" was the starting point. Refinements:

1. **M2 moved (report-P3 → P1).** The report's own TOP-5 ranks M2 #1 "do first — trivial, highest ROI." The S1↔M2 dependency is directional: S1 must never ship without M2; M2 ships fine alone. Front-loading it means a train stopped after one phase has killed the worst bug (RM players being shown a wrong answer as correct).
2. **M3 moved (report-P2 → P4).** Same-surface collision: M6 adds a row to the very screen M3 un-clips. The never-clip fix must be verified against the FINAL game-over layout (with the new row), so all three game-over proposals run as one coordinated pass.
3. **The Floor runs before the Front Door.** Value-front-load: every CRITICAL closes in the first fired phase. P1↔P2 have **no surface collision**, so this order is a value preference, not a law — Sky may swap them (renumber bases) without breakage.
4. **S2 runs last of the build phases (report #5 in TOP-5, scheduled fifth).** Its Phantom lands on the title (P2 reworks it: Q1/Q4/Q10/M4) and game-over (P4 reworks it: M3/M6/S3). Building it after both means layout-neutral placement on settled surfaces. One rank of TOP-5 value traded for guaranteed no-rework — chosen, not accidental.
5. **Added the close-out car (P6)** — conservation at execution, not just at planning.

**Sub-trains: none.** The report specs no nested phased workstream (checked at authoring); no phase hides a flattened sub-sequence.

---

## 3 · Ordering laws (stop-gates — each names what breaks if violated)

1. **P1 before P3.** S1's held win-state must terminate in the same paint as M2's judgment-class clear. Built before M2 exists, S1 defines the clear itself and P1 would rework it; S1 shipped without M2 re-creates CRITICAL L4-F1. P1 records the clear's **code anchor (function/selector — never a commit SHA;** a squash-merge would orphan a SHA) in `DECISIONS.md`; P3 carries it forward.
2. **P2 before P5, and P4 before P5.** S2 adds elements to the title and to game-over; those surfaces are reworked by P2 and P4 respectively. S2 must be layout-neutral (no reflow) on the SETTLED screens, re-verified at 768/375.
3. **M4 is scoped to the title→board swap ONLY.** The `.screen` class + its 0.35s opacity/visibility transition are SHARED by title, game-over, AND pause (`#pauseScreen`). An unscoped fix silently re-times the pause dim (the report's own GOOD reference, f031) and the game-over entrance. P2 must prove pause + game-over fades are **byte-identical** after M4 (capture diff); P3 re-smokes the pause fade; P4 re-smokes the game-over fade.
4. **P3 re-verifies P1's fold criteria with the longest deck content.** S1 renders the full `card.answer` in the learn CORRECT panel plus an arcade strap; a wrapping long answer at 375 can push the S token back below the fold — resurrecting closed CRITICALs. P3 re-runs M1's 375 fold check and Q3's 1440 zero-shift check with the longest `card.answer` in the deck rendered.
5. **P4's invariant is the end-state no-clip check.** The internal order M3 → M6 → S3 is a heuristic; the LAW is: after all three land, re-verify no-clip at 1440/768/375 **with M6's new row present**, and re-verify the in-play drill-run chrome at 375/768 (S3's badge respects Q9's label floor from P1; no cabinet clip; no arena encroachment). **If skipped:** M6's added row can silently reopen the very game-over clip M3 just closed, and the badge can reintroduce sub-floor text or clipping in the chrome P1 fixed.
6. **Locate by selector/function anchor; the report's line numbers are hints pinned to `9789d1a`.** Every phase edits `index.html`, so line refs go stale train-wide. (CLAUDE.md's own green gate warns: "lines drift — re-derive every step.")
7. **Serial + stacked.** Each phase branches off the previous phase's tip; pre-flight verifies the base is present + green and ADAPTS if Sky merged (recovery protocol, §6). Parallel phases collide in one file (`index.html`).
8. **P2 small check:** Q2's label unification lengthens HUD strings ("MAC" → "TERMINAL") — confirm the 375 HUD row still fits at Q9's enlarged floor (landed in P1). **If skipped:** the longer "TERMINAL" string can overflow/wrap the 375 HUD row Q9 just enlarged, reopening L6-F3.

**Cross-phase consumption:** P3 consumes P1's M2 anchor + M1/Q3 fold criteria (via DECISIONS + evidence reports). P4 consumes P1's Q9 floor value. P5 consumes P2's settled title + P4's settled game-over (captures as reference). P6 consumes every phase's evidence report + DECISIONS entries + ledger slices.

---

## 4 · Conservation map (19/19 — ACTUAL, reconciled at P6 close-out 2026-07-29)

Every slate proposal landed in exactly one phase. All 30 commit SHAs below were re-resolved via
`git log -1 <sha>` at P6 close-out (not trusted from transcription) — every one present, every subject
matching. Status legend: **CLOSED** (shipped, banked, evidenced) · **FORKED** (a clause traced and
consciously not built, with the finding recorded) · PENDING-SKY-PICK / DEFERRED (unused — none of
either in this train).

| ID | Phase | Status | Commit(s) | One-line |
|---|---|---|---|---|
| M1 | P1 | CLOSED | `b300b41` | Candidate C de-collision (≤600 diamond) + learn-mode fold relief |
| M2 | P1 | CLOSED | `6d150c4` | L4-F1 verified NON-REPRO at per-frame resolution; documents the SD-9 same-paint clear anchor (no behavioral change) |
| Q3 | P1 | CLOSED | `71bff76` + `b5c3a50` | 768 SETTINGS un-clip (Q3a) + 1440 learn-diamond/bar un-clip (Q3b) — **one slate ID, two commits** (see arithmetic note below) |
| Q9 | P1 | CLOSED | `4290195` | 8px→10px HUD stat-label floor |
| M4 | P2 | CLOSED | `15838b9` (+ `78d605a` harden) | Title→board double-exposure killed (two-beat exit); harden commit dropped a fragile deferred-rAF cleanup found by adversarial review |
| M5 | P2 | CLOSED | `350f8bb` (M5a) + `c4b06dc` (M5b) | Favicon recolor + PNG/ICO fallbacks (M5a); OG card export + truthful alt (M5b) |
| Q1 | P2 | CLOSED | `9e5c46d` | Controls-orphan fixed via inverted NBSP binding |
| Q2 | P2 | CLOSED | `8f32c49` (+ `c24f34c` follow-up) | Canonical category name via `CATEGORY_LABELS`; follow-up self-flagged "⚠ EXCEEDS APPROVED PLAN" (share-string unification) — **Sky's keep/drop call, open item** |
| Q4 | P2 | CLOSED | `dcd858e` | Invalid `@supports` grammar fixed (De Morgan) |
| Q5 | P2 | CLOSED | `3c9c438` | Preload woff2 + metrics-matched fallbacks (kills FOUT) |
| Q10 | P2 | CLOSED | `e48e310` | Returning-player welcome-back beat |
| S1 | P3 | CLOSED | `0cf8bca` (S1a) + `161ae66` (S1b) | Held-win CSS state layer + wiring (score-fly, win-strap, learn answer line) |
| Q6 | P3 | CLOSED | `974f601` | Neutralized teal focus-ring on a wrong token |
| Q7 | P3 | CLOSED | `be022b6` | SPIRITS heart glyph + 50/50 slashed-circle (glyph + aria only, SD-2) |
| Q8 | P3 | CLOSED | `36d160e` | Pause overlay → real modal (RESUME button, inert board, focus stash/restore) |
| M3 | P4 | CLOSED | `d67e2e5` | Never-clip the game-over review box |
| M6 | P4 | CLOSED | `8e7b61f` (+ `b34473e`/`26a6e46`/`15e6669` adversarial fixes) | This-run credit + un-hidden Learn MASTERED bar; 3 follow-ups fixed 2 real a11y bugs + 1 cosmetic clip found by adversarial review |
| S3 | P4 | CLOSED | `63da969` | DRILL MISSED promoted to primary CTA + drill badge |
| S2 | P5 | **CLOSED (title + game-over bookends) / FORKED (in-play breathing clause)** | `13c1122` + `34f8d76` + `87cc42a` + `a2b75f6` | Bookends built as specified; in-play clause traced (D-3: `renderCard`/`answer`/`learningRetry`/`learningReveal`/`nextCard` — no idle non-card-read window exists in the loop) and consciously re-homed to game-over instead — **one slate ID, two rows in P5's own evidence report** (see arithmetic note below) |
| — | P6 | — (0 slate items) | — | This phase carries no slate items; it reconciles the 19 above |

**Counts: P1=4 · P2=7 · P3=4 · P4=3 · P5=1 · P6=0 → 19. 18 CLOSED outright + 1 (S2) CLOSED-with-one-clause-FORKED · 0 PENDING-SKY-PICK · 0 DEFERRED.** Nothing dropped; nothing smuggled.

**Two arithmetic traps that produce a false 20 (stated explicitly so no future reader miscounts):**
1. **Q3 is one slate ID, not two.** "Q3a" and "Q3b" are the two commits that closed the ONE id `Q3`
   (768 un-clip + 1440 un-clip respectively) — count it once.
2. **S2 is one slate ID, not two.** P5's own evidence report lists "S2 (title + game-over bookends)"
   and "S2 (in-play breathing clause)" as two separate ROWS for readability — they are the same ID
   with a split status, not two IDs. Count it once.

Full per-ID evidence: `reports/P1-verification-evidence.md` through `P5-verification-evidence.md`.
This table is reproduced in `reports/2026-07-29_GhostCode_UPLIFT_TrainReport.md`.

**Fidelity rule:** each phase prompt quotes its proposals' slate blocks **VERBATIM** from the report — the recorded taste travels intact; no lossy paraphrase. (This rule exists because a one-liner drift was caught at planning: Q7 is a **glyph-swap + aria-semantics change only** — its own verification demands a glyph-only diff, and the "50/50 appears twice" observation is fenced out-of-scope by the report itself.)

---

## 5 · Sky-fork schedule + SKY-PREP list

| Fork / gate | Phase | Nature |
|---|---|---|
| **Fork E** FYI (keep-diamond vs fenced grid reflow) | P1 pre-flight | Proceed on keep-diamond per the report unless Sky redirects; M1's mockup gate IS the fork's UI half. The reflow remains a fenced Sky+Dani input-model decision. |
| **M1 de-collision candidates** (2–3, real 375 content) | P1 | Mockup gate — S token fold, Phantom clearance, reveal-token unoccluded, all shown with the longest deck strings |
| **OG-card composition** (2–3 candidates) | P2 | **Plan-added gate** (new-asset composition; Sky is the design judge). Gates ONLY the og-image export — favicon recolor, PNG/ICO fallback, alt fix, and the other six P2 items proceed ungated |
| **Fork C** (keep vs remove the title controls line) | P2 | Surfaced with both mockups. Q1's one-line fix builds on silence (fixes a live defect); a later REMOVE pick supersedes it trivially |
| **Fork D** (name the curriculum pre-play) | P2 | Decision surfaced ONLY — a YES creates a PARKING-LOT item (new title copy is un-slated work); nothing in P2 blocks on it |
| **Fork A** (win-beat form: held ✓ · +N · command burn-in · all three) | P3 | Mockup gate; **S1 is the gated item**; Q6/Q7/Q8 proceed while it waits |
| **Q7 glyph choice** | P3 | **Plan-added light gate** (the report's glyph suggestion is illustrative, not a recorded decision — Sky is the design judge): 2–3 glyph candidates, AA-measured |
| **Fork F** (this-run row vs fenced mastery-rule change) | P4 | Gate on M6 only. A mechanics pick → M6 recorded FORKED (dropped from the train; the rule change goes to the fenced Sky+Dani list) |
| **Fork B** (title-Phantom form: idle-float · static glyph · one-shot materialize) | P5 | Mockup gate, front-loaded — the whole phase is the gated item; candidates are code-free mocks under `reports/captures/p5/` |

**SKY-PREP (prepare early; each item tagged with the phase that needs it):**
1. **Commit the `design-reviews/fable-audit/` TEXT files** (report + build-plan) — needed at/before P1. The design authority is currently untracked; a `git clean -fd` would delete the train's law. Decide gitignore-vs-commit for the ~80 MB `assets/` at the same time (text files can be committed either way). Until committed: the train pins absolute paths and **forbids clean operations**.
2. **Fork C + Fork D answers** → P2.
3. **OG-card pick** from candidates → P2.
4. **Q10 welcome-back wording review** → P2 (builds with the slate's example copy — "Welcome back — pick up where you left off" — flagged SKY-WORDING in DECISIONS; edit any time).
5. **Fork A pick + Q7 glyph pick** → P3.
6. **Fork F answer** → P4.
7. **Fork B pick** → P5.
8. **Device looks:** per-phase quick checks (iPhone Safari via `python3 -m http.server` on the LAN; VoiceOver; real OS-level Reduce Motion) + ONE consolidated close-out device session (P6 assembles the list).

---

## 6 · Standing rails (baked into every phase prompt; summarized here)

- **Stacked train + recovery protocol.** Branch off the named base; verify base present + green. If `origin/main` moved: check **content-containment** — prior phase squash-merged → **rebase** the phase branch onto `origin/main`; unrelated drift → **merge main in**; either way, full green gate before work item 1. An unexplained regression costs ONE reverted commit + a note — never the phase. (P1 caveat: M1/Q3b/Q9 edit overlapping CSS regions — a single revert there may cascade; the phase prompt acknowledges cascade-revert rather than promising clean atomicity.)
- **Green gate on every phase** (no new failures; CI mirrors it):
  `node --check cards.js` · extract the inline `<script>` (re-derive the line window every time) → `node --check -` · `node test/cards.test.js` · browser smoke via local server.
- **Checkpoint & handoff protocol.** One commit per work item = the checkpoint; BANK BEFORE NEW WORK; update `HANDOFF.md` at EVERY checkpoint; checkpoint + HANDOFF note BEFORE any risky multi-file step; a window killed mid-run must leave HANDOFF accurate to the last checkpoint; the resume rule reads HANDOFF first. Continuity > speed.
- **Mockup-gate mechanics.** A gate stops ONLY the gated item; ungated items proceed. No pick in-window → the item is recorded **PENDING-SKY-PICK** in DECISIONS + HANDOFF and the phase stops complete-except-pick. **No later phase builds on an unpicked outcome** — it inherits PENDING.
- **PROTECT-ACTIVE.** Each phase re-renders its touched PROTECT surfaces before/after for Sky's eye (per-phase recapture sets are in the phase prompts; the full PROTECT list is in the report).
- **Fences held verbatim.** Presentation-only (mechanics/curriculum/scoring/difficulty fenced); NESW direction mapping load-bearing (no remap); `textContent`-only for card-derived text; `[PERSIST-ADDITIVE]` gc.v1; `[LIFELINE-SESSION-ONLY]`; no invented copy/claims/numbers — Q10 uses the slate's example copy flagged SKY-WORDING; accessibility outranks aesthetics; honest evidence tags (verified / code-inferred / NEEDS-SKY-DEVICE).
- **STOP discipline.** Stop ON the branch. Merge, push, build, deploy, DNS = Sky's hands. **ff-only merge-order warning (in every phase handoff):** merging phase k's tip fast-forwards main through ALL of phases 1..k — merge in train order; skipping a phase requires rebasing all later branches + re-running gates.
- **Design-Compiler note (Const. Art. 2.4):** each phase's before/after capture set is the compile input; routing to Dani is Sky's step.
- **Capture rig:** reuse `design-reviews/fable-audit/tools/` (RUNBOOK.md; `PW_PREFIX` outside the repo; Playwright's bundled ffmpeg has no filters — use `-r 3`, not `-vf fps=3`). Captures land in `build-plan/reports/captures/p<N>/`; evidence in `build-plan/reports/P<N>-verification-evidence.md`.

---

## 7 · Launch-sequencing ledger (running; P6 consolidates into DEPLOY-CHECKLIST.md)

| # | Item | Source phase |
|---|---|---|
| L1 | `og:image` / `twitter:image` are ABSOLUTE URLs to the prod domain — after deploy, social scrapers may serve the CACHED old card: re-scrape (LinkedIn Post Inspector etc.; iMessage's cache is stubborn — expect lag) | P2 (M5) |
| L2 | Favicon PNG/ICO fallback `<link>` tags must ship in the SAME deploy as the files | P2 (M5) |
| L3 | Q5 preload URLs must byte-match the exact woff2 URLs the Google-Fonts CSS resolves to — a mismatch double-downloads; verify at build AND spot-check live post-deploy | P2 (Q5) |
| L4 | No DNS changes anywhere in this train (CNAME untouched) | — |
| L5 | Deploy = Sky pushes `main` → GitHub Pages; CI green gate runs on push — confirm green before the device session | P6 |
| L6 | Post-deploy device session runs against the LIVE site (Safari truth) | P6 |

---

## 8 · Parking lot (planning-time ideas — NOT scheduled; Sky's to pick up or drop)

1. **Fork-D YES-side title copy** (naming "Claude Code · Terminal · Git" pre-play) — created only if Sky answers YES; new copy is un-slated work and enters a future train, not this one.
2. **Stale-branch prune** (~12 pre-train branches in the repo) — pre-existing hygiene, not slate; the train adds clearly-prefixed `uplift/*` branches.
3. **"Use repo-root `DECISIONS_LOG.md` instead of build-plan/DECISIONS.md"** — considered and REJECTED (Sky's instruction mandates `build-plan/DECISIONS.md`); the ledger header disambiguates the two so no future agent merges them.

---

## 9 · How to fire the train

1. Complete SKY-PREP #1 (commit the text files) — or accept the pinned-paths risk knowingly.
2. Fresh window, **Opus 4.8 ultracode max effort**, paste: *"Read and execute `/Users/skypie/Games/pacman-code-trainer/design-reviews/fable-audit/build-plan/1.md` exactly as written."* — then, when it stops, fire `2.md`, `3.md`, … each in its own fresh window, in order.
3. When it stops: review its evidence report + captures, make any gate picks (recorded in DECISIONS.md), merge if desired (train order!), then fire the next phase file in a fresh window.
4. If a window dies mid-phase: fresh window, same phase file — its resume rule reads HANDOFF.md first and continues from the last banked commit.

---

## 10 · Self-verify record

- Plan-level adversarial review at authoring (architecture punch list): applied — Q7 scope corrected; `.screen` scoping law added (LAW 3); S1-fold + S3-badge re-verify laws added (LAWS 4–5); anchor-not-line-number rule (LAW 6); anchor-not-SHA carry (LAW 1); Fork D reframed decision-only; Fork F drop-protocol; S3 gate removed (report-decided); per-phase merge-order warning; squash/drift recovery protocol; untracked-authority SKY-PREP item.
- **Mechanical reconciliation (2026-07-16, scripted): PASS.** Slate IDs three-way exact match (report == master map == phase-file assignments = 19, zero duplicates); all embedded slate blocks **byte-identical** to the report; report path cited in every file; repo HEAD == `9789d1a` (no drift); `git status` clean except `design-reviews/` additions.
- **Skeptic pass (2026-07-16, 7 Sonnet skeptics — one per phase file + one for this master): 0 BLOCKER, 8 MAJOR, 12 MINOR — ALL FIXED same-run.** Fixes applied: recovery protocol inlined in P3–P6 pre-flights (was a dangling "as in the rails" pointer); read-first order reconciled (HANDOFF before DECISIONS, matching the resume rule); intended-files carve-outs for the ledgers + `reports/` in every phase; P1's device list gained the Q3a 768-iPad-Safari check and §10 gained a Q3 split-status notation (Q3a CLOSED / Q3b PENDING when the gate isn't picked); P2's PROTECT set gained the seeded stats strip + 1440/768 diamond geometry, its device list gained Q4/Q5/M4/Q10-VoiceOver checks, and M5's alt-text fix moved INTO the gated commit (words and picture can never disagree on the branch); P3/P4 evidence-report paths made explicit (`build-plan/reports/P1-verification-evidence.md`); P6's `<handshake-base>` placeholder resolved to an explicit rule, its two checklist deliverables given explicit `build-plan/` paths + a master files-list update instruction, its deploy steps renumbered one-per-line with L-tags, and "wrong-stack timing" spelled out; Q7's gate honestly labeled PLAN-ADDED (here, in P3, and in DECISIONS); LAWS 5/8 given explicit failure modes; a generator phrasing artifact ("ONLY … only") removed train-wide. Post-fix mechanical re-check: PASS (19/19 conservation, byte-fidelity intact, zero dangling pointers).
- **Verdict: plan PASS** — fresh-window runnable, conservation 19/19 both directions, fences carried, gates scoped to their items.
