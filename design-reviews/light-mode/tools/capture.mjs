// ─────────────────────────────────────────────────────────────────────────────
// GHOST CODE — LIGHT MODE — deterministic capture harness.
//
// Purpose #1 (Phase 1): the BYTE-IDENTITY GATE. Render the key screens before
// and after the tokenization refactor and prove the dark experience is
// pixel-unchanged. Determinism is the whole game here, so:
//   • Math.random is replaced (pre-page-scripts) with a seeded PRNG → the same
//     card, the same shuffle, the same 50/50 elimination every run.
//   • localStorage['gc.v1'] is seeded to a fixed object → same HUD, same
//     mastery bars, same title stats.
//   • document.fonts.ready is awaited → no fallback-face capture.
//   • screenshots use animations:'disabled' (Playwright finishes CSS animations
//     to a stable end frame) + caret:'hide'.
//   • deviceScaleFactor 1, fixed viewports.
//
// Purpose #2 (Phase 2/3): the same driver renders candidate palettes and the
// shipped light theme on the REAL screens (not swatches), via THEME=<name>.
//
// Usage:
//   node capture.mjs <outDir> [--theme=dark|light] [--attr=data-theme-value]
//
// Writes ONLY under design-reviews/light-mode/**. Never touches game code.
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
const outDir = path.resolve(process.argv[2] ?? './out');
const themeArg = (process.argv.find(a => a.startsWith('--theme=')) ?? '').split('=')[1] || null;

fs.mkdirSync(outDir, { recursive: true });

// ── Deterministic seed injected before ANY page script runs ──────────────────
// mulberry32 — tiny, well-distributed, fully reproducible.
const SEED_SCRIPT = (themeAttr) => `
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
        'git-status':    { c: 4, w: 0, total: 4 },
        'git-clone':     { c: 3, w: 1, total: 4 },
        'mac-ls':        { c: 3, w: 0, total: 3 },
        'mac-pwd':       { c: 5, w: 1, total: 6 },
        'claude-init':   { c: 3, w: 0, total: 3 },
        'claude-resume': { c: 1, w: 2, total: 3 }
      }
    }));
  } catch (e) {}
  ${themeAttr ? `
  try { localStorage.setItem('gc.theme', ${JSON.stringify(themeAttr)}); } catch (e) {}
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.setAttribute('data-theme', ${JSON.stringify(themeAttr)});
  });` : ''}
})();
`;

// ── The key-screen matrix ───────────────────────────────────────────────────
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
};

/** Each screen: how to drive the page into that state. */
const SCREENS = [
  {
    name: 'title', viewports: ['desktop', 'mobile'],
    drive: async () => {}, // landing state
  },
  {
    name: 'board', viewports: ['desktop', 'mobile'],
    drive: async (page) => {
      await page.evaluate(() => startGame());
      await page.waitForTimeout(700);
    },
  },
  {
    name: 'correct', viewports: ['desktop'],
    drive: async (page) => {
      await page.evaluate(() => startGame());
      await page.waitForTimeout(500);
      // Press the number key of the token whose value === the correct answer.
      await page.evaluate(() => {
        const el = [...document.querySelectorAll('.token')]
          .find(t => t.dataset.value === state.current.answer);
        answer(el);
      });
      await page.waitForTimeout(320);
    },
  },
  {
    name: 'wrong', viewports: ['desktop'],
    drive: async (page) => {
      await page.evaluate(() => startGame());
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const el = [...document.querySelectorAll('.token')]
          .find(t => t.dataset.value !== state.current.answer);
        answer(el);
      });
      await page.waitForTimeout(320);
    },
  },
  {
    name: 'token-focus', viewports: ['desktop'],
    drive: async (page) => {
      await page.evaluate(() => startGame());
      await page.waitForTimeout(500);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.evaluate(() => document.querySelector('.token').focus());
      await page.waitForTimeout(200);
    },
  },
  {
    name: 'learn-reveal', viewports: ['desktop', 'mobile'],
    drive: async (page) => {
      await page.evaluate(() => {
        state.persist.mode = 'learn';
        document.body.classList.add('learning-mode');
        startGame();
      });
      await page.waitForTimeout(500);
      // Three wrong answers escalate learn mode to the full reveal phase.
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => {
          const el = [...document.querySelectorAll('.token')]
            .find(t => t.dataset.value !== state.current.answer);
          if (el) answer(el);
        });
        await page.waitForTimeout(900);
      }
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'gameover', viewports: ['desktop', 'mobile'],
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
    name: 'settings', viewports: ['desktop'],
    drive: async (page) => {
      await page.evaluate(() => openSettings());
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'shortcuts', viewports: ['desktop'],
    drive: async (page) => {
      await page.evaluate(() => openShortcuts());
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'pause', viewports: ['desktop'],
    drive: async (page) => {
      await page.evaluate(() => startGame());
      await page.waitForTimeout(500);
      await page.evaluate(() => document.getElementById('pause').click());
      await page.waitForTimeout(500);
    },
  },
];

// ── Runner ──────────────────────────────────────────────────────────────────
const log = [];

const browser = await chromium.launch();

for (const screen of SCREENS) {
  for (const vpName of screen.viewports) {
    const vp = VIEWPORTS[vpName];
    const ctx = await browser.newContext({
      viewport: vp,
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
      colorScheme: 'light', // explicit + stable; the theme is driven by attr/localStorage
    });
    await ctx.addInitScript(SEED_SCRIPT(themeArg));
    const page = await ctx.newPage();

    const consoleErrors = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    try {
      await screen.drive(page);
    } catch (err) {
      log.push(`FAILED ${screen.name}@${vpName}: ${err.message}`);
      await ctx.close();
      continue;
    }

    await page.waitForTimeout(250);
    const file = path.join(outDir, `${screen.name}@${vpName}.png`);
    await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
    log.push(`OK ${screen.name}@${vpName}${consoleErrors.length ? ' CONSOLE-ERRORS: ' + consoleErrors.join(' | ') : ''}`);
    await ctx.close();
  }
}

await browser.close();
fs.writeFileSync(path.join(outDir, '_capture-log.txt'), log.join('\n') + '\n');
console.log(log.join('\n'));
console.log(`\n${log.filter(l => l.startsWith('OK')).length} captured → ${outDir}`);
if (log.some(l => l.startsWith('FAILED'))) process.exit(2);
