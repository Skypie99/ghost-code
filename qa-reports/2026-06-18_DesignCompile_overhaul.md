# Design Compiler — Ghost Code overhaul (Passes 3 / 4a / 4b + Pass 5 dialog)

**Role:** Dani (Creative Director) · **Date:** 2026-06-18 · **Const. Art. 2.4 — 7-layer compile gate**
**Subject:** the UI-defining/UI-touching work now on local `main` (`1ab5b92`): Pass 3 visual system, Pass 4a results screen, Pass 4b settings/difficulty/drill, Pass 5 a11y dialog/forced-colors.
**Method:** read-only, 6 parallel layer audits + a compile decision (run on Sonnet). Grounded in `index.html`.

## COMPILE DECISION: 🔴 BLOCK · Luxury 7/10
One ship-stopper. The Pass 3 design backbone is genuinely strong (graphite 3-surface hierarchy, single teal accent + disciplined semantic color, Inter/JetBrains Mono, tabular numerals, the Phantom) — but a keyboard-a11y failure in the Settings dialog blocks UI-DONE until fixed. Fix is ~5 lines. After it, the project is shippable with the polish list as a follow-on.

### Per-layer
| Layer | Verdict | One-line |
|---|---|---|
| 1 Tokenization | POLISH | Token backbone solid; 3 dead `text-shadow` lines, 2 unregistered hex (`#5fe6d4`, `#BFF5EE`), systemic spacing-token gap. None break rendering. |
| 2 Accessibility Parity | 🔴 **BLOCK** | **Settings modal Tab handler traps all Tab on CLOSE → the 7 seg controls are keyboard-unreachable (WCAG 2.1.1).** All new contrast ratios + target sizes pass AA. |
| 3 Component Consistency | POLISH | Duplicated modal open/close JS; `.seg__btn` re-implements `.btn` without a shared base; stat-label pattern triplicated. No blockers. |
| 4 Visual Entropy | POLISH | Consistent 2px off-grid values (gaps/margins) on the new surfaces violate the 4px scale; rhythm soft, nothing broken. |
| 5 Luxury UI Score | POLISH (7/10) | Strong craft; held back by the 3 dead text-shadows, the infinite-blink CTA, and the 8px/7px learn-badge below Pass 3's own 12px floor. |
| 6 Regression Safety | POLISH | Two silent regressions: duplicate `#sky` rule restores synthwave purple at large viewports; `finalScore.textContent` strips the `.word1` gradient span. |

## 🔴 BLOCKER (must fix before UI-DONE)
- **Settings modal keyboard trap** (`index.html` ~line 2371, Pass 4b). The Tab branch unconditionally redirects every Tab to `#set-close`, locking out all seven `.seg__btn` controls. **Fix:** replace with a focus cycle over all `#settings-modal button`s (forward/back wrap-around). _(Root cause: mirrored Pass 5's shortcuts-dialog Tab handling, which is correct there because that dialog has only a CLOSE button.)_

## Top polish (prioritized, non-blocking — propose as a follow-on)
1. **Regression — duplicate `#sky`:** the Pass 3 calm radial is overridden by the leftover synthwave purple gradient (later same-selector rule wins) → purple visible at large-viewport edges. Remove the old block / fold into the Pass 3 rule.
2. **Regression — `finalScore.textContent`** replaces the `.word1` span → game-over score loses its gradient. Use `.querySelector('.word1').textContent`.
3. **`.blink` infinite CTA pulse** on PRESS START / PLAY AGAIN — the biggest retro holdover in a calm design; make it a one-shot, drop the loop.
4. **Delete 3 dead `text-shadow` declarations** (`#streak .val`, `#prompt-text`, `#learn-badge`) — suppressed by the global kill rule but contradict the system.
5. **Promote `#5fe6d4` → `--accent-hover`** (the only raw hex in the actively-painted UI).
6. **Raise `#learn-badge` font 8px/7px → 11px/10px** (below Pass 3's own 12px floor).
7. **Snap off-scale 2px gaps/margins** on results/mastery/title-stats to `0`/`var(--space-1)`.
8. **`role="group"` + `aria-label="Lifetime stats"`** on the `.title-stats` strip (3 unlabeled cells otherwise).
9. **Missed-review heading `<p>` → `<h3>`** so SR heading-navigation finds it.
10. **Add `.big-btn` + `.missed-review` to the forced-colors border rule** (moderate confidence — Chromium-only).
Plus: promote `--accent-subtle` (#BFF5EE), `--surface-track/-hover` alpha tokens, route `kbd`/`#learn-badge` radius + the ✓/✗ glyph font through tokens, and broadly adopt the `--space-*` scale.

## ESCALATE to Sky (cannot be settled from Chromium)
- **VoiceOver (macOS/iOS):** verify `aria-pressed` segmented controls, `role=progressbar` mastery bars, the results `role=group`, both modals (focus-trap/`aria-modal`), and arrow-key token focus read naturally.
- **Windows High Contrast (real device):** confirm `.big-btn` (PRESS START / PLAY AGAIN) and the `.missed-review` boundary don't vanish (flagged as possibly missing the `CanvasText` border).
- **Safari/WebKit (real device):** the title `-webkit-background-clip:text` gradient, the modal scrim stacking, and any `color-mix()` if adopted.
- **TalkBack (Android WebView):** focus-trap + `aria-modal` behavior on the dialogs.

## Outcome
**BLOCK** → blocker + the two regressions proposed as fixes on `fix/ghost-code-designcompile-fixes-2026-06-18` (see that commit). Re-compile after merge expected **PASS** (with the polish list optional). Cross-engine/real-device checks above remain required before UI-DONE / deploy.

---

## RE-COMPILE — 2026-06-18 (after the fixes + polish landed on main `6a5d685`)
**Re-run on an Opus agent. DECISION: 🟢 PASS · Luxury 8/10 · prior BLOCKER resolved.**

Verified in current code:
- **Blocker cleared** — the Settings dialog Tab handler now cycles focus through all 8 dialog buttons (7 `.seg__btn` + CLOSE) with shift-aware wrap-around (`index.html` ~2373–2383). All Sound/Motion/Difficulty controls are keyboard-reachable → WCAG 2.1.1 satisfied.
- **Regression 1 fixed** — exactly one calm `#sky` rule remains (the synthwave purple duplicate is gone).
- **Regression 2 fixed** — `gameOver()` writes into the `.word1` span, preserving the score gradient.
- **Polish all confirmed** — new tokens defined + consumed (no stray painted-UI hex), finite 3-pulse CTA, `#learn-badge` 11/10px, dead text-shadows removed, `.title-stats role=group`, missed-review `<h3>`, forced-colors covers `.big-btn`/`.missed-review`. The one extra token-drift nit the re-compile caught (`.phantom-head` gradient still raw `#BFF5EE`) was then fixed → `var(--accent-subtle)` (this commit), so painted UI is fully tokenized.

Per layer: L1 PASS · L2 PASS (Chromium) · L3 POLISH (deferred component-consistency debt — non-blocking) · L4 PASS · L5 8/10 · L6 PASS. **No remaining blockers.**

Remaining = optional follow-on (factor the duplicated modal logic / shared `.btn` base for `.seg__btn`; broad `--space-*` adoption) + the standing **Sky-gated real-device checks** (VoiceOver/iOS, Windows High Contrast, Safari/WebKit, TalkBack) before deploy. **UI-DONE for Chromium.**
