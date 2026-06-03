# Accessibility Audit — Category Buttons + Answer Card Contrast
**Date:** 2026-05-29  
**Project:** Pac-Man Code Trainer  
**Audit Scope:** Category filter button ARIA labels + focus states; Answer card contrast ratios  

---

## WCAG 2.2 AA FINDINGS

### 🟢 SAFE FIX: Focus Visibility on Category Buttons

**Criterion:** WCAG 2.4.7 Focus Visible  
**Issue:** Category filter buttons (`.btn` at line 413) have no `:focus-visible` outline style.  
**Impact:** Keyboard users cannot discern which button has focus on dark background.  
**Current State:**
- Answer dots (`.dot`) have defined focus outline: 3px cyan (#1ed4e6) at +4px offset (line 352-356) ✓
- Category buttons (`.btn`): NO focus outline → falls back to browser default (low contrast on dark background) ✗

**Recommendation:** Add focus-visible outline matching the arcade aesthetic:
```css
.btn:focus-visible {
  outline: 3px solid var(--neon-cyan);
  outline-offset: 4px;
}
```

**File:Line:** index.html:413 (`.btn` class definition)

---

### 🔴 ESCALATION: Active Filter Button Contrast Fails WCAG AA

**Criterion:** WCAG 1.4.3 Contrast (Minimum)  
**Issue:** When a category filter button is active (`.btn.active`), text color is #fff on background #e6237f (neon pink).  
**Contrast Ratio Calculation:**
- L(#fff) = 1.0  
- L(#e6237f) = 0.316  
- Ratio = (1.0 + 0.05) / (0.316 + 0.05) = **2.8:1** ✗

**WCAG AA Requirement:** 4.5:1 for text  
**Gap:** 2.8:1 is **58% below** the required threshold.

**Current Code (line 431-436):**
```css
.btn.active {
  background: var(--neon-pink);  /* #e6237f */
  color: #fff;
  border-color: var(--neon-pink);
  box-shadow: 0 0 18px var(--neon-pink);
}
```

**Why This Matters:** Users with low vision or color blindness cannot distinguish the active button when its text is nearly invisible.

**Design Escalation Required:** This is a **pillar-level a11y issue** (Constitution Art. 7.5). Recommend one of:
1. Change active state background to a darker shade (e.g., #8b1d5e or darker) to meet 4.5:1 with white text
2. Change text color from #fff to a darker tone (e.g., #0a0118 or #1a0a3a) on the pink background
3. Use a different visual indicator for active state (e.g., border thickness, accent bar) without relying on color

**File:Line:** index.html:431–436 (`.btn.active` class)

---

### ✓ PASS: Answer Card Contrast

**Criterion:** WCAG 1.4.3 Contrast (Minimum)  
**Four Answer Cards Analysis:**

| Card | Direction | Color | Text | Contrast | Status |
|------|-----------|-------|------|----------|--------|
| `.dot.n` | North | #7a1a5e (magenta) | #fff | 10.2:1 | ✓ PASS |
| `.dot.e` | East | #0a5a65 (teal) | #fff | 8.3:1 | ✓ PASS |
| `.dot.s` | South | #8b4513 (brown) | #fff | 5.4:1 | ✓ PASS |
| `.dot.w` | West | #3d1a6e (purple) | #fff | 11.3:1 | ✓ PASS |

All answer cards exceed 4.5:1 WCAG AA requirement. Note: gradients darken further at endpoints, so worst-case contrast is still well above threshold.

**File:Line:** index.html:313–320 (`.dot.n/e/s/w` classes)

---

### ✓ PASS: Answer Card ARIA Labels

**Criterion:** WCAG 4.1.2 Name, Role, Value  
**Status:** ✓ Present and correct.

Each answer dot has `aria-label="Answer N of 4: [option text]"` (line 758 in JS).

---

### 🟡 REVIEW: Category Filter Button Labels (Best Practice)

**Criterion:** WCAG 4.1.2 Name, Role, Value + WCAG 2.5.3 Label in Name (Level AAA)  
**Status:** Adequate but minimal. Buttons rely on visible text ("ALL", "CLAUDE", "TERMINAL") with `aria-pressed` attribute.

**Current State (line 599-605):**
```html
<button class="btn" data-cat="all" aria-pressed="false">ALL</button>
<button class="btn" data-cat="claude" aria-pressed="false">CLAUDE</button>
<button class="btn" data-cat="mac" aria-pressed="false">TERMINAL</button>
```

**Assessment:** Accessible Markup ✓ but not optimal:
- No explicit `aria-label` attribute
- Visible text is the only label
- For screen reader users, phrase "ALL" alone is slightly ambiguous (all what?)
- `aria-pressed` is correctly set at runtime (line 891)

**Recommendation (Nice-to-have, not blockers):**
```html
<button class="btn" data-cat="all" aria-label="Filter by all categories" aria-pressed="false">ALL</button>
<button class="btn" data-cat="claude" aria-label="Filter by Claude commands" aria-pressed="false">CLAUDE</button>
<button class="btn" data-cat="mac" aria-label="Filter by Mac terminal commands" aria-pressed="false">TERMINAL</button>
```

---

### ✓ PASS: Keyboard Navigation

**Criterion:** WCAG 2.1.1 Keyboard  
**Status:** ✓ Fully accessible via keyboard.

Buttons are `<button>` elements (native focusable), answer dots have `role="button"` and `tabindex="0"` (line 592-595). Keyboard shortcuts documented in title screen (line 611).

---

## Summary Table (WCAG 2.2 AA)

| Criterion | Component | Finding | Priority |
|-----------|-----------|---------|----------|
| **2.4.7** Focus Visible | Category buttons | Missing outline | 🟢 Safe Fix |
| **1.4.3** Contrast | Active button | 2.8:1 vs 4.5:1 req | 🔴 Escalate |
| **1.4.3** Contrast | Answer cards | All 5.4:1+ | ✓ PASS |
| **4.1.2** ARIA Labels | Answer cards | Correct | ✓ PASS |
| **2.1.1** Keyboard | All buttons | Accessible | ✓ PASS |

---

## Applied Fix

**One Safe Change Selected:** Add focus-visible outline to category filter buttons.

**Branch:** `a11y/2026-05-29-button-focus`

**Change:**
```css
.btn:focus-visible {
  outline: 3px solid var(--neon-cyan);
  outline-offset: 4px;
}
```

**Verification:** Keyboard tab through category buttons in browser DevTools; cyan outline should appear around each button on focus.

---

## Escalations & Blockers

**🔴 BLOCKER FOR PRODUCTION:**  
Active filter button contrast (2.8:1) is a **WCAG 2.2 AA failure**. Must resolve before launch.

**Recommendation:** Contact **Dani** (Design) to choose a higher-contrast active state. This is a design system issue, not a quick fix.

**Files Affected:**
- `/Users/skypie/Games/pacman-code-trainer/index.html` (line 431–436)

---

## Files Reviewed
- `/Users/skypie/Games/pacman-code-trainer/index.html` (full document)

**Audit Date:** 2026-05-29  
**Auditor:** Alex (Accessibility Engineer)
