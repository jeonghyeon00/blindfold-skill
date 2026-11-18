import type { Messages } from '../types'

const messages: Messages = {
  "meta": {
    "title": "Blindfold — the Agent Skill that hides your context",
    "description": "An Agent Skill that briefly blindfolds your AI agent. It hides the existing context so independent subagents think from scratch and find genuinely new alternatives. Works with Claude Code, Codex and any Agent Skills client.",
    "share": "The more it knows, the less it imagines. Blindfold hides what your agent already knows, so fresh subagents can think from scratch.",
    "imageAlt": "The Blindfold mascot, blindfolded, surrounded by glowing idea bulbs",
    "keywords": "Blindfold, AI agent, Agent Skills, Claude Code, Codex, subagents, brainstorming, context anchoring, plugin",
    "noscript": "Turn on JavaScript to see the interactive content on this page."
  },
  "nav": {
    "home": "Blindfold, back to top",
    "sections": "Sections",
    "language": "Language"
  },
  "story": {
    "aria": "As context fills, thinking narrows; once it is hidden, thinking opens up again",
    "heroTag": [
      "The more it knows,",
      "the less it imagines."
    ],
    "heroDesc": "A skill that briefly blindfolds your AI agent. It hides the existing context and lets independent subagents think from scratch.",
    "cue": "Scroll to fill the context",
    "chapters": [
      "One requirement. Countless directions it could go.",
      "It reads the code, hears about past attempts, and the longer the conversation runs, the more its thinking leans one way.",
      "150k tokens. The window is only 15% full, yet whatever you ask drifts toward the answer that already exists.",
      "Leave only the brief, and the leaning thoughts open up in every direction again."
    ],
    "lead": "The less it knows,\nthe more it imagines."
  },
  "why": {
    "label": "Why it matters",
    "manifesto": "An agent anchors on the screens and code it has already seen. The longer the conversation, the less a request for a new design strays from where it started. The same model, kept from the existing work, finds a different path."
  },
  "how": {
    "label": "How it works",
    "blindzone": "Steps that run blindfolded",
    "steps": [
      {
        "name": "Extract",
        "desc": "Pull only the requirements that must hold from the existing work, and write them into a short brief."
      },
      {
        "name": "Isolate",
        "desc": "Launch several subagents that carry nothing but the brief. File reads are blocked."
      },
      {
        "name": "Diverge",
        "desc": "Each agent designs its own alternative without knowing the current solution."
      }
    ]
  },
  "compare": {
    "label": "Compare · Example",
    "title": "Same request, different starting point.",
    "ask": "Ask",
    "prompt": "Rework onboarding so fewer people drop off",
    "withoutAria": "Without Blindfold: all three proposals are variations of the existing 3-step form",
    "withAria": "With Blindfold: three different directions",
    "mainAgent": "Main agent",
    "subagents": "Subagents × 3 · each on its own",
    "loaded": [
      "Current screens and code",
      "7 earlier mockups",
      "96 conversation turns",
      "3 discarded attempts"
    ],
    "briefWhat": "One page of requirements only",
    "goal": "Cut drop-off during sign-up and raise the completion rate to 55% or more.",
    "context": "A web collaboration whiteboard used by designers, developers and PMs. Sign-up completion is 38% today · brand primary #3B5BFD, text #111318 · logo is a text wordmark, top left · collects email, password and role · must fit in the first 360px screen.",
    "results": "Results · 3 options",
    "sameForm": "All still the 3-step form",
    "blindResults": "Without seeing each other",
    "verdictWithout": "All three are variations of the existing 3-step form.",
    "verdictWith": "Three different directions.",
    "nudges": [
      "Change the button color",
      "Polish the helper text",
      "Add a progress bar"
    ],
    "alts": [
      {
        "title": "Conversational onboarding",
        "desc": "Asks one question at a time and collects the three details like a chat. It never looks like a form."
      },
      {
        "title": "Try it first",
        "desc": "Lets people use the product right away without signing up, and asks for sign-up the first time they save."
      },
      {
        "title": "One-card sign-up",
        "desc": "Puts all three fields on a single card and picks the role with chips. The step indicator disappears."
      }
    ],
    "pickHint": "The three options on the right never saw each other’s answers, or the existing one. Pick one.",
    "pickThen": "Now the main agent applies it to fit the existing design system and code.",
    "sketch": {
      "email": "Email",
      "password": "Password",
      "role": "Role",
      "hint": "Takes 30 seconds!",
      "next": "Next",
      "askEmail": "What’s your email?",
      "emailAnswer": "me@studio.io",
      "askRole": "What do you do?",
      "roles": [
        "Design",
        "Dev",
        "PM",
        "Other"
      ],
      "saveToSignUp": "Sign up to save",
      "quickSignUp": "Sign up in 10s",
      "start": "Get started"
    }
  },
  "start": {
    "label": "Get started",
    "copyFail": "Select and copy",
    "when": "When every new draft moves the same way by small steps, or you need a whole new direction.",
    "get": "A requirements brief and several independent alternatives.",
    "then": "The main agent folds the option you pick into the existing project."
  },
  "install": {
    "short": "Install",
    "title": "Install Blindfold",
    "options": "Installation options",
    "method": "Choose an install method",
    "where": {
      "skills": "Run in your terminal.",
      "claude": "Run these in order inside Claude Code.",
      "codex": "Run these in order in your terminal."
    },
    "invoke": "Use it in your agent",
    "request": "request",
    "copy": "Copy",
    "copied": "Copied"
  }
}

export default messages
