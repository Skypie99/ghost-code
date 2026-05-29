---
mode: background
model_tier: opus-4.7
project: pacman-code-trainer
cycle_id: dana-background-2026-05-25
role: Dana (Backend & Database Engineer)
branch: (none this cycle — single cycle change spent elsewhere)
base: main
constitution: v1.11 / AGENT_OS v1.11
art_12_compliance: HALT-check passed; ≤1 reversible change rule honored (no change applied to this project this cycle); ~/.claude/** and ~/ClaudeCorp/.claude/** untouched
---

# Dana — Pac-Man Code Trainer background cycle 2026-05-25

## Posture for this cycle

No live database, no backend. Data layer = `cards.js` (the deck) +
`localStorage['pmct.v1']` (persistent state). Project is eligible for
the single per-cycle change (Const. 12.3) but the priority slot is being
spent on a higher-impact eligible project (Prompt Library — see
`background-2026-05-25-dana.md` there). This report is observation only.

## Baseline

**Deck file:** [cards.js](cards.js), 179 lines, 40 cards (20 claude, 20 mac).
Loaded via `<script src="cards.js">` in [index.html:583](index.html:583)
as `window.CARDS`. No build step; deck reload requires a tab refresh
(comment at top of cards.js says exactly this).

**localStorage shape** ([index.html:589–620](index.html:589)):
- Key: `pmct.v1` (versioned namespace ✓ good practice)
- Persisted shape (defaults via `Object.assign`):
  ```js
  {
    hi: 0,                  // high score
    category: 'all',        // 'all' | 'claude' | 'mac'
    cardStats: {}           // { [cardId]: { c: number } } — correct-count per card
  }
  ```

**Runtime state** (ephemeral, not persisted): `score`, `lives`, `streak`,
`current`, `busy`, `paused`, `playing`.

## Findings

### F1 — `STORAGE_KEY = 'pmct.v1'` is versioned but there's no version check on load 🟢 low

[index.html:611–614](index.html:611):
```js
const loadPersist = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};
```

The key is `pmct.v1` — the `.v1` suffix is the version channel. If the
shape ever changes (e.g. `cardStats[id]` grows fields like
`{c: 5, lastSeen: 1700000000}`), bumping to `pmct.v2` and adding a
migration step would be the move. Today, the persisted shape is simple
enough that even a totally foreign blob would `Object.assign` over the
defaults and the missing fields fall through to default values — which
is functionally a migration-by-merge.

**Why it's still safe today:** the shape hasn't changed. `Object.assign`
ignores extra keys and supplies defaults for missing ones, so a
forward-compatible read is implicit.

**Recommendation (deferred, not actioned this cycle):** when the shape
DOES change, wrap the load in a one-pass migrator:

```js
const STORAGE_KEY = 'pmct.v2';
const LEGACY_KEY  = 'pmct.v1';
const loadPersist = () => {
  // Try current
  try {
    const cur = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (cur && typeof cur === 'object') return cur;
  } catch {}
  // Try legacy → migrate forward
  try {
    const v1 = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (v1 && typeof v1 === 'object') {
      const v2 = migrateV1ToV2(v1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v2));
      return v2;
    }
  } catch {}
  return {};
};
```

### F2 — `save()` does not catch QuotaExceededError or write failure 🟢 low

[index.html:610](index.html:610):
```js
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.persist));
```

On Safari private browsing or quota-exceeded, this throws. The current
deck is ~40 cards × 1–2 fields per stat = trivial size, so quota is not
a realistic concern. But Safari private-window throws on the *first*
setItem unconditionally — every game in a private tab would error in
the console on first save.

**Why it's still safe today:** the throw is silent (the calling code
doesn't await save() or handle the rejection — `setItem` is synchronous
so the next line just keeps running on most browsers). The high score
won't persist but the game continues. The user sees no error.

**Recommendation (deferred):**
```js
const save = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.persist)); }
  catch (e) { /* private-mode or quota — high score is in-memory only */ }
};
```

### F3 — `state.persist.cardStats[card.id]` writes are unbounded 🟢 low

[index.html:714](index.html:714) reads `cardStats`; correctness depends
on `card.id` being unique across the deck. I confirmed:

```bash
grep -E 'id:\s*"' cards.js | awk -F'"' '{print $2}' | sort | uniq -d
# (empty output — no duplicate IDs)
```

All 40 IDs are unique. If a future card-author copies an existing block
and forgets to change the ID, the new card silently inherits the prior
card's stats. No protection — but `cards.js` lives next to a comment at
the top reminding authors to give each card a unique ID. Acceptable as
an honor-system invariant for a 40-card hobby deck.

**Recommendation (deferred — only if deck grows past ~100 cards):**
add a dev-mode dupe check on load:
```js
// at the bottom of cards.js, dev-only
(function checkUniqueIds() {
  const ids = window.CARDS.map(c => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) console.warn('Duplicate card IDs:', dupes);
})();
```

### F4 — `cardStats` entries persist after a card is deleted from the deck 🟢 low

If `cards.js` removes a card (e.g. `cc-clear` retires), the user's
`cardStats['cc-clear'] = { c: 12 }` lives forever in localStorage. The
game gracefully ignores unknown-card stats because `pickCard()` only
walks `window.CARDS`, so the entry never affects gameplay — but it
bloats the persisted blob over time.

**Why it's still safe today:** in a 40-card deck, even if every card got
deleted and replaced, you'd accumulate ~40 stale entries per generation.
Negligible. JSON blob remains < 4 KB.

**Recommendation (deferred):** prune unknown IDs on save:
```js
const save = () => {
  const valid = new Set(window.CARDS.map(c => c.id));
  for (const id of Object.keys(state.persist.cardStats)) {
    if (!valid.has(id)) delete state.persist.cardStats[id];
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.persist)); } catch {}
};
```

### F5 — `category` enum lives in three places — drift risk 🟢 low

The category value `'all' | 'claude' | 'mac'` appears in:
1. `cards.js` — `category: "claude"` / `category: "mac"` on each card.
2. `index.html:667` — `activeDeck()` filter logic.
3. `index.html:822` — `order` array for the cycle-category button (need
   to verify the exact list).

A new category (e.g. `'git'`) requires editing all three. No central
constant. For a 40-card flat-file game this is fine — but documenting it
because it's the kind of thing future-Dana or a contributor would trip
on.

**Recommendation (deferred — only if adding a 4th category):** lift the
list to a module-level constant in `cards.js`:
```js
window.CATEGORIES = ['all', 'claude', 'mac'];
```

## What I checked and didn't find

- No `cards.json` or other external data file. Single source of truth ✓.
- No HTTP fetch in `index.html` — fully offline-first, no API calls.
- No cookies, no sessionStorage. Single persistence channel
  (`localStorage`) which is correct for this scope.
- No duplicate card IDs (confirmed via grep + uniq).
- `Object.assign` merge in `loadPersist` correctly defaults missing keys.

## Decisions for Sky

None this cycle. Pac-Man data layer is in good shape for a hobby project;
the five findings above are all "consider when X grows" follow-ups, not
present bugs. The single per-cycle change (Const. 12.3) is being spent on
Prompt Library where the impact is higher.

## What I did NOT touch (Const. Art. 12 compliance ledger)

- Wrote nothing to `~/.claude/**` or `~/ClaudeCorp/.claude/**`.
- Made no changes to `cards.js` or `index.html`.
- Made no commits.
- Sent no external messages.

## End of cycle

Morgan picks up. Pac-Man's data layer is correct for its current shape.
