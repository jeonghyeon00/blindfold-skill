import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MascotMark } from './Mascot'
import { LOCALES, LOCALE_INFO, locale, t } from '../i18n'
import { REPO_URL } from '../lib/install'
import './Chrome.css'

export function Nav() {
  return (
    <header className="nav gutter">
      <a className="nav__mark" href="#top" aria-label={t.nav.home}>
        <MascotMark className="nav__mascot" />Blindfold
      </a>
      <nav className="nav__links" aria-label={t.nav.sections}>
        <a href="#why" data-cursor>Why</a>
        <a href="#how" data-cursor>How</a>
        <a href="#compare" data-cursor>Compare</a>
        <a href="#install" className="nav__cta" data-cursor>{t.install.short}</a>
        <a href={REPO_URL} className="nav__github" aria-label="GitHub">
          <svg width="19" height="19" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
        </a>
        <LangSwitch />
      </nav>
    </header>
  )
}

/** Language menu. Each locale is its own page, so picking one navigates there and is remembered. */
function LangSwitch() {
  const root = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (root.current?.open && !root.current.contains(e.target as Node)) root.current.open = false
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  return (
    <details className="lang" ref={root}>
      <summary className="lang__current" aria-label={t.nav.language} data-cursor>{LOCALE_INFO[locale].short}</summary>
      <ul className="lang__menu">
        {LOCALES.map((l) => (
          <li key={l}>
            <a
              href={LOCALE_INFO[l].path + window.location.hash}
              hrefLang={LOCALE_INFO[l].htmlLang}
              lang={LOCALE_INFO[l].htmlLang}
              aria-current={l === locale ? 'page' : undefined}
              onClick={() => { try { localStorage.setItem('lang', l) } catch { /* private mode */ } }}
            >
              {LOCALE_INFO[l].name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}

/** Black screen, a bone strip ties across, then the whole thing lifts. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { el.style.display = 'none'; onDone(); return }

    const n = { v: 0 }
    let cancelled = false
    let handedOver = false
    // leave the gsap context before handing over, or the next timeline's
    // selectors get scoped to the preloader
    const handOver = () => { if (!handedOver) { handedOver = true; window.setTimeout(onDone, 0) } }
    const ctx = gsap.context(() => {})

    // hold the lift until the web fonts are in, so no text swaps faces on screen
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => window.setTimeout(r, 2500)),
    ])

    ctx.add(() => {
      const tl = gsap.timeline({ onComplete: () => { el.style.display = 'none' } })
      tl.to(n, {
        v: 90, duration: 1.0, ease: 'power2.out',
        onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0') },
      })
        .fromTo('.pre__band', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0.35)
        .addPause('>', () => {
          fontsReady.then(() => {
            if (cancelled) return
            if (count.current) count.current.textContent = '100'
            tl.resume()
          })
        })
        .to('.pre__meta', { opacity: 0, duration: 0.2 })
        .to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '>0.05')
        // the hero starts rising while the curtain is still lifting
        .call(handOver, [], '<0.3')
    })
    return () => { cancelled = true; ctx.revert() }
  }, [onDone])

  return (
    <div className="pre" ref={root} aria-hidden="true">
      <div className="pre__band" />
      <div className="pre__meta gutter">
        <span className="mono">Loading context</span>
        <span className="mono"><span ref={count}>000</span>%</span>
      </div>
    </div>
  )
}

/** Small dot that becomes a ring over links and buttons. Desktop only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('has-cursor')
    const el = dot.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY)
      const hot = (e.target as Element | null)?.closest?.('a, button, [data-cursor]')
      el.classList.toggle('is-hot', !!hot)
    }
    const leave = () => el.classList.add('is-gone')
    const enter = () => el.classList.remove('is-gone')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
    }
  }, [])

  return <div className="cursor" ref={dot} aria-hidden="true" />
}
