/** Locale table. Pure data so vite.config.ts can import it at build time. */
export const LOCALES = ['en', 'ko', 'zh', 'ja', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_INFO: Record<Locale, { name: string; short: string; htmlLang: string; ogLocale: string; path: string; cjk: boolean }> = {
  en: { name: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US', path: '/', cjk: false },
  ko: { name: '한국어', short: 'KO', htmlLang: 'ko', ogLocale: 'ko_KR', path: '/ko/', cjk: false },
  zh: { name: '简体中文', short: '中文', htmlLang: 'zh-CN', ogLocale: 'zh_CN', path: '/zh/', cjk: true },
  ja: { name: '日本語', short: '日本語', htmlLang: 'ja', ogLocale: 'ja_JP', path: '/ja/', cjk: true },
  es: { name: 'Español', short: 'ES', htmlLang: 'es', ogLocale: 'es_ES', path: '/es/', cjk: false },
}

/** /ko/… → ko; anything without a locale prefix is the default (English). */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1]
  return (LOCALES as readonly string[]).includes(seg) && seg !== DEFAULT_LOCALE ? (seg as Locale) : DEFAULT_LOCALE
}
