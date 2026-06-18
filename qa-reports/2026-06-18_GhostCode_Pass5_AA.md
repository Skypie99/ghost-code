# Ghost Code — Pass 5: WCAG 2.2 AA Sweep

**Role:** Alex (accessibility) · **Date:** 2026-06-18 · **Branch:** `alex/ghost-pass5-aa-2026-06-18` (off local `main@3606978`)
**Scope:** The accessibility finishing pass over the Pass 1–4a modernization (plan §9/§10, `~/.claude/plans/opus-4-8-ultracode-nested-parasol.md`). Single file: `index.html` (inline CSS+JS).
**Status:** Built + behaviorally verified in Chromium preview. **NOT merged, NOT pushed** — origin/main is 6 commits behind; deploy is held for Sky. Routes through Dani's Design Compiler + Sky's cross-engine/device + screen-reader check before UI-DONE (Const. Art. 2.4).

---

## Scoping correction (caught before any edit)

An initial scout computed several "contrast failures" against the old neon hex (`#e6237f` etc.). **Those were invalid.** Pass 3 (`7188ceb`) already swapped the palette to graphite + one teal accent and *remapped the old variable names* (`--neon-pink → border-strong`, `--neon-cyan → accent`, lines 71–80), and force-hides the CRT layers (`#grid,#scanlines,#vignette { display:none !important }`, line 134). Pass 3's commit notes it "fixes the old AA failures by construction (token text ~12:1)." So this pass re-read the live file fresh and focused on the **non-contrast** AA gaps that were genuinely open.

---

## What changed (findings → fix)

| # | Finding (was) | Fix (now) | WCAG |
|---|---------------|-----------|------|
| 1 | **Arrow keys did nothing.** Only number keys 1–4 (which *answer*) and Tab reached tokens. No way to navigate the N/E/S/W diamond by arrows. | Added `↑→↓←` → **move focus** to the N/E/S/W token (then Enter/Space captures). Distinct from number keys, which still answer directly. Skips eliminated/empty tokens. | 2.1.1 Keyboard |
| 2 | **Focus could escape behind full-screen overlays.** The title and game-over screens cover the board, but `#arena` + `#bar` stayed in the tab order — a keyboard/SR user could Tab onto hidden/stale tokens and controls. | Added `setBoardInert()`; `#arena` + `#bar` are set `inert` while the title or game-over screen is up, and cleared on play. (Pause is intentionally left interactive — the PAUSE button resumes, and `answer()`/lifeline already guard on `state.paused`.) | 2.4.3 Focus Order |
| 3 | **No keyboard-shortcuts help.** The title hint vanished once play started; no in-game reference. | New `?` **shortcuts dialog** (`role="dialog" aria-modal="true"`, labelled by its `<h2>`). Opens with `?`, closes with `?`/`Esc`/CLOSE/scrim-click. Focus moves to CLOSE on open, is trapped while open (the rest of the cabinet is `inert`), and is restored to the trigger on close. Flat/tokenised styling, no backdrop blur — matches Pass 3. | 2.1.1, 2.4.3, 4.1.2 |
| 4 | **No Windows High-Contrast support.** Zero `forced-colors` handling; the graphite palette could vanish in forced-colors mode. | Added `@media (forced-colors: active)`: system-colour borders on tokens/buttons/panels/mastery track, `Highlight` focus rings + selected states, and the ✓/✗ outcome glyphs forced to `CanvasText` so meaning survives the colour loss. | 1.4.1, 1.4.11 |
| 5 | **Run-results block had no SR grouping.** The accuracy/correct/streak row on game-over was an unlabeled `div` (mastery + missed-review already had labels). | `role="group"` + `aria-label="This run"` on the stats row. | 1.3.1 |
| 6 | **Stale metadata + alt text.** `theme-color`, page/OG/Twitter descriptions, and `og:image:alt`/`twitter:image:alt` still described a "neon … synthwave arcade cabinet" (pre-Pass-3). | Updated `theme-color` to `#0E1116`; rewrote the alt text + descriptions to describe the calm, modern terminal-style design. | 1.1.1 (alt text); rest is metadata honesty |
| 7 | **Reduced motion** | Confirmed the global `prefers-reduced-motion` rule (line ~1043) already neutralises animation/transition durations; added `scroll-behavior: auto` for completeness. | 2.3.3 |

All changes are additive and tokenised (no raw hex except the modal scrim `rgba(8,11,16,.82)` and the system-colour keywords required by `forced-colors`).

---

## Verification (Chromium preview, localhost:8080)

Green gate: `node --check cards.js` ✓ · inline `<script>` `node --check -` ✓ · `node test/cards.test.js` → 56 cards ✓. No console errors on load.

Behavioral (via dispatched events + state inspection):
- **Load:** `#arena.inert` + `#bar.inert` = true (title up); modal present + hidden. ✓
- **`?` dialog:** opens (`visible`), `#cabinet.inert` = true, focus on CLOSE, Tab stays trapped on CLOSE; `role=dialog`, `aria-modal=true`, labelled by `#sc-title`; 9 shortcut rows. Renders correctly at desktop **and** 375px mobile (screenshots captured). ✓
- **Esc closes** the dialog and clears `#cabinet.inert`. ✓
- **Start game:** board inert cleared (`#arena`/`#bar` false), tokens have values. ✓
- **Arrow keys:** `→` focuses the E token, `↑` focuses the N token, and `state.busy` stays `false` (focus moved, did **not** auto-answer). ✓
- **Game over:** `#arena`/`#bar` inert again; stats row has `role=group aria-label="This run"`. ✓
- **CSS live:** `forced-colors`, `prefers-reduced-motion`, and `#shortcuts-modal` rules all present in the parsed stylesheet. ✓

---

## Already-compliant (protected, not touched)

- Outcome is never colour-alone — ✓/✗ glyphs + numbered positions (lines 603–604, 1287–1290).
- `:focus-visible` rings already on tokens/buttons/mode-toggle/big-btn (teal, ~9.8:1).
- `#a11y-announcer` live region already wired through correct/wrong/reveal/pause/lifeline + learn-mode phase changes (so no duplicate announcements were added).
- Token `aria-label`s carry the command text per card (line 1572).
- Tap targets ≥ 24px (`.mode-btn` min-height 32; `.btn`/`.big-btn` padding clears 24 at mobile sizes).
- `prefers-reduced-motion` already neutralises animations/transitions globally.

---

## DECISIONS FOR SKY / residual checks (cannot be done from Chromium)

1. **Real-device + screen-reader pass** — VoiceOver (iOS) / TalkBack (Android): confirm the `?` dialog is announced as a modal, focus is trapped, and arrow-to-focus + Enter reads naturally. (Part of the cross-engine check the overhaul already needs before deploy.)
2. **Windows High-Contrast** — verify the new `forced-colors` block on an actual Windows high-contrast theme (Chromium preview can't emulate it).
3. **Binary assets NOT fabricated** — `favicon.svg` and `og-image.png` may still depict the old synthwave look. I corrected the **alt text/metadata** only; the images themselves should be re-exported from the redrawn (Pass 3) Phantom. Flagging, not generating.
4. **Design Compiler (Dani)** — this pass adds a new UI surface (the dialog); route through the 7-layer gate before UI-DONE.
5. **Deploy stays held for Sky** — branch only; `origin/main` unchanged.

---

*Branch-only, no merge/push (Const. Art. 1). Green gate green. index.html: +157 / −7.*
