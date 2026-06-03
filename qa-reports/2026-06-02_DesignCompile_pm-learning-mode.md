# Design Compiler Gate — Learning Mode

**Date:** 2026-06-02
**Branch:** burst/pacman-2026-06-02 (Phase P1)
**Feature:** Learning Mode (mode toggle, no-life-loss, 3-attempt hint escalation, answer reveal, mastery progress bar) — originally `shamus/pm-learning-mode-2026-05-29` (commit 83a63eb)
**Compiler:** Design Compiler v1.11 (Const. Art. 2.4)
**Decision:** **PASS** (after in-gate polish, applied on this branch)

---

## Executive Summary

Learning Mode shipped functional and smoke-tested (Shamus 13/13) but had **never passed the Design Compiler** — its report file was absent, so per Const. Art. 2.4 it could not be marked UI DONE. This gate found **two POLISH items** (token drift + keyboard focus order) and a redundant aria-live, all fixed on the burst branch, plus folded in Taylor's category-chip aria-labels. After fixes, all 7 layers pass. Verified live in-browser (Learn flow: pre-hint → wrong → retry → reveal → next), **0 console errors**.

---

## Layer 1: TOKENIZATION

**Found (POLISH):** 4 inline `style=` color/font overrides inside the JS-injected learn-panel HTML:
- `lp-hint` pre-hint → `style="color:var(--neon-cyan-soft)"` + a `<span style="font-family:'Press Start 2P';font-size:9px;color:var(--neon-cyan)">HINT</span>`
- reveal `lp-status` → `style="color:var(--neon-cyan)"`
- correct `lp-status` → `style="color:var(--gold)"`

Tokens themselves were valid (`--neon-cyan-soft: #7ee6f5` exists, line 39), but inline style attributes bypass the stylesheet and are unmaintainable.

**Fix applied:** introduced four modifier classes in the `#learn-panel` CSS block — `.lp-kicker`, `.lp-hint--cyan`, `.lp-status--cyan`, `.lp-status--gold` — and replaced every inline `style=` with a class. Verified: `getAttribute('style') === null` on the hint; computed colors match tokens (kicker `rgb(30,212,230)` = `--neon-cyan`, hint `rgb(126,230,245)` = `--neon-cyan-soft`).

**Result:** ✓ PASS (POLISH applied — zero inline styles remain in the panel)

---

## Layer 2: ACCESSIBILITY PARITY

**Found (POLISH — most substantive):** when the retry1/retry2/reveal panels were injected, the dot the user just activated was disabled (`pointer-events:none`) but **kept DOM focus** — a keyboard/SR user was stranded on a dead control with the new action buttons unannounced and unreached.

**Fixes applied:**
1. **Focus order** — focus `#lp-retry` after injecting a retry panel, `#lp-next` after injecting reveal. Verified live: after a wrong answer `document.activeElement.id === "lp-retry"`; after SHOW ANSWER `=== "lp-next"`.
2. **De-duplicated announcements** — `#learn-panel` carried `aria-live="polite"` *and* the app has a dedicated visually-hidden `#a11y-announcer`, so every event was announced twice (the panel re-reading button labels too). Removed `aria-live` from the panel (kept `role="region"`/`aria-label`), leaving the concise announcer as the single source. Restored the pre-hint announce in `renderCard` (`"Hint: …"`) so the spoken hint did not regress. Verified: announcer reads `"Hint: Same word you say after a coffee break."` on a fresh card.
3. **Category-chip labels (Taylor fold-in)** — added `aria-label` to ALL / CLAUDE / TERMINAL chips ("Show all command categories", "Show Claude Code commands only", "Show Mac terminal commands only"), keeping existing `aria-pressed`.

**Contrast:** `.lp-status--cyan` (#1ed4e6) and `.lp-hint--cyan` (#7ee6f5) on panel bg `rgba(10,1,24,0.88)` ≈ 9–12:1; `.lp-status--gold` (#ffd700) ≈ 13:1. All exceed AA.
**Reduced motion:** no new animation introduced; global `prefers-reduced-motion` reduce rule still covers the panel.

**Known cross-mode gap (out of scope, noted for a future phase):** card *prompts* are not announced in either Arcade or Learn mode (the `#prompt` block isn't a live region). Pre-existing; not a Learning-Mode-gate item.

**Result:** ✓ PASS (POLISH applied)

---

## Layer 3: COMPONENT CONSISTENCY

Panel action buttons (`#lp-retry`, `#lp-reveal`, `#lp-next`) reuse the shared `.btn` class — identical hover, `:focus-visible` cyan ring, and contrast as every other control. The mode toggle mirrors existing button styling and `aria-pressed` semantics. No bespoke one-off components.

**Result:** ✓ PASS

---

## Layer 4: VISUAL ENTROPY

`hideLearningPanel()` clears (`innerHTML=''` + removes `.visible`) before each show, so only one panel surface exists at a time — no stacking/competing overlays. The tokenization fix also **resolved a latent mismatch**: the cyan "THE ANSWER IS" and gold "CORRECT!" previously kept the base `.lp-status` *pink* glow (cyan/gold text + pink shadow). The new modifier classes set a matching glow (`text-shadow` now `rgb(30,212,230) 0 0 8px` on cyan), reducing visual noise.

**Result:** ✓ PASS (improvement)

---

## Layer 5: LUXURY UI SCORE

| Criterion | Score | Note |
|---|---|---|
| Spatial rhythm | 6/6 | Panel padding/gap consistent; reuses cabinet spacing |
| Restrained glows | 6/6 | Glows now color-matched (8px), no blow-out |
| Typography breathing room | 6/6 | VT323 22–26px body, Press Start 2P kicker — clear hierarchy |
| Motion purposefulness | 6/6 | No new motion; inherits reduced-motion coverage |
| Focus states | 6/6 | `:focus-visible` rings + deliberate focus routing to action buttons |
| Accessibility layer | 6/6 | Single announcer, focus order, AA contrast, aria-labels |

**LUXURY UI SCORE: 6/6** — up from the implicit ~5/6 pre-polish (inline styles + focus gap were the drag).

---

## Layer 6: REGRESSION SAFETY

- **IDs preserved:** `#lp-retry`, `#lp-reveal`, `#lp-next` unchanged — all `addEventListener` wiring intact (focus calls placed *after* listeners attach).
- **Arcade path untouched:** no edits to the arcade branch of `answer()`; the `aria-live` removal and `renderCard` announce only affect learn-mode rendering.
- **Green gate:** `node --check cards.js` ✓, inline `<script>` `node --check` ✓ (bounds 820..1318).
- **Live verification:** Learn flow exercised end-to-end (pre → wrong → retry1 w/ focus → reveal w/ focus → next → fresh pre-hint); **0 console errors**; localStorage/mode persistence unaffected.

**Result:** ✓ PASS — zero regression.

---

## Layer 7: COMPILE DECISION

**Gate Result: PASS.** Two POLISH items (token drift, focus order) + a redundant aria-live were found and **fixed in-gate on `burst/pacman-2026-06-02`** (auto-propose on branch, never silent apply — Const. Art. 2.4). Taylor's category aria-labels folded in. All 7 layers pass; verified live. **Learning Mode may now be marked UI DONE.**

---

## Required Actions
None outstanding. (Future, separate phase: announce card prompts in both modes — pre-existing cross-mode gap.)

## Sign-Off
**Design Compiler:** PASS · **v1.11** (Const. Art. 2.4) · **2026-06-02**
**Next step:** Sky gates the merge of `burst/pacman-2026-06-02` to `main`.
