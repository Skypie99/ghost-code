// ─────────────────────────────────────────────────────────────────────────────
// GHOST CODE — LIGHT MODE — WCAG contrast checker.
//
// "CONTRAST IS MEASURED, NEVER EYEBALLED." Every ink-on-surface pairing that
// ACTUALLY OCCURS in index.html is enumerated below with the line it occurs on,
// so the table is a map of the real app rather than a swatch grid.
//
// Thresholds (WCAG 2.2):
//   • 4.5:1  normal text  (SC 1.4.3)
//   • 3:1    large text   (>=24px, or >=18.66px bold)  (SC 1.4.3)
//   • 3:1    UI component / graphical boundary          (SC 1.4.11)
//
// Alpha-composed colours are FLATTENED against their real backdrop before
// measuring — measuring rgba() against nothing would be a lie.
//
// Usage: node contrast.mjs [--md]
// ─────────────────────────────────────────────────────────────────────────────
import { DARK, CANDIDATES, LIGHT_EFFECTS } from './palettes.mjs';

const hex = (h) => {
  const s = h.replace('#', '');
  const n = s.length === 3 ? s.split('').map(c => c + c).join('') : s;
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16));
};
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
/** Composite a translucent fg over an opaque bg → the colour the eye sees. */
const over = (rgbTriplet, alpha, bg) =>
  rgbTriplet.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));

const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Every pairing in the real sheet. `req` is the threshold that applies.
 * kind: 'text' (4.5) | 'large' (3) | 'ui' (3) | 'info' (no requirement — a
 * decorative separator; reported for judgement, never used to pass/fail).
 */
const PAIRINGS = [
  // ── Body + screen text ────────────────────────────────────────────────────
  { id: 'prompt text',            fg: 'text-primary',   bg: 'surface-raised', kind: 'large', at: 'L452 #prompt-text (20-30px)' },
  { id: 'screen p',               fg: 'text-primary',   bg: 'surface-base',   kind: 'large', at: 'L1114 .screen p (26px)' },
  { id: 'tagline',                fg: 'text-secondary', bg: 'surface-base',   kind: 'text',  at: 'L1084 .tagline (16px)' },
  { id: 'screen .small',          fg: 'text-secondary', bg: 'surface-base',   kind: 'text',  at: 'L1128 .small (12px)' },
  { id: 'HUD label',              fg: 'text-secondary', bg: 'surface-raised', kind: 'text',  at: 'L338 #hud .label (11px)' },
  { id: 'HUD value',              fg: 'text-primary',   bg: 'surface-raised', kind: 'large', at: 'L346 #hud .val (24px)' },
  { id: 'hint',                   fg: 'text-secondary', bg: 'surface-raised', kind: 'text',  at: 'L776 #hint (18px)' },
  // ── The command tokens — the hero surface ────────────────────────────────
  { id: 'TOKEN command text',     fg: 'text-primary',   bg: 'surface-token',  kind: 'text',  at: 'L625 .token .txt (15-19px)' },
  { id: 'TOKEN key label',        fg: 'text-secondary', bg: 'surface-token',  kind: 'text',  at: 'L616 .token .key (11px)' },
  { id: 'TOKEN "> " prefix',      fg: 'accent',         bg: 'surface-token',  kind: 'text',  at: 'L633 .txt::before' },
  // ── Accent as text ───────────────────────────────────────────────────────
  { id: 'wordmark CODE',          fg: 'accent',         bg: 'surface-base',   kind: 'large', at: 'L1072 .word2 (20px/600)' },
  // The GHOST wordmark is a gradient — the WORST case is its lightest stop, so
  // both ends are measured. (Also the Phantom head's radial stops.)
  { id: 'wordmark GHOST · light stop', fg: 'accent-subtle', bg: 'surface-base', kind: 'large', at: 'L1094 .word1 0% (40px/700)' },
  { id: 'wordmark GHOST · dark stop',  fg: 'accent-deep',   bg: 'surface-base', kind: 'large', at: 'L1094 .word1 100%' },
  { id: 'learn kicker',           fg: 'accent',         bg: 'surface-raised', kind: 'text',  at: 'L953 .lp-kicker (11px)' },
  { id: 'learn answer',           fg: 'accent',         bg: 'surface-raised', kind: 'large', at: 'L931 .lp-answer (22px/600)' },
  { id: 'learn badge',            fg: 'accent',         bg: 'surface-raised', kind: 'text',  at: 'L862 #learn-badge (11px)' },
  { id: 'drill badge',            fg: 'accent',         bg: 'surface-raised', kind: 'text',  at: 'L878 #drill-badge (11px)' },
  { id: 'results stat value',     fg: 'accent',         bg: 'surface-base',   kind: 'large', at: 'L1561 .results-stat__val (26px)' },
  { id: 'mastery run chip',       fg: 'accent',         bg: 'surface-base',   kind: 'text',  at: 'L1598 .mastery__runchip (11px)' },
  // ── Semantic as text ─────────────────────────────────────────────────────
  { id: 'streak value',           fg: 'warning',        bg: 'surface-raised', kind: 'large', at: 'L420 #streak .val (24px)' },
  { id: 'learn status (warn)',    fg: 'warning',        bg: 'surface-raised', kind: 'text',  at: 'L916 .lp-status (13px)' },
  { id: '50/50 button label',     fg: 'warning',        bg: 'surface-raised', kind: 'text',  at: 'L819 .lifeline-btn (13px)' },
  { id: 'GAME OVER heading',      fg: 'danger',         bg: 'surface-base',   kind: 'large', at: 'L1100 .screen h2 (22px/700)' },
  { id: 'diff badge hard',        fg: 'danger',         bg: 'surface-raised', kind: 'text',  at: 'L462 #diff-badge.hard (12px)' },
  { id: 'win-strap command',      fg: 'success',        bg: 'surface-raised', kind: 'large', at: 'L738 #win-strap (14-20px/600)' },
  { id: 'score-fly +N',           fg: 'success',        bg: 'surface-raised', kind: 'text',  at: 'L713 .score-fly (15px/700)' },
  { id: 'learn status (win)',     fg: 'success',        bg: 'surface-raised', kind: 'text',  at: 'L964 .lp-status--gold (13px)' },
  // ── Ink on filled controls ───────────────────────────────────────────────
  { id: 'PRIMARY btn label',      fg: 'ink-on-accent',  bg: 'accent',         kind: 'large', at: 'L1236 .big-btn (17px/600)' },
  { id: 'active mode tab',        fg: 'ink-on-accent',  bg: 'accent',         kind: 'text',  at: 'L852 .mode-btn.active (12px)' },
  { id: 'active category btn',    fg: 'text-primary',   bg: 'accent-quiet',   kind: 'text',  at: 'L813 .btn.active (13px)' },
  { id: 'pressed segment',        fg: 'text-primary',   bg: 'accent-quiet',   kind: 'text',  at: 'L1317 .seg__btn[pressed] (13px)' },
  { id: 'kbd chip',               fg: 'text-primary',   bg: 'surface-token',  kind: 'text',  at: 'L1293 #shortcuts-modal kbd (13px)' },
  // ── UI boundaries (SC 1.4.11) ────────────────────────────────────────────
  { id: 'focus ring on base',     fg: 'accent',         bg: 'surface-base',   kind: 'ui',    at: 'L808/L1253 :focus-visible outline' },
  { id: 'focus ring on token',    fg: 'accent',         bg: 'surface-token',  kind: 'ui',    at: 'L652 .token:focus-visible' },
  { id: 'wrong-focus ring',       fg: 'text-secondary', bg: 'surface-token',  kind: 'ui',    at: 'L689 .token.wrong:focus-visible' },
  { id: 'strong border on base',  fg: 'border-strong',  bg: 'surface-base',   kind: 'ui',    at: 'L615 .token:hover / L1296 kbd' },
  { id: 'correct border',         fg: 'success',        bg: 'surface-raised', kind: 'ui',    at: 'L662 .token.correct' },
  { id: 'wrong border',           fg: 'danger',         bg: 'surface-raised', kind: 'ui',    at: 'L669 .token.wrong' },
  { id: 'lifeline pip (slash)',   fg: 'warning',        bg: 'surface-raised', kind: 'ui',    at: 'L405 .lifeline-pip' },
  { id: 'spirit pip',             fg: 'accent',         bg: 'surface-raised', kind: 'ui',    at: 'L372 .spirit-pip' },
  { id: 'progress fill',          fg: 'accent',         bg: 'surface-raised', kind: 'ui',    at: 'L995 .lp-fill / L1584 .mastery__fill' },
  // ── Reported, not required (decorative separators) ───────────────────────
  { id: 'subtle border on base',  fg: 'border-subtle',  bg: 'surface-base',   kind: 'info',  at: 'L298 #cabinet, L608 .token' },
  { id: 'subtle border on raised',fg: 'border-subtle',  bg: 'surface-raised', kind: 'info',  at: 'L904 #learn-panel, L1274 dialog' },
];

/** Composed (alpha) pairings — flattened against their real backdrop first. */
const COMPOSED = [
  {
    id: 'TOKEN text on CORRECT fill', kind: 'text',
    at: 'L625 .txt over L661 .token.correct fill',
    fg: (t) => t['text-primary'],
    bg: (t, fx) => flattenFill(fx['success-fill'] ?? 'rgba(var(--success-rgb),0.12)', t, 'success-rgb', t['surface-token']),
  },
  {
    id: 'TOKEN text on WRONG fill', kind: 'text',
    at: 'L625 .txt over L668 .token.wrong fill',
    fg: (t) => t['text-primary'],
    bg: (t, fx) => flattenFill(fx['danger-fill'] ?? 'rgba(var(--danger-rgb),0.12)', t, 'danger-rgb', t['surface-token']),
  },
  {
    id: '✓ glyph on CORRECT fill', kind: 'ui',
    at: 'L683 .token.correct::after',
    fg: (t) => t['success'],
    bg: (t, fx) => flattenFill(fx['success-fill'] ?? 'rgba(var(--success-rgb),0.12)', t, 'success-rgb', t['surface-token']),
  },
  {
    id: '✗ glyph on WRONG fill', kind: 'ui',
    at: 'L684 .token.wrong::after',
    fg: (t) => t['danger'],
    bg: (t, fx) => flattenFill(fx['danger-fill'] ?? 'rgba(var(--danger-rgb),0.12)', t, 'danger-rgb', t['surface-token']),
  },
  {
    id: '50/50 label on hover fill', kind: 'text',
    at: 'L820 .lifeline-btn:hover',
    fg: (t) => t['warning'],
    bg: (t, fx) => flattenFill(fx['warning-fill'] ?? 'rgba(var(--warning-rgb),0.12)', t, 'warning-rgb', t['surface-raised']),
  },
  {
    id: 'progress fill vs its track', kind: 'ui',
    at: 'L995 .lp-fill over L988 .lp-track',
    fg: (t) => t['accent'],
    bg: (t, fx) => flattenFill(fx['surface-track'] ?? 'rgba(var(--overlay-rgb),0.06)', t, 'overlay-rgb', t['surface-raised']),
  },
];

function flattenFill(expr, tokens, rgbKey, backdropHex) {
  const m = expr.match(/rgba\(var\(--[a-z-]+\),\s*([\d.]+)\)/);
  const alpha = m ? parseFloat(m[1]) : 0.12;
  const triplet = tokens[rgbKey].split(',').map(Number);
  return '#' + over(triplet, alpha, hex(backdropHex)).map(c => c.toString(16).padStart(2, '0')).join('');
}

const REQ = { text: 4.5, large: 3, ui: 3, info: 0 };

function evaluate(theme, effects) {
  const t = theme.tokens;
  const rows = [];
  for (const p of PAIRINGS) {
    const val = ratio(hex(t[p.fg]), hex(t[p.bg]));
    const req = REQ[p.kind];
    rows.push({ ...p, fgHex: t[p.fg], bgHex: t[p.bg], val: r2(val), req, pass: p.kind === 'info' ? null : val >= req });
  }
  for (const c of COMPOSED) {
    const fgHex = c.fg(t), bgHex = c.bg(t, effects);
    const val = ratio(hex(fgHex), hex(bgHex));
    const req = REQ[c.kind];
    rows.push({ id: c.id, at: c.at, kind: c.kind, fgHex, bgHex, val: r2(val), req, pass: val >= req });
  }
  return rows;
}

// ── Report ──────────────────────────────────────────────────────────────────
const md = process.argv.includes('--md');
const themes = [
  { theme: DARK, effects: {} },
  ...CANDIDATES.map(c => ({ theme: c, effects: LIGHT_EFFECTS })),
];

let anyFail = false;
const out = [];

for (const { theme, effects } of themes) {
  const rows = evaluate(theme, effects);
  const fails = rows.filter(r => r.pass === false);
  if (theme.key !== 'dark' && fails.length) anyFail = true;

  out.push('');
  out.push(md ? `### ${theme.label}` : `\n══ ${theme.label} ══`);
  if (theme.blurb) out.push(md ? `\n${theme.blurb}\n` : theme.blurb);
  if (md) {
    out.push('| Pairing | Where | Ink | Surface | Ratio | Needs | |');
    out.push('|---|---|---|---|---:|---:|:--:|');
  }
  for (const r of rows) {
    const mark = r.pass === null ? '·' : r.pass ? 'PASS' : 'FAIL';
    if (md) {
      out.push(`| ${r.id} | \`${r.at}\` | \`${r.fgHex}\` | \`${r.bgHex}\` | **${r.val}:1** | ${r.req ? r.req + ':1' : '—'} | ${r.pass === null ? '·' : r.pass ? '✅' : '❌'} |`);
    } else {
      out.push(`  ${mark.padEnd(5)} ${String(r.val).padStart(6)}:1  (needs ${r.req || '—'})  ${r.id}  [${r.fgHex} on ${r.bgHex}]`);
    }
  }
  const req = rows.filter(r => r.pass !== null);
  out.push('');
  out.push(`${md ? '**' : ''}${theme.label}: ${req.filter(r => r.pass).length}/${req.length} required pairings pass${fails.length ? ` — FAILING: ${fails.map(f => f.id).join(', ')}` : ''}${md ? '**' : ''}`);
}

console.log(out.join('\n'));
if (anyFail) { console.log('\n*** At least one candidate has a failing pairing — fix or cut before Sky sees it. ***'); process.exit(1); }
console.log('\nAll candidates: every required pairing passes.');
