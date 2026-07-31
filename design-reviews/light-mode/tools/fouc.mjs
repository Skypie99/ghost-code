// ─────────────────────────────────────────────────────────────────────────────
// GHOST CODE — LIGHT MODE — the NO-FOUC prover.
//
// The claim: with theme=light persisted, a hard load NEVER paints a dark frame
// first. Asserting that from the structure of the code ("it's a synchronous
// head script, so it runs before any paint") is an argument, not evidence — so
// this measures it.
//
// Instrument: CDP Page.startScreencast, started BEFORE navigation, capturing
// every frame the compositor produces. Each frame is decoded and its mean
// luminance sampled. For theme=light every painted frame must be LIGHT; for
// theme=dark every frame must be DARK. A single wrong-polarity frame is a FOUC
// and fails the run.
//
// Usage: node fouc.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const PW_PREFIX =
  process.env.PW_PREFIX ??
  '/private/tmp/claude-501/-Users-skypie/8a65aa72-a5fe-4c6d-809e-c79c98ec4645/scratchpad/pwdeps';
const req = createRequire(path.join(PW_PREFIX, 'node_modules', 'noop.js'));
const { chromium } = req('playwright');

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8123';
const OUT = path.resolve('../captures/fouc');
fs.mkdirSync(OUT, { recursive: true });

const seed = (theme) => `
(() => {
  try {
    localStorage.setItem('gc.v1', JSON.stringify({
      hi: 120, category: 'all', mode: 'arcade', bestStreak: 7,
      soundOn: false, reduceMotion: false, difficultyFilter: 'all',
      theme: ${JSON.stringify(theme)}
    }));
  } catch (e) {}
})();`;

const browser = await chromium.launch();

/** Decode captured JPEG frames and return mean luminance for each. */
async function luminances(files) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('about:blank');
  const out = [];
  for (const f of files) {
    const b64 = fs.readFileSync(f).toString('base64');
    const L = await page.evaluate(async (data) => {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + data;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = 60; c.height = 40;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0, 60, 40);
      const d = g.getImageData(0, 0, 60, 40).data;
      let sum = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) {
        const f2 = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        sum += 0.2126 * f2(d[i]) + 0.7152 * f2(d[i + 1]) + 0.0722 * f2(d[i + 2]);
        n++;
      }
      return sum / n;
    }, b64);
    out.push(L);
  }
  await ctx.close();
  return out;
}

const results = [];

for (const theme of ['light', 'dark']) {
  const dir = path.join(OUT, theme);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(seed(theme));
  const page = await ctx.newPage();
  // Prime storage on a first visit, then HARD reload — the load we actually measure.
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async (f) => {
    const i = frames.length;
    const file = path.join(dir, `f${String(i).padStart(3, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
    frames.push(file);
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 80, everyNthFrame: 1 });

  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1400);           // let the title screen settle + fonts swap
  await cdp.send('Page.stopScreencast');
  await page.waitForTimeout(150);

  const resolved = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const metaC = await page.evaluate(() => document.getElementById('theme-color-meta')?.getAttribute('content'));
  const cs = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  await ctx.close();

  const Ls = await luminances(frames);
  // Threshold well clear of both palettes: dark base ~0.006, light base ~0.87.
  const MID = 0.25;
  const wrong = Ls.map((L, i) => ({ i, L })).filter(({ L }) =>
    theme === 'light' ? L < MID : L > MID);

  results.push({ theme, resolved, metaC, cs, frames: Ls.length, wrong, Ls });
}

await browser.close();

// ── Report ──────────────────────────────────────────────────────────────────
let fail = false;
const lines = ['GHOST CODE — no-FOUC proof (CDP screencast, hard reload)', ''];
for (const r of results) {
  const first = r.Ls.length ? r.Ls[0].toFixed(4) : 'n/a';
  const min = r.Ls.length ? Math.min(...r.Ls).toFixed(4) : 'n/a';
  const max = r.Ls.length ? Math.max(...r.Ls).toFixed(4) : 'n/a';
  lines.push(`persisted theme = ${r.theme}`);
  lines.push(`  data-theme resolved to : ${r.resolved}`);
  lines.push(`  color-scheme           : ${r.cs}`);
  lines.push(`  theme-color meta       : ${r.metaC}`);
  lines.push(`  painted frames captured: ${r.frames}`);
  lines.push(`  frame luminance        : first=${first}  min=${min}  max=${max}`);
  if (r.wrong.length) {
    fail = true;
    lines.push(`  *** FOUC: ${r.wrong.length} wrong-polarity frame(s) at index ${r.wrong.map(w => w.i).join(', ')}`);
  } else {
    lines.push(`  VERDICT: no wrong-polarity frame — NO FOUC`);
  }
  lines.push('');
}
const text = lines.join('\n');
fs.writeFileSync(path.join(OUT, 'fouc-report.txt'), text);
console.log(text);
process.exit(fail ? 1 : 0);
