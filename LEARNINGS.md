# LEARNINGS — Pac-Man Code Trainer

> This file distills durable, reusable lessons from the Pac-Man Code Trainer project.
> Generated from `DECISIONS_LOG.md` on 2026-06-03.
> Append new lessons here as they land in future build bursts.

---

## Green Gate Without TypeScript

**What we learned:**
This project has zero dependencies, no build, no framework, and no TypeScript. So the "typecheck safety net" other projects rely on doesn't exist. Instead, we use a **green gate** that replaces it:

```
node --check cards.js                                    # exit 0
open=$(grep -n '<script>' index.html | head -1 | cut -d: -f1)
close=$(grep -n '</script>' index.html | tail -1 | cut -d: -f1)
sed -n "$((open+1)),$((close-1))p" index.html | node --check -   # exit 0
# then: serve :8080, 0 console errors, smoke test (start · 4 dots · correct/wrong · C · L · localStorage)
```

The `<script>` bounds **must be re-derived with grep every time** — they drift as the HTML grows.

**Why it matters:**
Without a build step or a type system, runtime syntax errors can slip into production. The green gate is the canary. It catches malformed JS before shipping.

**How to apply it next time:**
- Run the green gate after **every step** (every phase, every commit).
- If you add lines to the `<script>` tag or near its close, re-derive the line numbers; don't reuse old ones.
- The gate is cheap; make it a habit, not an afterthought.

---

## localStorage Stays Additive — Never Rename Keys

**What we learned:**
The data layer is `localStorage['pmct.v1']` only. No database, no migrations. The schema is:
```javascript
{
  hi: string,             // username or display name
  category: string,       // 'all', 'claude', 'mac', 'git', etc.
  cardStats: {...},       // card-level metadata (mastered, difficulty, etc.)
  mode: 'arcade' | 'learn',
  // ... new keys added as needed
}
```

**The hard rule:** never rename `hi`, `category`, `cardStats`, or `mode`. If a rename is ever **forced** (e.g., a legacy key name becomes impossible), bump to `pmct.v2` with a migration function. Until then, add new fields via `Object.assign({defaults}, loadPersist())` so old saves continue to work.

**Why it matters:**
Users have saved games in localStorage. If you rename a key without a migration, their saved state vanishes. Additive changes (new fields) are safe; destructive ones (renames, deletes) break existing installs.

**How to apply it next time:**
- New state field? Add it to the `Object.assign({defaults}, ...)` default object. Old saves won't have it; the default fills in.
- Think twice before renaming. Is there a better way to extend the existing key?
- Only bump to `pmct.v2` if you have no other choice, and write the migration inline.

---

## Always Use textContent — Never innerHTML (Even for Trusted Card Data)

**What we learned:**
Card data (prompt, hint, explain, decoys) is authored by maintainers and stored in `cards.js`. It's "trusted" in the sense we wrote it, but **use `textContent` everywhere**, never `innerHTML`.

The `renderExplain()` function and all card-derived text rendering must go through `textContent` only.

**Why it matters:**
Even trusted data can become an injection vector if the code is refactored or if a future feature (like importing user-written cards or external content) is added. Defense-in-depth: treat all card data as untrusted.

**How to apply it next time:**
- Any time you render `card.prompt`, `card.hint`, `card.explain`, `card.answer`, or anything from the card object, use `textContent`.
- If you need HTML formatting (e.g., `<br>`), use `createElement` and `appendChild` instead.
- Make it a style rule, not an exception.

---

## Decoy Quality: Aliases Must Not Be Real Answers

**What we learned:**
In Phase 3, a bug shipped: `claude -r` and `claude -p` were used as wrong-answer decoys in the Claude Code cards. But those are **real aliases** of the actual commands (`claude run`, `claude profile`). A player who knew the aliases but not the full commands could guess wrong and still be correct.

Phase 6 caught this proactively in the GIT cards and applied the fix: **a decoy must never be a real alias, abbreviation, or alternate spelling of the correct answer.**

**Why it matters:**
A decoy that's a real alternative teaches the wrong lesson. The game rewards memorizing the exact answer, not learning a related-but-wrong shortcut.

**How to apply it next time:**
- When authoring decoys, ask: "Is this decoy a real alias of the correct answer?"
- Check official docs (Claude Code, Mac terminal, Git) for aliases and abbreviations.
- Prefer decoys that are **plausibly wrong** but not officially valid.

---

## Branch Base: Always Use the Cumulative Shamus Tip, Not origin/main

**What we learned:**
This project started with `origin/main` at the Initial commit. Early agent work (Learning Mode, card validation, lifeines) was committed to local `main`, making it +21 commits ahead of the remote. When starting a new burst, the branch base must be **local `main` (the cumulative tip)**, not `origin/main` (the stale remote).

**Why it matters:**
If you branch off `origin/main`, you'll have merge conflicts with all the work that's already shipped locally. Using the cumulative local tip keeps your burst in sync with reality.

**How to apply it next time:**
- Check where `origin/main` points. If it's behind local `main`, branch off local `main`.
- Verify with `git log main..origin/main` — if it's empty, they're in sync. If not, local is ahead.
- Before a burst, run `git branch burst/... main` (not `origin/main`).

---

## Fresh Card Authoring > Cherry-Picking Stale Branches

**What we learned:**
The GIT cards feature (`feat/auto-2026-05-25-shamus-git-*`) was drafted on an old branch with a stale base. Phase 3 refactored the card ternary logic, so cherry-picking the old UI commit would cause a conflict and require manual rebasing. Instead, **we wrote the GIT cards fresh** in Phase 6, reusing the refactored patterns.

**Why it matters:**
Stale branches introduce merge debt. Writing fresh is faster than debugging a 2–3 week old rebase conflict, especially when the original code patterns have already been superseded.

**How to apply it next time:**
- If a feature branch is >2 weeks old and its base has been refactored significantly, write fresh.
- Copy the *content* (card data, specs), not the *code*. Use the latest patterns.
- Saves merge headaches and keeps the history clean.

---

## main Is Sky's Hand Only — Never Agent-Delegate

**What we learned:**
Constitution Article 1 is a hard stop: agents cannot merge to `main`, even with Sky's in-session approval in the chat. This was tested once (Sky said "merge it") and explicitly declined.

The correct flow is:
1. Agent finishes the work on a feature branch.
2. Morgan updates Sky on the status.
3. Sky runs the merge command directly (`git merge --ff-only burst/...`).

**Why it matters:**
`main` is the source of truth. Only the project owner should move it. Delegating merges to agents blurs accountability and can introduce unintended commits if an agent misunderstands the intent.

**How to apply it next time:**
- Never offer to merge to `main`, even if asked.
- Write all work to a feature branch.
- Surface the branch to Morgan/Sky for their explicit merge.

---

## PLAN.md Is the Living Roadmap — Read Before Replanning

**What we learned:**
PLAN.md lives in the project root and defines the persistent roadmap. Each build burst reads PLAN.md before deciding what to build. This prevents re-deciding phases or duplicating work.

When a phase is done, it's marked **DONE** in the phase table. When a new phase is queued, it moves to the **NEXT** row. Phases are **strictly sequential** — never parallel, because every phase edits the same 2 files.

**Why it matters:**
In a fragmented project with multiple agents and long build cycles, it's easy to step on each other's work. PLAN.md is the single source of truth for what's being built and in what order.

**How to apply it next time:**
- Open PLAN.md at the start of your burst.
- Check which phase is marked **NEXT**.
- After your phase is done, update PLAN.md to mark it **DONE** and the next phase as **NEXT**.
- Never skip a phase or start a phase out of order (unless Sky explicitly authorizes it).

---

## Lifeline State Is Session-Only, Not Persisted

**What we learned:**
The 50/50 Lifeline feature (H key, 3 per game) tracks `state.lifelinesLeft` in memory. It resets to 3 at the start of each game (`startGame()`), not on app open. It is **never saved to localStorage**.

**Why it matters:**
Lifelines are a meta-game mechanic meant to balance a single play session. Persisting them would let a player hoard lifelines across multiple sessions, breaking the difficulty curve. Session-only keeps the game fair and predictable.

**How to apply it next time:**
- If you add a new in-game state that's meant to reset between games, keep it session-only (no persist).
- Only persist data that the player needs to remember across app restarts (e.g., username, category preference, card statistics).

---

## Design Compiler Is the Gate for UI Changes

**What we learned:**
Pac-Man follows the Constitution Article 2.4 Design Compiler — a 7-layer compile gate before UI changes are marked DONE:

1. **Tokenization** — use design tokens, not raw hex/numbers.
2. **Accessibility Parity** — color contrast, screen-reader text, focus rings.
3. **Component Consistency** — reuse existing `.btn`, `.card`, etc. classes.
4. **Visual Entropy** — alignment, spacing, weight consistency.
5. **Luxury UI Score** — polish, motion, delight.
6. **Regression Safety** — no unintended side effects.
7. **Compile Decision** — COMMIT (ship), POLISH (refine), BLOCK (rework), or ESCALATE.

Phase 6's GIT filter button is a UI surface, so it must pass the Design Compiler before being marked DONE. Shamus predicted COMMIT (it reuses the `.btn` class and aria patterns identical to CLAUDE and TERMINAL buttons).

**Why it matters:**
UI changes affect user perception and accessibility. The Compiler ensures new UI doesn't degrade the experience or introduce a11y regressions. It's not bureaucracy; it's a safety net.

**How to apply it next time:**
- If your phase includes a UI change, route it to Dani (design) for the 7-layer gate.
- Don't mark UI DONE until the Compiler returns COMMIT.
- If it returns POLISH, refine and re-gate. If BLOCK, rework the approach.

---

## Decoupling: Branch-Local State vs. Persistent State

**What we learned:**
By Phase 4, we'd accumulated state fields that fell into two camps:

- **Session-only:** `state.lifelinesLeft`, `state.missedThisRun`, `state.current`, `state.score`.
- **Persistent:** `hi`, `category`, `cardStats`, `mode`.

The pattern is: add session fields directly to `state`; add persistent fields to the default object in `loadPersist()`. This keeps the code mental model clean.

**Why it matters:**
Conflating session and persistent state makes it hard to reason about what gets reset on game-over vs. app-close. Separation makes the code self-documenting.

**How to apply it next time:**
- New feature has data that survives game-over? Add to `cardStats` (or a new field in the default object).
- New feature has data that resets on game-over? Add to `state` during `startGame()`.
- Question everything that touches localStorage; only persistent logic should touch it.

---

## Continuous Integration as a Habit, Not an Afterthought

**What we learned:**
Phase 5 formalized CI with `.github/workflows/ci.yml`, mirroring the local green gate. The workflow runs on every push:

```yaml
- node --check cards.js
- extract + validate inline <script>
- node test/cards.test.js
- browser smoke test (start, 4 dots, navigate modes)
```

Before Phase 5, we were running the gate manually. Formalizing it caught edge cases (e.g., empty-deck phantom scoring in Phase 6).

**Why it matters:**
Manual gates are forgotten. Automated gates catch regressions before they hit users.

**How to apply it next time:**
- Add CI to any project from the start. Even a vanilla JS project deserves `npm test` + syntax check.
- Run CI locally before every commit. Make it a habit.
- If CI fails, fix the root cause (not the test) before pushing.

---

## Constitutional Guardrails Are Not Optional

**What we learned:**
The Constitution (Sky's global project rules) includes hard stops:
- Never merge to `main` (agent delegated).
- Never apply migrations directly to a live database.
- Never commit credentials or secrets.
- Never send external side effects (app-store submit, webhook, etc.) without explicit approval.

These aren't suggestions or best practices; they're laws. When in doubt, escalate to Sky.

**Why it matters:**
These guardrails exist because mistakes at scale are costly. A mis-merged commit, a leaked credential, or an unintended external call can break the build or leak data. They're there to protect the project and the user.

**How to apply it next time:**
- Read `~/.claude/CONSTITUTION.md` before starting any work.
- If you hit a conflict between a task and the Constitution, stop and escalate.
- The Constitution wins, always.

---

## Ghost Code Is a 4-Token Quiz, Not a Moving Maze

**What we learned:**
Despite the Pac-Man styling, there is **no maze, no continuous movement, no chasing ghosts, no arrow-key driving.** The Phantom sits at the centre of the arena; four command **tokens** sit at N/E/S/W; you pick the right command (tap, swipe toward it, press `1`–`4`, or Tab+Enter) and the Phantom *rotates to aim* at your choice. Input is `1`/`2`/`3`/`4` + letter shortcuts (`R`/`Esc`/`H`/`L`/`C`) — never arrow keys.

**Why it matters:**
Requests framed around classic Pac-Man ("swipe-to-turn", "d-pad", "queue the next turn", "responsive maze grid") don't map. The right adaptation is directional: a **swipe up/right/down/left selects the matching compass token**, and tapping a token is the primary input. A d-pad is redundant — the tokens *are* the directional targets.

**How to apply it next time:**
- Don't add maze/movement mechanics. The "game feel" is: read prompt → choose one of 4 compass tokens → Phantom aims → correct/wrong.
- Any new input modality should resolve to `answer(tokenEl)` and respect the same guard as keydown (`!playing || paused || busy || learnRevealed`).

---

## Mobile: Fluid Base + One Portrait Media Query, Measured Not Eyeballed

**What we learned:**
The desktop layout is absolutely-positioned at fixed pixels. The clean way to make it phone-native without disturbing desktop:
1. Make sizes **fluid with `clamp()`/`min()` where the desktop value is the upper bound** (e.g. `width: min(580px, 90vw)`, `clamp(110px, 36vw, 200px)`) — desktop resolves to its exact old value, phones shrink.
2. Put the portrait re-anchoring in **one `@media (max-width: 600px)` block** (mode toggle, HUD wrap, diamond centre/scale, hint/bar, learn-panel re-anchor).
3. **Tune by measuring `getBoundingClientRect()` in the live page, not by eye.** Collisions (HUD↔prompt, S-token↔hint↔bar, hint-panel↔N) were all found and fixed by reading rects under real 375/390 emulation — and stress-tested with the *longest* prompt and the *tallest* (reveal) learn panel.

Learn mode is the tricky one: a taller HUD (LEARN badge) + progress bar + an opaque hint panel that covers the prompt. The panel is capped (`max-height: 44vh; overflow-y:auto`) so long reveal phases scroll instead of overflowing, and the diamond drops lower (`body.learning-mode #arena{top:62%}`) so the short pre-hint clears the N token.

**How to apply it next time:**
- Don't scale the whole cabinet with `transform: scale()` — it shrinks tap targets below the WCAG 2.5.8 floor. Scale dimensions/fonts instead.
- After any layout change, re-measure rects in both modes before trusting a screenshot.

---

## Headless-Screenshot Gotchas (true phone shots for Sky)

**What we learned:**
Two traps when producing real phone-width PNGs:
1. **`--window-size` below ~500px crops, not shrinks** (headless Chrome's min layout viewport). Use **`Emulation.setDeviceMetricsOverride`** via the DevTools Protocol (390×844 @2× = a true 780-wide image) for accurate phone layout — and it lets you `setTouchEmulationEnabled` so touch-only media (`.touch-device`, `pointer:coarse`) renders.
2. **Chrome 148's HTTP `/json` endpoint can be unavailable**, but it always prints the browser WebSocket URL to **stderr** (`DevTools listening on ws://…`). Launch with `--remote-allow-origins=*`, parse that line from stderr, then `Target.createTarget` (flatten sessions). Polling `/json/version` over HTTP is flaky; parsing stderr is robust. (Reusable helper: `/tmp/ghostshot.py`.)

**How to apply it next time:**
- For any "send Sky a phone screenshot" task, use device-metrics emulation + stderr ws parsing, not raw `--window-size`. The Preview MCP `preview_resize mobile` is great for *verification* but doesn't emulate pointer type and can't hand you a file.

---
