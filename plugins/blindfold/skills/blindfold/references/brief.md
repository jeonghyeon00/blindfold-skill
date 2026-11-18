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

Request: "온보딩 이탈 방지를 위해 온보딩을 다시 구성하고 싶어"

```markdown
# BRIEF

## Goal
가입 도중 이탈을 줄여 가입 완료율을 55% 이상으로 올린다.

## Context
- 디자이너·개발자·기획자가 함께 쓰는 웹 협업 화이트보드.
- 사용자가 보는 문제: 가입을 시작한 사람 열에 여섯이 끝내지 않고 떠난다. 모바일에서 특히 심하다.
- 사용자는 입력할 것이 많아 보여서라고 추정한다. 확인된 원인은 아니다.
- 지금 가입 완료율은 38%다.
- 브랜드 컬러는 주색 #3B5BFD, 글자 #111318. 로고는 좌측 상단 텍스트 워드마크.
- 받는 정보는 이메일, 비밀번호, 직군 세 가지.
- 360px 폭의 첫 화면 안에서 끝나야 한다.
```

The brief states the problem the user sees and marks their theory as a guess, but does not mention that the current onboarding is a three-step form, or anything about its buttons, copy or progress bar. With those left out, the subagents come back with a conversational sign-up, a try-first flow and a single card instead of three variations on the form.

### Research

Request: "가입 폼에서 필드를 줄이면 전환율이 무조건 오른다는 게 맞아?"

```markdown
# BRIEF

## Goal
가입·리드 폼의 입력 필드 수가 완료율에 주는 영향과, 그 효과가 달라지는 조건을 근거와 함께 파악한다.

## Context
- 웹 서비스의 회원가입 폼을 설계하는 데 쓴다.
- 필드 수와 완료율의 관계를 다룬 실험, 연구, 대규모 사례를 원한다.
- 효과의 크기와, 효과가 없거나 반대로 나타난 조건이 함께 필요하다.
```

The brief turns "무조건 오른다" into an open goal and does not say what the user or the main agent believes, so the subagent has nothing to agree with.

### Decide

Request: "A, B, C 중에 뭐가 제일 나아?" after the Brainstorm example above.

```markdown
# BRIEF

## Goal
가입 도중 이탈을 줄여 가입 완료율을 55% 이상으로 올린다.

## Context
- 디자이너·개발자·기획자가 함께 쓰는 웹 협업 화이트보드.
- 사용자가 보는 문제: 가입을 시작한 사람 열에 여섯이 끝내지 않고 떠난다. 모바일에서 특히 심하다.
- 받는 정보는 이메일, 비밀번호, 직군 세 가지. 360px 첫 화면 안에서 끝나야 한다.
- 기준: 완료율 개선 효과, 그다음 구현 부담.

## Options
### Option 1
가입 없이 바로 보드를 쓰게 하고, 처음 저장하는 순간 이메일·비밀번호·직군을 한 화면에서 받는다.

### Option 2
한 번에 질문 하나씩, 채팅처럼 이메일, 비밀번호, 직군을 차례로 묻는다.

### Option 3
카드 한 장에 세 항목을 모두 두고, 직군은 한 번에 고르는 칩으로 받는다.
```

The options drop their Brainstorm titles and letters, and each is one sentence of the same weight. Each judge sees them in a different order.
