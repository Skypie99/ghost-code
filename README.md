# Ghost Code

A retro arcade flashcard game for memorizing Claude Code commands, Mac terminal commands, and Git. Guide the Phantom — a spectral terminal cursor — and capture the right command token. A wrong guess costs a spirit.

## Play it

Double-click `index.html`. That's it — it opens in your default browser.

(Or from the terminal: `open ~/Games/pacman-code-trainer/index.html`.)

**Controls:** mouse, or `1` `2` `3` `4` for the four command tokens. `R` restart. `Esc` pause. `C` cycle category. `H` 50/50 lifeline. `L` toggle Learn Mode.

## Game modes

**Arcade Mode** — 3 spirits. A wrong answer costs one spirit and flashes danger. Aim for score and streak.

**Learn Mode** — No spirit loss. Wrong answers escalate: hint → retry → reveal. Use it to study before going for score.

## Add a card

1. Open `cards.js` in any text editor.
2. Copy the last `{ ... }` block, paste it on a new line, change the words.
3. Save. Refresh the game tab.

Example — adding a card for `git status`:

```js
{ id: "git-status", category: "git",
  prompt: "Show which files you've changed in the current git repo",
  answer: "git status",
  decoys: ["git diff", "git log", "git changes"],
  hint: "Same word your laundry app uses." },
```

Categories: `"claude"` (Claude Code), `"mac"` (Mac terminal), `"git"`. You can invent new ones — just add a matching filter button if you want it on its own toggle.

## Files

- `index.html` — the whole game (HTML + CSS + JS, no build step).
- `cards.js` — the flashcard deck.
- `assets/` — empty for now; reserved for sounds/sprites.

Your high-score and mastered commands live in browser `localStorage` under the key `gc.v1`. Clearing site data wipes your progress.
