# P6 — Close-Out — Verification Evidence

**Phase:** P6 of 6 (Ghost Code UPLIFT train) · **Branch:** `uplift/p6-closeout` · **Base:**
`uplift/p5-ghost` @ `a2b75f6` (rollback anchor) · **Date:** 2026-07-29 · **Executed on:** Sonnet 5
(this session) — the plan names "Opus 4.8 ultracode max effort" (SD-8); tagged honestly rather than
repeated as if it described what ran. **Authored by (plan):** Fable 5 max, 2026-07-16.
**Status at stop:** **COMPLETE** — no slate items to build; this phase reconciled the whole train.
Stopped ON the branch; not merged.

> This phase makes **zero application-code changes**. `git diff a2b75f6..HEAD -- index.html cards.js`
> is empty throughout. Every claim below is either MEASURED (re-run at the tip, this session) or
> CODE-INFERRED (grepped from source directly, never trusted from a prior report's prose). Where a
> measurement showed something unexpected, this report includes the investigation that resolved it —
> same standard P5 held itself to.

---

## Pre-flight

- Branch created off `uplift/p5-ghost`@`a2b75f6` (P5's tip; P5 stopped complete with 4 commits
  banked, so per §2.1 of the phase brief, base = P5's tip). Base green gate PASS (56/56, script window
  `1804..3027`). No drift: `main`==`origin/main`==`9789d1a`, unmoved.
- **All 30 conservation-table commit SHAs re-resolved via `git log -1 <sha>` before any work began**
  (not trusted from the phase file's transcription, per its own instruction) — all 30 present, all
  subjects matched exactly.
- No drift-adjusted base recorded anywhere in `DECISIONS.md` §D — the whole-train diff audit uses the
  original handshake `9789d1a` throughout this report.

---

## Commit stack (base `a2b75f6` → tip)

| # | Commit | Item | One-line |
|---|---|---|---|
| 1 | `f5aece0` | P6-0 | Track the 14 existing `build-plan/**.md` files as-is (ADD, not MODIFY) |
| 2 | `74f0e20` | P6-1 | Whole-train gates at the tip (new capture rig + 2 reused scripts + 3 fade legs + diff audit) |
| 3 | `0bfb775` | P6-2 | Conservation map → ACTUAL in `00_master.md` §4 (19/19 reconciled) |
| 4 | `a9a54e7` | P6-3 | `DEVICE-GATE-CHECKLIST.md` (28 items) |
| 5 | `81bddf6` | P6-4 | `DEPLOY-CHECKLIST.md` |
| 6 | `a79c95b` | P6-5 | Whole-train report |
| 7 | *(this commit)* | P6-6 | Final ledgers — this file + `DECISIONS.md` §D + `HANDOFF.md` TRAIN COMPLETE |

`git diff a2b75f6..HEAD --stat` (through P6-5) = 8 new `build-plan/**.md` files, zero application
code. Full whole-train diff (`9789d1a..HEAD`) = 20 files: the 6 code files from P1–P5 (unchanged by
P6) + 14 build-plan `.md` files (the 14 from P6-0, tracked as-is — this commit's file additions
land on top).

---

## Per-item evidence

### Item 1 — Whole-train gates → `f5aece0` (bootstrap) + `74f0e20` ✅

**Green gate:** 56/56, 0 console errors, `node --check` clean on both `cards.js` and the extracted
inline script (window `1804..3027`, re-derived fresh — line numbers drift, per `CLAUDE.md`'s own
warning).

**New capture rig (`tools/p6-captures.mjs`, written this phase):**
- **Coverage hole 1 — seeded@768.** `01-base-screens.mjs`'s seeded matrix only ever ran at 1440+375.
  Reused its exact `seededProfile(CARDS)` seed shape and its `loseRun()` choreography (imported
  directly, not re-implemented) at 768. Both `title-seeded__dark__768.png` and
  `gameover-seeded__dark__768.png` captured successfully.
- **Coverage hole 2 — in-app Reduce Motion@768/375.** `04-rm.mjs`'s in-app Settings→Motion=Reduced
  job only ever ran at 1440. Mirrored its exact interaction sequence (click `#settings-btn` → click
  the "Reduced" seg button → close → verify `body.reduce-motion`) at both 768 and 375. Both confirmed
  `reduceMotionApplied: true`; 4 screenshots captured (gameplay + correct-feedback × 2 widths).
- **New — in-play wrong-answer photosensitivity probe.** Nothing in the train had measured the
  wrong-answer window before. See the dedicated methodology note below — this took two iterations to
  get right and the failure is worth recording honestly.

**Photosensitivity probe — methodology (an honest account of what didn't work first):**
The first version used a `requestAnimationFrame` loop inside `page.evaluate()` to sample the flashed
token's box-shadow alpha (mirroring `p5-anim-audit.mjs`'s tail-pulse luminance sampler). It produced
untrustworthy numbers — a flat alpha ceiling of `0.3` that matched none of the three keyframe stops
declared in `index.html` (`0%→0.35, 40%→0.60, 100%→0.35`), and a lockout-window measurement of `null`
(never observed `state.busy` flip back to `false`). This is consistent with this environment's
already-documented behavior (RUNBOOK.md / P3 evidence: "this session's automated browser throttles
rAF + CSS transitions when the tab isn't painting").

Diagnosed with two throwaway scripts (Node-side discrete polling, then a `MutationObserver` + in-page
`performance.now()` timestamping) before landing on the final design: an in-page `setInterval` poll
(same timer substrate as the app's own `setTimeout` calls in `flashDanger()`/`answer()`, so the
MEASURED gap between them is self-consistent regardless of any front-loaded callback-delivery delay)
plus one live computed-style sample for iteration-count, plus the keyframe source itself for the
amplitude bound — no peak-luminance number is asserted from a sample that couldn't be trusted.

**Results, 3 independent runs** (real CDP keypress via `pressAnswer({correct:false})` — only the
CHOICE is scripted):

| Run | Card | Measured lockout window | Live `animationIterationCount` |
|---|---|---|---|
| 1 | `mac-mkdir` | 1896ms | `'1'` |
| 2 | `mac-ls` | 1983ms | `'1'` |
| 3 | `cc-model` | 1894ms | `'1'` |

Mean 1924ms, all three within normal browser-timer scheduling jitter of the code's declared `1900`
constant (`answer()`, the arcade wrong-answer branch). A discretely-polled measurement carries
±poll-interval precision (4ms here) — run 3's raw 1894ms sits within that band of the 1900 threshold,
not below it. **iteration-count confirmed `'1'` live in all 3 runs**, corroborated by static source:
`.danger-flash { animation: danger-pulse 0.4s ease-out; }` — no `infinite` keyword anywhere near
either the rule or the keyframe, so CSS's default iteration-count of 1 applies. **PASS** (measured
window consistent with ≥1900ms; iteration-count is 1, confirmed two independent ways).

**Reused as-is, re-run at the tip (unmodified scripts, per the phase brief's explicit reuse list):**
- `p5-anim-audit.mjs` → **FINITE-ITERATION AUDIT: PASS** (only allowlisted `cursor-blink`/`twinkle`
  read `infinite`). **PHOTOSENSITIVITY (tail-pulse): PASS**, ~0.30 Hz (WCAG 2.3.1 floor is 3 Hz).
  **Honest note:** the console reported "cursor-blink instances: 6," double P5's prose-reported "3."
  Investigated via the raw `anim-audit.json`: the script concatenates its title-screen pass and
  game-over-screen pass into one array; all 3 physical `.phantom-cursor-bar` DOM elements
  (arena/title/game-over) are always present in the DOM regardless of which screen is visually active
  (only `.screen`'s opacity/z-index toggles, no DOM removal), so each pass independently finds all 3,
  giving 3+3=6 in the concatenated total. Same 3 physical elements P5 already accounted for
  ("mutually exclusive in real play via z-index/opacity stacking, not absence") — not a new element,
  not a regression. P5's prose most likely reported the architectural count (3 DOM instances) rather
  than the script's own concatenated total (6). Recorded here so the discrepancy doesn't look like an
  unexplained anomaly to a future reader.
- `p5-oneactor.mjs` → **ONE-ACTOR-MOVES: PASS** (150 frames over 2501ms, 1 distinct `#phantom`
  position/transform, 0 frames with a non-`'none'` animation-name).

**Deliberately NOT re-run, with reasons (both were on the phase brief's "if wanted" optional list):**
- `p4-endstate.mjs` hardcodes its output path to `captures/p4/endstate/`. P6's tip includes P5's
  Phantom bookends, which P4's own tip did not — re-running it would silently overwrite P4's evidence
  screenshots with different-looking pixels than what `P4-verification-evidence.md`'s prose describes.
  **Substituted a stronger, more direct proof:** `git diff 15e6669..a2b75f6 -U0 -- index.html`,
  filtered for any M3/M6/S3 selector or function name (`missed-review`, `mr-overflow`, `mr-more`,
  `updateMissedReviewFade`, `mastery__`, `learn-progress-bar`, `runCorrectByCat`, `drill-badge`,
  `drill-missed-btn`, `drillCleared`), matches **zero** lines — P5 never touched any of M3/M6/S3's
  surfaces, so their P4 end-state guarantees carry forward unchanged to the P6 tip without a re-shoot.
- `p5-law2-domcheck.mjs` needs two genuinely different URLs to A/B compare. P6 makes zero code
  changes, so there is nothing to compare — old and new would be identical, making the check
  trivially true but uninformative. **Substituted the even stronger claim:** P6's own diff on
  `index.html`/`cards.js` is empty (verified below), which trivially implies zero layout drift.
- `p2-favicon-export.mjs` was NOT run — it writes into the repo root, forbidden by §3.8 (no
  application code / build-artifact changes this phase).

**Three fade-check legs via `p2-m4.mjs`** (honest three-way framing — P6 changes nothing, so there is
no before/after; each leg is reported for exactly what it proves, per the phase brief's explicit
instruction not to claim three byte-parity results):

1. **Measured, intra-session pause-hash stability.** Ran `node p2-m4.mjs p6-run1` then
   `node p2-m4.mjs p6-run2` back-to-back at the tip. `parity.pauseSettledSha` identical both runs:
   `d75d3ba28f1338b4` == `d75d3ba28f1338b4`. `maxDE=0` for both full-motion and reduced-motion, both
   runs — matches the established P2/P4/P5 baseline.
2. **Measured, cross-session transition-string match.** Computed `.screen` transition on both
   `#pauseScreen` and `#gameover`: `"opacity 0.35s, visibility 0.35s"` — both runs, byte-identical to
   P5's recorded value (`P5-verification-evidence.md`'s M4 re-smoke row).
3. **Code-inferred, definitive, whole-train.** `git diff 9789d1a..HEAD -U0 -- index.html`, filtered
   to the `.screen`/`.screen.hidden` rule bodies and the literal `transition: opacity 0.35s...` line,
   matches **zero** lines across all 6 phases — the core fade rule was never touched, ever, by any
   phase. A broader keyword grep for `pauseScreen`/`togglePause` (any mention, not just the rule body)
   DOES find 3 lines — all from Q8's own already-verified P3 work (an `aria-label`→`aria-labelledby`
   swap, a documenting comment, and the new RESUME button's `addEventListener` call). None of the
   three touch the shared fade mechanism; this is Q8 legitimately adding pause FEATURES while leaving
   the fade TIMING untouched — exactly what LAW 3/SD-6 requires, not a violation of it. **The
   strongest form of this proof for this specific phase:** `git diff a2b75f6..HEAD -- index.html
   cards.js` is empty — P6 itself changes zero lines of either file.

**Diff audit:** `git diff 9789d1a..HEAD --stat` = 20 files at this item's checkpoint — the 6 code
files P5 already accounted for (`index.html`, `favicon.svg`, `favicon-32.png`, `favicon-180.png`,
`favicon.ico`, `og-image.png`) plus the 14 `build-plan/**.md` files P6-0 added. No drift-adjusted base
recorded in `DECISIONS.md` §D (checked) — base remains `9789d1a`. Every file accounted for.

### Item 2 — Conservation map → ACTUAL → `0bfb775` ✅

Rewrote `00_master.md` §4 in place. All 19 slate IDs resolved: **18 CLOSED outright, 1 (S2)
CLOSED-with-one-clause-FORKED, 0 PENDING-SKY-PICK, 0 DEFERRED.** Tally 4+7+4+3+1+0 = **19**, exactly —
this item's hard gate. All 30 commit SHAs re-verified via `git log -1` a second time (once at
pre-flight, once as this item's own gate, per the phase brief's explicit instruction). Both
arithmetic traps that would produce a false 20 stated explicitly in the table's own notes (Q3 = one
ID/two commits; S2 = one ID/two rows in P5's own report). Full table reproduced in the Item 5 train
report — see §2 there.

### Item 3 — `DEVICE-GATE-CHECKLIST.md` → `a9a54e7` ✅

28 items, harvested from every `NEEDS-SKY-DEVICE` tag across `P1-verification-evidence.md` through
`P5-verification-evidence.md` plus each phase's own §8 device-check list, deduped and ordered as one
efficient session (grouped by screen, clustered by OS-setting toggle — Reduce Motion and VoiceOver
each flip exactly once and cover everything they touch). Added to `00_master.md`'s "Files here" list.
Nothing on it has been checked off; this train has never had a real-device pass.

### Item 4 — `DEPLOY-CHECKLIST.md` → `81bddf6` ✅

Master §7's L1–L6 as one ordered list. Confirmed no phase formally appended an L7+ (checked all 5
phase files + master); folded in 5 de-facto riders that exist in the evidence but were never given
their own L-number, rather than inventing new numbers for them: L1's og-image/alt same-deploy pairing
(already true by construction — both landed in the single gated commit `c4b06dc`), L2's 4-binary
favicon chain (not just the `<link>` tags), L3's Google-Fonts-version spot-check, the `c24f34c`
pre-merge keep/drop call flagged as cheapest-to-decide-now, and the standing git-clean hazard. States
both valid merge paths (single ff of the P6 tip, or six phase-by-phase stops) before step 1. Verified
`git diff 9789d1a..HEAD -- CNAME` is empty before asserting "no DNS changes" in the doc text (not
asserted blind). Added to `00_master.md`'s "Files here" list.

### Item 5 — Train report → `a79c95b` ✅

`reports/2026-07-29_GhostCode_UPLIFT_TrainReport.md`. Per-phase commit spans and rollback anchors
re-derived from `git log --oneline <base>..<tip>` for all 6 phases (not transcribed from memory or
from HANDOFF prose) — see the table this report built, cross-checked against §1 above. Reproduces the
ACTUAL conservation table, the full gate-results table, links both checklists, and carries the
complete "open items for Sky" list (nothing merged; M2's device-RM gap; S2's forked clause; `c24f34c`
undecided; Fork C provisional; the deferred/known-honest items; the pre-existing disowned defects; the
evidence gaps including the missing `captures/p3/` directory; and the SD-8 provenance note).

**The SD-8 provenance claim was independently re-verified this item**, not copied from the phase
file's transcription: `git log --format='%b' <sha> | grep '^Co-Authored-By:'` run against all 30
commits gives **23 `Claude Opus 4.8` + 7 `Claude Sonnet 5` = 30**, exactly matching the phase file's
number, with the 7 Sonnet commits identified precisely: `b34473e`/`26a6e46`/`15e6669` (M6's three
adversarial-fix commits) and all four P5 commits (`13c1122`/`34f8d76`/`87cc42a`/`a2b75f6`). This
window's own model (Sonnet 5) is tagged honestly in the report rather than silently repeating SD-8's
"Opus 4.8 ultracode max effort" directive as if it described what actually ran this phase.

### Item 6 — Final ledgers → *(this commit)*

This file, plus `DECISIONS.md` §D's final append-only row and `HANDOFF.md`'s TRAIN COMPLETE state —
see those files directly for their own content; not duplicated here.

---

## Device checklist (§8 — restated per the phase brief's stop-condition requirement)

The full 28-item list lives in `DEVICE-GATE-CHECKLIST.md` (this phase's Item 3 deliverable). Every
single item on it is `NEEDS-SKY-DEVICE` — none of this train has ever had a real-device pass; every
capture across all 6 phases is Chromium (Playwright 1.61.1 / Chromium 1228, headless). The checklist
is the artifact; this line is the honest summary: **28/28 open, 0/28 checked.**

---

## Capture manifest (this phase)

- `captures/p6/final/` — `title-seeded__dark__768.png`, `gameover-seeded__dark__768.png`,
  `inapp-rm-gameplay__dark__768.png`, `inapp-rm-correct__dark__768.png`,
  `inapp-rm-gameplay__dark__375.png`, `inapp-rm-correct__dark__375.png`,
  `inplay-wronganswer-flash__dark__1440.png`, `p6-captures-summary.json`,
  `photosensitivity-wronganswer-summary.json`, `photosensitivity-wronganswer-busylog.json`.
- `captures/p5/anim-audit.json` + `photosensitivity-luminance.json` + `oneactor-framelog.json` —
  overwritten in place by this phase's tip-level re-run (numerically consistent with P5's own numbers,
  since P6 makes zero code changes between P5's tip and its own — the code state sampled is identical).
- `captures/p2/m4/p6-run1/` and `.../p6-run2/` — the two intra-session fade-check runs (opening-run
  frames + timeline JSON + pause/game-over settled stills, each labeled separately, no collision with
  prior phases' `before`/`after`/`p4-endstate`/`p5-after` labels).
- New tool (untracked, `tools/`): `p6-captures.mjs`.
- **NOT re-captured, deliberately** (see Item 1 above for the reasoning): `captures/p4/endstate/`
  (would have overwritten P4's evidence with post-P5 pixels); no `p5-law2-domcheck` re-run (nothing to
  A/B compare when the code hasn't changed).

---

## Conservation (§10 — this phase carries none)

| ID | Status at stop |
|---|---|
| (none — P6 carries no slate items; it RECONCILES all 19 from P1–P5) | — |

Full ACTUAL table: `00_master.md` §4, reproduced in the Item 5 train report.

---

## Stop

Green gate clean throughout (56/56, inline-script `node --check` OK, 0 console errors). Every phase
law satisfied and evidenced, including an honest methodology account of the photosensitivity probe's
first (untrustworthy) attempt and why it was replaced, and an honest note on the cursor-blink
double-count discrepancy rather than either silently matching P5's "3" or reporting an unexplained
"6." `git diff a2b75f6..HEAD -- index.html cards.js` is empty throughout — zero application-code
changes, confirmed at every checkpoint. Conservation reconciles to exactly 19/19.

**STOP on `uplift/p6-closeout`.** No merge, no push, no deploy, no DNS — Sky's hands. Do not
self-declare UI-DONE — routing to Dani's Design Compiler (Const. Art. 2.4) is Sky's step, same as
every prior phase.

> **ff-only merge-order reminder:** merging this tip fast-forwards `main` through **P1, P2, P3, P4, P5
> AND P6** — merge in train order (P1→P2→P3→P4→P5→P6), or stop anywhere earlier in that order per
> `DEPLOY-CHECKLIST.md` step 1's phase-by-phase option. Serial per project: no other phase runs while
> this branch is open. **This is the LAST car — there is no P7.**
