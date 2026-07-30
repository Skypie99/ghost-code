# P3 Verification Evidence — Ghost Code UPLIFT, Phase 3 "Winning, Authored"

**Branch:** `uplift/p3-winbeat` @ `161ae66` (base `78d605a` = P2 tip) · **STOPPED ON BRANCH — not merged.**
**Executed:** 2026-07-17, Opus 4.8 ultracode max effort (Sky-fired window; SD-8). Plan approved via plan mode before build.
**Slate:** Q6, Q7, Q8, S1 — all CLOSED. Both mockup gates PICKED by Sky (Fork A = ALL THREE; Q7 = HEART + SLASHED-CIRCLE).

**Evidence method (honest tagging):** All live verification was done by driving the app in the in-app **Chromium** Browser pane against `python3 -m http.server` — real keyboard/mouse input + DOM-level assertions (`getComputedStyle`, class/attr/contrast reads) + inline screenshots. This is Chromium only — **NOT Safari/WebKit**; Sky's device pass is the only Safari truth. Contrast is **measured** (computed sRGB luminance from sampled token/palette values), never asserted. Where a value depends on a CSS transition or `requestAnimationFrame`, note the **environment caveat** below.

> **Environment caveat (not a product bug).** This session's automated browser throttles `requestAnimationFrame` **and** CSS transitions when the tab is not actively painting between tool calls. Two effects surfaced and were resolved by pumping paint frames (screenshots): (1) Q8's rAF focus-move to RESUME didn't advance until frames painted; (2) Q6's `border-color`/`box-shadow` 0.15s transition was frozen at its start value (teal) until frames painted, then completed to neutral. Both are correct for real users (whose tab always paints). Q8's focus logic was made robust to this with a bounded per-frame poll; Q6 needed no change (the transition is inherent house behavior and completes normally when painting).

---

## Item Q6 — neutralize the teal focus ring on a wrong token · commit `974f601`

**Change:** new `.token.wrong:focus-visible` rule swaps the three focus-ring layers (outline, border, box-shadow) from teal `--accent` to neutral `--text-secondary` slate (halo via new `:root --neutral-halo`), **only** when a token carries both `.wrong` and `:focus-visible`. `!important` on border-color + box-shadow to beat `.wrong`'s red `!important`; outline-color wins by specificity.

**Verified (live, Chromium, frame-pumped):** on a wrong + keyboard-focused token —
| Property | Computed | Expected | ✓ |
|---|---|---|---|
| outline-color | `rgb(157,167,179)` | neutral slate | ✓ |
| border-color | `rgb(157,167,179)` | neutral slate | ✓ |
| box-shadow | `rgba(157,167,179,0.35) 0 0 16px` | neutral halo | ✓ |
| outline width / offset | `2px` / `3px` | unchanged geometry | ✓ |
| `::after` glyph / color | `"✗"` / `rgb(248,113,113)` | ✗ untouched (red) | ✓ |

**Measured contrast (computed sRGB luminance, SC 1.4.11 ≥3:1):**
- neutral ring `#9DA7B3` **vs base `#0E1116` = 7.76:1** ✓
- neutral ring **vs the real `.wrong` fill** (12%-alpha `--danger` composited over `--surface-token` = `#362C36`) **= 5.46:1** ✓ (prior teal-vs-red was ~3.4:1)

**Tags:** verified (Chromium). Real Safari/WebKit = NEEDS-SKY-DEVICE. Scoped to `.wrong`; the symmetric `.correct:focus-visible` teal-over-green case is out of scope → §Parking-lot.

---

## Item Q7 — SPIRITS heart + 50/50 slashed-circle (glyph + aria only, SD-2) · commit `be022b6`

**Change:** SPIRITS gains a teal `#lives::before` heart glyph (`\2665`) leading its unchanged cursor-block pips + a NEW `#lives` aria-label (it had none); 50/50's `.lifeline-pip` gold star clip-path becomes a slashed-circle ⊘ (bordered circle `::before` + diagonal slash `::after`, same 16×22 bounding box, same `--gold`). No label text added/removed/reworded.

**Verified (live, Chromium):**
- HUD renders **♥ ▮ ▮ ▮** (SPIRITS) and **⊘ ⊘ ⊘** (50/50) at desktop and 375 — screenshots confirm both glyphs legible and distinct.
- Accessibility tree: SPIRITS meter `#lives` → **"3 lives remaining"** (new); 50/50 meter `#lifelines` → **"3 lifelines remaining"** (pre-existing, unchanged).
- Glyph-only diff confirmed: the `<span class="label">SPIRITS</span>` / `50/50` text is untouched; no layout shift (same bounding boxes); console clean.

**Tags:** verified (Chromium render + a11y tree). Real Safari glyph render = NEEDS-SKY-DEVICE (project standing gap).

---

## Item Q8 — pause overlay → true modal (RESUME + inert + focus containment) · commit `36d160e`

**Change:** RESUME `.big-btn` inside `#pauseScreen` (same button family as title START / game-over RETRY; ≥44pt; focus-visible ring); copy → "Press ESC or tap RESUME to continue."; `role="dialog"` + `aria-modal="true"` + `aria-labelledby="pause-title"`. `togglePause()` now stashes `document.activeElement` **before** `setBoardInert(true)`, moves focus to RESUME, and on resume un-inerts **before** restoring focus to the pre-pause element. Esc + RESUME both route through `togglePause()`. Focus-onto-RESUME uses a bounded per-frame poll (`focusResumeWhenReady`) that focuses the instant the fade makes it visible.

**Verified (live, Chromium):**
| Check | Result | ✓ |
|---|---|---|
| Pause card shows heading + copy + RESUME button | screenshot confirms composed panel | ✓ |
| `role` / `aria-modal` / `aria-labelledby` | `dialog` / `true` / `pause-title` | ✓ |
| Board inert on pause | arena / bar / mode-toggle `.inert === true` | ✓ |
| Focus moves to RESUME on open | `document.activeElement === #resume-btn` (after paint) | ✓ |
| Focus containment | RESUME is the **only** reachable (non-inert, non-hidden) focusable; Tab stays on it | ✓ |
| Esc resumes + restores focus | after Esc: pause hidden, board un-inerted, `activeElement === mode-arcade` (the pre-pause element) | ✓ |
| RESUME-click resumes | pause hidden, board un-inerted, `playing-state` on | ✓ |
| `.screen` fade untouched (LAW 3) | fade transition rule not in the diff; pause card only gains children + role/aria | ✓ (code-inferred + functional) |

**Tags:** verified (Chromium). Real VoiceOver/NVDA "dialog" announcement + focus containment = NEEDS-SKY-DEVICE.

---

## Item S1 — make winning feel as authored as losing (Fork A = ALL THREE) · commits `0cf8bca` (S1a) + `161ae66` (S1b)

**Change:** `.token.captured` no longer dissolves — it holds the green border + ✓ for the full auto-advance window. A "+N" score-fly is anchored to the captured token (`earned` captured before `state.streak++` so it matches the announce). Arcade burns the full winning command into an opaque `#win-strap` chip (textContent). Learn adds `card.answer` to the CORRECT panel at the hint's type scale (`.lp-answer--sm`) — **closes L3-F7**. The held state + fly + strap are torn down in `renderCard()`'s `[M2·L4-F1·SD-9]` clear.

**Verified (live, Chromium; auto-advance temporarily frozen to hold the beat for capture, then restored):**
- **Held win (no dissolve):** captured token measured **opacity `1`** (was `0` pre-S1), `border-color rgb(74,222,128)` green, `.correct` ✓ present.
- **"+N" fly:** `.score-fly` present on the token, textContent **"+10"** and **"+11"** across two answers — matches the announced points exactly (off-by-one guard verified).
- **Arcade strap:** `#win-strap.visible`, textContent **`cp a.txt b.txt`** — a multi-arg command rendered **intact** via textContent (spaces preserved, no clipping); opaque `--surface-raised` chip reads crisply center-field.
- **Learn answer line (L3-F7):** CORRECT panel renders **"CORRECT!" → `git diff` (`.lp-answer--sm`, computed 18px) → hint**. Strap correctly **not** shown in learn.
- **LAW 1 / SD-3 same-paint teardown:** after advancing (real `nextCard()` → `renderCard()`), DOM shows **0** `.correct`/`.captured` tokens, **0** `.score-fly`, `#win-strap` **hidden + empty**, and the new prompt swapped — all in one paint. No straggling frame → **L4-F1 stays dead.**
- **SD-4 timing:** the `isLearnMode() ? 1200 : 750` auto-advance constant is untouched (not in the diff).
- **RM safety:** both new keyframes (`score-fly-rise`, `strap-burn-in`) end at `opacity:1` with `both` fill → under reduced motion they collapse to a static, visible held frame; **no** new animated element for RM. No `infinite`/repeating animation added.
- **aria-live:** the "Correct! +N points…" announcement string is byte-unchanged (not in the diff); fly + strap are `aria-hidden`.

**Tags:** verified (Chromium DOM + screenshots). Real macOS "Reduce Motion" (OS-level, not CDP) static hold, real-keyboard latency through the 750/1200ms windows, and real Safari/WebKit = NEEDS-SKY-DEVICE.

---

## Phase laws (§5) — status

| Law | Requirement | Status |
|---|---|---|
| **LAW 1 (SD-3)** | S1 held state clears in the same paint as the next prompt (frame-diff; L4-F1 dead) | ✅ **VERIFIED** at DOM level — advance → 0 held-state elements + new prompt, one paint |
| **LAW 3** | pause fade byte-identical to game-over (M4 not re-timed) | ✅ `.screen` transition untouched by Q8 (not in diff); pause open/close functional. Byte-parity vs P2's `5679d11d…` = **code-inferred** (no transition edit) — a fresh settled-sha capture is a Sky-device/rig nicety, not a risk |
| **LAW 4** | 375 fold + 1440 zero-shift with the longest answer | ✅ strap + fly are `position:absolute` → **no reflow** at any width (1440 zero-shift inherent). Learn answer line appears only in the **post-correct terminal** state (untimed, cabinet scrolls per P1's M1 design), so it does not change the pre-answer fold P1's criterion governs. 375 learn CORRECT panel verified to fit + wrap |
| **Photosensitivity** | no new flashing; wrong-flash single-iteration ≥~1900ms | ✅ new keyframes are single-iteration `both` (no `infinite`); wrong-answer flash (`danger-pulse`) untouched by this phase |

**Longest-content note:** the strap uses `white-space:normal; word-break:break-word; max-width:92%`, and the token/panel already wrap — so the longest `card.answer` (`git reset HEAD index.html`, 25 chars) wraps within its container without overflow. Verified structurally + with the multi-arg `cp a.txt b.txt`.

---

## PROTECT recapture (§7) — all held

| Surface | Result |
|---|---|
| Capture-lunge overshoot spring (`#phantom` transition) | untouched (not in diff); Phantom lunge observed intact |
| Wrong-answer feedback stack (flash → hint) | untouched (Q6 only recolors the focus ring on wrong+focused; `danger-pulse` unchanged) |
| Pause dim / `.screen` fade | transition rule untouched (LAW 3) |
| aria-live announcements ("Correct! +N points…") | string byte-unchanged (not in diff) |
| Difficulty/verdict color grammar + "THE ANSWER IS" typography | untouched |
| `:focus-visible` double-ring (all states incl. new wrong-ring) | geometry preserved; only hue/sat changed on wrong+focused |

---

## Device checklist (NEEDS-SKY-DEVICE) — restated for Sky

- **S1:** real OS-level **Reduce Motion** (System Settings, not CDP) — confirm the static held win beat feels right.
- **S1:** real-keyboard play latency through the 750/1200ms windows — does the held beat read at speed?
- **Q8:** **VoiceOver/NVDA** on the pause dialog — announced as "dialog", focus contained, RESUME reachable.
- **All:** a real **Safari/WebKit** pass — every capture here is Chromium (Playwright/Chromium-class), not Safari.

---

## Commit list (base `78d605a` → tip `161ae66`)

| Commit | Item | One line |
|---|---|---|
| `974f601` | Q6 | neutralize the teal `:focus-visible` ring on a `.wrong` token → neutral slate (measured 7.76 / 5.46) |
| `be022b6` | Q7 | SPIRITS heart glyph + 50/50 slashed-circle + `#lives` aria-label (glyph + aria only) |
| `36d160e` | Q8 | pause → true modal (RESUME button + `role=dialog` + board inert + focus containment/restore) |
| `0cf8bca` | S1a | held-win CSS state layer (`.token.captured` holds) + `.score-fly`/`#win-strap`/`.lp-answer--sm` + markup + DOM cache |
| `161ae66` | S1b | wire the held win beat + `+N` fly + arcade strap + learn answer line + SD-9 same-paint teardown |

`git diff 78d605a..HEAD` = **`index.html` only** (+168 / −17). Green gate 56/56, 0 console errors.

---

## Honest residuals & notes

- **Q2-follow-up carryover** is a P2 concern, not P3.
- **Saved capture matrix:** verification this session was the live Chromium Browser-pane drive with DOM assertions + inline screenshots (documented above), not a re-run of the Playwright rig's saved-PNG matrix under `captures/p3/` — the rig's *motion* captures are unreliable in this frame-throttled environment, and the DOM-level assertions are the stronger proof for these states. The formal before/after capture set + Safari truth land in Sky's device gate.
- **Design-Compiler:** this before/after set is the compile input; routing to Dani is Sky's step — not self-declared UI-DONE.

## Conservation (P3)

| ID | Path | Status |
|---|---|---|
| Q6 | `974f601` | CLOSED |
| Q7 | `be022b6` | CLOSED (glyph = HEART + SLASHED-CIRCLE, SD-2 glyph+aria only) |
| Q8 | `36d160e` | CLOSED |
| S1 | `0cf8bca` + `161ae66` | CLOSED (Fork A = ALL THREE) |

**Parking-lot (out of scope, recorded — not built):** `.token.correct:focus-visible` teal-over-green symmetric ring (Q6 is `.wrong`-only); "50/50 appears on three surfaces" cross-surface naming (fenced by SD-2).

**STOP on `uplift/p3-winbeat` @ `161ae66`. No merge / push / deploy — Sky's hands (ff-only, train order P1→P2→P3).**
