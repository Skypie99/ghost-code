# Rory — Ghost Code Pass 1 + Pass 2 merge to local main

**Date:** 2026-06-17 · **Role:** Rory (DevOps/Release)
**Authorization:** Sky's DIRECT instruction this interactive session ("do pass 3 … make rory merge first if needed, that's his thing"). This overrides the Ghost-Code "Sky's-hand-only" default and the pending Dani Design-Compiler gate. NOT done under the Art. 17 standing grant (that grant is Prompt-Library-only; Ghost Code is out of its scope).

## Action
Fast-forward merge of the stacked overhaul branches into **LOCAL main**:
- pre-merge `main` = `origin/main` = **48af607**
- `feat/ghost-code-pass2-layout-2026-06-17` = **1991445** (stacked on Pass 1 `903af11`) — linear descendant of main → clean `--ff-only`.
- Result: `git merge --ff-only` → **main is now 1991445** (Updating 48af607..1991445, Fast-forward, 3 files changed).

Contents now on main: Pass 1 (defect repair — learn-panel textContent, opaque overlays, deck guard) + Pass 2 (layout integrity — flex-column flow, no overlap at any viewport, D6 learn question visible).

## Gate checks
- **Green gate on main: PASS** — `node --check cards.js` ✓ · extracted inline `<script>` `node --check` ✓ · `node test/cards.test.js` → 56 cards pass ✓.
- Clean fast-forward (no merge commit, no conflicts).

## NOT pushed — live deploy held
- **`origin/main` is UNCHANGED at 48af607.** Local main is ahead by 2 commits. The live site (ghostcode.skypistudio.com, GitHub Pages off `main`) is **unchanged**.
- **Why no push:** pushing Ghost Code's main is a live production deploy = a prohibited agent external side effect (Art. 17 merge+push carve-out is Prompt-Library-ONLY). Also the passes are **Chromium-only verified** — no Safari/WebKit/real-device check — which is on the Art. 17.4 always-escalate list. **The push/deploy is held for Sky's explicit go**, ideally after a real-device cross-engine check.

## Rollback
Local, fully reversible (nothing pushed):
```
git checkout main && git reset --hard 48af607
```

## Notes / DECISIONS FOR SKY
- **Dani Design-Compiler gate was bypassed** on the UI-touching changes (D4 opacity, the Pass 2 composition changes) per Sky's direct merge instruction. Recommend a retro Design-Compiler pass before the live deploy, alongside Pass 3.
- **To deploy live:** Sky runs `git push origin main` (or authorizes it explicitly) — after a Safari/iOS + real-device check, since all verification so far is single-engine Chromium.
- Pass 3 (visual modernization) will branch off the new main (`1991445`).
