// =======================================================
//  PAC-MAN CODE TRAINER — Card Deck Validator
// -------------------------------------------------------
//  Zero-dependency Node test. Loads cards.js and checks every
//  card for the integrity rules the game depends on. Catches
//  the kinds of bugs that creep in when you copy-paste a card
//  and forget to change something:
//
//    - duplicate id
//    - missing field
//    - duplicate / wrong-count decoys
//    - answer accidentally listed as a decoy
//    - empty strings or non-string values
//    - unknown category
//    - bad difficulty value / empty explain (optional fields)
//
//  Run:  node test/cards.test.js
//  Exits non-zero on first failure so CI / pre-commit can use it.
// =======================================================

const fs = require("fs");
const path = require("path");

const VALID_CATEGORIES = new Set(["claude", "mac", "git"]);
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const REQUIRED_FIELDS = ["id", "category", "prompt", "answer", "decoys", "hint"];
const DECOY_COUNT = 3;

// cards.js assigns to window.CARDS — give it a window object and eval.
const cardsPath = path.resolve(__dirname, "..", "cards.js");
const cardsSource = fs.readFileSync(cardsPath, "utf8");
const sandbox = { window: {} };
// eslint-disable-next-line no-new-func
new Function("window", cardsSource)(sandbox.window);
const CARDS = sandbox.window.CARDS;

const failures = [];
function fail(msg) {
  failures.push(msg);
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

// ── Structural checks ───────────────────────────────────────
if (!Array.isArray(CARDS)) {
  fail("window.CARDS is not an array");
} else if (CARDS.length === 0) {
  fail("window.CARDS is empty");
}

const seenIds = new Set();

(CARDS || []).forEach((card, i) => {
  const tag = `card[${i}] (id=${card && card.id ? card.id : "?"})`;

  if (!card || typeof card !== "object") {
    fail(`${tag}: not an object`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in card)) fail(`${tag}: missing field "${field}"`);
  }

  if (!isNonEmptyString(card.id)) fail(`${tag}: id must be a non-empty string`);
  if (card.id && /\s/.test(card.id)) fail(`${tag}: id must not contain whitespace`);
  if (card.id && seenIds.has(card.id)) fail(`${tag}: duplicate id "${card.id}"`);
  if (card.id) seenIds.add(card.id);

  if (!VALID_CATEGORIES.has(card.category)) {
    fail(`${tag}: category "${card.category}" not in {${[...VALID_CATEGORIES].join(", ")}}`);
  }

  if (!isNonEmptyString(card.prompt)) fail(`${tag}: prompt must be a non-empty string`);
  if (!isNonEmptyString(card.answer)) fail(`${tag}: answer must be a non-empty string`);
  if (!isNonEmptyString(card.hint)) fail(`${tag}: hint must be a non-empty string`);

  if (!Array.isArray(card.decoys)) {
    fail(`${tag}: decoys must be an array`);
  } else {
    if (card.decoys.length !== DECOY_COUNT) {
      fail(`${tag}: decoys must have ${DECOY_COUNT} entries (has ${card.decoys.length})`);
    }
    card.decoys.forEach((d, j) => {
      if (!isNonEmptyString(d)) fail(`${tag}: decoys[${j}] must be a non-empty string`);
      if (d === card.answer) fail(`${tag}: decoys[${j}] duplicates the answer ("${d}")`);
    });
    const uniqueDecoys = new Set(card.decoys);
    if (uniqueDecoys.size !== card.decoys.length) {
      fail(`${tag}: decoys contain duplicates`);
    }
  }

  // Optional fields — validate only when present (backward-compatible).
  if ("difficulty" in card && !VALID_DIFFICULTIES.has(card.difficulty)) {
    fail(`${tag}: difficulty "${card.difficulty}" not in {${[...VALID_DIFFICULTIES].join(", ")}}`);
  }
  if ("explain" in card && !isNonEmptyString(card.explain)) {
    fail(`${tag}: explain, when present, must be a non-empty string`);
  }
});

// ── Report ──────────────────────────────────────────────────
if (failures.length === 0) {
  console.log(`OK — ${CARDS.length} cards passed all integrity checks.`);
  process.exit(0);
}

console.error(`FAIL — ${failures.length} issue(s) in ${cardsPath}:`);
for (const f of failures) console.error(`  • ${f}`);
process.exit(1);
