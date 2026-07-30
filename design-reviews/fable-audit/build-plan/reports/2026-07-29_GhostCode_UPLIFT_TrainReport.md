# Ghost Code UPLIFT — Train Report

**Run date:** 2026-07-29 · **Train:** 6 phases (P1–P6), 19 audited presentation-only proposals ·
**Design authority:** `design-reviews/fable-audit/2026-07-10_GhostCode_Design_Review.md` (Part-3
synthesis, 2026-07-10) · **Plan authored by:** Claude Fable 5 (max effort), 2026-07-16 · **This
phase (P6) executed on:** Sonnet 5 (this session) — the plan's own directive names "Opus 4.8
ultracode max effort" (`DECISIONS.md` SD-8); tagging this window's actual model honestly rather than
repeating the directive as if it were what ran.

**Status: nothing is merged.** `main == origin/main == 9789d1a` — the exact audited handshake SHA,
unmoved through the whole train. Everything below is banked and evidenced on stacked branches. "CLOSED"
in this report means *shipped to a branch and verified*, never *shipped to production*.

---

## 1 · What shipped, per phase

| Phase | Branch | Base → Tip | Commits | Slate items | Rollback anchor |
|---|---|---|---|---|---|
| P1 The Floor | `uplift/p1-floor` | `9789d1a` → `b5c3a50` | 5 | M1, M2, Q3, Q9 (all 5 CRITICALs closed) | `git reset --hard 9789d1a` |
| P2 The Front Door | `uplift/p2-frontdoor` | `b5c3a50` → `78d605a` | 10 | M4, M5, Q1, Q2, Q4, Q5, Q10 | `git reset --hard b5c3a50` |
| P3 Winning, Authored | `uplift/p3-winbeat` | `78d605a` → `161ae66` | 5 | S1, Q6, Q7, Q8 | `git reset --hard 78d605a` |
| P4 The Study Report, Cashed | `uplift/p4-studyreport` | `161ae66` → `15e6669` | 6 | M3, M6, S3 | `git reset --hard 161ae66` |
| P5 The Ghost Is Real | `uplift/p5-ghost` | `15e6669` → `a2b75f6` | 4 | S2 | `git reset --hard 15e6669` |
| P6 Close-Out | `uplift/p6-closeout` | `a2b75f6` → *(this commit)* | 7 | none (reconciliation only) | `git reset --hard a2b75f6` |

**30 application-code commits (P1–P5) + 7 documentation commits (P6) = 37 total.** Every phase stopped
complete, on its branch, green-gated, evidenced. Merge order is ff-only and sequential — see
`DEPLOY-CHECKLIST.md` step 1 for both valid merge paths (single fast-forward of the P6 tip, or six
phase-by-phase stops).

**Files touched, whole train** (`git diff 9789d1a..HEAD --stat`): `index.html` (+639/−61) ·
`favicon.svg` (recolored) · `favicon-32.png` / `favicon-180.png` / `favicon.ico` (new) ·
`og-image.png` (regenerated) · 14 `build-plan/**.md` files (P6, new — see §5 below on where these now
live). `cards.js` untouched train-wide (zero curriculum/data changes — presentation-only fences held).

---

## 2 · Conservation — ACTUAL (19/19 reconciled)

Reproduced verbatim from `00_master.md` §4 (re-verify there if this ever drifts — that file is the
source of truth, this report is a snapshot of it at close-out).

| ID | Phase | Status | Commit(s) | One-line |
|---|---|---|---|---|
| M1 | P1 | CLOSED | `b300b41` | Candidate C de-collision (≤600 diamond) + learn-mode fold relief |
| M2 | P1 | CLOSED | `6d150c4` | L4-F1 verified NON-REPRO at per-frame resolution; SD-9 anchor documented |
| Q3 | P1 | CLOSED | `71bff76` + `b5c3a50` | 768 un-clip (Q3a) + 1440 un-clip (Q3b) — one ID, two commits |
| Q9 | P1 | CLOSED | `4290195` | 8px→10px HUD stat-label floor |
| M4 | P2 | CLOSED | `15838b9` (+`78d605a`) | Title→board double-exposure killed; harden dropped a fragile rAF cleanup |
| M5 | P2 | CLOSED | `350f8bb` + `c4b06dc` | Favicon recolor + fallbacks (M5a); OG card export + truthful alt (M5b) |
| Q1 | P2 | CLOSED | `9e5c46d` | Controls-orphan fixed via inverted NBSP binding |
| Q2 | P2 | CLOSED | `8f32c49` (+`c24f34c`) | Canonical `CATEGORY_LABELS`; follow-up self-flagged out-of-scope — **Sky's keep/drop call** |
| Q4 | P2 | CLOSED | `dcd858e` | Invalid `@supports` grammar fixed |
| Q5 | P2 | CLOSED | `3c9c438` | Preload + metrics-matched fallback (kills FOUT) |
| Q10 | P2 | CLOSED | `e48e310` | Returning-player welcome-back beat |
| S1 | P3 | CLOSED | `0cf8bca` + `161ae66` | Held-win CSS layer + wiring |
| Q6 | P3 | CLOSED | `974f601` | Neutralized focus-ring on a wrong token |
| Q7 | P3 | CLOSED | `be022b6` | Glyph + aria only (SD-2) |
| Q8 | P3 | CLOSED | `36d160e` | Pause → real modal |
| M3 | P4 | CLOSED | `d67e2e5` | Never-clip the review box |
| M6 | P4 | CLOSED | `8e7b61f` (+3 adversarial fixes) | This-run credit + un-hidden MASTERED bar; 2 real a11y bugs + 1 cosmetic clip fixed |
| S3 | P4 | CLOSED | `63da969` | DRILL MISSED promoted to primary |
| S2 | P5 | **CLOSED (bookends) / FORKED (in-play clause)** | `13c1122`+`34f8d76`+`87cc42a`+`a2b75f6` | Bookends built; in-play clause traced (D-3) and re-homed to game-over |
| — | P6 | — | — | 0 slate items — this phase reconciles the 19 above |

**Tally: 4+7+4+3+1+0 = 19.** 18 CLOSED outright + 1 (S2) CLOSED-with-one-clause-FORKED · 0
PENDING-SKY-PICK · 0 DEFERRED. **Two arithmetic traps avoided:** Q3 is one ID (two commits, not
"Q3a"+"Q3b" as separate IDs); S2 is one ID (two rows in P5's own evidence report for readability, not
two IDs).

---

## 3 · Gate results (whole-train, re-run at the P6 tip)

| Gate | Result |
|---|---|
| `node --check cards.js` | OK |
| Inline `<script>` syntax check | OK (window `1804..3027`) |
| `node test/cards.test.js` | **56/56 cards pass** |
| Console errors | 0, throughout |
| All 30 conservation SHAs | Re-resolved via `git log -1`, all present, all subjects match |
| Finite-iteration audit (`p5-anim-audit.mjs`, re-run) | PASS — only allowlisted `cursor-blink`/`twinkle` infinites |
| Photosensitivity, tail-pulse (`p5-anim-audit.mjs`, re-run) | PASS — ~0.30 Hz (floor is 3 Hz) |
| ONE-ACTOR-MOVES (`p5-oneactor.mjs`, re-run) | PASS — 150 frames, 0 unexpected arena motion |
| **New:** in-play wrong-answer photosensitivity | PASS — measured lockout window 1894/1896/1983ms across 3 runs (code declares 1900ms), iteration-count confirmed `'1'` live + by static grep |
| **New:** seeded@768, in-app RM@768/375 captures | Filled — these two coverage gaps existed nowhere else in the train |
| M3/M6/S3 end-state (P4) | Not re-shot (would've overwritten P4's own evidence pixels with post-P5 frames) — proven unaffected instead: `git diff 15e6669..a2b75f6` touches zero M3/M6/S3 selectors |
| Fade-check leg 1 (intra-session pause-hash) | MATCH across 2 independent runs (`d75d3ba28f1338b4`) |
| Fade-check leg 2 (computed `.screen` transition) | `"opacity 0.35s, visibility 0.35s"` — byte-identical to P5's recorded value, both pause and game-over |
| Fade-check leg 3 (code-inferred, whole train) | The `.screen`/`.screen.hidden` rule bodies were never touched since `9789d1a`, by any phase. **P6 itself changes zero lines of `index.html`/`cards.js`.** |
| Diff audit | `git diff 9789d1a..HEAD --stat` = 20 files, all accounted for by a phase's intended-files list |

Full methodology and raw numbers: `reports/P6-verification-evidence.md` (§6 of this train).

---

## 4 · The two checklists this phase produced

- **[`DEVICE-GATE-CHECKLIST.md`](../DEVICE-GATE-CHECKLIST.md)** — 28 items, one consolidated
  on-device session (cold-cache → default Safari walk → Reduce Motion cluster → VoiceOver cluster →
  iPhone 375 → keyboard latency → full Safari visual pass). **Nothing on it has been checked off** —
  this train has had zero real-device passes; every capture in every phase is Chromium.
- **[`DEPLOY-CHECKLIST.md`](../DEPLOY-CHECKLIST.md)** — merge (either path) → push → CI green →
  favicon chain live → font-preload byte-match → social re-scrape → confirm no DNS change → the
  device session against the live site.

---

## 5 · Open items to carry to Sky (this report LISTS these, never resolves them)

- **Nothing is merged.** Five (or six, counting P6 itself) ff-merges stand between this state and
  production. "CLOSED" throughout this train means *banked and evidenced on a branch*.
- **M2's CRITICAL** closed on Chromium non-reproduction — real OS-level Reduce Motion has never been
  checked on a device (`DEVICE-GATE-CHECKLIST.md` item 16, flagged as this train's single largest
  outstanding correctness risk).
- **S2's in-play clause is FORKED**, not built — the train's only forked clause. Traced (D-3): no idle
  non-card-read window exists in the gameplay loop to breathe into; both dormant keyframes were
  re-homed to the game-over Phantom instead, which does satisfy the literal "wire the two dormant
  keyframes" instruction.
- **`c24f34c`** (Q2 follow-up) is still undecided — self-flagged "exceeds approved plan." Cheapest to
  decide before the P2 merge (`DEPLOY-CHECKLIST.md` step 0); costs a revert commit after.
- **Fork C** (P2, title controls line) only provisionally settled — KEEP was picked, but keep-vs-remove
  comparison mocks are still rendered under `captures/p2/forkC/` "for a later final call" per
  `DECISIONS.md` §B. Not blocking; a standing open question.
- **Deferred / known-honest, unfixed because they're correct-as-is, not oversights:**
  - Q3b's learn-diamond grow-jump (~185px) — a strict "never move" fix needs a structural panel
    overlay, out of scope for a MED-tier item.
  - S3's focus-contract tension — keyboard/SR focus lands on the now-*secondary* PLAY AGAIN button on
    a miss-run, not the promoted DRILL MISSED primary. Explicit per the PROTECT'd focus contract;
    Sky's call whether to revisit.
  - Q5's ~5px tagline advance variance under the metrics-matched font fallback (cosmetic, no reflow).
  - M6's `aria-valuemax` is dynamic (`activeDeck().length`), not the report's literal 56 — correct
    behavior for a filterable deck, a deliberate deviation from the literal spec text.
  - The drill badge reads "cleared of N" (unique cards), not a queue position, since `pickCard()`
    draws with repeats.
- **Pre-existing, correctly disowned by P5 (not S2's to fix, not this train's to fix):**
  - An intermittent ~39px `#gameover` height flake at 768px width — proven pre-existing via an
    old-vs-old self-comparison (see `P5-verification-evidence.md`'s Master LAW 2 section).
  - `#stars`/`twinkle` — dead, `display:none` CSS left over from the pre-redesign synthwave theme.
  - The ≤600px Phantom eye-overlap (both eyes render as one blob at phone width) — pre-existing in the
    arena Phantom, now also visible on both S2 bookends since they deliberately reuse the identical
    geometry. Deserves its own decision + Design Compiler pass, not a drive-by fix.
  - Three `.phantom-cursor-bar` DOM instances all declaring `cursor-blink infinite` (arena + title +
    game-over) — mutually exclusive in real play via z-index/opacity stacking, not by absence.
- **Evidence gaps, stated plainly:**
  - Every capture across all 6 phases is Chromium. Not one WebKit frame exists anywhere in this train.
  - **No `captures/p3/` directory exists on disk** — P3 was verified by live-driving in a Browser pane
    session, not by saved stills.
  - P1 and P3's exact drive scripts lived in session scratchpads and are not recoverable; their
    evidence reports stand on their own prose + the code diff, not a re-runnable script.
- **Provenance vs SD-8 (verified via `git log --format='%b' <sha>` trailers this session, not
  asserted):** of the 30 application-code commits, **23 carry a `Claude Opus 4.8` co-author trailer**;
  **7 carry `Claude Sonnet 5`** — specifically `b34473e`/`26a6e46`/`15e6669` (M6's 3 adversarial-fix
  commits) and all four P5 commits (`13c1122`/`34f8d76`/`87cc42a`/`a2b75f6`). This is a factual
  provenance note, not a defect: the three Sonnet M6 commits are precisely the ones that *found and
  fixed* two real accessibility bugs (the leaked `#learn-progress-bar` and the ARIA-invalid
  `valuenow>valuemax`) via an adversarial pass. **This window's own model is Sonnet 5**, not the "Opus
  4.8 ultracode max effort" SD-8 names — tagged honestly here rather than silently repeating the
  directive as if it described what ran.

---

## 6 · Where the detail lives

- Per-item evidence: `reports/P1-verification-evidence.md` → `P5-verification-evidence.md`.
- This phase's own methodology + raw measurements: `reports/P6-verification-evidence.md`.
- Cross-window decision log: `DECISIONS.md` (§A standing decisions, §B fork/gate picks, §D append-only log).
- Checkpoint-by-checkpoint history: `HANDOFF.md`.
- The train map + conservation source-of-truth: `00_master.md`.

---

## Stop

**STOP on `uplift/p6-closeout`.** No merge, no push, no deploy, no DNS — Sky's hands. This report
(plus the two checklists) is the input to Sky's own review and, optionally, Dani's Design Compiler
gate (Const. Art. 2.4) — this train does not self-declare UI-DONE.
