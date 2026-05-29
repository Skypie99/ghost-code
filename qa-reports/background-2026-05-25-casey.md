# Casey — Background Cycle — 2026-05-25

```yaml
mode: background
role: casey
project: primary = pacman-code-trainer | also: accessmap, mutualmesh, prompt-library
cycle_id: casey-copy-2026-05-25
model_tier: sonnet
date: 2026-05-25
coherence_score: 0.94
state_consistency: pass
duplicate_work_detected: no
drift_risk: low
change_applied: true
branch: community/auto-2026-05-25-casey-readme (pacman-code-trainer)
commit: ea8fefc
```

---

## 1. Dependency Graph

```yaml
nodes:
  - casey/pass1-copy-pacman (Casey, write)
  - casey/pass1-copy-prompt-library (Casey, audit)
  - casey/pass1-copy-accessmap (Casey, audit-only)
  - casey/pass1-copy-mutualmesh (Casey, audit-only)
  - casey/pass2-readme-pacman (Casey, community doc change)
  - casey/pass3-ideation (Casey, concept notes)
  - shamus/next-cycle-pacman (Shamus, future — pick up copy)
  - shamus/next-cycle-prompt-library (Shamus, future — pick up copy)

edges:
  - casey/pass1-copy-pacman → shamus/next-cycle-pacman (data: copy file)
  - casey/pass1-copy-prompt-library → shamus/next-cycle-prompt-library (data: copy file)
  - casey/pass1-copy-accessmap → casey/pass2-readme-pacman (gate: audit first, then change)
  - casey/pass2-readme-pacman → [morgan review] (merge: Sky merges when ready)
```

---

## 2. Reason for Ordering

- **Pac-Man first** — highest-priority eligible non-AUDIT-ONLY project; simplest codebase; most copy surfaces unaddressed. `ASSUMPTION` — no LEARNINGS.md exists for Pac-Man; ordering is Casey's judgment.
- **Prompt Library copy was already complete** from a prior background cycle (87 strings, F8 + F-future-1/2/3 + 5 polish proposals). Reviewed; still valid. No rewrite needed. Matches principle: don't repeat shipped work (Const. 9.6 §5).
- **AccessMap + MutualMesh = AUDIT-ONLY** per Const. Art. 12.5. Copy written to their qa-reports only, no branch created.
- **README before ideation** — reversible scoped change is higher value than a concept note; change used here, not on a risky surface.
- **One reversible change only** — `community/auto-2026-05-25-casey-readme` on Pac-Man (ea8fefc). No other commits this cycle. `CONST 12.3 respected.`

---

## 3. Blocked Nodes

- `{node: casey/pass1-copy-accessmap/heat-map, why: Jordan pre-review required (location + disability data, Const. Art. 7), unblock: Jordan APPROVED — then Shamus can wire copy in, type: DECISION_FOR_SKY}`
- `{node: shamus/next-cycle-prompt-library, why: copy file from prior cycle already landed — no new copy needed this cycle; Shamus should check if F5 Export/Import copy in prior file matches shipped implementation, unblock: Shamus reads SettingsModal.tsx and confirms alignment, type: MISSING_INPUT}`

---

## 4. Checkpoint References

- `{name: pacman-readme-improved, role: casey, artifact: branch:community/auto-2026-05-25-casey-readme#step-1, qa-report: qa-reports/background-2026-05-25-casey.md:this file}`
- `{name: prompt-library-copy-prior-cycle, role: casey, artifact: branch:prior-session-copy-file, qa-report: Documents/Claude/Projects/Prompt Library Tool/copy/copy-2026-05-25.md:line-1}`
- `{name: accessmap-copy-audit, role: casey, artifact: branch:none (audit-only), qa-report: AccessMap/qa-reports/background-2026-05-25-casey.md:line-1}`
- `{name: mutualmesh-copy-audit, role: casey, artifact: branch:none (audit-only), qa-report: MutualMesh/qa-reports/background-2026-05-25-casey.md:line-1}`

---

## 5. Duplication Report

No duplications detected this cycle.

Prior 7 days of qa-reports surveyed:
- `qa-reports/background-2026-05-25-gary-evening.md` — Gary fixed empty deck robustness, did not write copy. No overlap.
- `qa-reports/background-2026-05-25-quinn.md` — Quinn audited Prompt Library qa-reports (different project). No overlap.
- MutualMesh `community/auto-2026-05-25-casey-*` branches — prior Casey MutualMesh work. This cycle's MutualMesh output is AUDIT-ONLY to qa-reports, not branched. No conflict.

No role is being asked to repeat shipped work.

---

## Deliverables This Cycle

### Pass 1 — UI Copy

| Project | Output | Status |
|---|---|---|
| Pac-Man Code Trainer | `copy/copy-2026-05-25.md` — all screens, all states, aria pairs | NEW — written this cycle |
| Prompt Library Tool | `copy/copy-2026-05-25.md` — 87 strings (F8 + F-future-1/2/3 + 5 polish proposals) | EXISTING — audited + confirmed still valid |
| AccessMap | `qa-reports/background-2026-05-25-casey.md` — 6 features × copy | AUDIT-ONLY — no branch |
| MutualMesh | `qa-reports/background-2026-05-25-casey.md` — AC-6.1/6.2/6.3 + waiting room audit | AUDIT-ONLY — no branch |

### Pass 2 — Community Doc Improvement

- **Pac-Man README** — `community/auto-2026-05-25-casey-readme` (commit `ea8fefc`)
  - Added live demo link (`https://skypie99.github.io/pacman-code-trainer/`)
  - Added controls table (was inline, now scannable)
  - Added scoring / streak explanation
  - Added category table
  - Added `copy/` and `qa-reports/` to file listing

Community doc gaps noted (proposals, not applied):
- AccessMap README has no accessibility statement. Proposal: one paragraph explaining what AccessMap is for, who it's built for, and that a11y is a design pillar.
- MutualMesh README is comprehensive (Will's work is solid). No changes needed.
- Portfolio README: N/A — portfolio site, not a contributor-facing project.

### Pass 3 — New App Ideation

Two concepts written to `~/ClaudeCorp/qa-reports/new-app-concept-2026-05-25-local-handoff.md`:
1. **Local Handoff** (M) — zero-account, privacy-first file handoff between devices
2. **Pace Letter** (S) — guided personal letter writing via structured Claude prompts

---

## Voice Audit Summary (across all 5 projects)

The following patterns are consistent and should be maintained across all copy:

- **Consequence-named CTAs** — every destructive action names what happens, not just "Cancel"
- **Aria labels expand visual labels** — visual "Delete" → aria "Delete this flag from your watch list"
- **No inspiration porn** (AccessMap/MutualMesh) — disability framing is neutral and factual
- **Pluralization without parens** — `count === 1 ? "prompt" : "prompts"` not `"prompt(s)"`
- **Toast copy is flat** — "Saved" not "Saved!" no exclamation marks
- **Empty states name the action that fills them** — not "Nothing here yet" alone, but with a CTA

---

*— Casey, 2026-05-25 (BACKGROUND mode — no external sends, Const. Art. 12)*
