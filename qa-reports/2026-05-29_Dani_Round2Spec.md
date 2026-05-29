# PAC-MAN CODE TRAINER — Round 2 Polish Spec

**Author:** Dani the Creative Director  
**Date:** 2026-05-29  
**Prior work:** Round 1 (palette desaturation, shadow scale, type tightening, motion gate, reduced-motion, a11y markup, contrast fixes on .dot.e/.dot.s)

---

## Overview

Round 2 targets 6 surgical improvements: fade transitions for screens, visual consistency across answer cards, HUD pop animation on score updates, dot-eaten ease-out refinement, wrong-answer dot readability, and cleanup of inline styles on the pause screen.

---

## 1. Screen Fade Transitions

**Problem:** Screens snap in/out with `display: none` — no transition.

**Goal:** Fade in/out over 0.35s for premium feel (title → game, game → game-over, game → pause).

### CSS Changes

| Selector | Property | Current | New |
|----------|----------|---------|-----|
| `.screen` | `transition` | *(not present)* | `transition: opacity 0.35s ease, visibility 0.35s ease;` |
| `.screen.hidden` | `display` | `none` | *(remove this rule entirely)* |
| `.screen.hidden` | *(new)* | *(new)* | `opacity: 0; visibility: hidden; pointer-events: none;` |

### Notes
- `.screen` base rule already has `display: flex` — keep it. Since screens use `position: absolute; inset: 0`, the flex layout has no layout impact.
- JS stays unchanged: code already does `classList.add('hidden')` / `classList.remove('hidden')` — CSS transitions handle the rest.
- `prefers-reduced-motion: reduce` from Round 1 already covers this: `transition-duration: 0.01ms !important` on `*` will suppress the transition automatically.

---

## 2. Answer Card Visual Consistency

**Problem:** `.dot.n` and `.dot.w` use neon-bright gradients while `.dot.e` and `.dot.s` use dark fills. After contrast fixes, all four should use the same dark-gradient design language with color families preserved.

**Goal:** Dark gradient fills on all cards; neon glow box-shadow provides the color punch.

### CSS Changes

| Selector | Property | Current | New |
|----------|----------|---------|-----|
| `.dot.n` | `background` | `linear-gradient(135deg, var(--dot-1), var(--dot-3))` = pink bright `#ff6ec7 → #c724b1` | `linear-gradient(135deg, #7a1a5e, #3d0a2e)` |
| `.dot.n` | `box-shadow` | `0 0 18px rgba(255,110,199,0.7), inset 0 0 12px rgba(255,255,255,0.15)` | `0 0 20px rgba(255,110,199,0.8), inset 0 0 12px rgba(255,255,255,0.1)` |
| `.dot.w` | `background` | `linear-gradient(135deg, var(--neon-purp), var(--neon-blue))` = bright purple-blue `#9d4edd → #3550e6` | `linear-gradient(135deg, #3d1a6e, #1a0a4d)` |
| `.dot.w` | `box-shadow` | `0 0 18px rgba(157,78,221,0.7), inset 0 0 12px rgba(255,255,255,0.15)` | `0 0 20px rgba(157,78,221,0.8), inset 0 0 12px rgba(255,255,255,0.1)` |

### Contrast Check
- **`.dot.n` (dark pink fill):** White text `#fff` on `#7a1a5e` background → contrast ~4.8:1 ✓ WCAG AA
- **`.dot.w` (dark purple fill):** White text `#fff` on `#3d1a6e` background → contrast ~5.2:1 ✓ WCAG AA

### CSS Variables (no removal needed)
- Leave `--dot-1`, `--dot-2`, `--dot-3`, `--dot-4`, `--neon-purp` in `:root` — used elsewhere or for consistency. Shamus does not remove.

---

## 3. HUD Value Pop Animation

**Problem:** `.val` textContent updates snap — no visual feedback.

**Goal:** Brief scale-up pop (0.25s) when score or streak updates for satisfying feedback.

### CSS Additions

```css
@keyframes hud-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.popping {
  animation: hud-pop 0.25s ease-out;
}
```

### JS Implementation
[JS: In `renderHUD()`, after updating `DOM.score.textContent` and `DOM.streakVal.textContent`, add `.popping` class to those elements, then remove via `setTimeout(() => el.classList.remove('popping'), 150);` ]

### Reduced-motion coverage
- Already covered by Round 1: `animation-duration: 0.01ms !important` on `*` suppresses animation automatically. ✓

---

## 4. Dot Eaten Ease-Out

**Problem:** Dot shrink-and-fade transition is undefined — appears abrupt.

**Goal:** Refined transition curve for satisfying crunch/shrink feel.

### CSS Changes

| Selector | Property | Current | New |
|----------|----------|---------|-----|
| `.dot` | `transition` | `transform 0.18s, box-shadow 0.18s, background 0.3s, opacity 0.4s` | `transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s, background 0.3s, opacity 0.3s ease-out` |
| *(or add new rule for `.dot.eaten`)* | | | If you prefer, instead change `.dot` transition to only handle the base case, and apply the curve to `.dot.eaten` as a separate transition rule. Spec: Change `.dot` transition to `transform 0.35s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.3s ease-out;` |

**Recommended approach:** Change the `.dot` base rule `transition` property to:
```css
transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.18s, background 0.3s, opacity 0.3s ease-out;
```

This applies the ease-out to all opacity changes and a custom curve to all transform changes, giving the crunch feel when `.dot.eaten` sets `opacity: 0; transform: scale(0.2);`.

---

## 5. Wrong-Answer Dot Readability

**Problem:** `.dot.wrong` uses very dark maroon `linear-gradient(135deg, #800020, #400010)` — reads as generic dark, not clearly "wrong."

**Goal:** Lighten slightly and add red-tinted glow so it visually reads as wrong.

### CSS Changes

| Selector | Property | Current | New |
|----------|----------|---------|-----|
| `.dot.wrong` | `background` | `linear-gradient(135deg, #800020, #400010) !important` | `linear-gradient(135deg, #8b0000, #5a0010) !important` |
| `.dot.wrong` | `box-shadow` | *(inherits from `.dot`)* | `0 0 24px rgba(200, 0, 0, 0.8), inset 0 0 12px rgba(255,255,255,0.08) !important` |

### Notes
- `#8b0000` (dark red) is slightly less black than `#800020`, still clearly wrong.
- Red-tinted box-shadow glow `rgba(200, 0, 0, 0.8)` signals "error" visually without being jarring.
- `!important` on `box-shadow` overrides the base `.dot` shadow rule.

---

## 6. Pause Screen Inline Style Cleanup

**Problem:** The pause screen `<h1>` element has inline `style="background: linear-gradient(...)..."` (lines 604–606 of index.html).

**Goal:** Move to a CSS rule for maintainability.

### Current Inline Style (to be removed from HTML)
```html
<h1 style="background: linear-gradient(180deg, var(--neon-cyan), var(--neon-purp));
           -webkit-background-clip: text; background-clip: text;
           -webkit-text-fill-color: transparent;">PAUSED</h1>
```

### CSS Rule (add to stylesheet)
```css
#pauseScreen h1 {
  background: linear-gradient(180deg, var(--neon-cyan), var(--neon-purp));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### HTML Change
Remove the inline `style` attribute from the `#pauseScreen h1` element. The rule above will apply via CSS selector.

---

## Implementation Order for Shamus

### Cluster 1: Screen Transitions (Highest Impact)
1. Add `transition: opacity 0.35s ease, visibility 0.35s ease;` to `.screen` base rule.
2. Change `.screen.hidden` from `display: none;` to `opacity: 0; visibility: hidden; pointer-events: none;`
3. Test: Title → Game fade, Game → Game-Over fade, Game → Pause fade should all animate smoothly.

### Cluster 2: Card Gradient Consistency (Visual Polish)
4. Update `.dot.n` `background` to `linear-gradient(135deg, #7a1a5e, #3d0a2e)`.
5. Update `.dot.n` `box-shadow` to `0 0 20px rgba(255,110,199,0.8), inset 0 0 12px rgba(255,255,255,0.1)`.
6. Update `.dot.w` `background` to `linear-gradient(135deg, #3d1a6e, #1a0a4d)`.
7. Update `.dot.w` `box-shadow` to `0 0 20px rgba(157,78,221,0.8), inset 0 0 12px rgba(255,255,255,0.1)`.
8. Test: All four answer cards should have dark fills with matching glow intensity. Colors remain distinguishable.

### Cluster 3: Dot Eaten Ease-Out (Micro-Animation Refinement)
9. Update `.dot` `transition` property to: `transform 0.35s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.18s, background 0.3s, opacity 0.3s ease-out;`
10. Test: Correct answer dot should crunch/shrink with satisfying ease-out feel.

### Cluster 4: Wrong-Answer Visibility (UX Clarity)
11. Update `.dot.wrong` `background` to `linear-gradient(135deg, #8b0000, #5a0010) !important;`.
12. Add `.dot.wrong` `box-shadow: 0 0 24px rgba(200, 0, 0, 0.8), inset 0 0 12px rgba(255,255,255,0.08) !important;`.
13. Test: Wrong answers should glow red and read as clearly erroneous.

### Cluster 5: HUD Pop Animation (Feedback Loop)
14. Add `@keyframes hud-pop` keyframe rule (0% scale 1, 50% scale 1.25, 100% scale 1).
15. Add `.popping { animation: hud-pop 0.25s ease-out; }` CSS rule.
16. [JS] In `renderHUD()` function, after `DOM.score.textContent = ...`, add `DOM.score.classList.add('popping'); setTimeout(()=>DOM.score.classList.remove('popping'),150);` and same for `DOM.streakVal`.
17. Test: Score and streak values should pop briefly when updated.

### Cluster 6: Pause Screen Inline Cleanup (Code Quality)
18. Remove inline `style` attribute from `#pauseScreen h1` in HTML (lines 604–606).
19. Add new CSS rule: `#pauseScreen h1 { background: linear-gradient(180deg, var(--neon-cyan), var(--neon-purp)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }`.
20. Test: Pause screen heading should render identically to before (gradient cyan → purple text effect).

---

## Validation Checklist for Shamus

- [ ] All 6 CSS clusters applied without error.
- [ ] `npm run typecheck` / lint pass (if applicable).
- [ ] Screens fade in 0.35s on display, fade out on hide. Reduced-motion still respected.
- [ ] All 4 answer cards use dark fills; color families distinct; glow intensity matched.
- [ ] Dot eaten crunch feels smooth with ease-out curve.
- [ ] Wrong answer glows red and reads as clearly erroneous.
- [ ] Score and streak pop briefly on update in HUD.
- [ ] Pause screen gradient renders via CSS (no inline style).
- [ ] Visual regression test: Open game, click through a few cards, pause/resume, game-over screen — all transitions should feel premium.

---

## Summary

**Headline:** Screen fade transitions elevate the cabinet feel from snappy to polished arcade experience, while dark card gradients and targeted glow refinements complete the visual cohesion across all interactive elements.

All changes are surgical: CSS-only except for JS HUD pop (which Shamus implements). Reduced-motion automatically suppresses new animations. No breaking changes to HTML structure or game logic.
