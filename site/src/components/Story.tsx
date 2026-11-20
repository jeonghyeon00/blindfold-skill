import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MAX_TOKENS, STORY_VP, at, lerp, phaseAt, range, story } from '../lib/story'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { QUICK_INSTALL } from '../lib/install'
import { t } from '../i18n'
import { CopyCommand } from './CopyCommand'
import { Mascot } from './Mascot'
import './Story.css'

const ContextField = lazy(() => import('../scene/ContextField'))

type Chapter = { from: number; to: number; kicker: string; accent?: string; lead?: string; text?: string }

/** chapter captions; from/to in viewports scrolled (see STORY_VP) */
const CHAPTERS: Chapter[] = ([
  {
    from: 0.25, to: 0.7,
    kicker: 'Countless',
    text: t.story.chapters[0],
  },
  {
    from: 0.7, to: 1.15,
    kicker: 'Leaning',
    text: t.story.chapters[1],
  },
  {
    from: 1.15, to: 1.6,
    kicker: 'One Way',
    text: t.story.chapters[2],
  },
  {
    from: 2.3, to: 2.9,
    kicker: 'Wide Open',
    text: t.story.chapters[3],
  },
  {
    from: 2.9, to: STORY_VP + 0.05,
    kicker: 'More',
    accent: 'Ideas',
    lead: t.story.lead,
  },
] as Chapter[]).map((c) => ({ ...c, from: at(c.from), to: at(c.to) }))
/** caption fade in/out length */
const FADE = at(0.15)

const FILES_SEEN = 41
/** how long someone can linger at the very top before the hero nudges them */
const IDLE_MS = 2800

/** the HUD's idea bulb; its glass fills yellow with --ideas */
function Bulb() {
  return (
    <svg className="bulb" viewBox="0 0 16 22" aria-hidden="true">
      <path className="bulb__glass" d="M8 1.2a6.3 6.3 0 0 0-3.7 11.4c.8.6 1.2 1.4 1.2 2.3v.9h5v-.9c0-.9.4-1.7 1.2-2.3A6.3 6.3 0 0 0 8 1.2Z" />
      <path className="bulb__base" d="M5.6 17.6h4.8M6.2 19.6h3.6M7 15.8V12l1-1.2L9 12v3.8" />
    </svg>
  )
}
const fmt = (n: number) => n.toLocaleString('en-US')

export default function Story({ onScrollTo }: { onScrollTo: (y: number) => void }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const tokEl = useRef<HTMLSpanElement>(null)
  const brEl = useRef<HTMLSpanElement>(null)
  const filesEl = useRef<HTMLSpanElement>(null)
  const chapterEls = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(true)
  const activeRef = useRef(true)
  activeRef.current = active
  const reduced = usePrefersReducedMotion()

  // render the WebGL scene only while the story is on screen
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { story.target = self.progress },
    })

    const onMove = (e: PointerEvent) => {
      story.mouseX = (e.clientX / window.innerWidth) * 2 - 1
      story.mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let idleSince = performance.now()
    let lastTok = -1
    let lastIdeas = ''
    const tick = () => {
      const s = stage.current
      if (!s) return
      // the WebGL loop eases story.p; when it is paused, ease here instead
      if (!activeRef.current) story.p = story.target
      const ph = phaseAt(story.p)
      const tunnel = ph.blind ? 0 : ph.context
      const wdth = ph.blind ? lerp(62, 125, ph.bloom) : lerp(112, 62, tunnel)

      s.style.setProperty('--p', story.p.toFixed(4))
      s.style.setProperty('--tunnel', tunnel.toFixed(4))
      s.style.setProperty('--sweep', ph.sweep.toFixed(4))
      s.style.setProperty('--cover', ph.cover.toFixed(4))
      s.style.setProperty('--bloom', ph.bloom.toFixed(4))
      s.style.setProperty('--wdth', wdth.toFixed(1))
      s.style.setProperty('--fill', (ph.tokens / MAX_TOKENS).toFixed(4))
      s.style.setProperty('--ideas', ph.ideas.toFixed(4))
      s.style.setProperty('--fork', ph.fork.toFixed(4))
      s.style.setProperty('--hero', range(story.p, 0, at(0.35)).toFixed(4))
      s.dataset.blind = String(ph.blind)
      s.dataset.pastHero = String(story.p > at(0.3))
      // nudge toward scrolling when someone lingers at the very top
      const now = performance.now()
      if (story.target > 0.001 || document.documentElement.classList.contains('is-loading')) idleSince = now
      s.dataset.idle = String(now - idleSince > IDLE_MS)

      if (ph.tokens !== lastTok && tokEl.current) {
        tokEl.current.textContent = fmt(ph.tokens)
        if (filesEl.current) filesEl.current.textContent = String(ph.blind ? 0 : Math.round(ph.context * FILES_SEEN)).padStart(2, '0')
        lastTok = ph.tokens
      }
      if (ph.ideasLabel !== lastIdeas && brEl.current) {
        brEl.current.textContent = ph.ideasLabel === '∞' ? '∞' : ph.ideasLabel.padStart(3, '0')
        lastIdeas = ph.ideasLabel
      }

      CHAPTERS.forEach((c, i) => {
        const el = chapterEls.current[i]
        if (!el) return
        const fadeIn = range(story.p, c.from, c.from + FADE)
        const fadeOut = 1 - range(story.p, c.to - FADE, c.to)
        const o = Math.min(fadeIn, fadeOut)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translate3d(0, ${((1 - fadeIn) * 40 - (1 - fadeOut) * 40).toFixed(1)}px, 0)`
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      })
    }
    gsap.ticker.add(tick)
    tick()
    return () => {
      st.kill()
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  // the cue takes you to where the first chapter is fully in view
  const toFirstChapter = () => {
    const el = section.current
    if (!el) return
    const first = CHAPTERS[0]
    onScrollTo(el.offsetTop + (el.offsetHeight - window.innerHeight) * ((first.from + first.to) / 2))
  }

  return (
    <section className="story" style={{ '--story-vp': STORY_VP } as CSSProperties} ref={section} id="top" aria-label={t.story.aria}>
      <div className="story__stage" ref={stage}>
        <div className="story__gl" aria-hidden="true">
          <Suspense fallback={null}>
            <ContextField active={active} reduced={reduced} />
          </Suspense>
        </div>
        <div className="story__tunnel" aria-hidden="true" />
        <div className="story__grain" aria-hidden="true" />

        <div className="hud" aria-hidden="true">
          <div className="hud__row"><span>Context</span><span><span ref={tokEl}>0</span> / {fmt(MAX_TOKENS)} tok</span></div>
          <div className="hud__bar"><i /></div>
          <div className="hud__row hud__row--gap">
            <span className="hud__ideas"><Bulb />Ideas</span>
            <span ref={brEl} className="hud__count">∞</span>
          </div>
          <div className="hud__bar hud__bar--ideas"><i /></div>
          <div className="hud__row"><span>Files read</span><span ref={filesEl}>00</span></div>
          <div className="hud__redact">Redacted</div>
        </div>

        <div className="hero">
          <h1 className="hero__mark" data-fit>
            <span className="hero__word" data-fit-text>
              {[...'Blindfold'].map((c, i) => <span className="ch" key={i}>{c}</span>)}
            </span>
            <span className="sr-only"> — {t.meta.headline}</span>
          </h1>
          <div className="hero__foot">
            <p className="hero__tag">{t.story.heroTag[0]}<br />{t.story.heroTag[1]}</p>
            <div className="hero__intro">
              <p className="hero__desc">{t.story.heroDesc}</p>
              <div className="hero__install">
                <CopyCommand command={QUICK_INSTALL} />
                <a href="#install">{t.install.options} <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <button type="button" className="hero__cue" onClick={toFirstChapter}>
              <span className="hero__cue-icon" aria-hidden="true">
                <svg className="hero__cue-arrow" viewBox="0 0 14 14"><path d="M7 1v11M2.5 7.5 7 12l4.5-4.5" /></svg>
              </span>
              {t.story.cue}
            </button>
          </div>
        </div>

        {CHAPTERS.map((c, i) => (
          <div className="chapter" key={c.kicker} ref={(el) => { chapterEls.current[i] = el }}>
            <span className="chapter__idx">{String(i + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}</span>
            <p className="chapter__kicker">
              {c.kicker}{c.accent && <> <em className="chapter__accent">{c.accent}</em></>}
            </p>
            {c.lead && <p className="chapter__lead">{c.lead}</p>}
            {c.text && <p className="chapter__text">{c.text}</p>}
          </div>
        ))}

        <div className="blindband" aria-hidden="true">
          <div className="blindband__inner">
            <span className="blindband__word">
              Blindfold
              <Mascot className="blindband__peek" pose="peek" />
            </span>
            <span className="blindband__tagline">Less context, more flexibility.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
