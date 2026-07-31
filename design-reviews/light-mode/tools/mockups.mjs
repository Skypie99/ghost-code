// ─────────────────────────────────────────────────────────────────────────────
// GHOST CODE — LIGHT MODE — THE MOCKUP GATE.
//
// Renders each candidate palette on the REAL key screens (not swatches) by
// injecting its token block into the live app, then builds a self-contained
// comparison gallery: dark | A | B | C, one row per screen, so identity can be
// judged against the shipped theme rather than in isolation.
//
// The palettes come from palettes.mjs — the SAME module the contrast table is
// computed from, so what Sky sees is by construction what was measured.
//
// Usage: node mockups.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { DARK, CANDIDATES, toCssBlock } from './palettes.mjs';

const PW_PREFIX =
  process.env.PW_PREFIX ??
  '/private/tmp/claude-501/-Users-skypie/8a65aa72-a5fe-4c6d-809e-c79c98ec4645/scratchpad/pwdeps';
const req = createRequire(path.join(PW_PREFIX, 'node_modules', 'noop.js'));
const { chromium } = req('playwright');

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8123';
const ROOT = path.resolve(process.argv[2] ?? '../captures/mockups');
fs.mkdirSync(ROOT, { recursive: true });

const SEED = `
(() => {
  let s = 0x9E3779B9;
  Math.random = function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try {
    localStorage.setItem('gc.v1', JSON.stringify({
      hi: 120, category: 'all', mode: 'arcade', bestStreak: 7,
      soundOn: false, reduceMotion: false, difficultyFilter: 'all',
      cardStats: {
        'git-status': {c:4,w:0,total:4}, 'git-clone': {c:3,w:1,total:4},
        'mac-ls': {c:3,w:0,total:3}, 'mac-pwd': {c:5,w:1,total:6},
        'claude-init': {c:3,w:0,total:3}, 'claude-resume': {c:1,w:2,total:3}
      }
    }));
  } catch (e) {}
})();
`;

/** The screens Sky judges the palette on. Cropped to the cabinet where useful. */
const SCREENS = [
  { name: 'title', vp: { width: 1280, height: 860 }, drive: async () => {} },
  {
    name: 'board', vp: { width: 1280, height: 860 },
    drive: async (p) => { await p.evaluate(() => startGame()); await p.waitForTimeout(700); },
  },
  {
    name: 'correct', vp: { width: 1280, height: 860 },
    drive: async (p) => {
      await p.evaluate(() => startGame()); await p.waitForTimeout(500);
      await p.evaluate(() => {
        const el = [...document.querySelectorAll('.token')].find(t => t.dataset.value === state.current.answer);
        answer(el);
      });
      await p.waitForTimeout(320);
    },
  },
  {
    name: 'wrong', vp: { width: 1280, height: 860 },
    drive: async (p) => {
      await p.evaluate(() => startGame()); await p.waitForTimeout(500);
      await p.evaluate(() => {
        const el = [...document.querySelectorAll('.token')].find(t => t.dataset.value !== state.current.answer);
        answer(el);
      });
      await p.waitForTimeout(320);
    },
  },
  {
    name: 'learn-reveal', vp: { width: 1280, height: 860 },
    drive: async (p) => {
      await p.evaluate(() => { state.persist.mode='learn'; document.body.classList.add('learning-mode'); startGame(); });
      await p.waitForTimeout(500);
      for (let i = 0; i < 3; i++) {
        await p.evaluate(() => {
          const el = [...document.querySelectorAll('.token')].find(t => t.dataset.value !== state.current.answer);
          if (el) answer(el);
        });
        await p.waitForTimeout(900);
      }
      await p.waitForTimeout(400);
    },
  },
  {
    name: 'gameover', vp: { width: 1280, height: 860 },
    drive: async (page) => {
      await page.evaluate(() => startGame());
      await page.waitForTimeout(500);
      // Score a few first so the results screen has real numbers. The state.busy
      // guard matters: answering while the previous answer is still resolving is
      // a no-op, which is what silently left the old driver mid-play.
      const step = async (wantCorrect) => {
        for (let t = 0; t < 25; t++) {
          const acted = await page.evaluate((want) => {
            if (state.busy || !state.playing || !state.current) return false;
            const els = [...document.querySelectorAll('.token')];
            const el = want
              ? els.find(x => x.dataset.value === state.current.answer)
              : els.find(x => x.dataset.value !== state.current.answer);
            if (!el) return false;
            answer(el); return true;
          }, wantCorrect);
          if (acted) return true;
          await page.waitForTimeout(120);
        }
        return false;
      };
      for (let i = 0; i < 3; i++) { await step(true); await page.waitForTimeout(900); }
      for (let i = 0; i < 8; i++) {
        const over = await page.evaluate(() => !document.getElementById('gameover').classList.contains('hidden'));
        if (over) break;
        await step(false);
        await page.waitForTimeout(1100);
      }
      await page.waitForTimeout(700);
    },
  },
  {
    name: 'settings', vp: { width: 1280, height: 860 },
    drive: async (p) => { await p.evaluate(() => openSettings()); await p.waitForTimeout(400); },
  },
  { name: 'title-mobile', vp: { width: 375, height: 760 }, drive: async () => {} },
  {
    name: 'board-mobile', vp: { width: 375, height: 760 },
    drive: async (p) => { await p.evaluate(() => startGame()); await p.waitForTimeout(700); },
  },
];

const THEMES = [
  { key: 'dark', label: DARK.label, css: null },
  ...CANDIDATES.map(c => ({ key: c.key, label: c.label, css: toCssBlock(c, ':root') + '\n:root { color-scheme: light; }' })),
];

const browser = await chromium.launch();
const log = [];

for (const theme of THEMES) {
  const dir = path.join(ROOT, theme.key);
  fs.mkdirSync(dir, { recursive: true });
  for (const screen of SCREENS) {
    const ctx = await browser.newContext({
      viewport: screen.vp, deviceScaleFactor: 1,
      reducedMotion: 'no-preference', colorScheme: 'light',
    });
    await ctx.addInitScript(SEED);
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    if (theme.css) await page.addStyleTag({ content: theme.css });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    try { await screen.drive(page); } catch (e) { log.push(`FAILED ${theme.key}/${screen.name}: ${e.message}`); await ctx.close(); continue; }
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, `${screen.name}.png`), animations: 'disabled', caret: 'hide' });
    log.push(`OK ${theme.key}/${screen.name}`);
    await ctx.close();
  }
}
await browser.close();

// ── Build the self-contained comparison gallery ──────────────────────────────
const b64 = (p) => fs.readFileSync(p).toString('base64');
const rows = SCREENS.map(s => {
  const cells = THEMES.map(t => {
    const f = path.join(ROOT, t.key, `${s.name}.png`);
    if (!fs.existsSync(f)) return `<figure class="shot missing"><figcaption>${t.key} — missing</figcaption></figure>`;
    return `<figure class="shot"><img loading="lazy" src="data:image/png;base64,${b64(f)}" alt="${s.name} in ${t.label}"><figcaption><b>${t.key}</b></figcaption></figure>`;
  }).join('\n');
  return `<section class="row"><h2>${s.name} <span class="vp">${s.vp.width}×${s.vp.height}</span></h2><div class="strip">${cells}</div></section>`;
}).join('\n');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ghost Code — light-mode candidates</title>
<style>
 body{margin:0;padding:24px;background:#14171c;color:#e6edf3;font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
 h1{font-size:20px;margin:0 0 4px} .sub{color:#9da7b3;margin:0 0 24px}
 .row{margin:0 0 40px} h2{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#9da7b3;margin:0 0 10px;border-bottom:1px solid #2a323d;padding-bottom:6px}
 .vp{color:#5c6675;font-weight:400;text-transform:none;letter-spacing:0}
 .strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
 @media(max-width:1100px){.strip{grid-template-columns:repeat(2,1fr)}}
 .shot{margin:0} .shot img{width:100%;height:auto;display:block;border:1px solid #2a323d;border-radius:8px}
 figcaption{color:#9da7b3;font-size:12px;padding-top:6px}
 .legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:0 0 28px}
 .legend div{background:#1c232e;border:1px solid #2a323d;border-radius:8px;padding:12px}
 .legend b{color:#3dd8c4}
</style></head><body>
<h1>Ghost Code — light-mode candidates</h1>
<p class="sub">Each candidate rendered on the real app. Left column is the shipped dark theme, for identity comparison.</p>
<div class="legend">
${CANDIDATES.map(c => `<div><b>${c.label}</b><br>${c.blurb}</div>`).join('\n')}
</div>
${rows}
</body></html>`;

fs.writeFileSync(path.join(ROOT, 'gallery.html'), html);
fs.writeFileSync(path.join(ROOT, '_log.txt'), log.join('\n') + '\n');
console.log(log.join('\n'));
console.log(`\n${log.filter(l => l.startsWith('OK')).length} shots → ${ROOT}/gallery.html`);
if (log.some(l => l.startsWith('FAILED'))) process.exit(2);
