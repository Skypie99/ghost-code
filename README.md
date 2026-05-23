# PAC-MAN CODE TRAINER

A retro arcade flashcard game for memorizing Claude Code commands and Mac terminal commands. Click the right command-dot, Pac-Man chomps it. Click the wrong one, a ghost takes a life.

## Play it

Double-click `index.html`. That's it — it opens in your default browser.

(Or from the terminal: `open ~/Games/pacman-code-trainer/index.html`.)

**Controls:** mouse, or `1` `2` `3` `4` for the four dots. `R` restart. `Esc` pause. `C` cycle category.

## Add a card

1. Open `cards.js` in any text editor.
2. Copy the last `{ ... }` block, paste it on a new line, change the words.
3. Save. Refresh the game tab.

Example — adding a card for `git status`:

```js
{ id: "git-status", category: "mac",
  prompt: "Show which files you've changed in the current git repo",
  answer: "git status",
  decoys: ["git diff", "git log", "git changes"],
  hint: "Same word your laundry app uses." },
```

Categories so far: `"claude"` (Claude Code) and `"mac"` (terminal). You can invent new ones — just add a matching filter button later if you want it on its own toggle.

## Files

- `index.html` — the whole game (HTML + CSS + JS).
- `cards.js` — the flashcard deck.
- `assets/` — empty for now; reserved for sounds/sprites.

Your high-score and mastered cards live in browser `localStorage`, so clearing site data wipes your progress.
