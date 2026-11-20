/** Every user-facing string on the page, per locale. Mono labels and kickers stay English by design. */
export interface Messages {
  meta: {
    title: string
    /** what Blindfold is, read after the wordmark in the H1 */
    headline: string
    description: string
    /** shorter line for link previews */
    share: string
    imageAlt: string
    keywords: string
    noscript: string
  }
  nav: { home: string; sections: string; language: string }
  story: {
    aria: string
    heroTag: [string, string]
    heroDesc: string
    cue: string
    /** captions for the Countless, Leaning, One Way and Wide Open chapters */
    chapters: [string, string, string, string]
    /** closing line of the More Ideas chapter; \n breaks the line */
    lead: string
  }
  why: { label: string; manifesto: string }
  how: {
    label: string
    blindzone: string
    steps: [{ name: string; desc: string }, { name: string; desc: string }, { name: string; desc: string }]
  }
  compare: {
    label: string
    title: string
    ask: string
    prompt: string
    withoutAria: string
    withAria: string
    mainAgent: string
    subagents: string
    loaded: [string, string, string, string]
    briefWhat: string
    goal: string
    context: string
    results: string
    sameForm: string
    blindResults: string
    verdictWithout: string
    verdictWith: string
    nudges: [string, string, string]
    alts: [{ title: string; desc: string }, { title: string; desc: string }, { title: string; desc: string }]
    pickHint: string
    pickThen: string
    sketch: {
      email: string
      password: string
      role: string
      hint: string
      next: string
      askEmail: string
      emailAnswer: string
      askRole: string
      roles: [string, string, string, string]
      saveToSignUp: string
      quickSignUp: string
      start: string
    }
  }
  start: { label: string; copyFail: string; when: string; get: string; then: string }
  install: {
    short: string
    title: string
    options: string
    method: string
    where: { skills: string; claude: string; codex: string }
    invoke: string
    request: string
    copy: string
    copied: string
  }
}
