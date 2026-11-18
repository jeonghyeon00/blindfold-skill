import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mascot } from './Mascot'
import { CopyCommand, useCopyCommand } from './CopyCommand'
import './Sections.css'
import { splitWords, t } from '../i18n'
import { QUICK_INSTALL, REPO } from '../lib/install'

/* ---------------------------------------------------------------- Why */

const MANIFESTO = t.why.manifesto

export function Why() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.why__w', { opacity: 0.14 }, {
        opacity: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: '.why__text', start: 'top 78%', end: 'bottom 45%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="why gutter" id="why" ref={root}>
      <div className="sec-label"><span className="mono">Why</span><span className="mono">{t.why.label}</span></div>
      <p className="why__text">
        {splitWords(MANIFESTO).map((w, i) => <span className="why__w" key={i}>{w}</span>)}
      </p>    </section>
  )
}

/* ---------------------------------------------------------------- How */

const STEPS = (['Extract', 'Isolate', 'Diverge'] as const).map((word, i) => ({
  word, name: t.how.steps[i].name, who: i === 0 ? 'Main' : 'Sub', desc: t.how.steps[i].desc,
}))

function StepRow({ s, i }: { s: (typeof STEPS)[number]; i: number }) {
  return (
    <li className="step" data-cursor>
      <span className="step__idx mono">{String(i + 1).padStart(2, '0')}</span>
      <span className="step__word">{s.word}</span>
      <div className="step__body">
        <h3>{s.name}</h3>
        <p>{s.desc}</p>
      </div>
      <span className="step__who mono">{s.who}</span>
    </li>
  )
}

export function How() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.blindzone__band', { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.blindzone', start: 'top 70%', end: 'top 25%', scrub: 0.6 },
      })
      gsap.fromTo('.blindzone__tag', { opacity: 0, x: -12 }, {
        opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.blindzone', start: 'top 30%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="how" id="how" ref={root}>
      <div className="gutter how__head">
        <div className="sec-label"><span className="mono">How</span><span className="mono">{t.how.label}</span></div>      </div>
      <ol className="steps">
        <StepRow s={STEPS[0]} i={0} />
        <li className="blindzone" aria-label={t.how.blindzone}>
          <span className="blindzone__band" aria-hidden="true" />
          <span className="blindzone__tag mono gutter">Blind zone · 0 files read</span>
          <ol>
            <StepRow s={STEPS[1]} i={1} />
            <StepRow s={STEPS[2]} i={2} />
          </ol>
        </li>
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------ Compare */

/* One request, two lanes: an agent that carries everything so far, and
   subagents that get only the brief. Each lane ends in its three proposals,
   drawn as wireframes, so the difference reads at a glance. */

const fmtN = (n: number) => n.toLocaleString('en-US')

const LOADED = [
  { label: t.compare.loaded[0], what: 'src/onboarding/** · onboarding.css', tok: 12480 },
  { label: t.compare.loaded[1], what: 'figma: Onboarding v1–v7', tok: 38210 },
  { label: t.compare.loaded[2], what: 'conversation turns 1–96', tok: 104935 },
  { label: t.compare.loaded[3], what: 'fewer steps · button color · hero illustration', tok: 3870 },
]
const LOADED_TOK = LOADED.reduce((a, l) => a + l.tok, 0)
const BRIEF_TOK = 612

/** the brief: the goal, and only the context needed to reach it */
const BRIEF_LINES: [string, string][] = [
  ['Goal', t.compare.goal],
  ['Context', t.compare.context],
]

/* tiny wireframes, one per proposal */

const SK = t.compare.sketch

type StepsVariant = 'color' | 'copy' | 'progress'

/** the existing 3-step form, nudged one way or another */
function SketchSteps({ variant }: { variant: StepsVariant }) {
  return (
    <span className="sk sk--steps" aria-hidden="true">
      <span className="sk__steps"><i className="on">1</i><i>2</i><i>3</i></span>
      {variant === 'progress' && <span className="sk__progress"><i /></span>}
      <span className="sk__label">{SK.email}</span>
      <span className="sk__field" />
      <span className="sk__label">{SK.password}</span>
      <span className="sk__field" />
      {variant === 'copy' && <span className="sk__hint">{SK.hint}</span>}
      <span className={`sk__btn${variant === 'color' ? ' sk__btn--alt' : ''}`}>{SK.next}</span>
    </span>
  )
}

const NUDGES: { variant: StepsVariant; label: string }[] = [
  { variant: 'color', label: t.compare.nudges[0] },
  { variant: 'copy', label: t.compare.nudges[1] },
  { variant: 'progress', label: t.compare.nudges[2] },
]

function SketchChat() {
  return (
    <span className="sk sk--chat" aria-hidden="true">
      <span className="sk__msg sk__msg--in">{SK.askEmail}</span>
      <span className="sk__msg sk__msg--out">{SK.emailAnswer}</span>
      <span className="sk__msg sk__msg--in">{SK.askRole}</span>
      <span className="sk__chips sk__chips--out"><i>{SK.roles[0]}</i><i>{SK.roles[1]}</i><i>{SK.roles[2]}</i></span>
      <span className="sk__msg sk__msg--in sk__typing"><i /><i /><i /></span>
    </span>
  )
}

function SketchTry() {
  return (
    <span className="sk sk--try" aria-hidden="true">
      <span className="sk__bar" />
      <span className="sk__grid"><i /><i /><i /><i /></span>
      <span className="sk__line" style={{ width: '70%' }} />
      <span className="sk__line" style={{ width: '45%' }} />
      <span className="sk__sheet">
        <span>{SK.saveToSignUp}</span>
        <span className="sk__btn">{SK.quickSignUp}</span>
      </span>
    </span>
  )
}

function SketchCard() {
  return (
    <span className="sk sk--card" aria-hidden="true">
      <span className="sk__card">
        <span className="sk__label">{SK.email}</span>
        <span className="sk__field" />
        <span className="sk__label">{SK.password}</span>
        <span className="sk__field" />
        <span className="sk__label">{SK.role}</span>
        <span className="sk__chips">{SK.roles.map((r) => <i key={r}>{r}</i>)}</span>
        <span className="sk__btn">{SK.start}</span>
      </span>
    </span>
  )
}

const ALTS = [
  { id: 'A', sketch: SketchChat, ...t.compare.alts[0] },
  { id: 'B', sketch: SketchTry, ...t.compare.alts[1] },
  { id: 'C', sketch: SketchCard, ...t.compare.alts[2] },
]

export function Compare() {
  const root = useRef<HTMLElement>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const pick = ALTS.find((a) => a.id === picked)

  // token counts tick up once when the lanes arrive
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const total = Number(el.dataset.count)
        const n = { v: 0 }
        el.textContent = '0'
        gsap.to(n, {
          v: total, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => { el.textContent = fmtN(Math.round(n.v)) },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="cmp gutter" id="compare" ref={root}>
      <div className="sec-label"><span className="mono">Compare</span><span className="mono">{t.compare.label}</span></div>
      <h2 className="cmp__title" data-split>{t.compare.title}</h2>
      <p className="cmp__ask" data-reveal><span className="mono">{t.compare.ask}</span>{PROMPT}</p>

      <div className="cmp__lanes">
        <article className="lane lane--without" aria-label={t.compare.withoutAria}>
          <header className="lane__head mono"><span>Without Blindfold</span><span>{t.compare.mainAgent}</span></header>
          <h3 className="lane__kicker">One Way</h3>
          <dl className="lane__stats mono">
            <div><dt>Context</dt><dd><b data-count={LOADED_TOK}>{fmtN(LOADED_TOK)}</b> tok</dd></div>
          </dl>
          <ul className="lane__ctx">
            {LOADED.map((l) => (
              <li key={l.label}>
                <span className="lane__label">{l.label}</span>
                <span className="lane__what mono">{l.what}</span>
                <span className="lane__tok mono">{fmtN(l.tok)}</span>
              </li>
            ))}
          </ul>
          <div className="lane__out">
            <p className="lane__outhead mono"><span>{t.compare.results}</span><span>{t.compare.sameForm}</span></p>
            <ul className="lane__opts">
              {NUDGES.map((n) => (
                <li key={n.variant} className="opt opt--static">
                  <SketchSteps variant={n.variant} />
                  <span className="opt__cap">{n.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="lane__verdict">{t.compare.verdictWithout}</p>
        </article>

        <article className="lane lane--with" aria-label={t.compare.withAria}>
          <header className="lane__head mono"><span>With Blindfold</span><span>{t.compare.subagents}</span></header>
          <h3 className="lane__kicker">Wide Open</h3>
          <dl className="lane__stats mono">
            <div><dt>Context</dt><dd><b data-count={BRIEF_TOK}>{fmtN(BRIEF_TOK)}</b> tok</dd></div>
          </dl>
          <ul className="lane__ctx">
            <li>
              <span className="lane__label">brief.md</span>
              <span className="lane__what mono">{t.compare.briefWhat}</span>
              <span className="lane__tok mono">{fmtN(BRIEF_TOK)}</span>
              <div className="lane__brief">
                {BRIEF_LINES.map(([k, v]) => <p key={k}><b>{k}</b>{v}</p>)}
              </div>
            </li>
          </ul>
          <div className="lane__out">
            <p className="lane__outhead mono"><span>{t.compare.results}</span><span>{t.compare.blindResults}</span></p>
            <ul className="lane__opts">
              {ALTS.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className="opt"
                    aria-pressed={picked === a.id}
                    onClick={() => setPicked(picked === a.id ? null : a.id)}
                  >
                    <a.sketch />
                    <span className="opt__cap"><b className="opt__id">{a.id}</b>{a.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="lane__verdict">{t.compare.verdictWith}</p>
        </article>
      </div>

      <p className="cmp__pick" aria-live="polite">
        {pick
          ? <><b>{pick.id} · {pick.title}</b> {pick.desc} {t.compare.pickThen}</>
          : t.compare.pickHint}
      </p>
    </section>
  )
}

/* ------------------------------------------------------------ Install */

const INSTALL_METHODS = {
  skills: { name: 'Skills CLI', commands: [QUICK_INSTALL], invoke: ['/blindfold', '$blindfold'] },
  claude: {
    name: 'Claude Code',
    commands: [`/plugin marketplace add ${REPO}`, '/plugin install blindfold@blindfold'],
    invoke: ['/blindfold:blindfold'],
  },
  codex: {
    name: 'Codex',
    commands: [`codex plugin marketplace add ${REPO}`, 'codex plugin add blindfold@blindfold'],
    invoke: ['$blindfold'],
  },
} as const

type InstallMethod = keyof typeof INSTALL_METHODS
const METHOD_KEYS = Object.keys(INSTALL_METHODS) as InstallMethod[]

export function Install() {
  const [method, setMethod] = useState<InstallMethod>('skills')
  const { commands, invoke } = INSTALL_METHODS[method]

  return (
    <section className="install gutter" id="install" aria-labelledby="install-title">
      <div className="install__layout">
        <h2 className="install__title" id="install-title">{t.install.title}</h2>
        <div>
          <fieldset className="install__methods">
            <legend>{t.install.method}</legend>
            <div className="install__choices">
              {METHOD_KEYS.map((key) => (
                <label key={key}>
                  <input type="radio" name="install-method" checked={method === key} onChange={() => setMethod(key)} />
                  <span>{INSTALL_METHODS[key].name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="install__where">{t.install.where[method]}</p>
          <ol className="install__commands">
            {commands.map((command) => <li key={command}><CopyCommand command={command} /></li>)}
          </ol>
          <div className="install__invoke">
            <p>{t.install.invoke}</p>
            <ul>
              {invoke.map((command) => <li key={command}><code>{command} &lt;{t.install.request}&gt;</code></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Start */

const PROMPT = t.compare.prompt
const COMMAND = `/blindfold ${PROMPT}`

export function Start() {
  const { status, copy, label } = useCopyCommand(COMMAND)

  return (
    <section className="start gutter" id="start">
      <div className="sec-label"><span className="mono">Start</span><span className="mono">{t.start.label}</span></div>
      <div className="start__head">
        <h2 className="start__big" aria-label="/blindfold">
          <span>/blind</span><span>fold</span>
        </h2>
        <Mascot className="start__mascot" happy={status === 'ok'} />
      </div>
      <div className="start__row">
        <div className="cmd" data-reveal>
          <code><b>/blindfold</b> {PROMPT}</code>
          <button type="button" onClick={copy} className="mono" aria-live="polite">
            {label}
          </button>
        </div>
        <dl className="start__notes">
          <div data-reveal><dt className="mono">When</dt><dd>{t.start.when}</dd></div>
          <div data-reveal><dt className="mono">Get</dt><dd>{t.start.get}</dd></div>
          <div data-reveal><dt className="mono">Then</dt><dd>{t.start.then}</dd></div>
        </dl>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Footer */

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot__row gutter mono">
        <span>Blindfold — AI context isolation skill</span>
        <span>Less context, more branches</span>
      </div>
      <p className="foot__mark" aria-hidden="true" data-fit>
        <span data-fit-text>Blindfold</span>
      </p>
    </footer>
  )
}

/* --------------------------------------------- shared reveal behaviour */

/** Word-mask reveal for [data-split], fade-up for [data-reveal]. */
export function useReveals() {
  useEffect(() => {
    const splits = gsap.utils.toArray<HTMLElement>('[data-split]')
    splits.forEach((el) => {
      if (el.dataset.splitDone) return
      el.dataset.splitDone = '1'
      const walk = (node: Node) => {
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment()
            splitWords(child.textContent ?? '').forEach((chunk) => {
              const [, part, space] = /^(.*?)(\s*)$/s.exec(chunk)!
              if (part) {
                const mask = document.createElement('span')
                mask.className = 'split-mask'
                const w = document.createElement('span')
                w.className = 'split-word'
                w.textContent = part
                mask.append(w)
                frag.append(mask)
              }
              if (space) frag.append(space)
            })
            child.replaceWith(frag)
          } else if (child.nodeName !== 'BR') walk(child)
        })
      }
      walk(el)
    })

    const ctx = gsap.context(() => {
      splits.forEach((el) => {
        gsap.from(el.querySelectorAll('.split-word'), {
          yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 28, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    })
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])
}
