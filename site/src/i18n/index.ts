import { LOCALE_INFO, localeFromPath, type Locale } from './locales'
import type { Messages } from './types'
import en from './messages/en'
import ko from './messages/ko'
import zh from './messages/zh'
import ja from './messages/ja'
import es from './messages/es'

export * from './locales'
export type { Messages }

const MESSAGES: Record<Locale, Messages> = { en, ko, zh, ja, es }

/** The page's locale is fixed by its URL; switching languages is a navigation. */
export const locale: Locale = localeFromPath(window.location.pathname)
export const t: Messages = MESSAGES[locale]

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl
  ? new Intl.Segmenter(LOCALE_INFO[locale].htmlLang, { granularity: 'word' })
  : null

/**
 * Splits text into the chunks the word reveals animate, each keeping the
 * whitespace that follows it. Chinese and Japanese have no spaces, so they are
 * cut at word boundaries, with punctuation kept on the word before it.
 */
export function splitWords(text: string): string[] {
  if (!LOCALE_INFO[locale].cjk) return text.split(/(?<=\s)(?=\S)/)
  const parts: string[] = []
  const segs = segmenter ? Array.from(segmenter.segment(text), (s) => ({ s: s.segment, word: s.isWordLike })) : Array.from(text, (s) => ({ s, word: /\p{L}|\p{N}/u.test(s) }))
  for (const { s, word } of segs) {
    if (!word && parts.length) parts[parts.length - 1] += s
    else parts.push(s)
  }
  return parts
}
