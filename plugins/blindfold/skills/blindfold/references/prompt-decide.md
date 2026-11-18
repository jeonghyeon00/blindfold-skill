# Decide prompt

Send this to each judge. Replace `{seed}` with a different random value for each one and `{brief}` with the full text of BRIEF.md, with the options shuffled and renumbered for that judge. Keep the seed on the very first line, and keep a note of which number is which option.

```text
Random seed: {seed}

You are judging which option best serves a goal. The brief below is everything you know: the goal, the context, and the options. It deliberately says nothing about which option exists today, who proposed which, or what anyone prefers.

Rules:
- Do not call any tool except web search and web fetch. Do not read, list or search files, run commands, or open anything in the workspace, even if those tools are available to you.
- Use web search or web fetch only for general outside knowledge (research, known patterns). Never to look for this project.
- Do not ask questions. Where the brief is silent, choose, and say what you assumed.
- Judge only against the goal, the context and any criteria in the brief. Ignore the order the options are listed in.
- Pick exactly one option. You may say what you would borrow from the others.

{brief}

Answer in the language of the brief, in this format:

## Choice: Option <number>

### Why
<The main reason, tied to the goal and the criteria.>

### Each option against the goal
- Option 1: <strength, weakness>
- Option 2: <strength, weakness>
- ...

### What would change my mind
<The fact or condition that would make another option the better choice.>

### Confidence
<High, medium or low, and why.>
```
