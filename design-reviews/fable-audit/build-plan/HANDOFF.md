# HANDOFF.md — Ghost Code UPLIFT train (checkpoint state)

> Updated at EVERY checkpoint (each banked commit, each gate, each stop) — not just at phase end.
> A window killed at ANY moment must leave this file accurate to the last checkpoint.
> **The resume rule: a fresh window reads THIS FILE first, then DECISIONS.md, then continues from
> the last banked commit — never from chat memory.**

## ⚠ Standing warnings (apply to every phase)

- **ff-only merge order:** merging phase k's tip fast-forwards `main` through ALL of phases 1..k.
  Merge in train order (P1 → P2 → …). Skipping a phase requires rebasing all later branches and
  re-running their gates.
- **The design authority may be untracked** (`design-reviews/` — SKY-PREP #1). Until Sky commits the
  text files: absolute paths only, and **NO clean operations** (`git clean` is forbidden train-wide).
- Merge / push / build / deploy / DNS are **Sky's hands**. Phases stop ON their branch.

## Authoring run — 2026-07-16 (Fable 5 max, same session as the Part-3 report of 2026-07-10)

| File | Status |
|---|---|
| 00_master.md | ✅ written |
| DECISIONS.md | ✅ written (seeded) |
| HANDOFF.md | ✅ written (this file) |
| 1.md | ✅ written |
| 2.md | ✅ written |
| 3.md | ✅ written |
| 4.md | ✅ written |
| 5.md | ✅ written |
| 6.md | ✅ written |
| Skeptic pass + mechanical ID reconciliation | ✅ PASS (0 BLOCKER; 8 MAJOR + 12 MINOR all fixed — record in 00_master.md §10) |

## Execution state — P1 COMPLETE (stopped on branch)

- **Completed phases:** **P1 `The Floor` ✅** — all 5 CRITICALs closed on `uplift/p1-floor` @ `b5c3a50`
  (base `main`@`9789d1a`). NOT merged (Sky's hands).
- **Current phase / item:** — (P1 done)
- **Known issues:** none blocking. Honest residual: Q3b grow-jump not fully stabilized (reachability
  restored; a strict "never move" fix = panel overlay = structural, deferred).
- **Recommended next action:** Sky reviews `build-plan/reports/P1-verification-evidence.md` + captures →
  (optional) Dani Design-Compiler gate → **ff-merge `uplift/p1-floor` into `main` (train order!)** → run
  the device checklist → fire **P2** (`2.md`) in a fresh window on Opus 4.8 ultracode max.

### P1 conservation (ACTUAL at stop)
| ID | Status | Commit |
|---|---|---|
| M1 | CLOSED (candidate C + fold) | `b300b41` |
| M2 | CLOSED (verified non-repro + SD-9) | `6d150c4` |
| Q3 | CLOSED — Q3a `71bff76` + Q3b `b5c3a50` (both halves; C picked in-session) | — |
| Q9 | CLOSED (10px floor) | `4290195` |

### P1 The Floor — 2026-07-17 · branch `uplift/p1-floor` · base `9789d1a` (rollback anchor)
- [pre-flight] handshake CLEAN (HEAD==9789d1a, tree clean, no drift); `design-reviews/` untracked →
  absolute paths + NO clean ops. Fork E: proceeding keep-diamond (no Sky redirect).
- [captures] BEFORE set + M2 rAF diagnostic saved under `build-plan/reports/captures/p1/before/`.
- BANKED `6d150c4` — **M2**: L4-F1 verified NON-REPRO at per-frame resolution (all advance paths,
  both RM routes, 0 stale frames); `renderCard` clear already same-paint; annotated as SD-9 anchor;
  no behavioral change. SD-9 written to DECISIONS.
- BANKED `4290195` — **Q9**: 8px HUD stat labels → **10px** floor (largest that holds the 1-row HUD;
  11px wraps). Portrait `:1172` + landscape `:1261` twins. Verified 1-row/no-overflow @375 + landscape.
  **Q9 floor = 10px** (P4 badge + P2 relabel must respect).
- BANKED `71bff76` — **Q3a**: 768 SETTINGS un-clip. New `@media (min-width:601px) and (max-width:819px)`
  grows `#cabinet` (height:auto + min-height:min(780px,94vh) + max-height:96vh + overflow-y:auto) so the
  wrapped 2-row bar fits. Container-sizing only (no tap-target shrink). Verified un-clipped @601/700/768,
  arena 369→369 (diamond unchanged), 900/1440/375 unaffected.
- GATE M1 de-collision: **PICKED(C — Balanced)** by Sky in-session (A insufficient; B/C viable).
- BANKED `b300b41` — **M1** (candidate C): ≤600 de-collision (phantom 42→36, tokens →clamp(112,37vw,165))
  = +10/+12/+15px clearance @375/390/430 (was −8px). Learn fold relief (arena compaction + panel 32vh +
  learn cabinet scroll): pre-hint + retry1 show all 4 tokens; retry2/reveal scroll. focus-ring intact.
- BANKED `b5c3a50` — **Q3b**: general `body.learning-mode #cabinet{overflow-y:auto}` → 1440 learn diamond
  + bar reachable by scroll; 1440 arcade hero untouched. Residual: grow-jump not fully stabilized (MED).
- STATUS: **stopped complete** (all 5 items banked; green gate clean; diff = index.html only; PROTECT intact)
- REMAINING: none
- KNOWN ISSUES: Q3b grow-jump residual (reachability restored; strict fix = structural, deferred)
- NEXT ACTION + resume: P1 is done. Sky merges (ff-only, train order) → device checklist → fire `2.md` (P2)
  fresh window. Capture rig this session: `PW_PREFIX=<scratchpad>/pwdeps`, `BASE_URL=http://127.0.0.1:8123`.
- Capture rig (this session): `PW_PREFIX=<scratchpad>/pwdeps`, `BASE_URL=http://127.0.0.1:8123`,
  server `python3 -m http.server 8123` running; drivers reuse `tools/lib.mjs`.

> **ff-only merge-order reminder:** merging this branch fast-forwards `main` through P1 — merge in
> train order P1→P6. Stop is ON the branch; Sky merges.

### (original pre-start note, superseded) — Sky completes SKY-PREP #1 (commit `design-reviews/` text files), then fires P1.

## Execution state — P2 COMPLETE (stopped on branch `uplift/p2-frontdoor` @ `78d605a`)

### P2 The Front Door — 2026-07-17 · branch `uplift/p2-frontdoor` · base `b5c3a50` (rollback anchor)
- [pre-flight] Branch created off `uplift/p1-floor`@`b5c3a50`; base green gate PASS (56/56). No drift (main==origin==`9789d1a`). `design-reviews/` UNTRACKED → absolute paths + NO `git clean` + stage only named files. Fork C=**KEEP & fix**, Fork D=**NO/keep-generic** recorded in DECISIONS §B/§D.
- [captures] BEFORE stills saved → `build-plan/reports/captures/p2/before/` (title fresh+seeded @375/768/1440; og-image.png + favicon.svg as-is). Q1 orphan + Q10 flat-weight seeded strip both confirmed in baseline. M4 pause/game-over fade baselines captured at M4 start (fade code untouched by Q4/Q1/Q2/Q5 — verified by their diffs).
- [09:54] BANKED `dcd858e` — **Q4**: invalid `@supports` grammar in `.word1` fallback fixed (De Morgan). Forced-fallback = `var(--accent)` 10.64:1 on title bg. Zero change on supporting browsers.
- [09:57] BANKED `9e5c46d` — **Q1**: controls-orphan — inverted NBSP binding (pairs glued, separators break). "? HELP" intact @1440/768. Fork C mocks → `captures/p2/forkC/`.
- [10:09] BANKED `8f32c49` — **Q2**: one canonical category name via `CATEGORY_LABELS` (HUD + chip + game-over bars). LAW 8: 375 single-row HUD held at the Q9 10px floor (≤600 gap 10→8px).
- [10:23] BANKED `3c9c438` — **Q5**: preload 2 variable woff2 (byte-matched, no double-download) + metrics-matched `@font-face` fallbacks. Tokens hold height (dH −3→0), HUD digits dW 0; 375 tagline no reflow; diamond stable.
- [10:41] BANKED `15838b9` — **M4**: title→board double-exposure killed — two-beat (content fade over opaque bg → cut) scoped to `#title` start path; RM instant (unchanged). DE metric 0.25→0. **Pause byte-identical (sha 5679d11d… ==), game-over transition unchanged** (SD-6 / LAW 3 held).
- [10:52] BANKED `e48e310` — **Q10**: returning-player branch (`mastered>0`) — accent MASTERED numeral (#3DD8C4) + static "Welcome back — pick up where you left off". Fresh shows neither; aria group unchanged. SKY-WORDING.
- [reconcile 2026-07-17, git-verified] An external reconcile note previously claimed Q5 uncommitted / M4·Q10 not done — that was **STALE**. Git (`main..HEAD`) is authoritative: **all 6 code items are committed** (dcd858e·9e5c46d·8f32c49·3c9c438·15838b9·e48e310); the working tree has no tracked changes. Corrected here from git.
- [11:12] BANKED `350f8bb` — **M5a**: favicon recolored to shipped palette (geometry byte-identical → mascot PROTECT held) + favicon-32/180.png + favicon.ico (3-size) + SVG/PNG/apple-touch/ICO link tags (Ledger L2). All 4 icons 200.
- [11:34] GATE OG-card: **PICKED(A — editorial)** by Sky in-window. 3 typography-only candidates rendered <100KB → `captures/p2/og-candidates/`.
- [11:38] BANKED `c4b06dc` — **M5b**: exported candidate A as og-image.png (91,984 B, was 323,598) + rewrote og/twitter image alt to the actual card (dropped the false mascot claim, L1-F2). Tool-07 harness: words+picture agree.
- [11:44] BANKED `c24f34c` — **Q2-follow-up** (⚠ exceeds approved plan): unified the copy-result SHARE string ("MAC deck"→"TERMINAL deck") via `CATEGORY_LABELS`. Isolated, revertible; Sky may drop.
- [close-out] Adversarial verification: 2 independent skeptics (M4/motion + Q5/Q2/Q4/PROTECT) → **NO correctness bug, NO PROTECT regression**; Q5 preload URLs empirically re-confirmed against the live css2 endpoint. One LOW nit actioned → M4-harden below.
- [12:02] BANKED `78d605a` — **M4-harden**: dropped M4's deferred rAF cleanup (backgrounded-tab fragility flagged by the skeptic) — net simplification, no behavior change. Re-verified maxDE 0 / RM 0 / pause sha `5679d11d…` unchanged. (The capture server had died mid-close-out → restarted; the fix was verified against a live server.)
- STATUS: **STOPPED COMPLETE** — all 7 slate items CLOSED; OG gate RESOLVED (A); adversarial pass clean + hardened. **Tip `78d605a`** (10 P2 commits). Green gate 56/56, 0 console errors. `git diff b5c3a50..HEAD` = 6 intended files only (index.html + favicon.svg + og-image.png + 3 new icon files). Evidence: `build-plan/reports/P2-verification-evidence.md`.
- REMAINING: none (phase complete).
- KNOWN ISSUES: none blocking. Honest residuals: Q5 Inter proportional-advance ~5px variance on the one-line tagline (cosmetic, no reflow; inherent to metrics fallbacks); Q2-follow-up (`c24f34c`) exceeds approved scope — Sky's call to keep/drop.
- NEXT ACTION: **Sky reviews** `P2-verification-evidence.md` + captures → (optional) Dani Design-Compiler gate on the before/after set → **ff-merge `uplift/p2-frontdoor` into `main` in train order (P1 then P2)** → run the §device checklist → fire **P3** (`3.md`) fresh window. **Resume rule** (if re-fired): read this file — the phase is complete, nothing to redo. Capture rig this session: `PW_PREFIX=/private/tmp/claude-501/-Users-skypie/a1351595-26f1-4d73-abde-ff7934225849/scratchpad/pwdeps`, `BASE_URL=http://127.0.0.1:8123`.

> **ff-only merge-order reminder:** merging this branch fast-forwards `main` through P1 AND P2 — merge in train order. Stop is ON the branch; Sky merges.

## Execution state — P3 COMPLETE (stopped on branch `uplift/p3-winbeat` @ `161ae66`)

### P3 Winning, Authored — 2026-07-17 · branch `uplift/p3-winbeat` · base `78d605a` (rollback anchor)
- [pre-flight] §0 HARD GATE PASSES: SD-9 anchor recorded non-blank (`renderCard()` token-reset loop, P1 `6d150c4`) → S1 may ship. Branch created off `uplift/p2-frontdoor`@`78d605a`; base green gate PASS (56/56). No drift (main==origin==`9789d1a`, unmoved → clean branch, no rebase). `design-reviews/` UNTRACKED → absolute paths + NO `git clean` + stage only `index.html`. **Both P3 gates pre-picked by Sky in plan mode:** Fork A=**ALL THREE**, Q7=**HEART + SLASHED-CIRCLE** (DECISIONS §B/§D) → no throwaway prototype capture; picked forms built directly.
- [banked `974f601`] **Q6**: `.token.wrong:focus-visible` neutralizes the teal ring → `--text-secondary` slate (via new `--neutral-halo`), geometry byte-identical. Measured ring contrast 7.76:1 (base) / 5.46:1 (wrong fill) — both ≫ 3:1. Fill + ✗ untouched. Live-verified (frame-pumped: outline+border+halo all neutral rgb(157,167,179)).
- [banked `be022b6`] **Q7** (SD-2 glyph+aria only): SPIRITS teal `#lives::before` heart + NEW `#lives` aria-label "{n} lives remaining"; 50/50 star → gold slashed-circle ⊘ (same 16×22 box). Live-verified: ♥▮▮▮ / ⊘⊘⊘, a11y tree "3 lives/lifelines remaining", no label text changed, no layout shift.
- [banked `36d160e`] **Q8**: pause → true modal — RESUME `.big-btn`, `role=dialog`+`aria-modal`+`aria-labelledby`, `setBoardInert(true)` on pause, focus stash-before-inert / restore-after-un-inert, Esc+RESUME both togglePause. Focus-to-RESUME via bounded per-frame poll (fade keeps it unfocusable ~1 frame-set). `.screen` fade UNTOUCHED (LAW 3). Live-verified: board inert, RESUME sole focusable (Tab contained), Esc resumes+restores to pre-pause element, RESUME-click resumes.
- [banked `0cf8bca`] **S1a**: held-win CSS — `.token.captured` holds (no dissolve), `.score-fly`+`#win-strap`+`.lp-answer--sm` rules (RM-safe: keyframes end visible, `both`), `#win-strap` node + DOM cache. Inert until S1b.
- [banked `161ae66`] **S1b**: wired — spawnScoreFly (`earned` pre-`streak++`), arcade strap = `state.current.answer` via textContent (opaque chip), learn CORRECT panel gains answer line (closes L3-F7), SD-9 teardown removes fly + clears strap in the same paint. Live-verified in BOTH modes; **LAW 1/SD-3 same-paint teardown confirmed at DOM level** (advance → 0 correct/captured/fly, strap hidden+empty, new prompt).
- STATUS: **STOPPED COMPLETE** — all 4 slate items CLOSED (Q6/Q7/Q8/S1); both gates PICKED. **Tip `161ae66`** (5 P3 commits). Green gate 56/56, 0 console errors. `git diff 78d605a..HEAD` = **index.html only** (+168/−17). No new flashing. PROTECT intact. Evidence: `build-plan/reports/P3-verification-evidence.md`.
- REMAINING: none (phase complete).
- KNOWN ISSUES: none blocking. Environment note (not a bug): this session's automated browser throttles rAF + CSS transitions when the tab isn't painting — Q8 focus-move and Q6 ring-transition need painted frames to complete; both verified correct once frames pumped (real users always paint). NEEDS-SKY-DEVICE: real-OS Reduce Motion (S1 static hold), VoiceOver on the pause dialog (Q8), and a real-Safari/WebKit pass (all captures Chromium).
- NEXT ACTION + resume command: **Sky reviews** `P3-verification-evidence.md` + captures → (optional) Dani Design-Compiler gate on the before/after set → **ff-merge in train order (P1 → P2 → P3)** → run the §device checklist → fire **P4** (`4.md`) fresh window. **Resume rule** (if this file is re-fired on `3.md`): read HANDOFF first — the phase is complete, nothing to redo. Capture rig this session: `PW_PREFIX=<this session's scratchpad>/pwdeps`, `BASE_URL=http://127.0.0.1:8123` (server on :8000 was used for the live Browser-pane drive).

> **ff-only merge-order reminder:** merging this branch fast-forwards `main` through P1, P2 AND P3 — merge in train order (P1→P2→P3). Stop is ON the branch; Sky merges.

## Execution state — P4 COMPLETE (stopped on branch `uplift/p4-studyreport` @ `15e6669`)

### P4 The Study Report, Cashed — 2026-07-18 · branch `uplift/p4-studyreport` · base `161ae66` (rollback anchor)
- [pre-flight] Branch created off `uplift/p3-winbeat`@`161ae66`; base green gate PASS (56/56, script
  window 1659..2767). No drift (main==origin==`9789d1a`, unmoved → clean branch, no rebase).
  `design-reviews/` UNTRACKED → absolute paths + NO `git clean` + stage only `index.html` (+ the
  ledgers/reports under `build-plan/`). **Fork F PICKED by Sky (plan gate) = presentation row** →
  M6 builds (see DECISIONS §B/§D). Slate: M3 (ungated) · M6 (Fork F=presentation) · S3 (SD-1).
- [captures] BEFORE set saved → `build-plan/reports/captures/p4/before/` (game-over fresh+seeded
  @375/768/1440 with the 8 LONGEST-lesson cards as this run's misses; drill-run @3 widths). Clipping
  (L2-F3) + inverted button weight (L8-F4) + no-drill-identity (L3-F6) all confirmed in baseline.
- [BANKED `d67e2e5`] **M3**: never-clip the review box. Sticky gradient edge-fades (decorative
  `::before` top + aria-hidden `.mr-more` child bottom, carrying "↓ more" glyph+text) gated on
  `.mr-overflow`; `updateMissedReviewFade()` toggles state on scroll + rAF-after-show. Verified
  @375/768/1440: overflow→fade+more, bottom→top-fade+last-line-readable+cues-gone, 1-short-miss→zero
  cues (sh==ch 98/98), box→Tab→drill-missed-btn (no trap). RM-safe (no opacity anim). Green gate 56/56.
- [BANKED `8e7b61f`] **M6** (Fork F = presentation row): this-run credit + un-hide MASTERED bar.
  New session-only `runCorrectByCat` (reset in startGame, incremented in answer handler, NEVER
  persisted) → per-category "+N this run" chip + hatched provisional sliver + "You answered N of M
  correctly this run." summary; no chip at 0. Chip aria-hidden, credit folded into the bar's
  aria-label. `#learn-progress-bar` un-hidden → role=progressbar + dynamic aria-valuenow/max/label
  (max = activeDeck().length, NOT hard-coded 56 — deviation flagged). Verified @375/1440:
  {claude:+2,git:+3}, mac:0→none, summary correct, no cramp; learn bar value 3/56==visible 3/56.
  Green gate 56/56.
- [BANKED `63da969`] **S3** (SD-1 / L8-F4 + L3-F6): DRILL MISSED becomes the filled `.big-btn blink`
  primary + PLAY AGAIN → secondary ghost (only when misses exist; flawless run keeps PLAY AGAIN
  primary). Fill/weight/order move; hotkeys + the app-driven focus target (again-btn) byte-identical
  to base. Measured AA: DRILL 10.64:1, PLAY AGAIN 7.76:1. New `#drill-badge` "DRILLING MISSES ·
  {cleared} of {N}" — standalone centred chrome pill below the HUD (order 3), body.drill-mode toggle,
  CATEGORY stat hidden while drilling → **Q9 single-row HUD holds @375 (visibleStats=5, rows=1)**.
  `drillCleared` Set (unique correct, session-only, never persisted). aria-live=polite, change-guarded
  (no spam), ≥10px. Verified: swap + no-miss fallback + badge 0/3→(real correct press)→1/3. Green 56/56.
- [2026-07-29, Item 4 END-STATE RE-VERIFY] New driver `tools/p4-endstate.mjs` drove M3+M6+S3
  simultaneously (worst-case 8 misses, fresh+seeded profiles, ×3 widths). No-clip confirmed
  (`lastItemFits:true` all 6 combos). Drill-run chrome confirmed (Q9 10px floor holds @375, 11px
  @768; single-row HUD holds; real page-level overflow `false` at all 3 widths — an initial cruder
  `#cabinet.scrollWidth` reading was investigated and found to be a pre-existing `.screen`-bleed
  artifact unrelated to P4, confirmed identical in plain arcade mode with zero drill badge present).
  Master LAW 3 re-smoke (`tools/p2-m4.mjs p4-endstate`): maxDE 0 both RM paths; computed `.screen`
  transitions byte-identical to P2's values; `git diff` confirms zero lines of pause/`.screen` code
  touched by any P4 commit (definitive proof — a cross-session PNG hash isn't valid to compare).
- [2026-07-29, adversarial pass] 2 independent skeptics: one on M6 (session-state/persistence/aria),
  one on S3 (focus-contract/Q9-floor/M3-interaction) — both empirically stress-tested in a real
  browser, not just static reads. **S3: all 7 claims CONFIRMED-OK, 0 defects** (one non-blocking
  design-tension note: keyboard/SR focus lands on the now-secondary again-btn, not the promoted
  DRILL MISSED primary — intentional per the PROTECT'd focus contract, Sky's call whether to revisit).
  **M6: 2 real bugs + 1 cosmetic found, all fixed:**
- [BANKED `b34473e`] **M6-adv1**: `#learn-progress-bar` had leaked into the a11y tree behind
  title/pause/game-over once M6 un-hid it (`setBoardInert()` was never extended to cover it) —
  empirically found via a real accessibility-tree dump showing "progressbar Mastered 0 of 0"
  alongside "PRESS START" on the title screen. Fixed by folding it into the same inert toggle as
  `#arena`/`#bar`/`#mode-toggle`. Re-verified: inert on title-with-learn-persisted + mid-pause,
  live again on resume.
- [BANKED `26a6e46`] **M6-adv2**: Learn-mode `mastered` count was unfiltered (whole-session
  `state.learnMastered.size`) while `total` was deck-filtered — an ordinary category switch
  mid-session could produce `aria-valuenow > aria-valuemax` (empirically reproduced: "23 of 16",
  ARIA-invalid). Fixed by filtering `mastered` through the same `deck` array as `total`. Re-verified
  against the identical repro: now "0/16", valid range.
- [BANKED `15e6669`] **M6-adv3**: the "this-run" sliver was clipped/invisible at 100% lifetime
  mastery (floor-forced 2% width placed it entirely past the track's right edge). Fixed by clamping
  `left` to `min(pct, 100-width)`. Re-verified: GIT @100% mastery + 2 this-run now renders
  left:98%/width:2% (fully inside the track) instead of left:100% (clipped).
- STATUS: **STOPPED COMPLETE** — all 3 slate items CLOSED (M3/M6/S3); Item 4 end-state re-verify
  CLOSED; adversarial pass CLOSED (2 real bugs + 1 cosmetic fixed, re-verified against their exact
  repro scenarios; 1 design-tension note surfaced for Sky). **Tip `15e6669`** (6 P4 commits). Green
  gate clean throughout (56/56, 0 console errors). `git diff 161ae66..15e6669` = index.html only
  (+212/−9). PROTECT surfaces intact (focus contract byte-unchanged, re-queue mechanic untouched,
  seeded stats strip untouched, fade byte-parity held). Evidence:
  `build-plan/reports/P4-verification-evidence.md`.
- REMAINING: none (phase complete).
- KNOWN ISSUES: none blocking. Honest deviations (unfixed — correct behavior, not oversights): M6
  learn-bar `aria-valuemax` is dynamic (report said 56); S3 blink relocated to the new primary; drill
  badge reads "cleared-of-N" (not queue position, since `pickCard()` draws with repeats).
  NEEDS-SKY-DEVICE: M3 Safari scrollbar + OS RM; M6 VoiceOver (chips + un-hidden progressbar); S3
  real-browser auto-focus (headless throttles the fade, confirmed pre-existing/environmental via a
  manual-refocus test that succeeds instantly) + VoiceOver badge; iPhone look of the re-weighted
  game-over buttons @375.
- NEXT ACTION + resume: Sky reviews `build-plan/reports/P4-verification-evidence.md` + captures →
  (optional) Dani Design-Compiler gate → **ff-merge `uplift/p4-studyreport` into `main` (train order:
  P1→P2→P3→P4)** → run the device checklist → fire **P5** (`5.md`) in a fresh window. Capture rig
  this session: `PW_PREFIX=/private/tmp/claude-501/-Users-skypie/18652365-6856-4fdd-9f05-fe8dddc13f6d/scratchpad/pwdeps`,
  `BASE_URL=http://127.0.0.1:8123`.

> **ff-only merge-order reminder:** merging this branch fast-forwards `main` through P1, P2, P3 AND
> P4 — merge in train order (P1→P2→P3→P4). Stop is ON the branch; Sky merges.

## Execution state — P5 COMPLETE (stopped on branch `uplift/p5-ghost` @ `a2b75f6`)

### P5 The Ghost Is Real — 2026-07-29 · branch `uplift/p5-ghost` · base `15e6669` (rollback anchor)
- [pre-flight] Branch created off `uplift/p4-studyreport`@`15e6669`. **Note on base SHA:** `5.md`
  (authored 2026-07-16) names the base as P4's tip `63da969` — that was correct at authoring time,
  but this session's P4 close-out (Item 4 end-state re-verify + adversarial pass) banked 3 more
  commits fixing 2 real bugs found by adversarial review, moving the P4 tip to `15e6669`. Per the
  resume rule ("a fresh window reads HANDOFF.md first... continues from the last banked commit"),
  P5 correctly branches from the CURRENT tip, not the stale reference. Base green gate PASS (56/56).
  No drift (`main`==`origin/main`==`9789d1a`, unmoved). `design-reviews/` UNTRACKED → absolute paths
  + NO `git clean` + stage only `index.html`.
- **Master LAW 2 pre-flight check:** P2 (`78d605a`) and P4 (`15e6669`) both banked on this branch's
  history (confirmed via `git log`; both evidence reports exist) — S2 may proceed.
- **Fork B (title-Phantom form) gate:** resolved coming into this window — **PICKED: C, one-shot
  materialize** (Sky's decision, recorded this session; see DECISIONS.md §B/§D). No throwaway
  candidate mocks needed — building the picked form directly, per §C's "pick in hand → build
  directly" precedent (mirrors P3's Fork A handling).
- **D-3 (in-play clause forked):** traced `renderCard()`/`answer()`/`learningRetry()`/
  `learningReveal()`/`nextCard()` — confirmed no idle non-card-read window exists in the gameplay
  loop (every window is a prompt-read, hint-read, or verdict beat the capture-lunge already owns).
  The two dormant keyframes (`phantom-float`, `phantom-tail-pulse`) are re-homed to the game-over
  Phantom instead of wired into in-play idle time. S2's in-play clause records as **FORKED** with
  this finding; the title + game-over bookends proceed as **CLOSED**.
- [BANKED `13c1122`] **B1**: rewrote the dormant `phantom-float`/`phantom-tail-pulse` keyframes
  (amplitude `-10px`→`-3px`, asymmetric from/to → symmetric 0/50/100, tail opacity base 0.6→0.9
  matching `.phantom-tail`'s own resting value, `transform-origin:50% 0` added). Zero visual change
  — confirmed unreferenced by any element. Green gate 56/56.
- [BANKED `34f8d76`] **B2**: `.phantom-figure` shared placement CSS (absolute, 64×80, `--title`/
  `--over` position variants) + mobile (≤600px) size/position variant + `position:relative` on
  `#title h1`/`#gameover h2` (load-bearing anchors, commented in place). Zero visual change —
  confirmed unused. Green gate 56/56.
- [BANKED `87cc42a`] **B3**: inserted the title + game-over figure instances — duplicate of
  `#phantom`'s inner subtree (cursor-bar + head + eyes + tail, same bare-class geometry, zero
  redraw) as the first child of `#title`'s `<h1>` and `#gameover`'s `<h2>`, `aria-hidden="true"`.
  Verified: both are the genuine first child; `aria-hidden` correctly excludes them from the a11y
  tree (they carry no text nodes either way); `.phantom-figure` deliberately NOT added to
  `gameOver()`'s teardown array (static markup); replay-twice (3× `gameOver()` with no reset) shows
  exactly 1 figure instance each time, no stacking. Visually verified @1440. Green gate 56/56.
- [BANKED `a2b75f6`] **B4**: wired the motion. Title gets a one-shot `phantom-materialize` (Fork
  B=C), `both` fill, 1 iteration, on the wrapper only — `#phantom`'s own transform stays 100% JS
  (SD-5 untouched, verified `animationName:'none'` throughout). Fires exactly once per session
  (`#title` never regains `.hidden` after the one-way title-exit — confirmed no
  `classList.remove('hidden')` on `DOM.title` anywhere). Game-over gets B1's rewritten keyframes
  re-homed (D-3), scoped `#gameover:not(.hidden)` — zero JS/timers, replay-safe. RM verified on BOTH
  paths (CDP + in-app): `opacity:1`, fully materialized, never faded to nothing. Added the RM
  pseudo-element asymmetry warning comment to the RM block. Green gate 56/56.
- [2026-07-29, full verification pass] ONE-ACTOR-MOVES PASS (151-frame sample, zero arena motion/
  animation during idle). Finite-iteration PASS — only sanctioned `cursor-blink` (now 3 static DOM
  instances, mutually exclusive in real play) plus one newly-found PRE-EXISTING exception:
  `#stars`'s `twinkle infinite`, confirmed `display:none` (dead synthwave-era leftover, unrelated to
  S2). Photosensitivity PASS (~0.30 Hz, floor is 3 Hz). Geometry-PROTECT PASS (zero new base
  `.phantom-*` rules — only compound-selector motion rules + markup reuse). M4 re-smoke PASS
  (maxDE 0 both RM paths; `git diff` confirms zero lines of pause/`.screen` code touched — the
  definitive proof, not a cross-session hash compare).
- [2026-07-29, Master LAW 2] 375/1440: PASS, byte-identical DOM geometry across repeated controlled
  A/B runs (pre-P5 code served in isolation vs current code, measured in one script execution).
  768: an intermittent ~39px `#gameover` height flake appeared in some runs — investigated properly
  rather than dismissed: reproduced the SAME flake comparing the pre-P5 code against ITSELF,
  proving it predates this phase entirely and is unrelated to any P5 commit (likely a font-load/
  text-wrap timing race in the P3/P4-vintage `.missed-review` content, not confirmed further —
  flagged as a separate investigation). In-play: proven layout-neutral by `git diff` line-absence
  (zero lines touch `#arena`/`.token`/`renderCard`/`shuffle`/`pickCard`) rather than a pixel-diff,
  since the app's own `Math.random()` calls make cross-process screenshot comparison inherently
  noisy for this specific surface.
- STATUS: **STOPPED COMPLETE** — S2's title+game-over bookends CLOSED; in-play clause **FORKED**
  (D-3, recorded not dropped). **Tip `a2b75f6`** (4 P5 commits). Green gate clean throughout
  (56/56, 0 console errors). `git diff 15e6669..a2b75f6` = index.html only (+64/−6). PROTECT
  surfaces intact. Evidence: `build-plan/reports/P5-verification-evidence.md`.
- REMAINING: none (phase complete, modulo the in-play FORK which is recorded, not pending).
- KNOWN ISSUES: none blocking. Honest residuals (pre-existing, not S2-introduced, not fixed): the
  ≤600px eye-overlap (PROTECT'd mascot geometry, deserves its own Design Compiler pass); 3 static
  `cursor-blink` DOM instances (visually mutually exclusive via z-index/opacity stacking, not
  absence); unused `--phantom-tail`/`--phantom-eye*` design tokens. NEEDS-SKY-DEVICE: real OS Reduce
  Motion; iPhone look of the title Phantom @375; real-device feel of the game-over float/pulse
  amplitude (Chromium timing ≠ device compositor); Safari/WebKit generally.
- NEXT ACTION + resume: Sky reviews `build-plan/reports/P5-verification-evidence.md` + captures →
  (optional) Dani Design-Compiler gate → **ff-merge `uplift/p5-ghost` into `main` (train order:
  P1→P2→P3→P4→P5)** → run the device checklist → fire **P6** (`6.md`) in a fresh window (close-out
  phase per `00_master.md`). Capture rig this session:
  `PW_PREFIX=/private/tmp/claude-501/-Users-skypie/18652365-6856-4fdd-9f05-fe8dddc13f6d/scratchpad/pwdeps`,
  `BASE_URL=http://127.0.0.1:8123`.

> **ff-only merge-order reminder:** merging this branch fast-forwards `main` through P1, P2, P3, P4
> AND P5 — merge in train order (P1→P2→P3→P4→P5). Stop is ON the branch; Sky merges.

## Execution state — P6 IN PROGRESS (branch `uplift/p6-closeout`)

### P6 Close-Out — 2026-07-29 · branch `uplift/p6-closeout` · base `a2b75f6` (rollback anchor)
- [pre-flight] Branch created off `uplift/p5-ghost`@`a2b75f6` (P5's tip; P5 stopped complete with 4
  commits banked, so base = P5's tip per §2.1). Base green gate PASS (56/56, script window 1804..3027).
  No drift (`main`==`origin/main`==`9789d1a`, unmoved). All 30 conservation-table SHAs re-resolved via
  `git log -1` and confirmed present with matching subjects before any work began.
- [BANKED `f5aece0`] **P6-0** (bootstrap, partial SKY-PREP #1): staged the 14 existing
  `build-plan/**.md` files by explicit pathspec (00_master/DECISIONS/HANDOFF/1-6.md/reports P1-P5) —
  all landed as `A` (ADD), confirmed via `git diff --cached --name-status` before committing. 2916
  insertions, zero binaries. `design-reviews/` captures/assets/tools remain untracked (commit-scope
  decision: build-plan text only).
- [captures] `tools/p6-captures.mjs` written (new — fills 2 coverage holes + 1 new probe): seeded@768
  title+gameover (01-base-screens.mjs's seeded matrix was 1440+375 only), in-app
  Settings->Motion=Reduced @768/375 (04-rm.mjs's in-app job was 1440 only), and a new in-play
  photosensitivity probe for the wrong-answer window (nothing in the train had measured this before).
  Output → `build-plan/reports/captures/p6/final/`.
- [photosensitivity probe — methodology note] A first rAF-loop version produced untrustworthy
  box-shadow-alpha readings (matched none of the 3 declared `danger-pulse` keyframe stops) —
  consistent with this environment's documented rAF/timer-callback throttling (RUNBOOK.md / P3
  evidence: "throttles rAF + CSS transitions when the tab isn't painting"). Replaced with in-page
  `setInterval` polling (same timer substrate as the app's own `setTimeout` calls, so the MEASURED
  gap is self-consistent regardless of callback-delivery delay) + a live computed-style sample for
  iteration-count + the keyframe source itself for the amplitude bound. Ran 3 independent times:
  measured lockout window 1894ms / 1896ms / 1983ms (mean 1924ms, all within normal timer-scheduling
  jitter of the code's declared 1900ms constant) — reported as a precision band (±poll interval),
  not a single cherry-picked number. `animationIterationCount` read live = `'1'` every time; static
  grep of `.danger-flash`'s rule + the `danger-pulse` keyframe confirms no `infinite` keyword and no
  iteration-count override anywhere in the stylesheet. **PASS.**
- [BANKED `<pending>`] **P6-1** — whole-train gates at the tip:
  - Green gate: 56/56, 0 console errors, script window 1804..3027.
  - New capture rig (above): PASS — seeded@768 + in-app RM@768/375 captured; photosensitivity probe
    PASS (measured window consistent with ≥1900ms across 3 runs; iteration-count confirmed 1).
  - `p5-anim-audit.mjs` re-run at the tip: FINITE-ITERATION AUDIT PASS; PHOTOSENSITIVITY (tail-pulse)
    PASS (~0.30 Hz). **Honest note:** console reports "cursor-blink instances: 6" vs P5's prose
    reporting 3 — verified via the raw JSON this is a benign double-count (the script concatenates
    its title-pass + game-over-pass findings; all 3 physical `.phantom-cursor-bar` DOM elements are
    always present regardless of which screen is active, so each pass finds all 3 = 3+3=6). Same 3
    physical elements P5 already accounted for ("mutually exclusive in real play via z-index/opacity
    stacking, not absence"); P5's prose likely transcribed the architectural count instead of the
    script's own concatenated total. Not a regression — allowlisted either way.
  - `p5-oneactor.mjs` re-run at the tip: ONE-ACTOR-MOVES PASS (150 frames, 1 distinct position/
    transform, 0 non-'none' animation-name frames).
  - `p4-endstate.mjs` and `p5-law2-domcheck.mjs` deliberately NOT re-run: the former hardcodes its
    output path to `captures/p4/endstate/` — re-running it at the P6 tip (which includes P5's Phantom
    bookends, absent from P4's own tip) would silently overwrite P4's evidence captures with
    different-looking pixels than what `P4-verification-evidence.md`'s prose describes. The latter
    needs two genuinely different URLs to compare and P6 makes zero code changes, so there is nothing
    to A/B. Both replaced by a stronger, more direct proof: `git diff 15e6669..a2b75f6` (P5's diff)
    touches zero lines matching any M3/M6/S3 selector/function
    (`missed-review|mr-overflow|mr-more|updateMissedReviewFade|mastery__|learn-progress-bar|
    runCorrectByCat|drill-badge|drill-missed-btn|drillCleared`) — their P4 end-state guarantees
    therefore carry forward unchanged to the P6 tip without needing a re-shoot.
  - Three fade-check legs via `p2-m4.mjs` (honest three-way framing per the phase brief — nothing
    changed at P6 so there is no before/after, only what each leg actually proves):
    1. **Measured, intra-session:** ran `p2-m4.mjs p6-run1` and `p6-run2` back-to-back at the tip —
       `pauseSettledSha` identical both runs (`d75d3ba28f1338b4` == `d75d3ba28f1338b4`). `maxDE=0`
       both full-motion and reduced-motion, both runs (matches the established P2/P4/P5 baseline).
    2. **Measured, cross-session string compare:** computed `.screen` transition on both `#pauseScreen`
       and `#gameover` = `"opacity 0.35s, visibility 0.35s"` both runs — byte-identical to P5's
       recorded value.
    3. **Code-inferred, definitive:** `git diff 9789d1a..HEAD -U0 -- index.html`, filtered to the
       `.screen`/`.screen.hidden` rule bodies and the literal `transition: opacity 0.35s...` line,
       matches **zero** lines across the WHOLE train — the core fade rule itself was never touched by
       any phase. (A broader keyword grep for `pauseScreen`/`togglePause` DOES find 3 lines — Q8's own
       already-verified P3 work: an `aria-label`→`aria-labelledby` swap, a documenting comment, and
       the new RESUME button's listener — none of which touch the fade mechanism; expected, not a
       LAW 3 violation.) **P6 itself changes zero lines of `index.html`/`cards.js`** (`git diff
       a2b75f6..HEAD` on those two files = empty) — the strongest form of this proof for this phase.
  - Diff audit: `git diff 9789d1a..HEAD --stat` = 20 files — the same 6 code files as P5's tip
    (`index.html` + `favicon.svg`/`favicon-32.png`/`favicon-180.png`/`favicon.ico`/`og-image.png`)
    plus the 14 build-plan `.md` files P6-0 just added. No drift-adjusted base recorded in
    `DECISIONS.md` §D (checked) — base remains `9789d1a`. Every touched file accounted for by a
    phase's intended-files list; nothing unexplained.
  - This item's own commit (this HANDOFF update) = **P6-1**. (Commit SHAs are backfilled into the
    NEXT checkpoint entry once known — a commit cannot cite its own hash in its own content.)
- STATUS: Item 1 complete, evidence banked. Continuing to Item 2 (conservation -> ACTUAL).
- NEXT ACTION + resume: if this window dies, a fresh window reads this file — Item 1's gates are
  documented above and do not need re-running; continue from Item 2.

## Execution checkpoint template (each phase appends entries in this shape)

```
### P<N> <phase name> — <date> · branch <uplift/...> · base <sha>
- [hh:mm] BANKED <commit sha> — <work item id>: <one line>
- [hh:mm] GATE <name>: PRESENTED / PICKED(<choice>) / PENDING-SKY-PICK
- [hh:mm] CHECKPOINT before <risky step>: <what is about to change and why>
- STATUS: <in progress | stopped complete | stopped complete-except-pick>
- REMAINING: <items>
- KNOWN ISSUES: <...>
- NEXT ACTION + resume command: <...>
```
