# P2 — The Front Door — Verification Evidence

**Phase:** P2 of 6 (Ghost Code UPLIFT train) · **Branch:** `uplift/p2-frontdoor` · **Base:** `uplift/p1-floor` @ `b5c3a50` (rollback anchor)
**Date:** 2026-07-17 · **Executed on:** Opus 4.8 ultracode max (SD-8; Sky-initiated window) · **Authored by (plan):** Fable 5 max, 2026-07-16
**Status at stop:** **COMPLETE** — all 7 slate items closed (OG-card gate resolved in-window: Sky picked candidate **A**). Stopped ON the branch; not merged.

> All captures are **Chromium** (Playwright 1.61.1 / Chromium 1228) — NOT Safari/WebKit. Every contrast/shift claim is **measured** (sampled pixels / computed values / rAF opacity samples), never asserted. Safari is Sky's device pass (§Device checklist).

---

## Commit stack (base `b5c3a50` → tip)

| # | Commit | Item | One-line |
|---|---|---|---|
| 1 | `dcd858e` | **Q4** | Fix invalid `@supports` grammar in the `.word1` wordmark fallback (dead → live). |
| 2 | `9e5c46d` | **Q1** | Bind key–label pairs / let separators break — kill the controls-line "HELP" orphan. |
| 3 | `8f32c49` | **Q2** | One canonical category name via `CATEGORY_LABELS` across HUD/chip/game-over (+ LAW 8 fit). |
| 4 | `3c9c438` | **Q5** | Preload the two variable woff2 + metrics-matched `@font-face` fallbacks (kill FOUT shift). |
| 5 | `15838b9` | **M4** | Sequence the title→board swap (two-beat, scoped) — kill the crossfade double-exposure. |
| 6 | `e48e310` | **Q10** | Returning-player welcome-back beat — accent MASTERED numeral + one static line. |
| 7 | `350f8bb` | **M5a** | Recolor favicon to shipped palette + PNG/ICO/apple-touch fallbacks + link tags. |
| 8 | `c4b06dc` | **M5b** | Regenerate OG card (Sky's editorial pick) + truthful, mascot-free alt text. |
| 9 | `c24f34c` | **Q2-follow-up** | Unify the copy-result SHARE string to the canonical name (⚠ exceeds the approved plan's scope — see §Deviations; revertible). |

`git diff b5c3a50..HEAD --stat` = **6 files**: `index.html` (+92/−22), `favicon.svg` (recolor), `og-image.png` (323,598 → 91,984 B), and new `favicon-32.png` / `favicon-180.png` / `favicon.ico`. No other application source touched. (`design-reviews/` stays UNTRACKED — ledgers/reports/captures/tools are workspace-only, never staged.)

---

## Per-item evidence

### Q4 — invalid `@supports` fallback → `dcd858e`  ✅ verified
- **Change:** `@supports not (background-clip: text) and not (-webkit-background-clip: text)` → `not ((background-clip: text) or (-webkit-background-clip: text))` (De Morgan-equivalent, legally parenthesized).
- **Verified (Chromium CSSOM):** old grammar parses to **0 rules** (dropped — the fallback was dead on every engine); corrected grammar parses to **1 valid `CSSSupportsRule`**, present in the live CSSOM. Zero visual change on supporting browsers (gradient wordmark identical). Forced-fallback render = solid `var(--accent)` `rgb(61,216,196)` on the title bg `rgb(14,17,22)` = **10.64:1** (≫ AA).
- **NEEDS-SKY-DEVICE:** older-WebKit / non-Chromium engines where the fallback actually fires.
- Captures: `captures/p2/after/q4-wordmark-{supported,fallback-forced}.png`.

### Q1 — controls-line orphan (Fork C = KEEP) → `9e5c46d`  ✅ verified
- **Change:** rebound `&nbsp;` so each key–label pair is glued (`?&nbsp;HELP`, `R&nbsp;RESTART`, …) and separators are ordinary breaking ` · `. Mirrored on the touch-hint line.
- **Verified (Chromium):** title-fresh re-rendered @1440 **and** 768 — the whole controls line holds on one line, **"? HELP" intact, orphan gone** (BEFORE baseline showed "HELP" stranded on line 2). Whitespace-only; text/reading order/SR output unchanged.
- **Fork C:** Sky picked **KEEP & fix**. Keep-vs-remove comparison mocks rendered for a later final call → `captures/p2/forkC/forkC-{KEEP,REMOVE}__{1440,768}.png`.
- Captures: `captures/p2/{before,after}/title-fresh__{1440,768}*.png`.

### Q2 — one canonical category name → `8f32c49`  ✅ verified
- **Change:** `CATEGORY_LABELS = { all:'ALL', claude:'CLAUDE', mac:'TERMINAL', git:'GIT' }`; HUD readout, prompt chip, aria-live announcer, and game-over mastery bars all route through it; toggle buttons already matched.
- **Verified (Chromium):** for `mac`, HUD = chip = toggle = **"TERMINAL"** in one viewport (was "MAC" / "MAC TERMINAL" / "TERMINAL"); for `claude`, all = "CLAUDE"; game-over `CATS` resolves to `["CLAUDE","TERMINAL","GIT"]` with **0 console errors**.
- **LAW 8 (Q9 10px floor):** "TERMINAL" initially wrapped the 375 HUD to 2 rows. Restored single-row **without** shrinking labels below 10px by tightening the `≤600` HUD column gap `10→8px` + cat-badge padding `7→5px`. Verified `rows=1` for every category at **375 portrait, 812×375 landscape, 768, 1440**; no horizontal overflow.
- **Design note (chose short forms):** the chip loses the branded "CODE"/"MAC" (`CLAUDE CODE`→`CLAUDE`, `MAC TERMINAL`→`TERMINAL`) — the unification cost; short forms are LAW-8-safe and match the toggle the slate said to keep. Both strings pre-existed (no invented copy).
- Captures: `captures/p2/after/q2-play-{mac,claude}__375.png`, `q2-hud-mac-settled__{375,1440}.png`.

### Q5 — preload fonts + metrics-matched fallback → `3c9c438`  ✅ verified (Chromium) / device-pending
- **Change (SD-7 preload-only):** (1) preload the two **variable** woff2 (Inter v20, JetBrains Mono v24 — one latin file per family across all weights), URLs resolved from css2 with a modern browser UA; (2) `@font-face` fallback faces — `Inter Fallback` (local Arial) and `JetBrains Mono Fallback` (local Menlo/Courier New) — with `size-adjust` + ascent/descent overrides derived from the shipped webfonts via canvas metrics, wired into `--font-ui`/`--font-mono` ahead of the generic fallbacks.
- **Ledger L3 (byte-match):** cold-cache load → **each woff2 requested exactly once (no double-download)**, both preloads used, ahead of the stylesheet's discovered font requests.
- **Shift eliminated (clean per-element measurement, same page, webfont vs fallback):** command tokens hold height (`dH 0` vs the naive system-fallback's `dH −3` @1440 / `−2` @375); HUD digits `dW 0, dH 0`; wordmark `0/0`. This is the finding's exact target (HUD tabular numerals + the 4 command tokens).
- **Protected citizens held:** 375 title-tagline stays one line (no reflow); 1440/768 diamond token boxes stable across the swap.
- **Honest residual (code-inferred):** Inter is proportional, so one `size-adjust` can't perfectly match every string — the one-line tagline's advance varies ~5px (cosmetic, no reflow). Inherent to metrics fallbacks; not removable without self-hosting (fenced by SD-7).
- **NEEDS-SKY-DEVICE:** real Safari/WebKit cold-cache FOUT — Safari's font-loading (FOIT/FOUT) differs from Chromium and is the actual risk surface.

### M4 — kill title→board crossfade double-exposure → `15838b9`  ✅ verified (Chromium) / device-pending
- **Root cause:** `.screen` is **opaque** and **shared** by title/game-over/pause; hiding the title ran the shared 0.35s opacity fade, cross-dissolving the whole opaque title layer over the live board (~350ms of title-text-over-board-text).
- **Scoped fix (SD-6 / Master LAW 3):** touch ONLY the title's start-of-run exit. Full motion = two beats — fade the title CONTENT (`#title.title-exit > *`) to 0 over 0.18s while the opaque screen stays up (board hidden), then cut the empty screen (`transition:none`) to reveal the board. Total ~0.19s (< the old 0.35s → no added delay). Reduced-motion branched to the unchanged instant swap; helper classes clean up next frame.
- **Verified (rAF opacity sampler):** double-exposure metric `(1−screenOp)·screenOp·contentOp` peaked at **0.25** before (screenOp 0.52, contentOp 1) → **0** after. Reduced-motion **0 → 0** (unchanged).
- **Pause + game-over BYTE-PARITY:** computed `.screen` transition identical (`opacity 0.35s, visibility 0.35s`) before==after; **pause settled render sha `5679d11d…` before == after**; the gameover/pauseScr hide lines and the `.screen` base transition are untouched in the diff. No new flashing (monotonic opacity fades).
- **NEEDS-SKY-DEVICE:** real-Safari repaint/compositing timing of the sequenced swap.
- Captures: `captures/p2/m4/{before,after}/{summary.json, opening*__f*.png, pause-settled.png, gameover-settled.png}`.

### Q10 — returning-player welcome-back beat → `e48e310`  ✅ verified / device-pending
- **Change:** added the `mastered > 0` branch in `renderTitleStats` (value already derived from `cardStats`; **no new gc.v1 key**) — accent the MASTERED numeral with `--accent`, and append ONE static line "Welcome back — pick up where you left off". Static single paint, no animation.
- **Verified (Chromium):** FRESH (mastered 0) → no accent (`rgb(230,237,243)`), no line. SEEDED (mastered 28) → numeral **`rgb(61,216,196)` = #3DD8C4** + the welcome line. The strip's `role="group"` / `aria-label="Lifetime stats"` exposure unchanged both states; accent is not-color-alone (count is text).
- **Copy = SKY-WORDING** (slate example ships; Sky may re-word any time).
- **NEEDS-SKY-DEVICE:** Safari + VoiceOver pass of the strip.
- Captures: `captures/p2/after/q10-title-{fresh,seeded}__1440.png`.

### M5a — favicon recolor + raster fallbacks → `350f8bb`  ✅ verified / device-pending
- **Change (SD-7 recolor-only):** `favicon.svg` `#06f3ff`→`#3DD8C4` (body/tail/2 pupils), `#0a0118`→`#0E1116` (bg); `#ffffff` eyes unchanged. Generated `favicon-32.png`, `favicon-180.png` (apple-touch), `favicon.ico` (16/32/48 PNG-in-ICO) from the recolored SVG; wired SVG + PNG + apple-touch + ICO `<link>` tags (Ledger L2: tags + files same commit).
- **Geometry PROTECT proven:** BEFORE vs AFTER with fills+comments stripped → **zero diff** — the favicon↔mascot geometry chain is byte-identical (recolor + comment only).
- **Verified (Chromium):** all four icon files fetch **200**; the 180px render is the recolored teal mascot on `#0E1116`; ICO is a valid 3-image resource (`file(1)`).
- **NEEDS-SKY-DEVICE:** real-Safari tab/bookmark render (macOS + iOS) — the rig is Chromium-only and can't confirm the PNG/ICO fallback displays on WebKit.

### M5b — OG card (GATED → Sky picked A) → `c4b06dc`  ✅ verified / re-scrape pending
- **Gate:** 3 typography-only candidates (A editorial / B terminal-window / C split) rendered 1200×630, all <100KB, calm graphite + one teal accent, existing/approved copy only. **Sky picked A (editorial).**
- **Change:** exported A as `og-image.png` (**91,984 B**, down from 323,598 B); rewrote `og:image:alt` + `twitter:image:alt` to describe the actual card and **drop the false "Phantom mascot" claim** (L1-F2) in the same commit. Card = typography-only (mascot-inclusion question stays Sky's; no Phantom added).
- **Verified (Chromium, tool 07 social-card harness):** the card + `og:title` + `og:description` all read "calm terminal-command trainer / 56 cards / Claude Code · macOS · Git" — **words and picture agree**; no contradiction, no mascot in frame or alt. Only remaining "mascot" mentions are the in-game Phantom element + the favicon geometry comment (legitimate).
- **NEEDS-SKY-DEVICE / post-deploy (Ledger L1):** social scrapers cache the OLD card — re-scrape after deploy.
- Captures: `captures/p2/og-candidates/og-{A_editorial,B_terminal,C_split}.png`; harness `assets/preclick/social-card-harness__dark__1000.png`.

---

## PROTECT-ACTIVE recaptures (§7) — all held

| Surface | Result |
|---|---|
| 375 title reflow (no orphaned HELP) | ✅ orphan gone; line holds (Q1 captures) |
| Byline footer verbatim + `rel="noopener"` + two-line title pitch | ✅ **byte-unchanged** — not present in the diff |
| Pause dim + game-over fade byte-parity (M4 law) | ✅ pause settled sha `5679d11d…` before==after; transition identical |
| Deck-load failure floor (DECK UNAVAILABLE) | ✅ untouched — "Couldn't load the command deck…", START disabled (`protect-deck-floor__1440.png`) |
| Favicon↔mascot geometry (recolor, never redraw) | ✅ fills+comments-stripped diff = zero (geometry byte-identical) |
| Seeded lifetime-stats strip (Q10 touches deliberately) | ✅ before/after captured; `role="group"`/aria unchanged; accent added |
| 1440 + 768 compass-diamond geometry (Q5 global swap) | ✅ token boxes stable across the font swap (dW ~0.4, dH 0) |
| `[EXPLAIN-TEXTCONTENT]` / `[PERSIST-ADDITIVE]` / `[LIFELINE-SESSION-ONLY]` | ✅ no innerHTML for card text; no new gc.v1 key; lifelines untouched |

---

## Conservation table (§10)

| ID | Status | Commit |
|---|---|---|
| Q4 | **CLOSED** | `dcd858e` |
| Q1 | **CLOSED** (Fork C = KEEP; mocks rendered) | `9e5c46d` |
| Q2 | **CLOSED** (+ share-string follow-up) | `8f32c49` (+`c24f34c`) |
| Q5 | **CLOSED** | `3c9c438` |
| M4 | **CLOSED** | `15838b9` |
| Q10 | **CLOSED** (SKY-WORDING) | `e48e310` |
| M5 | **CLOSED** — M5a favicon `350f8bb`; M5b OG **PICKED A** `c4b06dc` | — |

Nothing silently dropped. Fork C = KEEP (picked). Fork D = NO/keep-generic (picked). OG-card gate = **RESOLVED (A)**. Q10 wording = SKY-WORDING.

---

## Deviations from the approved plan (transparency)

1. **Q2 share string (`c24f34c`)** — the approved plan explicitly scoped the copy-result share string OUT ("not an on-screen label"). During close-out I found it emitted `"… · MAC deck"` while the unified UI shows "TERMINAL" — a user-visible contradiction that undermines Q2's goal. I routed it through the same map so a shared result reads "TERMINAL deck". **This is the one change beyond approved scope; it's an isolated, trivially-revertible commit — drop it if you prefer the original scoping.**

---

## Device checklist restated for Sky (NEEDS-SKY-DEVICE — Chromium can't confirm these)

- **M5a:** Safari favicon render — SVG-only previously likely showed no icon; verify the new PNG/ICO fallback renders in Safari tab/bookmark (macOS **and** iOS).
- **M5b (post-deploy):** re-scrape the social unfurl (LinkedIn/Slack/Twitter cache the old card).
- **Q5:** real Safari/WebKit cold-cache load — confirm no layout shift on HUD digits/command tokens (Safari font-loading differs from Chromium).
- **M4:** real-Safari repaint timing of the sequenced title→board swap.
- **Q10:** Safari + VoiceOver pass of the welcome-back strip (aria group unchanged; the new line reads sanely).
- **Q4:** older-WebKit / non-Chromium spot-check of the wordmark fallback.
- **Q1/Q10:** iPhone look of the title via LAN server.

---

## Capture manifest

- `captures/p2/before/` — BEFORE title stills (fresh+seeded ×3 widths) + `og-image__BEFORE.png` + `favicon__BEFORE.svg`.
- `captures/p2/after/` — per-item AFTER (Q4 wordmark, Q1/Q10 titles, Q2 HUD, deck-floor).
- `captures/p2/forkC/` — Fork C keep-vs-remove mocks (@1440/768).
- `captures/p2/m4/{before,after}/` — opening-run frames + timelines + summary.json + pause/gameover settled.
- `captures/p2/og-candidates/` — the 3 OG candidates (A chosen).
- `assets/preclick/social-card-harness__dark__1000.png` — regenerated (tool 07) with the new card + alt.

---

## Adversarial verification (close-out skeptic pass)

Two independent adversarial reviewers re-read the full `b5c3a50..HEAD` diff at every use site and ran the green gate, tasked to REFUTE the claims.

**Skeptic B — Q5 / Q2 / Q4 / PROTECT → NO BUG, NO REGRESSION.** All CONFIRMED-OK. It *empirically re-fetched the live css2 endpoint* and byte-confirmed the preload URLs (Inter `…Q5nw.woff2` under `s/inter/v20/`, JetBrains `…nk-4.woff2` under `s/jetbrainsmono/v24/`) match what the page requests — preload is used, not wasted. `CATEGORY_LABELS` is initialized before every consumer (no TDZ); Q4 grammar valid + De-Morgan-correct; byline `rel=noopener`, two-line pitch, deck floor, textContent-only, and no-new-gc.v1-key all intact. Two **non-blocking** notes, both already accounted for: (1) the bottom-bar toggle labels are hardcoded HTML (a second source of truth — currently matches the map exactly, per the slate's "keep the toggle" direction; drift risk only), and (2) the Q5 preload carries a benign wasted-download/console-warning risk if Google ever bumps the font version (documented Q5 residual). Neither is user-visible.

**Skeptic A — M4 / motion → NO FUNCTIONAL BUG.** All 4 claims CONFIRMED-OK (it instrumented the live transition and traced every edge case — ESC during the swap window, double-start, restart-with-title-already-hidden, rAF re-enabling the transition, stale-class-on-re-show): double-exposure eliminated (maxDE 0.25→0; the board is NOT delayed — the game is turn-based with no timer/countdown), pause + game-over byte-identical (not in the diff; sha + computed transitions match), RM instant swap unchanged, and the helper classes can never reach pause/game-over. It surfaced ONE **LOW / no-visible-impact** nit: the beat-2 `requestAnimationFrame` cleanup doesn't run while the tab is backgrounded mid-swap (rAF frozen), leaving the (invisible, never-re-shown) title's helper classes stale until refocus. **Fixed → `78d605a` (M4-harden):** dropped the deferred rAF entirely (a net simplification); re-verified maxDE 0 / RM 0 / pause sha `5679d11d…` unchanged.

**Net: both skeptics found no correctness bug and no PROTECT regression.** The single actioned finding (M4 rAF fragility) was hardened; every other note is non-blocking and documented.

## Stop

Green gate clean after every item (56/56, inline-script `node --check` OK, 0 console errors). Every phase law satisfied and evidenced. Diff = intended files only. **STOP on `uplift/p2-frontdoor`.** No merge / push / build / deploy / DNS — Sky's hands.

> **ff-only merge-order reminder:** merging this tip fast-forwards `main` through **P1 and P2** — merge in train order (P1 → P2). Serial per project: no other phase runs while this branch is open.
