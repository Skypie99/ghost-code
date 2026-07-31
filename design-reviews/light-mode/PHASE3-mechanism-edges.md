# Phase 3 — The Mechanism + The Edges

**Branch:** `theme/light-mode` · **Date:** 2026-07-31 · **Palette:** B · Platinum (Sky-picked)

---

## 1. The mechanism

**Storage.** `gc.v1.theme` — `'system' | 'light' | 'dark'`, default `'system'`. Additive key, per
the project's hard rule that `gc.v1` keys are never renamed. Old saves get `'system'` for free.

**Resolution.** A synchronous `<script id="theme-boot">` in `<head>` reads the preference, resolves
`'system'` through `prefers-color-scheme`, and stamps `data-theme="light|dark"` on `<html>`. It also
keeps the `theme-color` meta in sync — a `media=` pair on two metas *cannot* express "the user chose
light while the OS is dark", so this is driven from the same resolver.

**Why the attribute is always stamped** (rather than leaning on a `prefers-color-scheme` block):
it keeps a single light-token block instead of a duplicated one, and it gives the showcase factory a
deterministic hook — set `data-theme` on `<html>` and the page obeys regardless of the OS. The
trade is that with JS disabled nothing is stamped and the page stays dark; since the app is a game
that does not function without JS at all, that fallback is exactly today's shipped experience.

**Live OS following.** A `matchMedia` listener re-resolves on OS change, but **only while the
player is on `system`** — an explicit choice is never overridden.

**Toggle.** A `Theme` row (SYSTEM / LIGHT / DARK) in the existing Settings dialog, built with the
same `segRow` helper and `.seg__btn` component as Sound / Motion / Difficulty. No new chrome, no new
component, `aria-pressed` handled by the existing helper. The switch announces through the existing
`#a11y-announcer` ("Theme set to light." / "Theme following system — currently dark.").

**Transition.** `html.theme-anim` is added for ~240 ms around a switch and then removed, so the
cross-fade can never make ordinary hovers feel laggy. It carries **no `!important`**, which is what
makes it free under reduced motion: the existing OS media query and the in-app `body.reduce-motion`
override both set `transition-duration: 0.01ms !important` and therefore win. Verified instant on
both paths.

---

## 2. The edges

| Edge | Treatment |
|---|---|
| **Scrollbars** | `color-scheme` declared per theme (drives the UA scrollbar). `.missed-review`'s explicit `scrollbar-color` rides `--border-strong` and follows automatically — verified `rgb(122,131,144)` light / `rgb(58,68,83)` dark. |
| **Selection** | `::selection` **did not exist before this pass**. Added, themed through tokens. |
| **Focus rings** | Already `var(--accent)` — follows the theme. Verified with real keyboard focus: `rgb(11,110,119)` light / `rgb(61,216,196)` dark. |
| **Form controls** | None exist in the app. `color-scheme` covers any future one. |
| **Shadows** | **Redesigned, not reused.** Dark's `rgba(0,0,0,.45)/.30` becomes `.06/.08` — a 45%-black shadow on a light surface is a bruise. The existing 1px border does the edge work. |
| **Glows** | Every 16px coloured bloom becomes a tight ring (`0 0 0 3px`) at the same loudness rank. A bloom on light is a smudge. |
| **Colour-carrying images** | `favicon.svg` / `-32` / `-180` / `.ico` are an **opaque dark tile with a teal Phantom**. Rendered against both Chrome tab strips (`captures/favicon/tabs.png`): legible on both. **Deliberately unchanged** — making it transparent would be *worse* on dark tabs. The tile gives the mascot a consistent field in every context. `og-image.png` renders on the sharing platform, not in the app, so it is theme-independent. |
| **`theme-color` meta** | Driven by the resolver, verified `#F3F6FA` light / `#0E1116` dark. |
| **Windows High Contrast** | The existing `forced-colors: active` block replaces colour with system keywords in both themes — untouched and still correct. |
| **The Phantom's eyes** | `--phantom-eye` is deliberately **not** overridden: the eyes sit on the teal body, not the page. The one white that must never invert. |

---

## 3. Evidence

### 3a. No FOUC — measured, not argued

`tools/fouc.mjs` starts a **CDP screencast before navigation** and samples the mean luminance of
every frame the compositor produces during a hard reload.

```
persisted theme = light
  data-theme resolved to : light      color-scheme: light     theme-color: #F3F6FA
  painted frames captured: 86
  frame luminance        : first=0.8792  min=0.8777  max=0.8798
  VERDICT: no wrong-polarity frame — NO FOUC

persisted theme = dark
  data-theme resolved to : dark       color-scheme: dark      theme-color: #0E1116
  painted frames captured: 84
  frame luminance        : first=0.0100  min=0.0096  max=0.0111
  VERDICT: no wrong-polarity frame — NO FOUC
```

86 painted frames in light and the luminance never once dips toward dark; 84 in dark and it never
rises. Zero wrong-polarity frames in either direction.

### 3b. Edge check — 24 assertions, all from computed style in a real browser

`tools/edges.mjs` → **ALL EDGE CHECKS PASS** (`captures/edge-report.txt`). Covers: explicit choice
beating the OS in *both* directions, `system` following the OS in both directions, `color-scheme`,
`theme-color`, the inverted lift wash, inverted `--ink-on-accent`, redesigned shadow, ring-not-blur
halo, scrim polarity, focus rings, scrollbar thumbs, the Phantom's eyes, and the reduced-motion
behaviour of the swap on both the in-app and OS paths.

*Two assertions failed on the first run and both were faults in the **test**, not the product:*
`:focus-visible` does not match a programmatic `.focus()` in Chromium (so it was reading
`currentColor`), and `.missed-review` is JS-built only on the results screen. Both are now driven
for real — keyboard `Tab`, and a played-out game — rather than probed on the title screen.

### 3c. The dark theme, one final time

```
BASELINE main@cff5321   vs   theme/light-mode with dark active

  IDENTICAL   board@desktop     board@mobile      correct@desktop
  IDENTICAL   gameover@desktop  gameover@mobile   learn-reveal@desktop
  IDENTICAL   learn-reveal@mobile   pause@desktop     shortcuts@desktop
  IDENTICAL   title@desktop     title@mobile      token-focus@desktop
  IDENTICAL   wrong@desktop
  ***DIFFERS  settings@desktop

  IDENTICAL = 13    DIFFERS = 1
```

**The one diff is honest and expected: the Settings dialog, because the theme toggle lives in it.**
You cannot add a toggle without the screen that contains it changing. Inspected side by side
(`captures/BASELINE-main/settings@desktop.png` vs `captures/FINAL-dark/settings@desktop.png`): the
only change is the added THEME row and the dialog's resulting height — same component, same type,
same colours, every other row pixel-aligned. **Nothing else in the dark theme moved.**

Sanity check in the other direction: light differs from dark on **14 / 14** screens, so the theme is
genuinely doing something.

### 3d. Census

**Zero raw colours in any live rule** from the cabinet section to `</style>`. The 21 literals that
remain are all inside the `display:none` synthwave layer (parking lot P-1).

---

## 4. Gates

```
node --check cards.js                                   OK
inline <script> node --check                            OK  (2015..3268)
theme-boot <script> node --check                        OK  (36..68)     [NEW]
node test/cards.test.js                                 OK — 56 cards
index.html references cards.js                          OK
theme contract (light block, color-scheme, meta hook)   OK              [NEW]
contrast — 47 pairings, Platinum                        47/47
edges — 24 assertions, both themes                      ALL PASS
no-FOUC screencast                                      NO FOUC (both)
byte-identity vs main (dark active)                     13 identical / 1 intentional
```

### A real find: this change broke CI, and the fix is in

The green gate — **and CI, verbatim** — locates the main inline script by grepping for a bare
opening `script` tag and slicing to the last closing one. Adding a second bare one in `<head>` made
that slice swallow the whole document; `node --check` failed on `</script>`. Two fixes landed:

1. The head script carries `id="theme-boot"`, so the existing heuristic still finds the right block.
2. **CI gained two steps** so the new code is actually covered rather than merely not breaking
   things: a syntax check of the theme-boot script by id, and a theme-contract check that fails the
   build if the light block, `color-scheme: light`, or the `theme-color` meta hook ever disappear.

`CLAUDE.md`'s green-gate snippet was updated to match, plus a short "two themes — how to add a
colour without breaking one of them" section, since the gate it documents has changed.

*(Amusing sub-find: the first version of the comment explaining this hazard contained a literal
bare script tag, and so triggered the hazard. The comment now avoids the literal, and says so.)*
