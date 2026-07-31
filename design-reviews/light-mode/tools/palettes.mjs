// ─────────────────────────────────────────────────────────────────────────────
// GHOST CODE — LIGHT MODE — candidate palettes.
//
// SINGLE SOURCE OF TRUTH. Both the contrast checker (contrast.mjs) and the
// mockup renderer (mockups.mjs) import from here, so a number Sky sees in the
// contrast table is by construction the number that rendered in the mockup.
//
// THE DESIGN LAW: a light theme for a dark-identity project is a DESIGNED
// SIBLING, never an inversion. Ghost Code's identity is: one phosphor-teal
// accent, graphite surfaces, mono commands with a "> " prefix, and colour
// reserved for MEANING. In light that means:
//   • the teal must DARKEN to survive on a light surface, while staying
//     recognisably the same teal (hue held ~172-176°, never re-hued);
//   • success/warning/danger must be RE-PICKED (the dark values are 1.7-2.9:1
//     on white — all three fail);
//   • the white "lift" washes must become BLACK lifts;
//   • glows must become rings/shadows — a bloom on a light surface is a smudge.
// ─────────────────────────────────────────────────────────────────────────────

/** The shipped dark theme, transcribed from :root — the identity reference. */
export const DARK = {
  key: 'dark',
  label: 'Dark (shipped)',
  tokens: {
    'surface-base': '#0E1116',
    'surface-raised': '#161B22',
    'surface-token': '#1C232E',
    'border-subtle': '#2A323D',
    'border-strong': '#3A4453',
    'text-primary': '#E6EDF3',
    'text-secondary': '#9DA7B3',
    'accent': '#3DD8C4',
    'accent-quiet': '#1E6F66',
    'accent-hover': '#5FE6D4',
    'accent-subtle': '#BFF5EE',
    'accent-deep': '#1E6F66',
    'success': '#4ADE80',
    'warning': '#FBBF24',
    'danger': '#F87171',
    'ink-on-accent': '#0E1116',
    'accent-rgb': '61,216,196',
    'success-rgb': '74,222,128',
    'danger-rgb': '248,113,113',
    'warning-rgb': '251,191,36',
    'muted-rgb': '157,167,179',
    'overlay-rgb': '255,255,255',
    'scrim-rgb': '8,11,16',
  },
};

// ── Candidate A — PAPER ──────────────────────────────────────────────────────
// Direction: warm off-white, like a laser-printed terminal manual. The greys
// carry a red-yellow cast. Against warm paper the teal reads COOLER and more
// deliberate — the highest identity contrast of the three. Register: a
// developer's notebook, ink on stock.
export const PAPER = {
  key: 'paper',
  label: 'A · Paper — warm off-white, ink-on-stock',
  blurb:
    'Warm paper surfaces with a red-yellow cast in the greys. The teal reads cooler and more ' +
    'deliberate against warmth, so the accent gets LOUDER without getting brighter. Reads like ' +
    'a printed manual for the terminal.',
  tokens: {
    'surface-base': '#FAF7F2',
    'surface-raised': '#FFFFFF',
    'surface-token': '#F4F0E8',
    'border-subtle': '#E3DCD0',
    'border-strong': '#867F72',   // 3.71:1 on base — clears SC 1.4.11
    'text-primary': '#1E1A14',
    'text-secondary': '#5F584C',
    'accent': '#0C6F62',
    'accent-quiet': '#CFEAE4',   // FILL tint (dark ink sits on it)
    'accent-hover': '#0A5C51',
    'accent-subtle': '#0F8071',  // gradient HIGHLIGHT end — 4.52:1 on base
    'accent-deep': '#063D36',    // gradient SHADOW end — 11.37:1 on base
    'success': '#106B36',
    'warning': '#7A5205',
    'danger': '#B3261E',
    'ink-on-accent': '#FFFFFF',
    'accent-rgb': '12,111,98',
    'success-rgb': '16,107,54',
    'danger-rgb': '179,38,30',
    'warning-rgb': '122,82,5',
    'muted-rgb': '95,88,76',
    'overlay-rgb': '0,0,0',
    'scrim-rgb': '30,26,20',
  },
};

// ── Candidate B — PLATINUM ───────────────────────────────────────────────────
// Direction: cool blue-grey — the literal light twin of the shipped graphite.
// The dark theme's base is a blue-black; its sibling is a blue-white. Also
// conserves the palette: the dark theme's #0E1116 base becomes the light
// theme's INK. Register: the same developer tool, in daylight.
export const PLATINUM = {
  key: 'platinum',
  label: 'B · Platinum — cool blue-grey, the graphite in daylight',
  blurb:
    'The literal sibling: the shipped graphite is a blue-black, so its light twin is a ' +
    'blue-white. Conserves the palette — the dark theme\'s #0E1116 surface becomes the light ' +
    'theme\'s ink. Same room, other lighting.',
  tokens: {
    'surface-base': '#F3F6FA',
    'surface-raised': '#FFFFFF',
    'surface-token': '#E9EEF5',
    'border-subtle': '#D8E0EA',
    'border-strong': '#7A8390',   // 3.54:1 on base — clears SC 1.4.11
    'text-primary': '#0E1116',
    'text-secondary': '#515C6B',
    'accent': '#0B6E77',
    'accent-quiet': '#CCE7EA',   // FILL tint (dark ink sits on it)
    'accent-hover': '#095A62',
    'accent-subtle': '#0D7F88',  // gradient HIGHLIGHT end — 4.39:1 on base
    'accent-deep': '#053C41',    // gradient SHADOW end — 11.20:1 on base
    'success': '#116634',
    'warning': '#79520A',
    'danger': '#B02A22',
    'ink-on-accent': '#FFFFFF',
    'accent-rgb': '11,110,119',
    'success-rgb': '17,102,52',
    'danger-rgb': '176,42,34',
    'warning-rgb': '121,82,10',
    'muted-rgb': '81,92,107',
    'overlay-rgb': '0,0,0',
    'scrim-rgb': '14,17,22',
  },
};

// ── Candidate C — PHOSPHOR ───────────────────────────────────────────────────
// Direction: near-neutral surfaces carrying a whisper of the brand teal, as if
// the phosphor were faintly lighting the room. The most Ghost-Code-specific and
// least generic of the three — the brand is in the SURFACE, not only the accent.
// Register: the terminal's glow leaking out into daylight.
export const PHOSPHOR = {
  key: 'phosphor',
  label: 'C · Phosphor — the terminal glow leaking into the room',
  blurb:
    'Surfaces carry a whisper of the brand teal, so the page itself looks faintly lit by the ' +
    'phosphor. The brand lives in the SURFACE, not just the accent — the most Ghost-Code-' +
    'specific of the three, and the least like a generic light mode.',
  tokens: {
    'surface-base': '#F1F7F5',
    'surface-raised': '#FFFFFF',
    'surface-token': '#E6F1EE',
    'border-subtle': '#D2E3DE',
    'border-strong': '#718883',   // 3.49:1 on base — clears SC 1.4.11
    'text-primary': '#0F1D1A',
    'text-secondary': '#4C5F5B',
    'accent': '#0A6E5E',
    'accent-quiet': '#C8E9E1',   // FILL tint (dark ink sits on it)
    'accent-hover': '#085A4D',
    'accent-subtle': '#0C826F',  // gradient HIGHLIGHT end — 4.36:1 on base
    'accent-deep': '#053B32',    // gradient SHADOW end — 11.54:1 on base
    'success': '#0F6A34',
    'warning': '#775108',
    'danger': '#B12A21',
    'ink-on-accent': '#FFFFFF',
    'accent-rgb': '10,110,94',
    'success-rgb': '15,106,52',
    'danger-rgb': '177,42,33',
    'warning-rgb': '119,81,8',
    'muted-rgb': '76,95,91',
    'overlay-rgb': '0,0,0',
    'scrim-rgb': '11,29,26',
  },
};

export const CANDIDATES = [PAPER, PLATINUM, PHOSPHOR];

/**
 * Effects that must be REDESIGNED for light rather than reused. Shared by all
 * three candidates (they differ in palette, not in materiality).
 *
 * Dark uses heavy black shadows and 16px coloured blooms. On a light surface a
 * 45%-black shadow is a bruise and a coloured bloom is a smudge, so:
 *   • shadow  → soft, short, low-alpha; the 1px border does the edge work
 *   • halo    → a tight RING (0 0 0 3px) instead of a 16px blur
 *   • glows   → tight rings at the same "loudness" rank as their dark cousins
 */
export const LIGHT_EFFECTS = {
  'shadow': '0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)',
  'accent-halo': '0 0 0 3px rgba(var(--accent-rgb),.28)',
  'neutral-halo': '0 0 0 3px rgba(var(--muted-rgb),.30)',
  'success-glow': '0 0 0 3px rgba(var(--success-rgb),0.22)',
  'success-glow-soft': '0 0 0 2px rgba(var(--success-rgb),0.18)',
  'success-glow-strong': '0 0 0 4px rgba(var(--success-rgb),0.26)',
  'success-glow-flash': '0 0 0 5px rgba(var(--success-rgb),0.30)',
  'danger-glow-soft': '0 0 0 3px rgba(var(--danger-rgb),0.20)',
  'danger-pulse-lo': '0 0 0 2px rgba(var(--danger-rgb),0.20)',
  'danger-pulse-hi': '0 0 0 5px rgba(var(--danger-rgb),0.34)',
  'phantom-halo-sm': '0 0 0 2px rgba(var(--accent-rgb),.18)',
  // Alpha-composed surfaces: on light these are BLACK lifts, and they need a
  // touch more alpha than the dark white-lifts to read at all.
  'surface-track': 'rgba(var(--overlay-rgb),0.09)',
  'surface-hover': 'rgba(var(--overlay-rgb),0.05)',
  // Fills sit UNDER text, so they stay light — raising alpha here would eat the
  // token's text contrast. Verified in the contrast table (§ token fills).
  'success-fill': 'rgba(var(--success-rgb),0.10)',
  'danger-fill': 'rgba(var(--danger-rgb),0.09)',
  'warning-fill': 'rgba(var(--warning-rgb),0.12)',
  // A modal scrim still DARKENS the backdrop in a light theme — that is what
  // makes it read as "behind" — but it needs less alpha than on dark.
  'scrim': 'rgba(var(--scrim-rgb),0.45)',
  // Ambient washes: on light the teal tint must be far weaker or it turns the
  // page green. Halved from the dark values.
  'wash-sky': 'rgba(var(--accent-rgb),0.028)',
  'wash-screen': 'rgba(var(--accent-rgb),0.03)',
  // The Phantom on a light surface: the body needs to stay a legible teal mass,
  // so the tail plume gets more alpha (a 42%/14% plume vanishes on white).
  'phantom-tail-near': 'rgba(var(--accent-rgb),0.34)',
  'phantom-tail-far': 'rgba(var(--accent-rgb),0.10)',
  'phantom-glow': 'rgba(var(--accent-rgb),0.22)',
  'phantom-tail': 'rgba(var(--accent-rgb),0.14)',
};

/** Build the CSS text of a light theme block for a candidate. */
export function toCssBlock(candidate, selector = ':root[data-theme="light"]') {
  const t = candidate.tokens;
  const lines = [];
  for (const [k, v] of Object.entries(t)) lines.push(`  --${k}: ${v};`);
  for (const [k, v] of Object.entries(LIGHT_EFFECTS)) lines.push(`  --${k}: ${v};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}
