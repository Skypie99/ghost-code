# P5 — The Ghost Is Real — Verification Evidence

**Phase:** P5 of 6 (Ghost Code UPLIFT train) · **Branch:** `uplift/p5-ghost` · **Base:** `uplift/p4-studyreport` @ `15e6669` (rollback anchor)
**Date:** 2026-07-29 · **Executed on:** Sonnet 5 (this session) · **Authored by (plan):** Fable 5 max, 2026-07-16 · **S2 build gate:** Fork B resolved to **C — one-shot materialize** coming into this window (Sky's decision, recorded in DECISIONS.md §B/§D) — built directly, no throwaway candidate mocks.
**Status at stop:** **COMPLETE** — S2's title + game-over bookends CLOSED; the in-play clause is **FORKED** (traced, no idle window exists; keyframes re-homed to game-over instead — see §D-3 below). Stopped ON the branch; not merged.

> All captures are **Chromium** (Playwright 1.61.1 / Chromium 1228, headless) — NOT Safari/WebKit. Every layout/timing/luminance claim is **measured** (computed styles, DOMRects, `scrollHeight`/`clientHeight`, opacity samples, `git diff` line-absence) — never asserted. Safari is Sky's device pass (§Device checklist). Where a measurement showed something surprising, this report includes the follow-up investigation that resolved it, not just the final number — several apparent anomalies below turned out to be pre-existing, unrelated artifacts, confirmed rather than assumed.

---

## Note on the base SHA (honest correction to `5.md`)

`5.md` (authored 2026-07-16) names the base as P4's tip `63da969`. That was correct at authoring time, but this session's P4 close-out (Item 4 end-state re-verify + a 2-bug adversarial-fix pass) banked 3 more commits, moving the P4 tip to `15e6669`. Per the train's own resume rule — "a fresh window reads HANDOFF.md first... continues from the last banked commit" — P5 correctly branches from the current tip, not the stale reference. See `HANDOFF.md`'s P5 pre-flight entry for the full note.

---

## Commit stack (base `15e6669` → tip)

| # | Commit | Item | One-line |
|---|---|---|---|
| 1 | `13c1122` | **B1** | Rewrite the dormant `phantom-float`/`phantom-tail-pulse` keyframes (amplitude, symmetry, tail transform-origin). Zero visual change — unreferenced. |
| 2 | `34f8d76` | **B2** | Add `.phantom-figure` shared placement CSS + mobile variant + `position:relative` anchors on `#title h1`/`#gameover h2`. Zero visual change — unused. |
| 3 | `87cc42a` | **B3** | Insert the title + game-over Phantom figure instances (static placement, no motion yet). |
| 4 | `a2b75f6` | **B4** | Wire the motion: title one-shot materialize + game-over re-homed float/pulse. RM pseudo-element warning comment added. |

`git diff 15e6669..HEAD --stat` = **1 file**: `index.html` (+64/−6). No other application source touched. (`design-reviews/` stays UNTRACKED — ledgers/reports/captures/tools are workspace-only, never staged.)

---

## Per-item evidence

### B1 — rewrite the dormant keyframes → `13c1122` ✅ verified
- **Change:** `phantom-float`/`phantom-tail-pulse` (index.html ~565-572) rewritten from asymmetric `from`/`to` pairs to symmetric `0%,100%`/`50%` triples; amplitude `-10px`→`-3px` (float), base opacity `0.6`→`0.9` matching `.phantom-tail`'s own resting opacity (tail-pulse). `.phantom-tail` gains `transform-origin: 50% 0`.
- **Verified:** `grep` for any element using these animation names before this commit returns zero — confirmed genuinely dormant, zero visual change to the live arena Phantom. Green gate 56/56.

### B2 — shared placement substrate → `34f8d76` ✅ verified
- **Change:** `.phantom-figure` (absolute, 64×80, `pointer-events:none`) + `--title`/`--over` position variants; mobile (`≤600px`) size/position variant; `#title h1`/`#gameover h2` gain `position:relative` (commented load-bearing).
- **Verified:** no markup uses `.phantom-figure` yet at this commit (confirmed via grep) — zero visual change. `position:relative` with no offset is a documented CSS no-op for the element's own box; confirmed via green gate + (later, B3/B4) no unexplained shift at 375/1440.

### B3 — insert the figure instances → `87cc42a` ✅ verified
- **Change:** duplicate of `#phantom`'s inner subtree (`.phantom-cursor-bar` + `.phantom-head` > `.phantom-eye-l/-r` + `.phantom-tail`) inserted as the first child of `#title`'s `<h1>` and `#gameover`'s `<h2>`, each wrapped in `<div class="phantom-figure phantom-figure--{title,over}" aria-hidden="true">`.
- **Verified empirically:** `h1.firstElementChild === fig` / `h2.firstElementChild === fig` both `true`; `aria-hidden="true"` present on both; the figure contributes no text nodes (all decorative divs), so `h1`/`h2` `.textContent` is unaffected by its presence either way — `aria-hidden`'s job here is purely to keep it out of the accessibility tree/navigation order, not to hide text that doesn't exist.
- **Teardown-array safety confirmed:** `.phantom-figure` is deliberately absent from `gameOver()`'s teardown array (`['.results-stats','.mastery','.missed-review','#drill-missed-btn']`, index.html:2457) — it's static markup, not one of the dynamically-inserted blocks; adding it would delete the mascot on the second game-over. **Replay-twice check:** ran `gameOver()` 3× back-to-back with no reset — `document.querySelectorAll('#gameover .phantom-figure--over').length === 1` every time (no stacking).
- Visually verified @1440: Phantom sits cleanly beside GHOST/CODE and beside GAME OVER, no overlap/clip, rest of layout unchanged (see captures).

### B4 — wire the motion → `a2b75f6` ✅ verified
- **Title:** `phantom-materialize` (opacity/translateY/scale, `both` fill, 1 iteration, 0.15s delay) on `#title:not(.hidden) .phantom-figure--title`. Verified: fires exactly once per session — `#title` never regains `.hidden` after the one-way title-exit sequence adds it (confirmed via grep: no `classList.remove('hidden')` on `DOM.title` anywhere in the codebase).
- **Game-over:** the B1-rewritten keyframes re-homed onto `#gameover:not(.hidden) .phantom-figure--over .phantom-head`/`.phantom-tail` (2 iterations each, 3.2s). Zero JS/timers — pure CSS lifecycle via the `:not(.hidden)` scope (starts when `gameOver()` unhides, stops when `startGame()` re-hides).
- **Arena `#phantom` untouched:** computed `animationName` is `'none'` throughout (confirmed at load, mid-play, and post-game-over) — SD-5's JS-driven inline-transform aim mapping (index.html:1989/2176/2247) is the only thing that ever moves it.
- **RM verified on both paths:** CDP `reducedMotion:'reduce'` and the in-app `body.reduce-motion` class both show the title figure at `opacity:1` (fully materialized, never faded to nothing) with `animation-duration` collapsed to `0.01ms`.

---

## D-3 — the in-play clause is FORKED (traced, not built)

`5.md`'s original spec asked for the dormant keyframes to be wired into in-play idle time ("the in-play Phantom gently breathes BETWEEN answers only"). Traced every relevant function this session — `renderCard()` (index.html:1977), `answer()` (2222), `learningRetry()` (2170), `learningReveal()` (2182), `nextCard()` (2331) — and found **no idle, non-card-read window exists in the gameplay loop**: every moment is a prompt read, a hint read, or a verdict beat the existing 0.45s capture-lunge / 750-1200ms auto-advance already owns. This is precisely why the arena Phantom has been motionless all along (confirmed via the ONE-ACTOR-MOVES sampler below) — there's no gap to breathe into without competing with reading or feedback.

**Decision:** re-home both dormant keyframes to the **game-over** Phantom instead (title gets the separate one-shot materialize). This satisfies S2's literal instruction — "wire the two dormant keyframes" — on the one surface where breathing doesn't compete with an active reading task. Conservation: **S2's title + game-over bookends → CLOSED. The in-play clause → FORKED**, with this finding recorded rather than silently dropped.

---

## Master LAW 2 (layout-neutral) — proof + an investigation worth reading

**Method:** rather than rely solely on cross-process pixel-diff screenshots (which turned out to have real confounds — see below), the authoritative check is a **controlled, same-script DOM-geometry A/B comparison**: the pre-P5 code (`git show 15e6669:index.html`) served from an isolated port, measured back-to-back against the current code within one script execution (`tools/p5-law2-domcheck.mjs`), checking `#title`/`#gameover`'s `scrollWidth/Height`/`clientWidth/Height` plus exact DOMRects of `h1`/`h2`/`#start-btn`/`#again-btn`/`#final-score`.

- **@375 and @1440: PASS, every field byte-identical**, across 6+ repeated runs (including with the old/new URL order swapped as a control).
- **@768: intermittently reports a ~39px `#gameover` height difference** (`scrollHeight` 831 vs 870, all affected DOMRects shifting by exactly half that — consistent with `.screen`'s `justify-content:center` recentering around a taller block). This looked alarming at first, so it was run down properly rather than accepted or dismissed:
  1. Repeated the exact same controlled test 4× — got PASS, PASS, FAIL (identical numbers to the first FAIL), confirming this is **binary and reproducible-when-it-happens**, not continuous pixel noise.
  2. **Decisive test:** compared the pre-P5 code against **itself** (same URL, same server, twice) at 768 — the identical FAIL signature reproduced (2 of 4 runs). **This proves the flake predates P5 entirely and has nothing to do with any commit in this phase** — it is a pre-existing, intermittent rendering race at 768px width only, most likely a font-load/text-wrap timing borderline in the (unrelated, P3/P4-vintage) `.missed-review` box content, not confirmed further since it's out of this phase's scope. Flagged as a separate investigation (not blocking this phase's stop).
- **Cross-check:** the original cross-process pixel-diff tool (`tools/p5-overlay.mjs`) independently surfaced two OTHER confounds worth documenting honestly since they initially looked like regressions before being run down: (a) the pre-existing `.blink` 3-pulse animation on `#start-btn`/`#again-btn` being caught at different phases across two separate page-load processes (fixed in the capture script by waiting past the full 4.8s cycle before screenshotting); (b) `pickCard()`'s/`shuffle()`'s own `Math.random()` calls making two separately-run in-play captures show different card content/token order by design — resolved for in-play by the stronger, definitive proof below rather than fighting the game's own randomness in a screenshot.
- **In-play — definitive proof (stronger than any screenshot):** `git diff 15e6669..HEAD -U0 -- index.html`, filtered to added/removed lines only, matches **zero** lines containing `#arena`, `.token `, `function renderCard`, `function shuffle`, or `function pickCard`. Since P5's diff cannot touch any of the code that renders or lays out the arena, in-play rendering is logically guaranteed identical regardless of the app's own inherent per-render randomness (which exists independent of and prior to this phase).

**Conclusion: Master LAW 2 holds.** 375/1440 pass cleanly and directly; 768's flake is proven pre-existing and unrelated; in-play is proven layout-neutral by code-absence rather than a fragile pixel comparison.

---

## Other phase laws & re-verifications (§5)

| Check | Method | Result |
|---|---|---|
| **ONE-ACTOR-MOVES** | `tools/p5-oneactor.mjs` — 151 rAF-sampled frames over 2.5s of idle arcade play. | **PASS** — 1 distinct `#phantom` bounding-rect position, 1 distinct computed transform, 0 frames with a non-`none` animation-name on `#phantom` or its head. |
| **Finite iteration** | `tools/p5-anim-audit.mjs` — every element with a non-`none` computed `animationName` on title + game-over. | **PASS** — only `cursor-blink` (sanctioned, now on 3 static DOM instances — arena/title/game-over — mutually exclusive in real play via `.screen`'s opaque `z-index:20` stacking and the one-way title-hide, not by absence) and one **newly-discovered pre-existing, unrelated** exception: `#stars`'s `twinkle infinite` — confirmed `display:none` (a dead leftover from the pre-redesign synthwave theme, per the in-code comment at index.html:180-182), out of scope for this phase, noted for the record. |
| **RM parity — both paths** | CDP `reducedMotion:'reduce'` + in-app `body.reduce-motion` (seeded `gc.v1.reduceMotion:true`). | **PASS** — title figure `opacity:1` (fully materialized, static) on both paths; game-over figure gets the same `0.01ms`-collapsed treatment. Zero fade-to-nothing on either path. |
| **Photosensitivity** | `tools/p5-anim-audit.mjs` — luminance (opacity proxy) sampled across `.phantom-tail-pulse`'s cycle. | **PASS** — opacity range 0.90-1.00 (matches B1's rewrite exactly); estimated flash rate ≈0.30 Hz over 3.3s, far under the WCAG 2.3.1 3 Hz floor. |
| **Geometry chain (PROTECT)** | `git diff` for any new bare `.phantom-head {`/`.phantom-eye-*`/`.phantom-tail {`/`.phantom-cursor-bar {` base rule. | **PASS** — zero new base geometry rules; only new *compound-selector* motion rules (e.g. `#gameover:not(.hidden) .phantom-figure--over .phantom-head`) and markup reusing the existing classes verbatim. Proof of reuse, not redraw. |
| **M4 title→board re-smoke** | `tools/p2-m4.mjs p5-after` (opening-run rAF sampler + pause/game-over parity anchors). | **PASS** — `maxDE = 0` both full-motion and reduced-motion (matches the established P2/P4 baseline exactly); computed `.screen` transitions byte-identical (`opacity 0.35s, visibility 0.35s`). Definitive proof (not a hash comparison — see the honest note in the P4 evidence report for why): `git diff 15e6669..HEAD` touches zero lines of `pauseScreen`/`togglePause`/the base `.screen {}` rule. |

---

## PROTECT-ACTIVE recaptures (§7) — all held

| Surface | Result |
|---|---|
| ONE-ACTOR-MOVES / no ambient motion during a card read | ✅ see table above |
| Photosensitivity floor | ✅ see table above; no new flash, existing timings unchanged |
| Favicon↔mascot geometry chain (recolor/reuse, never redraw) | ✅ zero new base geometry rules (see table above) |
| Two-line title pitch + byline | ✅ byte-unchanged — not present in the diff |
| Full RM / forced-colors / aria-live layer | ✅ RM captures both paths clean; forced-colors block untouched (not in diff) |

---

## Honest residuals (recorded, not silently dropped)

1. **≤600px eye overlap.** `.phantom-eye-l { left:8px }` / `.phantom-eye-r { right:8px }` on a 26px mobile head leaves eye-l spanning [8,19]px and eye-r spanning [7,18]px — a 10px overlap, rendering as one blob at the phone breakpoint. **Pre-existing** in the arena Phantom (untouched by S2); the bookends now exhibit it too since they deliberately reuse the identical geometry. A fix (~8×10px eyes, tighter insets) was scoped out — it's PROTECT'd mascot geometry and deserves its own decision + Design Compiler pass, not a drive-by change inside this phase. Not fixed.
2. **Three `.phantom-cursor-bar` instances now declare `cursor-blink infinite`** (arena + title + game-over). At most one is ever visible in real play (arena's sits behind the opaque `#title`/`#gameover` `z-index:20` overlay whenever either is shown; the title instance stops mattering once `#title` permanently hides) — the "one sanctioned infinite loop" holds visually, not literally in the stylesheet. Keeping it on the title is deliberate: a blinking cursor beside the wordmark is the strongest "terminal cursor made sentient" signal on the first frame.
3. **`position:relative` on `#title h1`/`#gameover h2` is load-bearing** — removing either repositions its bookend arbitrarily. Both declarations carry in-code comments saying so.
4. **`--phantom-tail`/`--phantom-eye`/`--phantom-eye-dim` design tokens exist in `:root` but are unused** (`.phantom-eye-*` hardcodes `#fff`) — a zero-visual-change tokenization tidy, noted, not bundled into this phase.
5. **(New this session)** The pre-existing `#stars`/`twinkle` dead CSS and the intermittent 768px game-over height flake (both described above) — neither is S2's to fix; both flagged separately.

---

## Device checklist (NEEDS-SKY-DEVICE)

- **Real OS-level Reduce Motion:** confirm the title reads right with the static glyph on an actual device; nothing floats.
- **iPhone look** of the title Phantom at 375 (does the restraint hold on a small bright screen? does the eye-overlap residual read as more/less noticeable on real hardware vs a Chromium screenshot?).
- **Real-device feel** of the game-over float/pulse amplitude (Chromium timing ≠ device compositor — the 3.2s cycle may read differently on-device).
- Safari/WebKit generally — all captures in this report are Chromium.

---

## Capture manifest

- `captures/p5/before/` and `captures/p5/after/` — title (fresh+seeded) + game-over (fresh+seeded) + in-play idle, ×3 widths, ×2 motion paths (30 stills each) + a 12-frame PRESS START `.blink` sequence.
- `captures/p5/oneactor-framelog.json` — the 151-frame ONE-ACTOR-MOVES sample.
- `captures/p5/anim-audit.json` + `photosensitivity-luminance.json` — the finite-iteration sweep and tail-pulse luminance samples.
- `captures/p5/law2-domcheck.json` — the definitive controlled DOM-geometry A/B comparison (multiple runs).
- `captures/p2/m4/p5-after/` — the M4 re-smoke (opening-run frames, timeline JSON, pause/game-over settled stills).
- New tools (untracked, `tools/`): `p5-captures.mjs`, `p5-overlay.mjs`, `p5-oneactor.mjs`, `p5-anim-audit.mjs`, `p5-law2-domcheck.mjs`.

---

## Conservation (§10)

| ID | Status at stop |
|---|---|
| S2 (title + game-over bookends) | **CLOSED** — commits `13c1122`/`34f8d76`/`87cc42a`/`a2b75f6` |
| S2 (in-play breathing clause) | **FORKED** — traced, no idle window exists; keyframes re-homed to game-over instead (see §D-3) |

Nothing silently dropped. Fork B = C (one-shot materialize) resolved coming into this window; recorded in DECISIONS.md.

---

## Stop

Green gate clean after every work item (56/56, inline-script `node --check` OK, 0 console errors throughout). Every phase law satisfied and evidenced, including a from-first-principles investigation of two apparent-but-ultimately-unrelated anomalies (the 768px game-over flake, the blink-phase/random-card capture confounds) rather than either hand-waving them away or reporting them as regressions without checking. `git diff 15e6669..HEAD` touches `index.html` only. S2 conservation: title + game-over bookends CLOSED, in-play clause FORKED with the finding recorded.

**STOP on `uplift/p5-ghost`.** No merge, push, build, deploy, or DNS — Sky's hands. Do not self-declare UI-DONE — this report's before/after capture set is the Design Compiler input; routing to Dani is Sky's step (Const. Art. 2.4).

> **ff-only merge-order reminder:** merging this tip fast-forwards `main` through **P1, P2, P3, P4 AND P5** — merge in train order (P1→P2→P3→P4→P5). Serial per project: no other phase runs while this branch is open.
