/**
 * Shared, mutable story state. Written by ScrollTrigger, read every frame by
 * the WebGL scene and the DOM overlays. Kept outside React on purpose so a
 * scroll tick never triggers a re-render.
 */
export const story = {
  /** raw scroll progress through the story section, 0..1 */
  target: 0,
  /** eased progress, follows target */
  p: 0,
  mouseX: 0,
  mouseY: 0,
}

export const MAX_TOKENS = 1_000_000
/** the lean is complete here: 15% of the window, nowhere near full or a compact.
 *  The window never fills in the story. */
export const LEAN_TOKENS = 150_000
export const BRIEF_TOKENS = 612
/** number of distinct rays leaving the requirement — reads as "countless" */
export const DIRECTIONS = 480

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))
const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * How many viewports of scrolling the whole story takes. The story section is
 * this plus one viewport tall (the sticky stage itself). Beats are written in
 * viewports scrolled and turned into 0..1 progress with `at`, so changing the
 * length of one part doesn't shift the others.
 */
export const STORY_VP = 3.65
/** viewports scrolled → story progress (0..1) */
export const at = (vp: number) => vp / STORY_VP

/** Story beats, as story progress. */
export const BEATS = {
  fillStart: at(0.7), // context starts filling once "Countless" has faded out
  fillEnd: at(1.55), // context reaches LEAN_TOKENS (150k) and the lean is complete
  coverStart: at(1.65), // blindfold starts tying
  coverFull: at(2.0), // screen fully covered — context is swapped here
  coverEnd: at(2.35), // blindfold lifts
  bloomEnd: at(2.75), // rays re-open in every direction (first fork)
  forkStart: at(2.85), // second fork + sparks
  forkEnd: at(3.4), // then a short hold on the finished picture
}

export interface Phase {
  /** 0..1 how far the lean has gone; 1 at LEAN_TOKENS, not at a full window */
  context: number
  /** 0..1 how much of the screen the blindfold covers */
  cover: number
  /** 0..1 blindfold strip sweep across the screen (before it expands) */
  sweep: number
  /** 0..1 the post-blindfold bloom, also the first fork */
  bloom: number
  /** 0..1 the second fork and the idea sparks at the ray ends */
  fork: number
  /** true once the context has been swapped for the brief */
  blind: boolean
  tokens: number
  /** 0..1 how open the thinking is: falls as context fills, recovers after */
  ideas: number
  /** what the HUD prints: ∞ when wide open, a dwindling count when leaning */
  ideasLabel: string
}

const countLabel = (open: number) =>
  open > 0.93 ? '∞' : String(Math.max(1, Math.round(DIRECTIONS * Math.pow(open, 2.4))))

export function phaseAt(p: number): Phase {
  const blind = p >= BEATS.coverFull
  const fill = smooth(range(p, BEATS.fillStart, BEATS.fillEnd))
  const context = blind ? BRIEF_TOKENS / LEAN_TOKENS : fill

  const sweep = smooth(range(p, BEATS.coverStart, BEATS.coverStart + at(0.125)))
  const coverIn = smooth(range(p, BEATS.coverStart + at(0.075), BEATS.coverFull))
  const coverOut = smooth(range(p, BEATS.coverFull + at(0.05), BEATS.coverEnd))
  const cover = blind ? 1 - coverOut : coverIn

  const bloom = blind ? smooth(range(p, BEATS.coverFull, BEATS.bloomEnd)) : 0
  const fork = blind ? smooth(range(p, BEATS.forkStart, BEATS.forkEnd)) : 0

  const tokens = blind ? BRIEF_TOKENS : Math.round(fill * LEAN_TOKENS)
  const ideas = blind ? Math.min(1, 0.02 + bloom * 0.98) : Math.pow(1 - fill, 1.4)

  return { context, cover, sweep, bloom, fork, blind, tokens, ideas, ideasLabel: countLabel(ideas) }
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export { clamp01, range, smooth }
