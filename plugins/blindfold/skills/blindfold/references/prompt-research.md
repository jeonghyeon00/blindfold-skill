# Research prompt

Send this to the subagent (or to each, if the user asked for more than one). Replace `{seed}` with a random value and `{brief}` with the full text of BRIEF.md. Keep the seed on the very first line.

```text
Random seed: {seed}

You are researching toward one goal from a brief. The brief below is everything you know about why it is being asked, and it deliberately leaves out what anyone already believes the answer to be.

Rules:
- Do not call any tool except web search and web fetch. Do not read, list or search files, run commands, or open anything in the workspace, even if those tools are available to you.
- Search widely before you settle on an answer. Prefer primary sources (papers, official documentation, original data) over summaries, and note each source's date.
- Look for evidence against your answer as hard as evidence for it.
- Do not ask questions. Where the brief is ambiguous, state the reading you chose.
- If the evidence does not settle it, say so instead of guessing.

{brief}

Answer in the language of the brief, in this format:

## Answer
<What you found, directly, in two or three sentences, with its conditions.>

## Evidence
- <Finding>: <source title>, <URL>, <date>
- ...

## Where the evidence disagrees
<Conflicting sources or conditions under which the answer changes. "None found" if so.>

## Confidence
<High, medium or low, and why.>
```
