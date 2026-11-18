import { useId } from 'react'
import './Mascot.css'

/* The Blindfold mascot: a round mochi with its eyes covered, still getting
   ideas (the bulb on its sprout). Geometry lives here, paint in Mascot.css. */

const BODY = 'M100 38 C 148 38 170 78 170 122 C 170 164 140 182 100 182 C 60 182 30 164 30 122 C 30 78 52 38 100 38 Z'
const BAND = 'M27 100 C 60 90 140 86 173 92 L174 116 C 140 110 60 114 26 126 Z'
const TAIL_UP = 'M168 98 C 182 91 193 96 200 87 C 199 103 186 108 170 107 Z'
const TAIL_DOWN = 'M167 105 C 180 110 187 123 198 125 C 186 133 172 122 165 111 Z'
const STEM = 'M100 40 C 100 28 104 20 112 15'
const BULB = 'M114 0 a9 9 0 0 0 -5.3 16.3 c1 .8 1.6 1.9 1.6 3.1 v1.3 h7.4 v-1.3 c0-1.2 .6-2.3 1.6-3.1 A9 9 0 0 0 114 0 Z'
const MOUTH = 'M90 142 Q 95 149 100 142 Q 105 149 110 142'

type Props = {
  className?: string
  pose?: 'peek'
  /** a little hop with a bright bulb, e.g. after the command is copied */
  happy?: boolean
}

/** Full-colour mascot. Decorative: hidden from assistive tech. */
export function Mascot({ className = '', happy = false, pose }: Props) {
  const clipId = useId()
  const peeking = pose === 'peek'
  return (
    <svg className={`mascot${happy ? ' is-happy' : ''} ${className}`} viewBox={peeking ? '-6 -4 212 160' : '-6 -4 212 214'} aria-hidden="true" focusable="false">
      {peeking && (
        <defs>
          <clipPath id={clipId}><rect x="-16" y="-16" width="232" height="161" /></clipPath>
        </defs>
      )}
      <g className="mascot__hop" clipPath={peeking ? `url(#${clipId})` : undefined}>
        <g className="mascot__bob">
          <g className="mascot__sprout">
            <path className="mascot__stem" d={STEM} />
            <path className="mascot__stem-in" d={STEM} />
            <circle className="mascot__glow" cx="114" cy="10" r="16" />
            <path className="mascot__bulb" d={BULB} />
            <path className="mascot__cap" d="M110.6 24 h6.8 M111.4 27 h5.2" />
            <path className="mascot__ray" d="M129 2 l5 -3.5 M131 11 h6.5 M98.5 0 l-4.5 -3.5" />
          </g>
          {!peeking && (
            <>
              <ellipse className="mascot__arm mascot__arm--l" cx="25" cy="146" rx="15" ry="10" transform="rotate(-28 25 146)" />
              <ellipse className="mascot__arm mascot__arm--r" cx="175" cy="146" rx="15" ry="10" transform="rotate(28 175 146)" />
              <ellipse className="mascot__foot" cx="76" cy="186" rx="16" ry="9" />
              <ellipse className="mascot__foot" cx="124" cy="186" rx="16" ry="9" />
            </>
          )}
          <path className="mascot__body" d={BODY} />
          <path className="mascot__shine" d="M58 72 C 64 60 75 53 86 51" />
          <g className="mascot__tails">
            <path className="mascot__tail" d={TAIL_UP} />
            <path className="mascot__tail" d={TAIL_DOWN} />
          </g>
          <path className="mascot__band" d={BAND} />
          <path className="mascot__stitch" d="M40 107 C 80 99 130 96 160 100" />
          <rect className="mascot__knot" x="159" y="92" width="17" height="22" rx="7" transform="rotate(-6 168 103)" />
          <ellipse className="mascot__cheek" cx="58" cy="139" rx="11" ry="7" />
          <ellipse className="mascot__cheek" cx="142" cy="137" rx="11" ry="7" />
          <path className="mascot__mouth" d={MOUTH} />
        </g>
      </g>
      {peeking && (
        <g className="mascot__paws">
          <ellipse className="mascot__foot" cx="56" cy="145" rx="15" ry="8" transform="rotate(-8 56 145)" />
          <ellipse className="mascot__foot" cx="144" cy="145" rx="15" ry="8" transform="rotate(8 144 145)" />
        </g>
      )}
    </svg>
  )
}

/**
 * One-colour mark for the nav. The nav blends with `difference`, so white
 * inverts whatever is behind it and black leaves it untouched: the band and
 * mouth are black, which reads as cut out of the body.
 */
export function MascotMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`mascot-mark ${className}`} viewBox="-6 -4 212 214" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d={STEM} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
        <path d={BULB} transform="translate(114 10) scale(1.25) translate(-114 -10)" />
        <ellipse cx="25" cy="146" rx="16" ry="11" transform="rotate(-28 25 146)" />
        <ellipse cx="175" cy="146" rx="16" ry="11" transform="rotate(28 175 146)" />
        <ellipse cx="76" cy="186" rx="17" ry="10" />
        <ellipse cx="124" cy="186" rx="17" ry="10" />
        <path d={BODY} />
        <path d={TAIL_UP} />
        <path d={TAIL_DOWN} />
      </g>
      <g fill="#000">
        <path d={BAND} />
        <path d={MOUTH} fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}
