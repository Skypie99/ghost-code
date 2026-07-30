# DEPLOY-CHECKLIST.md — Ghost Code UPLIFT (consolidated, P6 close-out)

> Master `00_master.md` §7's launch-sequencing ledger (L1–L6), as one clean ordered list, with 5
> de-facto riders folded in — items every phase implicitly depends on but none formally numbered as
> its own L-tag. No phase appended a real L7+; these are inline call-outs on the step they attach to,
> not new numbers. **Nothing in this list has been executed.** All merge/push/build/deploy/DNS steps
> are Sky's hands — this phase (P6) only writes the list.

## Step 0 · A decision to make BEFORE step 1 (cheapest now, costly later)

**`c24f34c`** (Q2 follow-up, self-flagged "⚠ EXCEEDS APPROVED PLAN" in `DECISIONS.md` §D) unified the
copy-result SHARE string ("MAC deck" → "TERMINAL deck") — isolated, trivially revertible, but it went
beyond P2's approved scope. It sits mid-stack in `uplift/p2-frontdoor`, under `78d605a`.

- **Keep it:** do nothing — it ff-merges with the rest of P2 automatically.
- **Drop it:** decide before merging P2. After P2 is on `main`, dropping costs a revert commit instead
  of a clean pre-merge choice. Cheapest to decide now, while it's still an isolated commit on a branch.

## Step 1 · Merge in TRAIN ORDER (ff-only) — pick ONE of two equivalent paths

Both are fast-forward only, both land the identical final tree — the only difference is how many
stops you take to look:

**Option A — one shot.** `git checkout main && git merge --ff-only uplift/p6-closeout` ships all 6
phases (30 commits: P1–P5's code + P6's 3 doc commits... check current count with `git log
--oneline main..uplift/p6-closeout | wc -l` at merge time) in a single fast-forward.

**Option B — phase by phase.** `git merge --ff-only uplift/p1-floor`, then `...p2-frontdoor`, then
`...p3-winbeat`, then `...p4-studyreport`, then `...p5-ghost`, then `...p6-closeout` — six stops,
each one an independent fast-forward of `main`. Lets you pause and look between phases (e.g. run the
device checklist against P1 alone before moving on) at the cost of six separate pushes/deploys instead
of one.

Either way: **never skip a phase.** Skipping requires rebasing every later branch onto the new tip and
re-running their gates before merging — the ff-only guarantee is what makes rollback trivial (`git
reset --hard <phase's base SHA>`, listed per-phase in each evidence report); breaking train order
breaks that guarantee.

## Step 2 · Push

`git push origin main`.

## Step 3 · GitHub Pages deploys automatically (L5)

Confirm the deploy workflow shows green on the push — `CLAUDE.md`'s CI mirrors the local green gate;
if CI is red, fix the root cause before treating the deploy as real (never push past a red CI to "see
if it's really broken").

## Step 4 · Verify live: favicon fallback chain (L2)

**Four binaries ship together, not just the `<link>` tags:** `favicon.svg` (recolored, primary),
`favicon-32.png`, `favicon-180.png` (apple-touch), `favicon.ico` (16/32/48 multi-size). All four must
be reachable at 200 on the live domain — check each URL directly, then confirm the browser tab +
bookmark actually render the recolored icon (this is also `DEVICE-GATE-CHECKLIST.md` item 6).

## Step 5 · Verify live: font preload URLs byte-match (L3)

Q5's preloads are pinned to specific resolved URLs for **Inter v20 / JBMono v24** — a routine Google
Fonts version bump on their end silently turns a pin into a wasted, non-matching download (double
fetch instead of a cache hit). Spot-check: open the live site, inspect the `<link rel=preload>` `href`
values, and confirm they byte-match whatever the live `css2` stylesheet actually resolves to at deploy
time (same method P2's adversarial pass used to verify this pre-merge — re-run it post-deploy since
Google's CDN can rotate URLs independent of any change on this end).

## Step 6 · Re-scrape social caches (L1)

`og:image` / `twitter:image` are **absolute URLs to the prod domain** — scrapers cache aggressively.
After deploy:
- LinkedIn Post Inspector (or equivalent) to force a re-scrape.
- iMessage's link-preview cache is the stubborn one — expect real lag; don't treat a stale preview as
  a deploy failure on its own.
- **Same-deploy dependency:** the rewritten `og:image:alt` text and the new `og-image.png` binary
  landed in the SAME gated commit (`c4b06dc`) specifically so words and picture can never disagree on
  the branch — confirm both actually reached prod together (they will, since they were never
  separable commits, but this is the reminder for why that mattered).

## Step 7 · Confirm no DNS changes (L4)

Nothing in this train touches DNS. `CNAME` exists at the repo root (`ghostcode.skypistudio.com`,
added `7ab62c6`, pre-dates this train) — confirm it's untouched: `git diff 9789d1a..HEAD -- CNAME`
must be empty.

## Step 8 · The consolidated device session, against the LIVE site (L6)

Run every item in `DEVICE-GATE-CHECKLIST.md` — now against production, not a LAN preview. This is the
step that actually closes the loop: everything above gets the bits to production; this is Sky
confirming they look and behave right once there.

---

## Standing hazard (repeat here since it applies to every step above)

`design-reviews/` binaries (`assets/`, capture PNGs/JSONs, `tools/`) remain **untracked** —
`P6-0` committed only the `build-plan/**.md` text. **`git clean` stays forbidden train-wide**, on
`main` after merge exactly as it was on every phase branch: a clean would delete the design authority
and every phase's evidence alongside whatever else is untracked at the time.

## Standing note (Pages now serves the build-plan docs — named once, not re-litigated)

GitHub Pages serves from the repo root (CNAME → ghostcode.skypistudio.com). Once step 1 lands, the 14+
`build-plan/**.md` files P6 tracked become fetchable at
`/design-reviews/fable-audit/build-plan/…` on the live domain — the same way `qa-reports/` is already
tracked and served today. This was a P6 commit-scope decision made knowingly (see `HANDOFF.md`'s P6
pre-flight note); named here once so it's a decision on the deploy record, not a surprise when someone
notices the URL resolves.
