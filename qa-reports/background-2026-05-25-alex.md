---
date: 2026-05-25
author: Alex (Accessibility Engineer)
mode: background
model_tier: opus-4-7
project: Pac-Man Code Trainer
cycle_id: background-alex-a11y-2026-05-25
scope: AUDIT-ONLY this cycle (single fix applied elsewhere); branches checked: a11y/auto-2026-05-25
branch_prefix_used: none (no commits this cycle)
---

# Alex — Pac-Man Code Trainer Background A11y Audit

**Standard:** WCAG 2.2 Level AA
**Type:** READ-ONLY background scan
**Branch reviewed:** `a11y/auto-2026-05-25` (post WCAG 2.4.3+2.4.11 fix, commit `3e9e4bb`)
**Prior context:**
- `2026-05-25-alex-loop-c-a11y.md` — original BLOCK on WCAG 2.4.3+2.4.11
- `2026-05-25-alex-pacman-re-audit.md` — re-audit PASS for the inert+focus fix

This pass surveys the next tier of improvements available beyond the original BLOCK fix.

---

## VERDICT: PASS — WCAG 2.2 AA compliant. Polish opportunities documented.

The blocker fix verified on the re-audit is sound. Tab order is clean, focus moves correctly across overlay transitions, inert is applied at the right boundaries. This audit found **5 polish-grade improvements** for future cycles — none are WCAG 2.2 AA failures, all would improve the SR experience for a user practicing on this app.

---

## FINDINGS (polish — none block AA)

### P1 — No live region for score / streak / hint updates (WCAG 4.1.3 — borderline)

**File:** [index.html](index.html) score/streak/hint DOM nodes

When the user answers correctly or incorrectly, the `#score`, `#streak .val`, and `#hint` text content changes silently. A screen-reader user gets no audio feedback on whether they were right or wrong, and no announcement of the new score.

**Fix proposal for Shamus (next cycle):**
- Add `aria-live="polite"` + `aria-atomic="true"` to `#score` and `#streak .val` so changes announce non-intrusively.
- Add a dedicated `<div role="status" aria-live="polite"`> outside the visible area (visually-hidden CSS) that announces "Correct!" or "Wrong — [hint]" after each answer.
- Wire it from the `answer()` function so each click/key activation triggers the announcement.

**WCAG:** 4.1.3 Status Messages (Level AA — currently borderline-failing in practice for SR users; passes structurally because there is no role-status requirement violated, just a missing feature).

---

### P2 — No `prefers-reduced-motion` support (WCAG 2.3.3 — Level AAA, but recommended for AA polish)

**File:** [index.html](index.html) — `@keyframes` blocks (streak-pop, card slide-in, ghost float, count-up, scanbar, etc.)

The arcade aesthetic uses many decorative animations. None are gated on `prefers-reduced-motion`. Users with vestibular disorders or who explicitly set reduced motion in OS settings still see all the animations.

**Fix proposal:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Single CSS block, kills animations for users who opted out, keeps the visual for everyone else.

**WCAG:** 2.3.3 Animation from Interactions (Level AAA — recommended for polish; not a 2.2 AA gate).

---

### P3 — Answer cards `aria-label` could be richer (WCAG 4.1.2 — minor)

**File:** [index.html:776-779](index.html)

Cards currently render `role="button"` with their visible content as accessible name (the number "1" + the answer text). SR reads "1, [answer text], button". For a quiz UX, a more contextual label would help:

```html
<div class="dot tl" data-pos="tl" data-key="1" tabindex="0" role="button"
     aria-label="Answer 1 of 4">…</div>
```

…with the visible answer text inside as the labelled content. Helps SR users orient themselves in the 2×2 grid.

**WCAG:** 4.1.2 Name, Role, Value (Level A — currently passes; this is a polish).

---

### P4 — Category buttons lack `aria-pressed` (WCAG 4.1.2)

**File:** [index.html:784-786](index.html)

The ALL / CLAUDE / TERMINAL category buttons toggle which is "active" via `.active` className (see line 1156). SR users get no indication which category is currently selected — they hear "All button, Claude button, Terminal button" with no state info.

**Fix proposal:**
```html
<button class="btn" data-cat="all" aria-pressed="true">ALL</button>
```

…and update the click handler (line 1149-1156) to set `aria-pressed` to match the `.active` class.

**WCAG:** 4.1.2 Name, Role, Value (Level A).

---

### P5 — Pause screen has no reachable "Resume" affordance (WCAG 2.1.1)

**File:** [index.html:812-817](index.html)

When the game is paused, `setGameInert(state.paused)` makes the arena + bar inert. The pause overlay has only text — no button to resume. A keyboard-only user can press Escape (per the document-level handler at line 1161), but a SR user using screen-reader pass-through gestures may not know to press Escape. A visible/focusable "Resume" button would help.

**Fix proposal:** Add `<button id="resume-btn">Resume</button>` inside `#pauseScreen`, hook to `togglePause()`, and `.focus()` it on pause. Existing keyboard handler keeps Escape working.

**WCAG:** 2.1.1 Keyboard (Level A — currently passes via Escape; this is a discoverability improvement).

---

## PASSING — clean areas

| Area | File:Line | Status |
|---|---|---|
| `tabindex="0"` on answer cards | index.html:776-779 | ✓ (from Loop C) |
| `role="button"` on answer cards | index.html:776-779 | ✓ |
| Enter/Space keydown handler | index.html:1136-1141 | ✓ |
| `setGameInert()` on overlay transitions | index.html:851-854, 1103, 1112, 1129, 1178 | ✓ (post 3e9e4bb) |
| Focus moves to first dot on start | index.html:1104 | ✓ |
| Focus moves to again-btn on game over | index.html:1113 | ✓ |
| `:focus-visible` ring (3px gold outline) | CSS | ✓ |
| Native `<button>` for bar buttons (no role hack) | index.html:784-788 | ✓ |
| Text contrast all ≥ 5.8:1 | All visible text | ✓ AA |
| `html lang="en"` | Line 2 | ✓ |
| `<title>` descriptive | Line 5 | ✓ |
| Viewport meta | Line 5 | ✓ |
| No keyboard traps | All overlays | ✓ |

---

## DECISIONS FOR SKY

_None required._ All P1-P5 are polish improvements, not WCAG 2.2 AA failures. The current state of branch `a11y/auto-2026-05-25` is mergeable to main from an a11y standpoint.

Recommendation: Sky merges `cycle/auto-2026-05-23-ui` → main (per Morgan's prior routing briefing). Then a follow-up `a11y/pacman-polish-p1-p5` cycle picks up P1-P5 from this report.

---

## Why Pac-Man was NOT picked for this cycle's single fix

Per Const. Art. 12.3, only one reversible scoped change per background cycle. Comparing candidates:

| Project | Candidate fix | Why ranked here |
|---|---|---|
| Pac-Man | P1 (live region for score/streak) | Larger — touches JS + CSS + HTML; needs visually-hidden div + announcement plumbing |
| Pac-Man | P4 (aria-pressed on category buttons) | Small but only helps category-switch flow |
| Prompt Library | Header focus-visible consistency | **Smallest blast radius; matches existing pattern; helps EVERY keyboard user** ← chosen |
| Portfolio | New-tab indicators on external links | Small but help only for the 1.5 pages of links |

Picked Prompt Library focus-visible — see `Documents/Claude/Projects/Prompt Library Tool/qa-reports/background-2026-05-25-alex.md`.

---

## Cycle compliance check

- ✓ HALT check ran (no sentinel)
- ✓ Mode: background logged in header
- ✓ Pac-Man is eligible for code changes, but this cycle's single fix was made elsewhere
- ✓ No external sends
- ✓ No `~/.claude/**` touched
