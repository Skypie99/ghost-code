# Peter — Pac-Man Code Trainer Night-Shift Audit (2026-05-25)

**Mode:** BACKGROUND (Const. Art. 12) · **Project tier:** eligible for 1 reversible change
**Reporter:** Peter (performance)

---

## Pass 1 — Regression Review

No commits in the last 12 hours. Nothing new to regression-audit.

---

## Pass 2 — Scale Baseline (light)

Hand-walked [index.html](index.html) (838 lines) and [cards.js](cards.js) (179 lines):

| Concern | Observation | Verdict |
|---|---|---|
| Animation pipeline | No `requestAnimationFrame` loop. Animation is CSS-class-driven (`.eaten`, `.correct`, `.wrong`) with `setTimeout` for cleanup. Ghosts auto-`remove()` after 1700 ms. | ✅ Event-driven, no idle frame churn. |
| Event-listener leaks | All listeners attached **once at startup** (lines 800–831). `DOM.dots` and category buttons are cached refs, not re-queried. | ✅ No leaks. |
| Hot-path DOM queries | `DOM.dots` cached via `Array.from(document.querySelectorAll('.dot'))` once. `answer()` uses `DOM.dots.find(...)` — O(4) — fine. | ✅ |
| localStorage I/O | `save()` is called once per answer. `cardStats` grows by 1 entry per unique card. With ~100 cards, the JSON blob is ~3 KB. | ✅ Fine. |
| Audio | `WebAudio`/oscillator-based beeps. Created per call; not pooled. Negligible overhead. | ✅ |

### One nice-to-have (Pass 3 scale-lens)

The `cards.js` array is shipped inline (no fetch). Growing the deck to 1,000+ cards would make the initial parse cost rise, but at the current ~100-card size it's invisible. Flag for revisit if Sky ever balloons the deck past 500 cards.

---

## Pass 3 — No-op

Nothing to apply here this cycle. Pac-Man is in good shape.

---

## Decisions for Sky (via Morgan)

None.

## What I did NOT do (and why)

- Did NOT apply any change to Pac-Man this cycle — no defensible perf win at current scale; budget went to Prompt Library (see that project's report).
