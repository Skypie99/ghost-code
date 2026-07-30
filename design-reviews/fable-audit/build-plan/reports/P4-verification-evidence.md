# P4 — The Study Report, Cashed — Verification Evidence

**Phase:** P4 of 6 (Ghost Code UPLIFT train) · **Branch:** `uplift/p4-studyreport` · **Base:** `uplift/p3-winbeat` @ `161ae66` (rollback anchor)
**Date:** 2026-07-29 · **Executed on:** Sonnet 5 (this session; the M3/M6/S3 commits themselves were authored on Opus 4.8 per their commit trailers — this window performs the Item-4 end-state re-verify, adversarial pass, and close-out only, adding no new M3/M6/S3 code) · **Authored by (plan):** Fable 5 max, 2026-07-16
**Status at stop:** **COMPLETE** — all 3 slate items closed; Item 4 end-state re-verify done; adversarial pass done. Stopped ON the branch; not merged.

> All captures are **Chromium** (Playwright 1.61.1 / Chromium 1228, headless) — NOT Safari/WebKit. Every clip/overflow/contrast claim is **measured** (computed styles, `scrollHeight`/`clientHeight`, bounding rects, opacity samples), never asserted. Safari is Sky's device pass (§Device checklist).

---

## Commit stack (base `161ae66` → tip `15e6669`)

| # | Commit | Item | One-line |
|---|---|---|---|
| 1 | `d67e2e5` | **M3** | Never-clip the game-over review box — sticky fade edges + "↓ more" affordance, gated on real overflow. |
| 2 | `8e7b61f` | **M6** | This-run credit ("+N this run" chip + hatched sliver) beside lifetime mastery bars + un-hide the Learn MASTERED bar for SR. |
| 3 | `63da969` | **S3** | DRILL MISSED becomes the primary CTA (PLAY AGAIN steps to secondary) + new `#drill-badge` identity during a review drill. |
| 4 | `b34473e` | **M6-adv1** | Adversarial fix: inert `#learn-progress-bar` behind title/pause/game-over (it leaked into the a11y tree once M6 un-hid it). |
| 5 | `26a6e46` | **M6-adv2** | Adversarial fix: filter the Learn-mode mastered-count to the active deck (fixes a reachable `aria-valuenow > aria-valuemax` state). |
| 6 | `15e6669` | **M6-adv3** | Adversarial fix: clamp the "this-run" sliver inside its track at 100% lifetime mastery (was clipped/invisible). |

`git diff 161ae66..15e6669 --stat` = **1 file**: `index.html` (+212/−9). No other application source touched. (`design-reviews/` stays UNTRACKED — ledgers/reports/captures/tools are workspace-only, never staged.)

---

## Per-item evidence

### M3 — never-clip the game-over review box → `d67e2e5`  ✅ verified
- **Change:** `.missed-review` keeps its fixed 220px footprint but gains two sticky gradient overlays (`::before` top fade, `.mr-more` bottom fade + "↓ more" text affordance — not colour-alone), both gated on a new `updateMissedReviewFade(box)` helper that toggles `.mr-overflow` / `.mr-scrolled` / `.mr-atbottom` from real `scrollHeight`/`clientHeight`/`scrollTop` geometry. Pure class/visibility toggles — no opacity animation, reduced-motion safe by construction. Runs on `scroll` (passive) and once via `requestAnimationFrame` after `gameOver()` shows the screen (so the very first geometry read happens post-layout-settle).
- **Verified (own banked evidence, HANDOFF.md):** @375/768/1440 — overflow → bottom fade + "↓ more"; scrolled → top fade; bottom → last line fully readable, cues hidden; 1-short-miss → zero cues (`sh==ch` 98/98); box → Tab → drill-missed-btn (no focus trap).
- **Re-confirmed this session (Item 4, combined end-state — see below):** identical behavior holds with M6's mastery-credit rows and S3's drill button ALSO present above/below it.

### M6 — this-run credit + un-hide Learn MASTERED bar → `8e7b61f`  ✅ verified
- **Change:** new session-only `state.runCorrectByCat = {claude:0, mac:0, git:0}` (reset in `startGame()`, incremented in the arcade answer handler only — never in learn mode, never persisted to `gc.v1`). Game-over's per-category `.mastery__track` rows gain a hatched `.mastery__runsliver` + `.mastery__runchip` ("+N this run") when `runN > 0` (no chip/sliver at 0 — verified no "+0" noise), plus one `.mastery__runsummary` line ("You answered N of M correctly this run."). `#learn-progress-bar` drops `aria-hidden`, gains `role="progressbar"` + live `aria-valuenow`/`aria-valuemax`/`aria-label`, updated in `renderLearnProgress()` (index.html:1923-1937) in the same synchronous call as the visible `n/total` text — same local `mastered`/`total` variables feed both, so they cannot drift.
- **Deviation (flagged, see §Deviations):** `aria-valuemax` is **dynamic** (`activeDeck().length`, index.html:1934) rather than a hard-coded 56 — correct behavior for a filtered/reviewDeck-scoped session, but different from what the original report's verbatim text assumed.
- **Verified (own banked evidence):** @375/1440 — chips `{claude:+2, git:+3}`, `mac:0` shows none; Learn bar `role=progressbar`, value `3/56 == visible 3/56`, `aria-label` "Mastered 3 of 56", `aria-hidden` gone. Green gate 56/56.
- **Not-colour-alone confirmed:** credit is carried by chip text + the bar's `aria-label` string (not hue alone); `aria-valuenow` stays banked mastery (provisional credit rides the label as text, per the in-code comment at index.html:2473-2478).
- **Post-adversarial-pass fixes (see §Adversarial verification below):** three real issues found during close-out review were fixed in follow-up commits `b34473e`/`26a6e46`/`15e6669` — `#learn-progress-bar` is now inert behind every overlay screen (it had leaked into the a11y tree once un-hidden), the Learn-mode mastered-count is now filtered to the active deck (fixes a reachable `aria-valuenow > aria-valuemax` state), and the "this-run" sliver is now clamped inside its track at 100% lifetime mastery (was clipped/invisible). All three empirically re-verified against the exact repro scenarios that found them.

### S3 — DRILL MISSED primary + drill-run badge → `63da969`  ✅ verified
- **Change:** when `state.missedThisRun.size > 0`, a new `#drill-missed-btn` (`big-btn blink`) is inserted before `again-btn` and `again-btn.className` steps down to `'btn'` (secondary); on a flawless run `again-btn` keeps `'big-btn blink'` unchanged (index.html:2564-2586). Hotkeys and the app-driven focus target (`document.getElementById('again-btn').focus()`) are untouched — confirmed **not present in the S3 diff at all** (the line is unchanged, so it cannot have moved). New `#drill-badge` (index.html:2412-2418, `updateDrillBadge()`) reads **`DRILLING MISSES · {cleared} of {N}`** where `cleared = state.drillCleared.size` (unique cards answered correctly this drill) and `N = state.reviewDeck.length` — an honest per-card-mastery count, **not a queue position** (the in-code comment explains why: `pickCard()` draws with repeats, no dequeue). Text only reassigned `if (DOM.drillBadge.textContent !== txt)` — change-guarded, so the `aria-live=polite` region never spams.
- **Deviation (flagged, see §Deviations):** the badge reads "cleared-of-N" rather than a queue-position count — a deliberate, honestly-documented improvement over the literal spec, not an oversight.
- **Q9 floor respected:** the `CATEGORY` HUD stat is hidden while `body.drill-mode` is active so the single-row HUD holds without shrinking any label below the P1-established 10px floor.
- **Verified (own banked evidence + re-confirmed this session):** swap + no-miss fallback + badge `0/3 → (real correct press) → 1/3`. Teardown array (index.html:2428) removes `#drill-missed-btn` alongside `.missed-review`/`.mastery`/`.results-stats` on replay — confirmed by reading the array directly, no stale buttons stack.

---

## Item 4 — END-STATE RE-VERIFY (Master LAW 5 — the pass's law)

The internal build order M3→M6→S3 is a heuristic; per 4.md §5, **this section is the actual law** — it verifies all three simultaneously, on the same screen, at the worst-case content length, which per-item isolation testing (the individual `p4-m3check.mjs`/`p4-m6check.mjs`/`p4-s3check.mjs` probes banked during each item's own commit) cannot catch on its own. New driver: `tools/p4-endstate.mjs`.

**No-clip @1440/768/375, M6's row present, longest lesson content (8 worst-case misses), fresh AND seeded profiles (6 combinations):**
- `.missed-review` overflows as expected at this content length (`sh` 1450–1778 vs `ch` 79–198 depending on width) — this is *by design* (M3's box is a fixed-footprint scrollable region, not a grow-to-fit one). The load-bearing assertion is that nothing is **unreachably** clipped: scrolled to bottom, the **last review item's bounding-rect bottom sits inside the box's own bottom edge at all 6 combinations** (`lastItemFits: true` in every case) — the last line is fully readable, never sliced mid-glyph, matching M3's own banked claim now re-verified with M6+S3 also present.
- `mr-overflow` engages correctly at this length; visually confirmed via capture (`gameover-endstate-seeded__375__top.png`) — fade + "↓ more" cue visible, GIT row correctly shows no chip (ran `runCorrectByCat.git = 0`), CLAUDE/TERMINAL rows show sliver + chip, DRILL MISSED renders as the bright primary with PLAY AGAIN stepped to secondary — all three items' visual claims hold *together*, not just in isolation.
- Fresh vs. seeded: the `.mastery` block's base bars/track structure pre-dates P4 (confirmed via `git show 8e7b61f -- index.html` — M6 only adds the `.mastery__runsliver`/`.mastery__runchip`/`.mastery__runsummary` classes and the JS that populates them; the CATS-iteration/track/fill scaffold already existed). Fresh (0 lifetime mastery) and seeded (partial lifetime mastery) both correctly show the same chip/sliver logic layered on top of their respective (0% vs partial%) base fills — no divide-by-zero, no `NaN%`, at any of the 3 widths.

**In-play drill-run chrome @375/768 (S3 badge vs. Q9 floor, no clip):**
- `#drill-badge` computed font-size: **10px @375** (exactly the P1 Q9 floor) / **11px @768**. All *visible* HUD `.stat` elements share the same bounding-rect top at both widths (`hudSingleRow: true`) — the single-row HUD holds with the badge added, matching Q9's own precedent (CATEGORY stat correctly hidden while drilling, per S3's design).
- **Cabinet/arena clip, measured correctly (see honest note below):** real page-level horizontal overflow (`document.documentElement.scrollWidth > window.innerWidth`) is **`false` at 375/768/1440** in drill mode — no visible horizontal scrollbar, nothing cut off. The badge's own bounding rect is fully inside the viewport at all three widths.
  - *Honest methodology note:* an initial, cruder check (`#cabinet`'s own `scrollWidth` vs. `clientWidth`) read as "overflowing" at 375/768 — investigated and found to be a **pre-existing, unrelated artifact**: `#cabinet`'s computed `overflow-x` is `hidden`, and the `.screen` overlay's own CSS deliberately bleeds past the cabinet's padding box (negative `left`/`right` insets, documented in-code as "cover the full frame") — a decorative technique reliant on the parent clipping it flush, by design. This measures **identically in plain arcade mode with zero drill badge present** (confirmed: `sw`/`cw` values are byte-identical between baseline arcade and drill mode at both widths), proving it predates P4 and has nothing to do with S3. The correct, meaningful metric — real page-level overflow — is `false` throughout; recorded here so a future re-check doesn't re-raise the same non-issue.
- No arena encroachment: `#arena`'s bounding-rect top sits below `#hud`'s bounding-rect bottom at both widths (flex-column order holds).

**Game-over fade re-smoke vs. P2's byte-parity captures (Master LAW 3):** re-ran `tools/p2-m4.mjs p4-endstate`.
- Double-exposure metric: **`maxDE = 0`** for both full-motion and reduced-motion (matches the `0` P2/P3 established as the fixed baseline).
- Computed `.screen` transition strings: `pause: "opacity 0.35s, visibility 0.35s"`, `gameover: "opacity 0.35s, visibility 0.35s"` — **byte-identical to P2's recorded values.**
- *Honest methodology note on the settled-render SHA:* this run's `pauseSettledSha` (`d75d3ba28f1338b4`) does not match P2's recorded `5679d11d…`. A raw PNG hash is **not a valid comparison across separate Chromium process invocations/sessions** (font hinting/compositing/random-card-in-background nondeterminism is possible even when the rendered overlay content is identical) — P2/P3 always compared a same-session before/after pair, which this Item-4 pass (no code change) does not produce. The methodologically sound proof instead: **`git diff 161ae66..63da969 -- index.html | grep -c "pauseScreen\|togglePause"` and the same for the base `.screen {` rule both return zero matches** — none of P4's three commits touch the pause markup, its JS, or the shared `.screen` transition rule at all, so byte-parity is a logical certainty, not something that needs a hash to prove. Recording this here so it isn't mistaken for a regression on a future read.

**Fresh AND seeded game-over, 3 widths, before/after:** BEFORE reference = `build-plan/reports/captures/p4/before/gameover-full__{375,768,1440}.png` (pre-M3/M6/S3, seeded profile, banked at phase start — clipping/inverted-weight/no-drill-identity baseline per HANDOFF.md). AFTER = this session's `captures/p4/endstate/gameover-endstate-{fresh,seeded}__{375,768,1440}__{top,scrolled}.png` (12 files) — both profiles now new coverage since fresh-profile game-over wasn't separately captured pre-P4.

---

## Phase laws & re-verifications (§5)

| Law | Status |
|---|---|
| **Master LAW 5** (Item 4 end-state is the actual law, not the M3→M6→S3 build order) | ✅ satisfied — see section above |
| **Master LAW 3** (game-over fade byte-parity) | ✅ satisfied — computed transitions identical; maxDE 0; diff-absence proof (see honest note above) |
| M6's row not-colour-alone; strip's aria exposure unchanged except the L6-F8 un-hide | ✅ verified — chip text + aria-label carry the credit, not hue |
| S3's badge: no new motion, static appear/update, aria-live polite | ✅ verified — `updateDrillBadge()` is a pure text/class toggle, change-guarded |

---

## PROTECT-ACTIVE recaptures (§7) — all held

| Surface | Result |
|---|---|
| DRILL MISSED mechanic + "death as study report" concept (re-queue behavior unchanged) | ✅ `pickCard()` draws with repeats; only emphasis/identity (badge text, button weight) changed, not the re-queue mechanic itself |
| App-driven game-over focus contract (focus lands where it did before) | ✅ the `document.getElementById('again-btn').focus()` line is byte-unchanged across all 3 P4 commits (confirmed absent from every diff) — **see honest environment note below** |
| Seeded lifetime-stats strip + "THE ANSWER IS" reveal typography | ✅ untouched — not present in any of the 3 diffs |
| Game-over fade byte-parity | ✅ see Master LAW 3 above |

**Honest environment note (focus contract):** in this session's headless Playwright harness, `document.activeElement` does not register as `again-btn` after `gameOver()` runs, even waiting up to 1500ms — reproduced in the *minimal* case (a single miss, no M6/S3 complexity at all), so it is unrelated to P4's specific changes. A **manual** `document.getElementById('again-btn').focus()` call, issued a moment later from the same page context, succeeds immediately — proving the element is genuinely focusable and the app's own call targets the correct id; the automated harness simply doesn't carry "input focus" into the page the way a real user-driven tab does. This exact limitation is already flagged in HANDOFF.md's P4 KNOWN ISSUES ("S3 real-browser auto-focus (headless throttles the fade)") from S3's own banking session — this pass re-confirms it rather than discovering something new. **NEEDS-SKY-DEVICE** (unchanged from S3's own evidence).

---

## Deviations from the approved plan (transparency)

1. **M6 — `aria-valuemax` is dynamic, not the literal 56.** `renderLearnProgress()` sets `aria-valuemax` from `activeDeck().length` (index.html:1934), which reflects the player's active category/difficulty filter (or an active review drill). The original report's verbatim text assumed a hard-coded 56. The dynamic form is the *more correct* behavior — a filtered deck's SR-exposed max should match what's visually shown, not the full unfiltered deck size — but it is a deviation from the literal spec text, flagged per LOW-TOKEN honesty rules.
2. **S3 — `.blink` relocated, not duplicated.** The finite 3-pulse cue moves from `again-btn` to the new `#drill-missed-btn` when misses exist (never both at once — confirmed by reading `gameOver()`'s branch: exactly one of the two buttons gets `'big-btn blink'` on any given call). This matches the report's own "fill/weight/order move" framing but is called out explicitly since it changes *which* DOM element carries the pre-existing animation class.
3. **S3 — the drill badge reads "cleared-of-N", not a queue position.** `updateDrillBadge()` (index.html:2412-2418) reports `state.drillCleared.size` (unique correct answers this drill) of `state.reviewDeck.length`, not a decrementing/incrementing queue index — because `pickCard()` draws with repeats (no dequeue), so no true "queue position" exists to report. This is a deliberate, more-honest substitute documented in-code, not an oversight.

---

## Adversarial verification (close-out skeptic pass)

Two independent adversarial reviewers, each tasked to actively REFUTE (not rubber-stamp) their assigned commit, re-read the relevant diffs + full function bodies, ran the green gate, and — beyond static reading — drove the real page in a browser to empirically reproduce edge cases rather than just reason about them.

**Skeptic 1 — M6 (`8e7b61f`) session-state/persistence/aria → 2 REAL BUGS FOUND, both fixed.**
All 5 assigned claims (session-only `runCorrectByCat`, no-chip-at-zero, not-colour-alone + aria-label lockstep, dynamic `aria-valuemax` with no drift, mastery-rule untouched) were CONFIRMED-OK as literally worded. But independent hunting beyond the checklist turned up two real, empirically-reproduced problems that specifically undercut this commit's own "accessibility parity" rationale:
- **Finding A (MEDIUM):** `setBoardInert()` (index.html:2639) was never extended to cover `#learn-progress-bar` when M6 removed its blanket `aria-hidden`. Empirically reproduced via a real accessibility-tree dump: on a fresh load with `mode:'learn'` persisted, the title screen exposed `progressbar "Mastered 0 of 0"` right alongside `button "PRESS START"` — an assistive-tech user on the title, pause, or game-over screen could land on a progress announcement that has nothing to do with the screen they're actually on. **Fixed → `b34473e`** (fold `DOM.learnProgressBar` into the same inert toggle `setBoardInert()` already applies to `#arena`/`#bar`/`#mode-toggle`). Re-verified: inert on title-with-learn-persisted and mid-pause, correctly live again on resume.
- **Finding C (MEDIUM-HIGH):** `renderLearnProgress()`'s `mastered` was the raw whole-session `state.learnMastered.size` while `total` was deck-filtered (`activeDeck().length`) — switching category mid-session (ordinary play, no restart) can leave `mastered > total`. Empirically pushed to a concrete reproduction: after mastering 23 cards across claude+mac then filtering to git (16 cards), the bar read **"23 of 16" / `aria-valuenow="23" > aria-valuemax="16"`** — a `role="progressbar"` asserting a spec-invalid range to screen readers, reachable through completely normal play. Also affected the *sighted* "N/total" text pre-existing this commit (M6 only promoted it from an easy-to-miss visual glitch to an active ARIA violation). **Fixed → `26a6e46`** (count only mastered cards within the same `deck` array already used for `total`). Re-verified against the identical repro: now reads "0/16", `aria-valuenow 0 <= aria-valuemax 16`.
- **Finding B (LOW-MEDIUM, cosmetic, fixed anyway):** the "this-run" sliver's `left:pct%` + floor-forced 2% minimum width placed it entirely past the track's right edge (clipped by `overflow:hidden`) whenever a category was already at 100% lifetime mastery and scored again this run — invisible despite the chip correctly showing beside it. **Fixed → `15e6669`** (clamp `left` to `min(pct, 100 - width)`). Re-verified: GIT at 100% mastery + 2 correct this run now renders `left:98%, width:2%` (fully inside the track) instead of `left:100%` (clipped).
- Minor non-blocking nits (not actioned): a bare `in` operator instead of an own-property check at index.html:2239 (unreachable today — category names are validated by `test/cards.test.js`); folding run-credit into `aria-label` rather than `aria-valuetext` (works as claimed, just a less-idiomatic ARIA channel); `#learn-progress-bar`'s static markup ships with no `aria-valuemax` until first render (now moot for the overlay-leak case since Finding A's fix makes it inert until then).
- Green gate: clean (56/56) both before and after the fixes.

**Skeptic 2 — S3 (`63da969`) focus-contract/Q9-floor/M3-interaction → all 7 claims CONFIRMED-OK, no code changes needed.**
Empirically stress-tested harder than real usage would (5x back-to-back `gameOver()` calls with no reset, forced N-of-N drill completion, category-switch-adjacent edge cases): the button-weight if/else (index.html:2572-2586) unconditionally assigns exactly one of `{drillBtn, againBtn}` to `'big-btn blink'`, never both/neither, correctly recomputed on every call including had-misses↔flawless transitions; the focus-target line and the `[R]` hotkey handler are genuinely absent from the diff (untouched); `.blink`/`@keyframes blink` are untouched and structurally only one element can ever carry the class; `#drill-badge` sits at `order:3` in `#cabinet`'s flex column — a sibling row below `#hud`, not a competitor inside the HUD's own row, so it cannot mathematically break the Q9 single-row HUD regardless of its own width (measured: 10px @375 / 11px @768, single row holds); `state.drillCleared` resets correctly per new drill and never touches `localStorage`; the aria-live change-guard was verified with a live `MutationObserver` — 3 real answers produced exactly 3 mutations, 3 redundant `updateDrillBadge()` calls with no state change produced zero; the missed-review-box/drill-button DOM order and teardown-array coexistence with M3 hold under repeated replay.
- **One independent UX note (not a bug, not actioned — a design tension worth surfacing to Sky):** on a miss-run, keyboard/SR focus lands on `again-btn`, which S3 demotes to the *secondary* ghost button — the newly-promoted "DRILL MISSED" primary sits earlier in DOM order but is not the auto-focus target, so an Enter-press immediately after game-over activates the secondary action; reaching the promoted primary needs Shift+Tab. This is explicit and intentional per the commit (focus target is deliberately unchanged, per the PROTECT'd "app-driven focus contract"), but it does sit in tension with "DRILL MISSED is the primary CTA." Recording it here rather than the S3 per-item section since it's an adversarial-review finding, not a claim verification.
- Green gate: clean (56/56).

**Net:** one of the two commits under adversarial review (M6) had two real, user-facing bugs that its own stated purpose (accessibility parity) directly cuts against — both fixed and re-verified against the exact scenarios that found them, plus one cosmetic issue fixed as a low-cost bonus. The other (S3) held up completely under genuinely adversarial, empirical stress-testing; its one surfaced note is a disclosed design tradeoff, not a defect.

---

## Device checklist restated for Sky (NEEDS-SKY-DEVICE — Chromium can't confirm these)

- **M3:** real-Safari scrollbar rendering (`scrollbar-width:thin` is not a WebKit property) + real OS-level Reduce Motion.
- **M6:** VoiceOver pass of the this-run credit chips + the un-hidden Learn MASTERED progressbar (`role="progressbar"` announce sanely, aria-label reads naturally).
- **S3:** real-browser auto-focus confirmation (headless cannot verify — see honest note above) + VoiceOver pass of the `#drill-badge` aria-live updates ("N of M") to confirm they announce sanely and don't spam.
- **iPhone look** of the re-weighted game-over buttons at 375 (thumb reach + visual hierarchy of DRILL MISSED vs. PLAY AGAIN).

---

## Capture manifest

- `captures/p4/before/` — pre-M3/M6/S3 baseline (game-over full + missed-box top/bottom + drill-run, seeded profile, ×3 widths) — banked at phase start.
- `captures/p4/m3check/`, `captures/p4/m6check/` *(if produced)*, `p4-s3check` output — per-item isolation probes banked during each item's own commit.
- `captures/p4/endstate/` — **this session:** `gameover-endstate-{fresh,seeded}__{375,768,1440}__{top,scrolled}.png` (12 files), `drill-chrome__{375,768}.png` (2 files), `summary.json` (raw measurements).
- `captures/p2/m4/p4-endstate/` — Master LAW 3 re-smoke (`summary.json`, opening-run frames, pause/gameover settled stills).

---

## Conservation table (§10)

| ID | Status | Commit |
|---|---|---|
| M3 | **CLOSED** | `d67e2e5` |
| M6 | **CLOSED** (Fork F = presentation row, picked; 2 real adversarial findings fixed + 1 cosmetic) | `8e7b61f` + `b34473e` + `26a6e46` + `15e6669` |
| S3 | **CLOSED** (SD-1; adversarial pass found no defect, 1 design-tension note surfaced) | `63da969` |

Nothing silently dropped. Fork F = presentation row (picked, P4 plan gate). Item 4 end-state re-verify: all four required checks (no-clip, drill-run chrome, LAW 3 re-smoke, fresh+seeded ×3 widths) satisfied and evidenced above. Adversarial pass: 2 real bugs + 1 cosmetic issue found and fixed (M6 side); 0 defects found, 1 UX note surfaced (S3 side).

---

## Stop

Green gate clean after every item, including all 3 post-adversarial fix commits (56/56, inline-script `node --check` OK, 0 console errors throughout). Every phase law satisfied and evidenced (Master LAW 5 = this document's Item 4 section; Master LAW 3 = the fade re-smoke). `git diff 161ae66..15e6669` touches `index.html` only. Every phase-assigned proposal (M3/M6/S3) is CLOSED — nothing PENDING, nothing silently dropped. The adversarial pass found and fixed 2 real bugs + 1 cosmetic issue, all re-verified against their exact repro scenarios, plus surfaced one non-blocking design-tension note for Sky's awareness (S3's focus target vs. its promoted primary button).

**STOP on `uplift/p4-studyreport` @ `15e6669`.** No merge / push / build / deploy / DNS — Sky's hands.

> **ff-only merge-order reminder:** merging this tip fast-forwards `main` through **P1, P2, P3 AND P4** — merge in train order (P1→P2→P3→P4). Serial per project: no other phase runs while this branch is open.
