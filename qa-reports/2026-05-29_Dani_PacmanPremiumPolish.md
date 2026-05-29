# PAC-MAN CODE TRAINER — Premium Polish Spec
**Dani, Creative Director | 2026-05-29**

Surgical token-and-rule-level refinements to elevate arcade vibe to premium while maintaining synthwave DNA. Direction A: harmonize palette, restrain glows, fix type hierarchy, calm motion during gameplay.

---

## 1. Palette Harmonization

Reduce saturation on hottest neons by 10–15%. Add tonal variants for soft and glow contexts.

### Token changes (lines 13–37 :root)

| Token | Current | New | Rationale |
|-------|---------|-----|-----------|
| `--neon-pink` | `#ff2d95` | `#e6237f` | reduce saturation, ease eye fatigue |
| `--neon-cyan` | `#06f3ff` | `#1ed4e6` | reduce saturation, warm slightly |
| `--neon-mag` | `#c724b1` | `#b01d99` | reduce saturation |
| `--neon-blue` | `#2a47ff` | `#3550e6` | reduce saturation, raise lightness |
| `--neon-pink-soft` | *(new)* | `#f58db5` | +20% lightness, for secondary contexts |
| `--neon-pink-glow` | *(new)* | `#ff2d95` | keep original for glow-only (box-shadow) |
| `--neon-cyan-soft` | *(new)* | `#7ee6f5` | +20% lightness, for secondary contexts |
| `--neon-cyan-glow` | *(new)* | `#06f3ff` | keep original for glow-only (box-shadow) |

### Derived color updates

Update literal colors in gradients that reference affected neons:

| Selector | Property | Current | New | Reason |
|----------|----------|---------|-----|--------|
| `.dot.n` | background gradient | `var(--dot-1)` is `#ff6ec7` | `#e6598f` | reduce saturation +2% to match palette |
| `.dot.s` | background gradient | `#ff6e00` literal | `#e65c00` | reduce saturation to match palette family |
| `.screen h1` | background gradient (layer) | uses `var(--sun-*)` unchanged | keep as-is | sun is backdrop, keep vibrant |

---

## 2. Shadow Scale

Define three shadow tiers. Replace all ad-hoc shadow literals with CSS vars for consistency.

### New :root shadow tokens (insert after line 36)

```css
--shadow-sm:    0 2px 6px rgba(0,0,0,0.55);
--shadow-md:    0 0 18px rgba(255,110,199,0.55);
--shadow-glow:  0 0 28px var(--neon-cyan);
```

### Shadow mappings (token → selector)

| Selector | Shadow property | Current | New | Shadow tier |
|----------|-----------------|---------|-----|--------------|
| `.dot .txt` | text-shadow | `0 0 4px rgba(0,0,0,0.4)` | `var(--shadow-sm)` | --shadow-sm |
| `.dot` (base) | box-shadow | `0 0 18px rgba(255,110,199,0.7), inset 0 0 12px rgba(255,255,255,0.15)` | `var(--shadow-md), inset 0 0 12px rgba(255,255,255,0.15)` | --shadow-md |
| `.dot.e` (east) | box-shadow | `0 0 18px rgba(6,243,255,0.7), inset 0 0 12px rgba(255,255,255,0.15)` | `var(--shadow-md) /* tune to cyan */, inset 0 0 12px rgba(255,255,255,0.15)` | --shadow-md (note: e variant uses cyan, not pink) |
| `.dot.s` (south) | box-shadow | `0 0 18px rgba(255,184,82,0.7), inset 0 0 12px rgba(255,255,255,0.15)` | `var(--shadow-md) /* tune to orange */, inset 0 0 12px rgba(255,255,255,0.15)` | --shadow-md (note: s variant uses orange) |
| `.dot.w` (west) | box-shadow | `0 0 18px rgba(157,78,221,0.7), inset 0 0 12px rgba(255,255,255,0.15)` | `var(--shadow-md) /* tune to purple */, inset 0 0 12px rgba(255,255,255,0.15)` | --shadow-md (note: w variant uses purple) |
| `#cabinet` | box-shadow | `0 0 28px var(--neon-cyan), 0 0 80px rgba(6, 243, 255, 0.25), inset 0 0 30px rgba(199, 36, 177, 0.15)` | `var(--shadow-glow), 0 0 80px rgba(6, 243, 255, 0.15), inset 0 0 30px rgba(199, 36, 177, 0.15)` | --shadow-glow (reduce outer 80px blur opacity from 0.25 → 0.15) |
| `#sun` | box-shadow | `0 0 80px rgba(255,46,149,0.55), 0 0 160px rgba(255,110,199,0.3)` | keep as-is | backdrop element, glows stay hot |
| `.pac-body` | box-shadow | `0 0 24px var(--pac-glow), 0 0 50px rgba(255,230,0,0.3)` | keep as-is | Pac glow is core identity |
| `.ghost` | box-shadow | `0 0 16px currentColor` | keep as-is | per-ghost color, stays proportional |
| `.btn:hover` | box-shadow | `0 0 18px var(--neon-cyan)` | keep as-is | interactive highlight |
| `.big-btn` | box-shadow | `0 0 18px var(--pac-glow), inset 0 0 10px rgba(255,230,0,0.1)` | keep as-is | start/retry button stays hot |

**Shadow recalibration note:** For `.dot` variants (.e, .s, .w), the color tint in the current shadow literals (255,110,199 for pink; 6,243,255 for cyan; etc.) is intentional. When switching to `var(--shadow-md)`, Shamus should either (a) leave the tint implicit in the shadow var, or (b) define per-variant shadow tiers. For simplicity, recommend leaving them as literal tuned shadows. Mark as **POLISH, not required**.

---

## 3. Type Hierarchy

Establish explicit font-size scale and improve readability of body text.

### Font-size scale (Press Start 2P chrome)

| Usage | Current selector | Font-size | New scale |
|-------|------------------|-----------|-----------|
| Main title (screens) | `.screen h1` | `38px` | `38px` (no change) |
| Subtitle (game-over) | `.screen h2` | `24px` | `24px` (no change) |
| Category badge | `#cat-badge` | `11px` | `11px` (no change) |
| HUD labels | `#hud .stat .label` | `9px` | `9px` (no change) |
| Answer key number | `.dot .key` | `10px` | `10px` (no change) |
| Prompt tag | `#prompt .tag` | `11px` | `11px` (no change) |
| Button text | `.btn` | `11px` | `11px` (no change) |
| Screen small text | `.screen .small` | `10px` | `10px` (no change) |
| Screen h1 mobile fallback | `@media .screen h1` | `26px` | `26px` (no change) |

### Font-size scale (VT323 body)

| Usage | Current selector | Font-size | New | line-height | New | letter-spacing |
|-------|------------------|-----------|-----|-------------|-----|----------------|
| HUD stat value | `#hud .stat .val` | `28px` | `28px` | `1` (implicit) | `1` | — |
| Prompt question | `#prompt-text` | `30px` | `30px` | `1.4` | `1.4` | — |
| Hint text | `#hint` | `22px` | `22px` | — | — | — |
| Answer card text | `.dot .txt` | `22px` | `22px` | `1.3` | `1.4` | — |
| Screen p | `.screen p` | `26px` | `26px` | `1.4` | `1.4` | — |
| Bar button label | `.btn` | uses Press Start 2P | — | — | — | — |
| Mobile fallback (card) | `@media .dot .txt` | `18px` | `18px` | — | — | — |

### Typography adjustments

| Selector | Property | Current | New | Reason |
|----------|----------|---------|-----|--------|
| `.arcade` | letter-spacing | `1px` | `-0.5px` | tighten Press Start 2P chrome for premium feel |
| `.dot .txt` | line-height | `1.3` | `1.4` | increase breathing room for readability |

---

## 4. Answer Cards (.dot) — Contrast & Interaction

Fix text contrast on answer card body text. Reduce hover scale to avoid aggressive jump. Add keyboard focus indicator.

### Contrast fix

| Selector | Property | Current | New | Reason |
|----------|----------|---------|-----|--------|
| `.dot .txt` | text-shadow | `0 0 4px rgba(0,0,0,0.4)` | `0 2px 6px rgba(0,0,0,0.55)` | increase contrast, soften with 2px offset for depth |

### Hover scale reduction

| Selector | Property | Current | New | Reason |
|----------|----------|---------|-----|--------|
| `.dot:hover` | transform | `scale(1.08)` | `scale(1.04)` | reduce motion intensity, less jarring on small screens |
| `.dot.n:hover` | transform | `translate(-50%, 0) scale(1.08)` | `translate(-50%, 0) scale(1.04)` | north variant |
| `.dot.e:hover` | transform | `translate(0, -50%) scale(1.08)` | `translate(0, -50%) scale(1.04)` | east variant |
| `.dot.s:hover` | transform | `translate(-50%, 0) scale(1.08)` | `translate(-50%, 0) scale(1.04)` | south variant |
| `.dot.w:hover` | transform | `translate(0, -50%) scale(1.08)` | `translate(0, -50%) scale(1.04)` | west variant |

### Keyboard focus indicator (new)

Add after line 343 (after `.dot.w:hover`):

```css
.dot:focus-visible {
  outline: 3px solid var(--neon-cyan-glow);
  outline-offset: 4px;
  z-index: 7;
}
```

---

## 5. Motion Calm During Gameplay

Pause grid animation and reduce scanline opacity when game is active (`body.playing-state` class).

### CSS gate (insert new rule after line 159, before `#vignette`)

```css
body.playing-state #grid::before,
body.playing-state #grid::after {
  animation-play-state: paused;
}

body.playing-state #scanlines {
  opacity: 0.3;
}
```

### JavaScript integration (Shamus implements)

In `startGame()` function (line 775):
- Add `document.body.classList.add('playing-state')` after `state.playing = true`

In `gameOver()` function (line 787):
- Add `document.body.classList.remove('playing-state')` 

In `togglePause()` function (line 794):
- On pause entry: `document.body.classList.remove('playing-state')`
- On pause exit: `document.body.classList.add('playing-state')`

---

## 6. Ghost Color Management

Ghost colors are already exposed as CSS vars (lines 33–36). JS currently hardcodes colors array (line 753).

### CSS vars (already present)

```css
--ghost-red:    #ff3b3b;
--ghost-pink:   #ffb8ff;
--ghost-cyan:   #06f3ff;
--ghost-orange: #ffb852;
```

### JS update recommendation (Shamus implements)

Line 753: Replace hardcoded array
```javascript
const colors = ['#ff3b3b','#ffb8ff','#06f3ff','#ffb852'];
```

with:
```javascript
const getGhostColors = () => {
  const root = getComputedStyle(document.documentElement);
  return [
    root.getPropertyValue('--ghost-red').trim(),
    root.getPropertyValue('--ghost-pink').trim(),
    root.getPropertyValue('--ghost-cyan').trim(),
    root.getPropertyValue('--ghost-orange').trim(),
  ];
};
const colors = getGhostColors();
```

This ensures ghost colors stay in sync if CSS is ever updated. No visual change now, but enables future palette tweaks without JS edit.

---

## 7. Prefers-Reduced-Motion

Disable animations for users with motion-sensitivity preference.

### Animations to disable

All @keyframes in file (identified by grep):
1. `twinkle` (line 82) — star background
2. `grid-scroll` (line 136) — neon grid floor
3. `chomp` (line 284) — Pac mouth animation
4. `ghost-bob` (line 380) — ghost vertical bounce
5. `flash` (line 355) — correct answer flash
6. `blink` (line 471) — "press to continue" blink

### @media rule (insert after line 501, before `</style>`)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibility Polish (Alex 2026-05-25 Pass-Through)

Markup-level changes for keyboard navigation and screen reader support. Shamus implements HTML edits.

### Answer dots — aria-label

Current (line 539–542):
```html
<div class="dot n" data-pos="n" data-key="1"><span class="key">1</span><span class="txt"></span></div>
<div class="dot e" data-pos="e" data-key="2"><span class="key">2</span><span class="txt"></span></div>
<div class="dot s" data-pos="s" data-key="3"><span class="key">3</span><span class="txt"></span></div>
<div class="dot w" data-pos="w" data-key="4"><span class="key">4</span><span class="txt"></span></div>
```

Update to:
```html
<div class="dot n" data-pos="n" data-key="1" role="button" tabindex="0" aria-label="Answer 1 of 4: [text from .txt]"><span class="key">1</span><span class="txt"></span></div>
<div class="dot e" data-pos="e" data-key="2" role="button" tabindex="0" aria-label="Answer 2 of 4: [text from .txt]"><span class="key">2</span><span class="txt"></span></div>
<div class="dot s" data-pos="s" data-key="3" role="button" tabindex="0" aria-label="Answer 3 of 4: [text from .txt]"><span class="key">3</span><span class="txt"></span></div>
<div class="dot w" data-pos="w" data-key="4" role="button" tabindex="0" aria-label="Answer 4 of 4: [text from .txt]"><span class="key">4</span><span class="txt"></span></div>
```

**Note:** aria-label content (the `[text from .txt]`) is dynamic and set by JS. Shamus updates JS that populates `.txt` to also set aria-label.

### Category buttons — aria-pressed

Current (line 547–549):
```html
<button class="btn" data-cat="all">ALL</button>
<button class="btn" data-cat="claude">CLAUDE</button>
<button class="btn" data-cat="mac">TERMINAL</button>
```

Update to:
```html
<button class="btn" data-cat="all" aria-pressed="false">ALL</button>
<button class="btn" data-cat="claude" aria-pressed="false">CLAUDE</button>
<button class="btn" data-cat="mac" aria-pressed="false">TERMINAL</button>
```

JS updates aria-pressed when button.active state changes.

### Pause overlay — Resume button visibility

Current pause screen (line 571–579) has no visible resume affordance beyond the button label.

```html
<div class="screen hidden" id="pauseScreen">
  <h2>PAUSED</h2>
  <p>Game paused. Press RESUME or click anywhere to continue.</p>
  <button id="resume" class="big-btn">RESUME</button>
</div>
```

CSS (new, after line 489):
```css
#pauseScreen #resume {
  margin-top: 20px;
  /* all other big-btn styles already apply */
}
```

No markup change needed; just ensure button is keyboard-focusable and visible. Already is.

---

## Implementation Order for Shamus

Execute in this order to minimize rework and enable testing after each cluster:

### Cluster 1: Palette Tokens
- Update :root vars (lines 13–37): `--neon-pink`, `--neon-cyan`, `--neon-mag`, `--neon-blue`
- Add new soft/glow vars: `--neon-pink-soft`, `--neon-pink-glow`, `--neon-cyan-soft`, `--neon-cyan-glow`
- Update `.dot.n`, `.dot.s` color literals to match new palette
- **Test:** Visual check — neons should feel less harsh, more harmonized

### Cluster 2: Shadow Scale
- Add :root shadow tokens: `--shadow-sm`, `--shadow-md`, `--shadow-glow`
- Replace `.dot .txt` box-shadow with `var(--shadow-sm)` (new text-shadow)
- Replace `.dot` base shadow with `var(--shadow-md)` (keep inset)
- Replace `#cabinet` outer shadow with `var(--shadow-glow)`, reduce 80px blur opacity
- **Test:** Shadows should feel softer, less electric

### Cluster 3: Type & Motion
- Update `.arcade` letter-spacing: `1px` → `-0.5px`
- Update `.dot .txt` line-height: `1.3` → `1.4`
- Add `body.playing-state` CSS rule to pause grid animation, reduce scanline opacity
- **Test:** Chrome is tighter, body is more breathable, grid stops when playing

### Cluster 4: Button Polish
- Reduce `.dot:hover` and variants scale: `1.08` → `1.04`
- Add `.dot:focus-visible` rule for keyboard users
- **Test:** Hover feels less jarring, Tab navigation shows outline

### Cluster 5: Prefers-Reduced-Motion
- Add `@media (prefers-reduced-motion: reduce)` rule
- **Test:** Enable motion reduction in OS settings — animations should stop

### Cluster 6: JS Ghost Color Sync
- Update line 753 to read colors from CSS vars via `getComputedStyle()`
- **Test:** Ghost colors render correctly (visual no-op, but future-proof)

### Cluster 7: JS Game State Gates
- Add `document.body.classList.add('playing-state')` in `startGame()` (line 775)
- Add `document.body.classList.remove('playing-state')` in `gameOver()` (line 787)
- Update `togglePause()` to toggle playing-state class (line 794)
- **Test:** Grid animation pauses/resumes with game; scanline opacity dims when active

### Cluster 8: A11y Markup
- Add `role="button" tabindex="0" aria-label="Answer N of 4: ..."` to `.dot` elements (lines 539–542)
- Add `aria-pressed="false"` to category buttons (lines 547–549); update via JS
- Verify pause screen button is focusable and visible (already is)
- Update JS that sets `.txt` content to also set aria-label dynamically
- **Test:** Tab through dots, verify outline appears; screen reader announces each answer; category button state toggles aria-pressed

---

## Summary

**Visual delta:** Palette softens (neons less searing), glows recalibrate (smaller halos), type hierarchy clarifies (tighter chrome, roomier body), answer cards scale less aggressively on hover, grid stops mid-game (calm), all animations respect OS motion preference.

**Tone:** Premium arcade — synthwave DNA intact, but refined. Less "bright hack," more "curated experience."
