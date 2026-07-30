# DEVICE-GATE-CHECKLIST.md — Ghost Code UPLIFT (consolidated, P6 close-out)

> Every capture in this entire train is **Chromium** (Playwright 1.61.1 / Chromium 1228, headless) —
> NOT Safari/WebKit. This is Sky's first real Safari/VoiceOver/iPhone look at the whole slate. 28
> items below, deduped from all five phases' §8 device-check lists and every NEEDS-SKY-DEVICE tag in
> `reports/P1-verification-evidence.md` through `P5-verification-evidence.md`. Ordered as **one
> efficient session**: grouped by screen so you aren't bouncing, and clustered by OS setting so each
> toggle (Reduce Motion, VoiceOver) happens once and covers everything it touches.
>
> Run this against the **LIVE site** post-deploy (`DEPLOY-CHECKLIST.md` step 8, item L6), or on the
> LAN pre-merge (`python3 -m http.server` + your iPhone/Mac Safari on the same network) if you want a
> pre-flight look first. Nothing below has been checked off yet — this is the open list.

## 1 · Cold-cache first (do this before anything else warms the cache)

| # | Item | What to check | Expected result | Verifies |
|---|---|---|---|---|
| 1 | Fresh Safari **private** window, first load | Watch the HUD numerals + command tokens as fonts swap in | No visible reflow/jump as Inter/JetBrains Mono finish loading; the metrics-matched fallback holds token/HUD layout steady during the swap | Q5 |

## 2 · Default-settings Safari walk (one continuous session, no OS toggles yet)

| # | Item | What to check | Expected result | Verifies |
|---|---|---|---|---|
| 2 | Title screen, **fresh** profile | The "? HELP" controls line | Wraps only at a separator (` · `), never splitting a key+label pair mid-word | Q1 |
| 3 | Title screen, **seeded** profile | Lifetime stats strip + controls line | Stats strip populated; Q1's fix still holds with the strip present; MASTERED numeral present | Q1, Q10 (setup) |
| 4 | Title screen, seeded, `mastered>0` | The returning-player line | Accented MASTERED numeral (#3DD8C4) + static "Welcome back — pick up where you left off" line; fresh profile shows neither | Q10 |
| 5 | Title screen | Wordmark rendering | Renders normally (the `@supports` De Morgan fix is a fallback-path correction; Safari should take the modern `background-clip:text` path and look unchanged) | Q4 |
| 6 | Browser tab + bookmarks bar | Favicon | Correct teal-recolored icon shows in the tab and when bookmarked (SVG primary, PNG/ICO fallback chain) | M5 |
| 7 | Press START | Title→board transition | Clean cut, no double-exposure (title and board text never both visible at once) | M4 |
| 8 | Gameplay, miss then get a fresh card | Focus ring on a previously-wrong token | Reads neutral slate, not the default teal `:focus-visible` ring | Q6 |
| 9 | Gameplay | SPIRITS heart glyph + 50/50 slashed-circle | Both render as real glyphs (not tofu/missing-character boxes); slashed-circle appears after using the 50/50 lifeline | Q7 |
| 10 | Learn mode @1440 (wide window) | Diamond + bottom bar reachability | Scrollable via `body.learning-mode #cabinet` when content is tall; arcade hero @1440 stays non-scrolling | Q3 (Q3b) |
| 11 | Settings modal @iPad width (~768–819px, e.g. iPad Safari or a resized window) | SETTINGS modal fit | Un-clipped; wrapped 2-row bar fits inside the grown cabinet; no tap-target shrink | Q3 (Q3a) |
| 12 | Lose a run (let spirits reach 0) | Missed-review box | Overflow → top/bottom fade cues + "↓ more"; scroll to bottom → top fade shows, last item fully readable, cues clear | M3 |
| 13 | Lose a run with misses present | Game-over buttons + badge | DRILL MISSED is the filled/bright primary button; PLAY AGAIN is the secondary outline button; a flawless run instead keeps PLAY AGAIN primary | S3 |
| 14 | Lose a run with per-category misses | This-run mastery credit | "+N this run" chip + hatched sliver beside each lifetime mastery bar; "You answered N of M correctly this run." summary line | M6 |
| 15 | Start a drill (DRILL MISSED) | Drill badge + HUD | "DRILLING MISSES · cleared of N" badge visible; HUD stays single-row @375 | S3 |

## 3 · Reduce Motion ON (System Settings → Accessibility → Motion, or Safari's own reduce-motion — toggle ONCE, cover all three)

| # | Item | What to check | Expected result | Verifies |
|---|---|---|---|---|
| 16 | RM ON, fresh load, lose a card immediately | The wrong-answer judgment-class clear | **CRITICAL — the train's single largest outstanding correctness risk.** The wrong-token's red/incorrect state clears in the SAME repaint as the next prompt appears — no stale "wrong" visual lingering into the next card. This closed on Chromium **non-reproduction**; this is its first real-device check. | M2 |
| 17 | RM ON, trigger a correct answer (S1 held-win state) | The held win beat | Static held green + checkmark shown (no dissolve motion); the "+N" and full-command burn-in appear without animating in | S1 |
| 18 | RM ON, title screen | Title Phantom | Static materialized figure, no float; fully visible (opacity 1), never fades to nothing | S2 |
| 19 | RM ON, game-over screen | Game-over Phantom | Static held figure, no float/pulse motion | S2 |

## 4 · VoiceOver ON (toggle once, cover all four)

| # | Item | What to check | Expected result | Verifies |
|---|---|---|---|---|
| 20 | Pause the game (Esc) | Pause dialog announcement | Announces as a modal dialog; RESUME is reachable and is the sole focusable element while paused; board content is excluded from swipe navigation | Q8 |
| 21 | Game-over with this-run credit | Mastery bars + chips | This-run credit chips + Learn-mode MASTERED progressbar announce sensibly (values, not just visual) | M6 |
| 22 | Game-over / drill mode | Review box + drill badge | Missed-review list and drill badge/row announce in a sensible reading order | M3, S3 |
| 23 | Title screen, seeded profile | Welcome-back line + MASTERED numeral | Both read correctly via VoiceOver — confirms the accent isn't the ONLY signal (not color-alone) | Q10 |

## 5 · iPhone Safari @375 (real device, not a resized desktop window)

| # | Item | What to check | Expected result | Verifies |
|---|---|---|---|---|
| 24 | Touch play, arcade | Diamond token tap targets | All 4 tokens tappable without overlap or mis-taps; capture-lunge reads clearly on a small bright screen | M1 |
| 25 | Title + game-over | Phantom "feel" | Does the restraint (single materialize / gentle float-pulse) read right at phone size and brightness? Note: a known **pre-existing** ≤600px eye-overlap residual exists (both eyes render as one blob at this breakpoint) — confirm whether it reads as more/less noticeable on real hardware vs. the Chromium captures. Not S2's to fix; recorded for Sky's own Design Compiler call. | S2 |
| 26 | Lose a run | Re-weighted game-over buttons | DRILL MISSED / PLAY AGAIN sizing and spacing hold at 375; no cramping | S3, M6 |

## 6 · Real-keyboard latency (desktop, physical keyboard — timing reads differently than a scripted CDP press)

| # | Item | What to check | Expected result | Verifies |
|---|---|---|---|---|
| 27 | Answer correctly (arcade 750ms / learn 1200ms auto-advance windows) | Pacing feel | Neither rushed nor sluggish; enough time to register the feedback before the next card | Master §6 pacing fence |
| 28 | Trigger S1's held-win beat repeatedly | Held-state timing | Reads as an intentional beat, not a glitch or a stutter, across several real keypresses in a row | S1 |

## 7 · Full-site Safari/WebKit visual pass

Independent of the itemized list above: one continuous click-through of the whole game in Safari,
since **every capture this entire train has ever produced is Chromium.** Look for anything that reads
differently from the captures in `reports/captures/p1/` through `p6/` — spacing, font rendering,
glyph fallbacks, focus rings, scrollbar behavior (M3's overflow fades in particular, since Safari's
scrollbar/overflow behavior has historically differed from Chromium's).

---

**Sourcing:** every row above traces to a `NEEDS-SKY-DEVICE` tag in `reports/P1-verification-evidence.md`
through `P5-verification-evidence.md`, a §8 device-check list in `1.md`–`5.md`, or `00_master.md` §5
SKY-PREP item 8. Nothing has been checked off — this is the open list as of P6 close-out
(2026-07-29). None of this train has had a real-device pass yet.
