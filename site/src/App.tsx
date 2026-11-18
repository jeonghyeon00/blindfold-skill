import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Story from './components/Story'
import { Cursor, Nav, Preloader } from './components/Chrome'
import { Compare, Footer, How, Install, Start, Why, useReveals } from './components/Sections'

gsap.registerPlugin(ScrollTrigger)

function useSmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const raf = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      l.destroy()
      lenis.current = null
    }
  }, [])
  return lenis
}

const $$ = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel))

/** Wordmark letters rise, then the band ties across them. */
function playIntro() {
  const root = document.documentElement
  if (!root.classList.contains('is-loading')) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('is-loading')
    return
  }
  // fromTo renders its start state immediately, so the hand-off from the
  // CSS-hidden state to gsap-hidden state is seamless
  const tl = gsap.timeline()
  // y: 0 so gsap doesn't absorb the CSS translateY(105%) as a pixel offset
  tl.fromTo($$('.hero__word .ch'), { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.045, clearProps: 'transform' })
    .fromTo($$('.hero__foot > *'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.6)
    .fromTo($$('.hud'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.9)
  root.classList.remove('is-loading')
}

/** Size each [data-fit] wordmark so its [data-fit-text] fills the line exactly. */
function useFitText() {
  useEffect(() => {
    const fit = () => {
      $$('[data-fit]').forEach((el) => {
        const text = el.querySelector<HTMLElement>('[data-fit-text]')
        if (!text) return
        el.style.setProperty('--fit', '100px')
        const cs = getComputedStyle(el)
        const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        const w = text.getBoundingClientRect().width
        if (w > 0) el.style.setProperty('--fit', `${((100 * avail) / w) * 0.995}px`)
      })
      ScrollTrigger.refresh()
    }
    fit()
    document.fonts?.ready.then(fit)
    let raf = 0
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit) }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])
}

export default function App() {
  const lenis = useSmoothScroll()
  useReveals()
  useFitText()

  useEffect(() => {
    history.scrollRestoration = 'manual'
    lenis.current?.stop()
    const anchor = document.getElementById(window.location.hash.slice(1))
    if (anchor) anchor.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo(0, 0)
  }, [lenis])

  const scrollTo = useCallback((y: number) => {
    if (lenis.current) lenis.current.scrollTo(y, { duration: 1.8 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }, [lenis])

  const onLoaded = useCallback(() => {
    lenis.current?.start()
    playIntro()
  }, [lenis])

  return (
    <>
      <Preloader onDone={onLoaded} />
      <Cursor />
      <Nav />
      <main>
        <Story onScrollTo={scrollTo} />
        <Why />
        <How />
        <Compare />
        <Install />
        <Start />
      </main>
      <Footer />
    </>
  )
}
