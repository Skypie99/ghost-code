# Design Compiler — P7 `p7-gameover-review`

**Date:** 2026-06-03
**Branch:** `shamus/p7-gameover-a11y-2026-06-03`
**Feature slug:** `p7-gameover-review`
**Surface:** Missed-cards review block injected into `#gameover` (Part A of P7)
**Compiler role:** Dani (Sonnet)
**Decision: POLISH**

---

## Surface under audit

Shamus added a scrollable `.missed-review` section dynamically injected before `#again-btn` in the game-over screen when `state.missedThisRun.size > 0`. It lists up to 8 missed cards' prompt + explanation. New CSS lives at lines 677–715 of `index.html`. Part B (screen-reader live-region announcement) is excluded from this compile — noted as existing, left to Alex.

---

## Layer 1 — Tokenization

**Result: NEAR-PASS — two raw `rgba()` values; both are within established project pattern.**

| Line | Value | Assessment |
|------|-------|------------|
| 683 | `border: 1px solid var(--neon-purp)` | Correct — token used |
| 686 | `background: rgba(30, 0, 60, 0.72)` | Raw RGBA — dark translucent panel. No `--bg-mid-alpha` token exists. Project uses raw rgba for all translucent backgrounds (see lines 515, 622). **Consistent with project convention.** |
| 688 | `scrollbar-color: var(--neon-purp) transparent` | Correct — token used |
| 693 | `color: var(--neon-pink)` | Correct — token used |
| 694 | `text-shadow: 0 0 6px var(--neon-pink)` | Correct — token used |
| 704 | `border-bottom: 1px solid rgba(157,78,221,0.3)` | Raw RGBA derived from `--neon-purp: #9d4edd` (rgb 157,78,221). Identical literal already used at lines 181 and 338. No `--neon-purp-rgb` triplet token exists in `:root`. **Consistent with project convention.** |
| 711 | `color: var(--neon-cyan)` | Correct — token used |

**Finding:** The key named-color values (`--neon-cyan`, `--neon-pink`, `--neon-purp`) are all tokenized. The two raw `rgba()` values are translucent overlays — the same pattern used throughout the existing codebase, which provides no RGB-channel triplet tokens. This is not a violation; it is convention compliance.

**No tokenization BLOCK.**

---

## Layer 2 — Accessibility Parity

**Result: STRUCTURAL NOTE (not a block — deep SR audit deferred to Alex)**

- The `.missed-review` div has `overflow-y: auto` with `max-height: 220px`. It is not assigned `tabindex="0"`, meaning keyboard users cannot scroll it using arrow keys. On mobile (touch scroll) this is fine; on desktop it is a gap. This is a functional accessibility concern — flagging for Alex.
- Content uses `textContent` only throughout (lines 1394, 1409, 1413) — no `innerHTML`, XSS risk zero.
- The screen-reader live announcement (Part B) is in scope on this branch and handles the announcement path. Noted.

**No BLOCK from this layer — surface to Alex.**

---

## Layer 3 — Component Consistency

**Result: POLISH REQUIRED — `.lp-explain` scoping mismatch**

The code at line 1412 assigns `className = 'lp-explain'` to the explanation `<p>` elements inside `.missed-review`. The CSS rule for this class (line 551) is:

```css
#learn-panel .lp-explain { font-size: 20px; color: var(--soft); ... }
```

This selector is **scoped to `#learn-panel`**. The `.missed-review` block lives inside `#gameover`, which is a sibling `.screen` element — completely outside `#learn-panel`. Therefore `#learn-panel .lp-explain` does **not apply** to the review block's explain text.

The explain `<p>` instead inherits from `.screen p` (line 654): VT323, **26px**, `var(--soft)`. This is readable but differs from the 20px the learn-panel rule specifies. The comment at line 715 (`/* .lp-explain reused from learn-panel — already styled */`) is technically incorrect.

**POLISH fix:** Add an unscoped companion rule for `.missed-review .lp-explain` at the point of use (line 715), or unscope `.lp-explain` globally. The minimal correct fix is an explicit companion rule.

---

## Layer 4 — Visual Entropy

**Result: PASS**

Layout math at reference cabinet height `min(780px, 94vh)`, inner padding 40px top+bottom:
- `.screen` flex column, `gap: 28px`, content budget ~700px at 780px cabinet
- Stack: `h2` GAME OVER (~35px) + gap + `h1` score (~55px) + gap + `p` hi-score (~37px) + gap + `.missed-review` (≤220px) + gap + button (~68px)
- Total worst-case: ~527px — comfortably inside 700px budget

At smaller viewports (94vh ≈ 626px cabinet, content budget ~546px): still fits.
The inner scroll (`overflow-y: auto`) on `.missed-review` prevents any blowout. `max-height: 220px` is a hard ceiling, not a flex-grow item.

**No crowding concern.**

---

## Layer 5 — Luxury UI Score

**Result: PASS**

- Border in `--neon-purp` echoes the cabinet glow family — cohesive
- Dark translucent background creates correct depth hierarchy (lighter than black, darker than the content)
- Heading in `Press Start 2P` at 9px matches the HUD's label convention
- Prompt in VT323 cyan (`--neon-cyan`) — high-impact scan-ability, consistent with learn-panel kicker styling
- Divider lines (`rgba(--neon-purp-derived, 0.3)`) are subtle and tasteful
- Scrollbar themed to `--neon-purp` — retro-correct

The only mark-down is the Layer 3 CSS scoping gap (26px vs 20px explain text). At 26px the explain is slightly large for a review list but still reads as deliberate VT323 terminal style. Not jarring, but slightly inconsistent with the learn-panel presentation users have already seen.

Score: **8/10** (would be 9/10 post-fix).

---

## Layer 6 — Regression Safety (Green Gate)

All three checks passed cleanly:

```
node --check cards.js           → OK
inline JS node --check          → OK
node test/cards.test.js         → OK — 56 cards passed all integrity checks.
```

**No regressions.**

---

## Layer 7 — Compile Decision

**POLISH**

One fix required before merge is safe from a design standpoint:

**Fix:** Add an explicit `.missed-review .lp-explain` rule so the explain text renders at 20px (matching learn-panel) rather than inheriting `.screen p`'s 26px. The existing comment at line 715 should be updated to reflect this.

This is a pre-merge feature branch; compiler may apply the fix directly per Art. 2.4 rules.

---

## Polish Fix — Before/After

**Before (line 715):**
```css
  /* .lp-explain reused from learn-panel — already styled */
```
The `#learn-panel .lp-explain` rule at line 551 does NOT apply here — the comment is misleading and the text inherits `.screen p` (26px).

**After (inserted at line 715):**
```css
  /* .missed-review: explicit companion so explain text matches learn-panel's 20px,
     not the wider .screen p (26px) it would otherwise inherit. */
  .missed-review .lp-explain {
    font-size: 20px;
  }
```

Only `font-size` needs overriding — `font-family`, `color`, `line-height`, `margin` are already correct via `.screen p` inheritance. `max-width` is constrained by `.missed-review` itself (560px).

---

## Accessibility flag for Alex

- `.missed-review` (overflow-y scroll, max-height 220px) has no `tabindex="0"` — keyboard users on desktop cannot scroll it. Recommend `tabindex="0"` + `role="region"` + `aria-label="Missed cards review"`.

---

## Decisions for Sky

None. This is a trivial compiler-level fix with no privacy, security, or UX-direction implications.
