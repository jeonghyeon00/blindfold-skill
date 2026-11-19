# Writing BRIEF.md

The subagents know nothing but this file. Write it for a capable stranger who will never see the project and cannot ask you anything. Every mode uses Goal and Context; Decide adds Options. A brief of 100 to 400 words is normal.

## Brainstorm brief

```markdown
# BRIEF

## Goal
<One or two sentences: the outcome, and how success is measured.>

## Context
- <What the product is and who uses it.>
- <The problem as the user sees it: the symptom, who it hits and why it
  matters, close to the user's own words.>
- <The evidence: numbers, where it happens, for whom.>
- <The user's guess at the cause, if they have one, labelled as a guess.>
- <Each hard constraint, written as values: colours as hex, fonts by name,
  the logo described in words, required inputs, platform, screen size,
  accessibility, budget, deadline.>
- <What is explicitly out of scope.>
```

## Research brief

```markdown
# BRIEF

## Goal
<What to find out, as an open goal. Not a claim to confirm.>

## Context
- <What the finding is for, and what kind of answer helps: a number,
  a comparison, a yes/no with conditions.>
- <Scope: timeframe, region, versions, population.>
- <Definitions of any term that could be read more than one way.>
```

## Decide brief

```markdown
# BRIEF

## Goal
<The outcome the choice has to serve.>

## Context
- <What the product is and who uses it.>
- <The problem as the user sees it, with its evidence.>
- <Hard constraints, written as values.>
- <The user's criteria in priority order, if they have any.>

## Options
### Option 1
<What it is and how it works, in neutral words.>

### Option 2
<The same level of detail as Option 1.>
```

Describe every option at the same length and level of detail. A longer or more vivid description wins votes on its own.

## Checklist

### Common

- [ ] Someone who has never heard of the project understands the task.
- [ ] Every constraint is written out, not referenced. "Keep the brand colours" is useless to an agent that cannot read files; "primary #3B5BFD, text #111318" is not.
- [ ] Nothing depends on a file, a link only you can open, or earlier conversation.
- [ ] A stranger could not guess the current solution, or the answer you expect, from it.

### Brainstorm

- [ ] The problem is stated as the user sees it, so every subagent solves the same problem.
- [ ] A guessed cause is labelled as a guess, and the user's own solution idea is left out.
- [ ] No description of the current solution, its structure or steps.
- [ ] No prior attempts or rejected ideas.
- [ ] No file paths, code, component names or screenshots.
- [ ] No preferred direction.

### Research

- [ ] The goal is open: something to find out, not a claim to confirm.
- [ ] No suspicion of the user's, and no expected answer or hint of which way you lean.
- [ ] No source you have already read, and no confidence level.

### Decide

- [ ] Options are labelled only by number, and no name hints at its origin.
- [ ] Every option is described at the same length and level of detail, in neutral words.
- [ ] Nothing says which option exists today, who proposed which, or what anyone prefers.
- [ ] No cost already spent on an option, unless it is a real constraint going forward.
- [ ] The order of the options is shuffled for each judge.

## Examples

### Brainstorm

Request: "Rework onboarding to cut sign-up drop-off"

```markdown
# BRIEF

## Goal
Cut drop-off during sign-up and raise sign-up completion to 55% or more.

## Context
- A web whiteboard that designers, developers and PMs use together.
- The problem as the user sees it: six in ten people who start signing up leave before finishing, worst on mobile.
- The user guesses it is because there looks like a lot to fill in. The cause is not confirmed.
- Sign-up completion is 38% today.
- Brand colours: primary #3B5BFD, text #111318. Logo: a text wordmark, top left.
- Collect exactly three things: email, password, role.
- It must finish within the first screen at 360px wide.
```

The brief states the problem the user sees and marks their theory as a guess, but does not mention that the current onboarding is a three-step form, or anything about its buttons, copy or progress bar. With those left out, the subagents come back with a conversational sign-up, a try-first flow and a single card instead of three variations on the form.

### Research

Request: "Is it true that cutting fields from a sign-up form always raises conversion?"

```markdown
# BRIEF

## Goal
Find out, with evidence, how the number of fields in sign-up and lead forms affects completion rate, and the conditions under which that effect changes.

## Context
- For designing the sign-up form of a web service.
- Looking for experiments, studies and large-scale cases on how field count relates to completion rate.
- Both the size of the effect and the conditions where it was absent or reversed are needed.
```

The brief turns "always raises" into an open goal and does not say what the user or the main agent believes, so the subagent has nothing to agree with.

### Decide

Request: "Which of A, B and C is best?" after the Brainstorm example above.

```markdown
# BRIEF

## Goal
Cut drop-off during sign-up and raise sign-up completion to 55% or more.

## Context
- A web whiteboard that designers, developers and PMs use together.
- The problem as the user sees it: six in ten people who start signing up leave before finishing, worst on mobile.
- Collect exactly three things: email, password, role. It must finish within the first screen at 360px wide.
- Criteria: effect on completion rate first, then implementation effort.

## Options
### Option 1
Let people use the board right away without signing up, and ask for email, password and role on one screen the first time they save.

### Option 2
Ask one question at a time, like a chat: email, then password, then role.

### Option 3
Put all three fields on a single card, with role as one-tap chips.
```

The options drop their Brainstorm titles and letters, and each is one sentence of the same weight. Each judge sees them in a different order.
