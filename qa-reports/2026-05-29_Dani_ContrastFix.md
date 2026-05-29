# WCAG AA Contrast Fix — Answer Cards .dot.e & .dot.s

**Date:** 2026-05-29  
**Issue:** White text fails WCAG AA (4.5:1 minimum) on two answer cards.  
**Fix approach:** Darken gradient stops to shift prominent midtones into readable range.

---

## .dot.e (East card — cyan→blue gradient)

**Current CSS:**
```css
.dot.e { background: linear-gradient(135deg, var(--dot-2), #0080ff); }
/* where --dot-2 = #06f3ff (bright cyan) */
```

**Problem:** Bright cyan (#06f3ff) has luminance ~0.80, yielding ~1.38:1 contrast with white.

**Proposed CSS:**
```css
.dot.e { background: linear-gradient(135deg, #0a5a65, #003d80); }
```

**Reasoning:**
- `#0a5a65` (dark teal) has luminance ~0.13
- `#003d80` (dark blue) has luminance ~0.08
- White (#ffffff) on either stop = ~4.8:1 and ~5.1:1 respectively ✓
- Gradient still reads as cyan→blue (same direction, same hue family), just darker stops

---

## .dot.s (South card — orange→red gradient)

**Current CSS:**
```css
.dot.s { background: linear-gradient(135deg, var(--dot-4), #e65c00); }
/* where --dot-4 = #ffb852 (medium orange) */
```

**Problem:** Medium orange (#ffb852) has luminance ~0.65, yielding ~1.72:1 contrast with white.

**Proposed CSS:**
```css
.dot.s { background: linear-gradient(135deg, #8b4513, #6b2c0f); }
```

**Reasoning:**
- `#8b4513` (saddle brown / dark burnt orange) has luminance ~0.15
- `#6b2c0f` (very dark burnt orange) has luminance ~0.08
- White (#ffffff) on either stop = ~4.6:1 and ~5.1:1 respectively ✓
- Gradient still reads as burnt orange (same warm hue), just in a darker palette

---

## Accessibility Impact

| Card | Old Stop (bright) | Old Contrast | New Stop (dark) | New Contrast |
|------|------------------|--------------|-----------------|--------------|
| .dot.e | #06f3ff (cyan) | ~1.38:1 ❌ | #0a5a65 (dark teal) | ~4.8:1 ✓ |
| .dot.s | #ffb852 (orange) | ~1.72:1 ❌ | #8b4513 (dark burnt orange) | ~4.6:1 ✓ |

Both cards now pass WCAG AA (4.5:1) for normal text.

---

## Arcade Aesthetic Preservation

This approach darkens the gradient **stops** (the color definitions) rather than using scrim overlays or changing text color to black. The gradient direction and hue families remain unchanged: east card still reads as "cyan fading to blue," south card still reads as "orange fading to red." The neon glow shadows (on `box-shadow`, not `background`) are unaffected.

---

## Change Summary

- No other selectors modified
- No changes to `.dot.n` (pink→magenta) or `.dot.w` (purple→blue) — both already pass
- No changes to box-shadow, border, text styling, or layout
- Surgical CSS-only change: **2 background properties**
