// ─────────────────────────────────────────────────────────────────────────────
// GHOST CODE — LIGHT MODE — the EDGE CHECK.
//
// The edges that betray a half-done light mode. Each one is asserted from the
// COMPUTED style in a real browser, in BOTH themes — not from reading the CSS.
//
// Usage: node edges.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const PW_PREFIX =
  process.env.PW_PREFIX ??
  '/private/tmp/claude-501/-Users-skypie/8a65aa72-a5fe-4c6d-809e-c79c98ec4645/scratchpad/pwdeps';
const req = createRequire(path.join(PW_PREFIX, 'node_modules', 'noop.js'));
const { chromium } = req('playwright');
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8123';

const seed = (theme, rm) => `
(() => { try { localStorage.setItem('gc.v1', JSON.stringify({
  hi: 120, category:'all', mode:'arcade', bestStreak:7, soundOn:false,
  reduceMotion:${rm}, difficultyFilter:'all', theme:${JSON.stringify(theme)}
})); } catch(e){} })();`;

const browser = await chromium.launch();
const rows = [];
const fail = [];

async function probe(theme, { rm = false, osScheme = 'light' } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1, colorScheme: osScheme,
  });
  await ctx.addInitScript(seed(theme, rm));
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const cs = (el, p) => getComputedStyle(el).getPropertyValue(p).trim();
    const root = document.documentElement;
    const tok = (n) => cs(root, n);
    // force the scrollable review box to exist so its scrollbar tokens resolve
    const mr = document.querySelector('.missed-review');
    return {
      dataTheme: root.getAttribute('data-theme'),
      colorScheme: getComputedStyle(root).colorScheme,
      themeColorMeta: document.getElementById('theme-color-meta')?.getAttribute('content'),
      surfaceBase: tok('--surface-base'),
      accent: tok('--accent'),
      overlayRgb: tok('--overlay-rgb'),
      inkOnAccent: tok('--ink-on-accent'),
      phantomEye: tok('--phantom-eye'),
      shadow: tok('--shadow'),
      accentHalo: tok('--accent-halo'),
      scrim: tok('--scrim'),
      bodyBg: getComputedStyle(document.body).backgroundColor,
      // theme-swap transition under the current motion setting
      animMs: (() => {
        document.documentElement.classList.add('theme-anim');
        const d = getComputedStyle(document.querySelector('#cabinet')).transitionDuration;
        document.documentElement.classList.remove('theme-anim');
        return d;
      })(),
      borderStrong: tok('--border-strong'),
    };
  });
  await ctx.close();
  return r;
}

const check = (name, cond, detail) => {
  rows.push(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) fail.push(name);
};

// ── 1. Explicit choice beats the OS, both directions ────────────────────────
rows.push('EXPLICIT CHOICE OVERRIDES OS PREFERENCE');
const lightOnDarkOS = await probe('light', { osScheme: 'dark' });
check('theme=light wins over an OS that prefers dark', lightOnDarkOS.dataTheme === 'light', `data-theme=${lightOnDarkOS.dataTheme}`);
const darkOnLightOS = await probe('dark', { osScheme: 'light' });
check('theme=dark wins over an OS that prefers light', darkOnLightOS.dataTheme === 'dark', `data-theme=${darkOnLightOS.dataTheme}`);

// ── 2. system follows the OS, both directions ───────────────────────────────
rows.push('', 'SYSTEM FOLLOWS THE OS');
const sysLight = await probe('system', { osScheme: 'light' });
check('theme=system + OS light  → light', sysLight.dataTheme === 'light', `data-theme=${sysLight.dataTheme}`);
const sysDark = await probe('system', { osScheme: 'dark' });
check('theme=system + OS dark   → dark', sysDark.dataTheme === 'dark', `data-theme=${sysDark.dataTheme}`);

// ── 3. The edges, in light ──────────────────────────────────────────────────
const L = lightOnDarkOS, D = darkOnLightOS;
rows.push('', 'THE EDGES (light)');
check('color-scheme is light (drives UA scrollbars/controls)', L.colorScheme === 'light', L.colorScheme);
check('theme-color meta tracks the resolved theme', L.themeColorMeta === '#F3F6FA', L.themeColorMeta);
check('the "lift" wash inverted to black', L.overlayRgb === '0,0,0', `--overlay-rgb: ${L.overlayRgb}`);
check('ink-on-accent inverted to white', L.inkOnAccent.toLowerCase() === '#ffffff', L.inkOnAccent);
check('shadow was REDESIGNED, not reused', L.shadow !== D.shadow && /\.0[0-9]/.test(L.shadow), L.shadow);
check('accent halo became a ring, not a blur', /0 0 0 3px/.test(L.accentHalo), L.accentHalo);
check('scrim still DARKENS on light', /14,17,22/.test(L.scrim), L.scrim);
check('body background is the light surface', L.bodyBg === 'rgb(243, 246, 250)', L.bodyBg);

rows.push('', 'THE EDGES (dark — must be untouched)');
check('color-scheme is dark', D.colorScheme === 'dark', D.colorScheme);
check('theme-color meta is the dark surface', D.themeColorMeta === '#0E1116', D.themeColorMeta);
check('the lift wash is still white', D.overlayRgb === '255,255,255', `--overlay-rgb: ${D.overlayRgb}`);
check('ink-on-accent is still the dark surface', D.inkOnAccent === '#0E1116', D.inkOnAccent);
check('halo is still the 16px bloom', /0 0 16px/.test(D.accentHalo), D.accentHalo);

rows.push('', 'THE PHANTOM (identity: eyes never invert)');
check('phantom eye is white in light', L.phantomEye.toLowerCase() === '#ffffff', L.phantomEye);
check('phantom eye is white in dark', D.phantomEye.toLowerCase() === '#ffffff', D.phantomEye);

// ── 3b. Focus ring + scrollbar — both need a REAL page state ────────────────
// :focus-visible does not match a programmatic .focus() in Chromium, and
// .missed-review is built by JS only on the results screen. Both are driven for
// real here rather than probed on the title screen.
rows.push('', 'FOCUS RING + SCROLLBAR (driven, not probed)');
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1, colorScheme: 'light' });
  await ctx.addInitScript(seed(theme, false));
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(600);
  // real keyboard focus → :focus-visible actually matches
  await page.keyboard.press('Tab');
  await page.waitForTimeout(150);
  const focusOutline = await page.evaluate(() => {
    const t = document.querySelector('.token');
    t.focus();
    return getComputedStyle(t).outlineColor;
  });
  // drive to the results screen so .missed-review exists
  for (let i = 0; i < 8; i++) {
    const over = await page.evaluate(() => !document.getElementById('gameover').classList.contains('hidden'));
    if (over) break;
    await page.evaluate(() => {
      if (state.busy || !state.playing || !state.current) return;
      const el = [...document.querySelectorAll('.token')].find(x => x.dataset.value !== state.current.answer);
      if (el) answer(el);
    });
    await page.waitForTimeout(1100);
  }
  const sb = await page.evaluate(() => {
    const mr = document.querySelector('.missed-review');
    return mr ? getComputedStyle(mr).scrollbarColor : null;
  });
  await ctx.close();
  const want = theme === 'light' ? 'rgb(11, 110, 119)' : 'rgb(61, 216, 196)';
  check(`${theme}: token :focus-visible ring is the theme accent`, focusOutline === want, focusOutline);
  const wantSb = theme === 'light' ? '#7A8390'.toLowerCase() : '#3A4453'.toLowerCase();
  check(`${theme}: review-box scrollbar thumb follows --border-strong`,
    !!sb && sb.toLowerCase().replace(/\s/g, '').includes(
      theme === 'light' ? 'rgb(122,131,144)' : 'rgb(58,68,83)'), sb ?? '(missed-review absent)');
}

// ── 4. Theme transition respects reduced motion ─────────────────────────────
rows.push('', 'THEME-SWAP TRANSITION vs REDUCED MOTION');
const rmOff = await probe('light', { rm: false });
const rmOn = await probe('light', { rm: true });
check('full motion: transition is animated', parseFloat(rmOff.animMs) > 0.1, `${rmOff.animMs}`);
check('reduced motion: transition is INSTANT', parseFloat(rmOn.animMs) < 0.01, `${rmOn.animMs}`);
const rmOs = await probe('light', { rm: false, osScheme: 'light' });

// OS-level reduced motion path
{
  const ctx = await browser.newContext({ viewport: { width: 900, height: 700 }, reducedMotion: 'reduce', colorScheme: 'light' });
  await ctx.addInitScript(seed('light', false));
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const d = await page.evaluate(() => {
    document.documentElement.classList.add('theme-anim');
    const v = getComputedStyle(document.querySelector('#cabinet')).transitionDuration;
    document.documentElement.classList.remove('theme-anim');
    return v;
  });
  await ctx.close();
  check('OS reduced-motion: transition is INSTANT', parseFloat(d) < 0.01, d);
}

await browser.close();

const text = ['GHOST CODE — light mode edge check', '', ...rows, '',
  fail.length ? `*** ${fail.length} FAILING: ${fail.join(', ')}` : 'ALL EDGE CHECKS PASS'].join('\n');
fs.mkdirSync(path.resolve('../captures'), { recursive: true });
fs.writeFileSync(path.resolve('../captures/edge-report.txt'), text);
console.log(text);
process.exit(fail.length ? 1 : 0);
