# P1 "The Floor" — Verification Evidence

**Branch:** `uplift/p1-floor` · **Base:** `main` @ `9789d1a` (handshake clean, no drift)
**Executed:** 2026-07-17, Opus 4.8 ultracode (Sky-fired window; SD-8). Capture rig: Playwright/Chromium 1228
(the audit engine), `PW_PREFIX` outside the repo, `python3 -m http.server 8123`. **All captures are Chromium —
NOT Safari/WebKit; Sky's device pass is the only Safari truth.** Captures: `build-plan/reports/captures/p1/`.

## Result: all 5 CRITICALs closed; Q3 SPLIT-closed; green gate clean; PROTECT surfaces intact.

| ID | Finding(s) | Status | Commit |
|---|---|---|---|
| M2 | L4-F1 reduced-motion stale judgment (CRIT) | **CLOSED** — verified non-repro + documented + SD-9 | `6d150c4` |
| Q9 | L6-F3 8px HUD labels (MED) | **CLOSED** — 10px floor | `4290195` |
| Q3a | L5-F4 768 SETTINGS clip (HIGH) | **CLOSED** — cabinet grow (601–819) | `71bff76` |
| M1 | L2-F1/F2, L5-F1/F2/F5 diamond collapse + occlusion + fold (4×CRIT + HIGH) | **CLOSED** — candidate C + fold relief | `b300b41` |
| Q3b | L4-F4 1440 learn grow-jump/bar clip (MED) | **CLOSED** — learn-mode cabinet scroll | `b5c3a50` |

Green gate PASS after every item (`node --check cards.js` · inline `<script>` check · `node test/cards.test.js`
56/56 · browser smoke **0 console errors** across arcade + learn + category + 50/50). `git diff 9789d1a..HEAD`
touches **only `index.html`** (+53/−6). Ledgers + captures live in the untracked `design-reviews/` tree.

---

## M2 — same-paint judgment-class clear (verified-already-correct + SD-9)  ·  `verified`
**The finding does not reproduce at per-frame resolution.** A `requestAnimationFrame` recorder logged the prompt
text + every token's judgment class on **every rendered frame** across all card-advance paths, both reduced-motion
routes:

| Path | RM route | frames | stale frames |
|---|---|---|---|
| arcade wrong → next | CDP `prefers-reduced-motion` | 189 | **0** |
| arcade wrong → next | in-app `body.reduce-motion` | 163 | **0** |
| arcade correct → next | CDP | 78 | **0** |
| learn correct → next | CDP | 101 | **0** |
| learn reveal → next | CDP | 46 | **0** |
| (normal-motion control) | — | 162 | **0** |

In every case the advance frame (new prompt) already shows all tokens cleared (`tk=[-,-,-,-]`). `renderCard`'s
`classList.remove('correct','wrong',…)` runs in the **same synchronous paint** as the prompt swap (`DOM.promptText`)
and the token-text swap — the exact end-state the M2 proposal specifies is already met. Most likely f029 was a 3fps
sampling/compositing artifact (the report's own honest-coverage caveat flags this class). **Change = a documenting
comment only** (no behavioral change), annotating the clear as the **SD-9 anchor**. `[SD-9]` = `renderCard()`'s
token-reset loop; **P3/S1 must terminate its held win-state in THIS clear.**
- Evidence: `captures/p1/before/m2-*-framelog.json`, `m2-rm-{cdp,inapp}-{held,after}__dark__1440.png`.
- **NEEDS-SKY-DEVICE:** real OS-level Reduce Motion (CDP emulation ≠ the OS setting; the audit also used CDP/in-app, not OS).

## Q9 — HUD label floor  ·  `verified (measured)`
8px → **10px** (portrait `≤600` + landscape `max-height:500px` twins). Probe: 10px is the **largest** size that
holds the single-row 375 HUD; 11px wraps it to 2 rows. Size-only — contrast unchanged (~7.8:1). Verified 1-row +
no-overflow at 375×812 and 740×380 (computed `fontSize=10px`, `labelRows=1`).
- **Q9 FLOOR = 10px** → P4's DRILL badge and P2's `MAC→TERMINAL` relabel must respect this (master LAWS 5 & 8).
- Evidence: `captures/p1/after/q9-hud-{375-portrait,740x380-landscape}.png`.

## Q3a — 768 SETTINGS un-clip  ·  `verified (measured)`
The desktop `#bar` wraps to a 2nd row across **601–819px**; the fixed `height:min(780px,94vh); overflow:hidden`
cabinet severed SETTINGS (hard **11px clip @700**, corner-severed @768). Fix = **container sizing only** (per the
report's "tap targets must not shrink"): a new `@media (min-width:601px) and (max-width:819px)` grows the cabinet
(`height:auto; min-height:min(780px,94vh); max-height:96vh; overflow-y:auto`). Verified on the live file:

| width | SETTINGS | cabinet | arena (diamond) |
|---|---|---|---|
| 601/700/768 | **un-clipped** | grows 780→819 | **369 (unchanged)** |
| 819 | ok | 780 | flex-fills 424 |
| 900 / 1440 / 375 | ok | 780/763 | unchanged, `overflow-y:hidden` (untouched) |

Diamond preserved (already pinned at min-height in this band → no flex slack to lose). Evidence:
`captures/p1/after/arcade-board__dark__768.png`, `q3a-768-fixed.png`.
- **NEEDS-SKY-DEVICE:** real iPad-width Safari (flex-wrap + overflow-clip differ from Chromium; 768 is this bug's target class).

## M1 — ≤600 diamond de-collision (candidate C, Sky-picked) + fold relief  ·  `verified (measured)`
**Gate:** 3 within-diamond candidates rendered @375 with the longest card forced (`git-reset-head`). A (slim
phantom only) = **insufficient** (−2px, still overlapped → token-narrowing required); B (+22px, 3-line wrap); **C
(balanced, +10px, 2-line wrap) — Sky picked.** SD-5 held: `.n/.e/.s/.w` anchors untouched.

**De-collision (candidate C):** Phantom 42→36 / head 30→26 / glow 16→10px blur; E/W tokens
`clamp(124px,41vw,200px)`→`clamp(112px,37vw,165px)`. Phantom↔token clearance (was **−8px overlap**):

| 375 | 390 | 430 | 600 |
|---|---|---|---|
| +10px | +12px | +15px | +86px |

No overlap in any state; `:focus-visible` double-ring intact (2px @375/768/1440).

**Fold relief (L5-F5, learn ≤600 only):** compact the learn diamond (`body.learning-mode #arena`
`clamp(170px,30vh,270px)`) + cap the panel (38→32vh) + learn-mode cabinet scroll. **Pre-hint + retry1 show all
four tokens (incl. S) with no scroll** (S-visible=true; N↔phantom 10px / phantom↔S 30px — safe, no vertical
collision); retry2/reveal scroll (learn is untimed). Arcade keeps the full-size diamond (arena 399 @375 unchanged).
- **375 FOLD REFERENCE (for P3 re-run w/ S1 content):** at 375 learn, with the longest `card.answer` rendered,
  the S token is on-screen (initial view) in pre-hint + retry1; the arena compacts to ~244px in learn mode.
- Evidence: `captures/p1/m1-gate/{baseline,A_slim_phantom,B_gutter_narrow_tokens,C_balanced_hybrid}__{arcade,learn-reveal}-375.png`;
  `captures/p1/after/m1-arcade-longest__dark__375.png`, `m1-learn-prehint-longest__dark__375.png`.
- **NEEDS-SKY-DEVICE:** real-iPhone Safari 375 touch play (readability-at-speed with real fingers is the core-mechanic floor).

## Q3b — 1440 learn grow-jump + bottom-bar clip  ·  `verified (measured)` + one honest residual
At 1440 the reveal panel (~275px) pushed the diamond + bottom bar past the fixed 780px cabinet (bar fully
off-screen, diamond severed) in every learn phase. The 1440 hero diamond is PROTECTed (no compaction), so the fix
is the phase's established pattern: `body.learning-mode #cabinet { overflow-y:auto }` (general) → diamond + bar
always **reachable**. Verified: 1440 learn scrolls (scrollH 1060 > clientH 778), **bar fully reachable after scroll**
(barBottom 816 ≤ cabBottom 840); **1440 arcade untouched** (`overflow-y:hidden`); 375 learn fold still resolved.
- **1440 ZERO-SHIFT CHECK (for P3 re-run):** the diamond position across learn phases is **not** fully stabilized —
  the panel still grows (grow-jump ~185px). Reachability (L4-F4's core) is restored; a strict "never move" fix needs
  a panel overlay (structural), out of scope for this MED. P3 must re-verify the 1440 learn layout after S1 adds the
  burned-in command (taller reveal → more scroll, still reachable).
- Evidence: `captures/p1/after/q3b-1440-learn-reveal-scrolled.png`.
- **NEEDS-SKY-DEVICE:** real desktop/iPad Safari learn-mode scroll behaviour.

---

## PROTECT recapture (before/after) — all intact  ·  `verified (measured)`
- **1440 hero diamond:** phantom **64×80**, tokens **200px**, `overflow:hidden` — base values, untouched (all edits
  scoped ≤600 / learn-mode / 601-819).
- **768 healthy diamond:** phantom 64×80, tokens 200px preserved (Q3a `overflow-y:auto` is the intended SETTINGS fix;
  the diamond itself is unchanged).
- **:focus-visible double-ring:** 2px outline at 375 / 768 / 1440.
- **RM / forced-colors layer:** both CDP and in-app paths render post-M2 (comment-only change did not touch the RM layer).
- **capture-lunge spring, photosensitivity timers, aria-live announcer:** untouched by construction (no edits to the
  motion layer or the `setTimeout` windows; M2 explicitly left them as-is).
- Evidence: `captures/p1/after/protect-arcade__dark__{1440,768}.png`, `protect-rm-{cdp,inapp}-rm__dark__1440.png`.

## Device checklist restated for Sky (NEEDS-SKY-DEVICE)
1. **M1** — real-iPhone Safari 375 touch play (serve on the LAN); readability-at-speed with real fingers.
2. **M2** — real OS-level Reduce Motion spot-check (CDP ≠ OS).
3. **Q3a** — real iPad-width Safari 768 `#bar`/SETTINGS un-clip.
4. **Q3b** — real desktop/iPad Safari learn-mode cabinet scroll.
5. Quick VoiceOver pass over the arena (should be unchanged — confirm no regression).

## Commits (base `9789d1a` → tip `b5c3a50`)
```
6d150c4 M2  — same-paint judgment clear documented + SD-9 (verified non-repro)
4290195 Q9  — 8px HUD labels → 10px floor
71bff76 Q3a — 768 SETTINGS un-clip (cabinet grow, 601–819)
b300b41 M1  — ≤600 de-collision (candidate C) + learn fold relief
b5c3a50 Q3b — 1440 learn cabinet scroll (bar reachable)
```

## Design-Compiler note (Const. Art. 2.4)
This before/after capture set is the compile input. Routing to Dani's 7-layer gate is **Sky's step** — not
self-declared UI-DONE.

## STOP
Stopped **on `uplift/p1-floor`** at tip `b5c3a50`. No merge / push / build / deploy — Sky's hands.
**ff-only merge order:** merging this tip fast-forwards `main` through P1; merge in train order **P1 → P6**.
