---
name: blindfold
description: Gets an unanchored result by hiding the existing context from the agents that produce it. The main agent distills the request into a short brief, independent subagents that cannot read files work from that brief alone, and the main agent compares what comes back. Brainstorm mode (3 subagents by default) designs genuinely different alternatives; use it when the user asks for fresh ideas, a redesign, other directions, or says every answer looks like the current one. Research mode (1 subagent by default) investigates an open goal from outside sources; use it when the user wants in-depth research, a rigorous fact-check, or an independent second opinion, not for quick lookups. Decide mode (3 subagents by default) has blind judges pick between existing options; use it when the user has to make a decision between options and wants it unbiased, or asks for a blind vote, not for a quick preference. Also use when the user invokes blindfold. Not for bugs, or for questions the project's own files answer.
license: MIT
metadata:
  version: "0.2.0"
---

# Blindfold

An agent that has already read the current screens, code and conversation anchors on them. Ask it for new directions and it returns variations of what exists; ask it to check a claim and it finds reasons to agree; ask it to choose and it favours what is already there. Blindfold keeps that context with you, the main agent, and sends independent subagents out with nothing but a brief.

## 0. Choose the mode

| Mode | Use for | Subagents | You get back |
| :- | :- | :- | :- |
| **Brainstorm** | ideas, alternatives, redesigns, other approaches | 3 | different designs to compare and pick from |
| **Research** | fact-checks, research questions, second opinions | 1 | a sourced finding to hold against what you believed |
| **Decide** | choosing between options that already exist | 3 | blind votes with reasons |

Pick the mode from the request. If the user gives a number of subagents, use it. When it is unclear: Brainstorm when the user wants something made, Research when they ask whether something is true, Decide when they already have options and ask which one.

## 1. Extract the brief

Write the brief from everything you already know. The subagents cannot read files, open links only you have, or ask questions, so the brief is all they will ever know. Every brief has a **Goal** and the **Context** needed to reach it; a Decide brief adds **Options**. Follow [references/brief.md](references/brief.md) for the templates, the checklists and examples.

**Brainstorm.**
- Goal: the outcome to reach, measurable when possible.
- Context: what the product is and who uses it; the problem as the user sees it (the symptom, who it hits and why it matters, close to the user's own words) with its evidence; every hard constraint written out as values (brand colours as hex, fonts, the logo described in words, required inputs, platform, screen size).
- Leave out: the existing solution, prior attempts, rejected ideas, file paths, code, and your preferred direction. If the user has a theory about the cause, keep it but label it as their unconfirmed guess; leave out any solution they have in mind.

**Research.**
- Goal: what to find out, written as an open goal rather than a claim to confirm ("check that X is faster than Y" becomes "find out how the speed of X and Y differs, and under what conditions").
- Context: what the finding is for, and the scope (timeframe, region, versions, definitions).
- Leave out: the claim's source, what the user suspects, your current answer, the evidence you have seen, and how confident you are.

**Decide.**
- Goal: the outcome the choice has to serve.
- Context: as in Brainstorm, plus the user's criteria in priority order if they have any. Without criteria, the goal is the criterion.
- Options: every option, labelled only `Option 1`, `Option 2`, …, each described with the same level of detail and in neutral words.
- Leave out: which option exists today, who proposed which, what the user or you prefer, how much was already spent on any of them, original names, and selling adjectives.

If a stranger could guess the current solution, or the answer you expect, from the brief, cut more.

Create a working directory with `mktemp -d` and save the brief there as `BRIEF.md`. Show the user the brief in a few lines, then continue unless they asked to review it first.

## 2. Isolate the subagents

Spawn the subagents in parallel. Give each one the prompt for its mode, filled in with a different random seed on the very first line (for example 8 random hex characters) and the full text of `BRIEF.md`, pasted in, since they cannot open the file:

- **Brainstorm**: [references/prompt-brainstorm.md](references/prompt-brainstorm.md)
- **Research**: [references/prompt-research.md](references/prompt-research.md)
- **Decide**: [references/prompt-decide.md](references/prompt-decide.md). Shuffle the order of the options for each judge, renumbering them, and keep the mapping: judges favour options by position.

In Claude Code with the Blindfold plugin installed, spawn each one as the `blindfold:blind-subagent` agent type: it has only web search and web fetch, and does not load CLAUDE.md. Anywhere else, use whatever subagent mechanism your environment provides; the prompt itself forbids every tool except web search and web fetch.

Give every subagent the same brief and nothing else. Do not assign directions, themes or personas, do not mention the other subagents, and do not hint at the current solution or the expected answer: each of those anchors them again.

If you cannot spawn subagents at all, tell the user Blindfold needs them and stop. Doing the work yourself defeats the purpose, because you have already seen the context.

## 3. Collect

Wait for every subagent. Save each answer next to `BRIEF.md`, unedited: `A.md`, `B.md`, `C.md`, … in Brainstorm mode, `FINDING.md` in Research mode, `VOTE-1.md`, `VOTE-2.md`, … in Decide mode, with the option mapping for each judge.

## 4. Compare, then act

Write to the user in their language.

**Brainstorm.** Compare the alternatives yourself; the subagents never see each other. For each one give its title, the core idea in one line, how it meets the goal, which constraint it strains, and what it would cost to build in this project. Say plainly where they overlap and which one you would pick and why, and note that your pick may lean toward whatever is closest to the existing solution. When there is no clear winner, or the user asks which one to take, offer a blind vote: run Decide with the same Goal and Context and the alternatives as the options. Let the user choose one, combine parts, or ask for another round; for another round, improve the brief rather than steering the subagents. Once the user has chosen, integrate the choice with your full context: match the project's design system, code and conventions, and keep what the brief said must stay.

**Research.** Now hold the finding against the claim or your own earlier answer. Report the finding with its sources, then a verdict: **agrees**, **partly agrees** or **conflicts**, and where exactly they differ. Where they conflict, check the cited sources yourself before you conclude, and do not dismiss the finding only because it disagrees with what you already had: that is the bias this mode exists to catch. If the evidence is thin or the sources disagree, say so; the user can ask for more subagents to see whether independent answers converge.

**Decide.** Map every vote back to the real options and report the tally (for example 2 to 1), each judge's main reason, and what would change their mind. A unanimous vote is a strong signal; a split means the options are close on these criteria or the brief is ambiguous, so offer to sharpen the criteria and run again. Then set the vote beside your own preference and beside the option that exists today, and say plainly when the vote goes against either: do not overrule it quietly. The user decides; once they have, integrate the choice with your full context.
