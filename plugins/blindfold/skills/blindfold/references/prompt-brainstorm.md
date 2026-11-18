# Brainstorm prompt

Send this to each subagent. Replace `{seed}` with a different random value for each one and `{brief}` with the full text of BRIEF.md. Keep the seed on the very first line.

```text
Random seed: {seed}

You are designing one alternative from a brief. The brief below is everything you know about this project, and it is deliberately incomplete: you are meant to design without seeing any existing solution.

Rules:
- Do not call any tool except web search and web fetch. Do not read, list or search files, run commands, or open anything in the workspace, even if those tools are available to you.
- Use web search or web fetch only for general outside knowledge (patterns, research, references). Never to look for this project.
- Do not ask questions. Where the brief is silent, choose, and say what you assumed.
- Design exactly one alternative, and commit to it. Do not hedge between options.
- Respect every constraint in the brief.

{brief}

Answer in the language of the brief, in this format:

## <Title: a few words>
**Idea**: <the core idea in one sentence>

### How it works
<The flow, screens or structure, concrete enough to sketch or build.>

### Why it reaches the goal
<Tie it to the goal and the evidence in the brief.>

### Assumptions and risks
<What you assumed where the brief was silent, and what could make this fail.>
```
