# Pac-Man Code Trainer — Learner-UX Friction Analysis (Flashcard Flow)

**Date:** 2026-05-29  
**Researcher:** Riley (User Researcher)  
**Project:** Pac-Man Code Trainer  
**Focus:** Cognitive friction in the flashcard-to-play loop for beginner learners

---

## Executive Summary

Pac-Man Code Trainer is a **game-based learning tool** for memorizing Claude Code and Mac terminal commands via a flashcard mechanic embedded in arcade gameplay. The core loop is:

1. **Flashcard prompt:** "Open Claude's memory files" appears above Pac-Man
2. **Learner reads** and mentally searches for the answer
3. **Learner picks one** of 4 command dots (correct answer + 3 decoys)
4. **Feedback:** Pac-Man chomps (right) or ghost kills (wrong); hint shown on fail
5. **Next card** loads after ~1 sec

This report surfaces **cognitive friction points** that slow learning or create frustration, especially for learners with:
- Low confidence in the domain (beginner coders, not familiar with `/help` convention)
- Limited working memory (juggling 4 options on the fly)
- Anxiety around "wrong answers" (prefer guidance over punishment)

**Confidence:** Medium — grounded in learning science + the app's current structure. Not from live user testing.

**Key Finding:** The game conflates *difficulty tuning* (how hard are the decoys?) with *confidence scaffolding* (does the learner feel safe trying?). Beginners hit a wall around card 10–15 when decoys stop being obviously wrong.

---

## Scenario 1: Decoy Difficulty Cliff

### Current Card Progression

**Easy cards (1–5):**
```
Prompt:   "Open Claude's memory files"
Answer:   "/memory"
Decoys:   "/remember", "/notes", "/brain"
Difficulty: Low — decoys are obviously wrong
```

A beginner reads "/memory" vs "/remember" and quickly sees: "/remember" is English, but Claude uses short slash-commands, so "/memory" is right.

**Medium cards (6–10):**
```
Prompt:   "Clear the current Claude Code conversation"
Answer:   "/clear"
Decoys:   "/reset", "/new", "/wipe"
Difficulty: Medium — decoys are plausible
```

Now the learner must **choose between semantically similar options**. Both "/clear" and "/wipe" mean "remove everything." They must remember which one Claude actually uses, not just understand the concept.

**Hard cards (11+):**
```
Prompt:   "Show current session status"
Answer:   "/status"
Decoys:   "/info", "/whoami", "/about"
Difficulty: High — all four are used in real terminals
```

A beginner who knows terminal basics knows `/whoami` (shows current user), `/info` (generic info), `/about` (common app command), and `/status` (health check). They're **all plausible**. Guessing now requires rote memorization of the exact Claude convention, not reasoning.

### The Friction: No Scaffolding Between Difficulty Levels

When a learner fails at card 11, they see:

```
❌ WRONG. Try again.
Hint: [generic hint like "Same word your laundry app uses"]

[Next card]
```

The hint is **sometimes helpful** (if they know what a laundry app does) but **often oblique** (assumes context they don't have). After 3–4 failures on the same card, the learner:
- Feels stuck (can't reason their way to the answer)
- Stops trying (clicks randomly)
- Quits the game (frustration threshold exceeded)

### Recommended Fix Direction

#### 1. Progressive Reveal (Hint Escalation)

Instead of a single hint, show hints that scaffold the learner back to reasoning:

**Attempt 1 (wrong):**
```
❌ Try again.
Hint: Think about what a laundry app uses.
[Retry] [Next card]
```

**Attempt 2 (wrong):**
```
❌ Still not it. The command is one of these 4.
Hint: It's the one that tells you your current situation.
[Retry] [Next card]
```

**Attempt 3 (wrong):**
```
❌ Let's reveal it.
The command is: /status
Hint: Same word your laundry app uses (shows wash status).
[Master card] [Review hint] [Next card]
```

**Why this works:**
- Attempt 1: Learner has room to reason
- Attempt 2: Narrowing scope (4 options → think about "current situation")
- Attempt 3: Direct answer + explanation (learning moment, not punishment)

#### 2. Decoy Explanation

After revealing the answer, briefly explain why the decoys are wrong:

```
The answer is: /status
Hint: Shows your current session info (like laundry status).

Why the others are wrong:
- /info: too vague, not a Claude command
- /whoami: tells you *who* you are, not your *status*
- /about: would show app info, not session info

[Next card]
```

**Why this works:**
- Learner understands the *reasoning*, not just rote memorization
- Sees why decoys are plausible (improves transfer to real learning)
- Feels less punished, more informed

---

## Scenario 2: Confidence Anxiety in Early Attempts

### Current Feedback Loop

When a learner plays a card:

1. **Read prompt** (1–2 sec)
2. **Think** (2–4 sec, sometimes longer)
3. **Click a dot** (instant)
4. **Immediate feedback:** ✓ (green flash, Pac-Man chomps) OR ❌ (red flash, ghost kills)
5. **Hint appears** for failed attempts

### Friction: High-Stakes Guessing

A learner approaching card 6 with low confidence might think:

> "I don't know. All four options look right. If I guess and get it wrong, I lose a life. Better to just click and see what happens."

This is **not learning**; it's **random guessing with feedback**. And if they guess wrong:

```
❌ WRONG
Hint: "Same word your laundry app uses"
[Next card]
```

The learner has **no explanation of why** they were wrong or how to improve. They just move to the next card and guess again.

### Recommended Fix Direction

#### 1. Optional "Show Hint Before Answering" Mode

Add a toggle in settings:

```
☑ Show hint before answering (learning mode)
☐ Hide hint until wrong (arcade mode)
```

In learning mode, the hint appears **before** the learner clicks:

```
Prompt: "Clear the current Claude Code conversation"
Hint:   "Same word you'd use to wipe a screen."

[/reset] [/clear] [/new] [/wipe]
```

This gives the learner a *reasoning aid*, not just feedback. They can use the hint to **narrow down** before guessing, building confidence.

**Why this works:**
- Beginners use hints proactively (learning strategy)
- Advanced learners ignore hints (arcade challenge)
- Same cards serve both skill levels

#### 2. Confidence Self-Assessment

After answering (correct or wrong), let the learner rate their confidence:

```
You answered: /clear ✓ CORRECT

How confident are you?
☐ Not sure (lucky guess)
☐ Somewhat sure
☑ Very sure (I know this one)

[Next card]
```

**Why this works:**
- Learner's self-perception of mastery feeds into adaptive difficulty
- Lucky guesses don't count as "mastered" (avoids false confidence)
- App can prioritize re-teaching cards the learner is uncertain about

---

## Scenario 3: Working Memory Overload (4 Options, 1 sec Glance)

### Current Flow

The flashcard prompt appears for ~2 sec before the 4 dots. Then Pac-Man appears, and the learner has **unlimited time** to click, but the presence of 4 *simultaneously visible* options creates cognitive load:

```
Prompt:   "Switch which Claude model you're chatting with"
Options:  [/switch] [/brain] [/model] [/version]
Time:     Think... click...
```

A learner reads the prompt, scans 4 options, and must hold them all in working memory while reasoning. For beginners, this is **cognitively expensive**:

- "What does each option mean?" (parsing)
- "Which one sounds like a Claude command?" (semantic reasoning)
- "Have I seen this before?" (retrieval from short-term memory)

All at once. By option 3 or 4, they've forgotten option 1.

### Friction: No External Aid

The current UI offers **no way to reduce cognitive load** for learners:
- No way to "buy time" (countdown timer would help)
- No way to "narrow options" (eliminate most-wrong decoy)
- No way to "check reasoning" (preview what each command does)

### Recommended Fix Direction

#### 1. Lifelines (Game Mechanic Borrowed from "Who Wants to Be a Millionaire")

Allow the learner to use **lifelines** (limited per session):

**50/50 Lifeline:**
```
[/switch] [?] [/model] [?]
```
Removes 2 of the 3 wrong options, leaving the correct answer + 1 decoy. Learner now has a 50/50 chance with more time to reason.

**Ask the Audience Lifeline:**
```
/switch: 12%
/brain:   8%
/model:  75%
/version: 5%

(Shows % of prior learners who chose each.)
```
Gives the learner a hint from the crowd without spoiling the answer.

**Why this works:**
- Learner has agency (can choose when to use a lifeline)
- Reduces cognitive load without removing the challenge
- Gamifies the learning experience (uses gaming conventions they know)
- Doesn't spoil the answer; still requires reasoning

#### 2. Hint Specificity Levels

Instead of a single hint, let the learner request **how much help** they want:

```
[Show a clue (1 word)] [Show a hint (full hint)] [Show the answer]
```

Clicking "Show a clue (1 word)" might reveal:
```
Clue: "model" (or "switch"?)
```

Then learner can reason: "Oh, /model, not /switch. Because you're not switching, you're selecting which model."

**Why this works:**
- Learner controls the level of spoiler they receive
- Still builds reasoning skills (they fill in the gaps)
- Works for all difficulty levels

---

## Scenario 4: Gamification Misalignment (Game Over Feels Punishing)

### Current Feedback

When the learner loses a life:

```
❌ WRONG
Ghost eats your life: ♥♥ → ♥
[Next card] OR [Game Over if 3rd loss]
```

Each wrong answer **costs a life**. Losing 3 lives ends the game. This feels **punishing** to a beginner who's trying to learn, not compete.

### Friction: Learning ≠ Winning

A learner who plays for 30 min, answers 20 cards, gets 5 wrong, and loses all 3 lives will feel:

> "I failed. The game is over. I learned a few things, but I lost."

This is **misaligned incentives**. They came to *learn*, but the game measures *performance*. A learner who prioritizes learning over performance will:
- Give up early (loss feels inevitable)
- Rush through cards (try to finish before losing)
- Stop playing (frustration outweighs fun)

### Recommended Fix Direction

#### 1. Separate Learning Mode from Arcade Mode

**Learning Mode:**
- No lives / no game over
- Show hints before answering
- Progress through all cards, build confidence
- Card-level mastery tracking (did they get it right?)

**Arcade Mode:**
- Traditional 3-life system
- Fast feedback, high challenge
- Compete for high scores
- Target: learners who've played 10+ times

**Why this works:**
- New learners default to Learning Mode (safe, scaffolded)
- Returning learners choose Arcade Mode (challenge, speed)
- Same cards, different incentives

#### 2. Mastery Tracking Without Lives

In Learning Mode, track progress like Duolingo:

```
Session progress:
✓ cc-help (correct on attempt 1)
✓ cc-clear (correct on attempt 2)
✓ cc-memory (correct on attempt 1)
○ cc-init (not yet mastered)
○ cc-config (not yet mastered)

Cards mastered this session: 3/5
Overall streak: 12 days
```

**Why this works:**
- Learner sees progress (intrinsic motivation)
- No "failure" feeling; just "not mastered yet"
- Encourages returning (streak motivation)

---

## Evidence Summary: Confidence Levels

| Friction Point | Evidence | Confidence | Why |
|---|---|---|---|
| **Decoy difficulty cliff** | Visible in cards.js (easy cards, hard cards with real-world decoys) | **High** | Empirical observation of card progression |
| **Single hint insufficient** | Reasoned from learning science (Bloom's taxonomy, hint scaffolding) | **Medium** | Not observed live, but aligns with pedagogical best practice |
| **4-option working memory overload** | Reasoned from cognitive psychology (working memory limits ~4 items) | **Medium** | Theory-driven, not user-tested |
| **Game Over punishes learners** | Reasoned from goal-alignment (learning vs. performance incentives) | **Medium-High** | Clear incentive mismatch; common in gamified learning |
| **Confidence anxiety in early attempts** | Inferred from beginner profile (Sky's profile: learns by doing, low patience) | **Medium** | Aligned with learner profile, not directly observed |

---

## Blockers for Ship?

**No.** The game is **functional and fun** in its current form:
- Core mechanic works (prompt → 4 options → feedback)
- Card deck is well-designed (prompts are clear, decoys are plausible)
- Arcade gamification is engaging
- Hint quality is decent (though brief)

**Should-have before widening use (e.g., sharing with learners):**
1. **Learning Mode** (no lives, scaffolded hints) — appeals to true learners
2. **Mastery tracking** — shows progress, encourages return visits
3. **Hint escalation on failure** — prevents random guessing

**Nice-to-have:**
1. Lifelines (50/50, audience)
2. Confidence self-assessment
3. Decoy explanations

---

## Next Steps

### For Iteration (game design):
1. **Priority 1:** Add Learning Mode toggle + mastery tracking (high-impact, learner retention)
2. **Priority 2:** Implement hint escalation on wrong attempts (reduces frustration)
3. **Priority 3:** Add card-level explanations (improves transfer learning)

### For Content (cards.js):
1. Review all hints for quality (some are great, some oblique)
2. Consider adding difficulty tags to cards (easy, medium, hard)
3. Ensure decoys are plausible for the target skill level

### For Data:
- Track which cards have the highest failure rate (they're the friction points)
- Track which hints are most useful (learners who use hints vs. pure guessing)
- Measure mastery decay (does a learner need reminder cards later?)

---

## Appendix: Learning Mode Wireframe

```
PAC-MAN CODE TRAINER

[☑ Learning Mode] [☐ Arcade Mode] [Settings] [Stats]

Card: 6 / 20
Session Progress: ███░░░░░░ 30%

Prompt:        "Show current session status"
Hint (optional): "Tells you how things are right now"

[/info] [/whoami] [/about] [/status]

[Skip this one] [Master: I know this]
```

On wrong answer:
```
❌ Not quite.

Attempt 2 hint: Think about what describes your situation right now.

[Try again] [See the answer]
```

On success or reveal:
```
✓ The answer is: /status

This shows your current session info (like laundry status).

Why the others are wrong:
- /info: too vague for a specific Claude command
- /whoami: shows *who* you are, not your status
- /about: app metadata, not session state

[Next card]
```
