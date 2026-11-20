import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, localeFromPath, type Locale } from './src/i18n/locales'
import type { Messages } from './src/i18n/types'
import en from './src/i18n/messages/en'
import ko from './src/i18n/messages/ko'
import zh from './src/i18n/messages/zh'
import ja from './src/i18n/messages/ja'
import es from './src/i18n/messages/es'
import { QUICK_INSTALL, REPO, REPO_URL } from './src/lib/install'
import plugin from '../plugins/blindfold/.claude-plugin/plugin.json'

const MESSAGES: Record<Locale, Messages> = { en, ko, zh, ja, es }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The released skill version, so structured data follows the plugin manifest. */
const VERSION: string = plugin.version

/**
 * The page's text as plain semantic HTML, placed inside #root so crawlers that
 * don't run JavaScript still read the whole page. React replaces it on mount;
 * html.js hides it until then so it never flashes.
 */
function staticContent(l: Locale): string {
  const m = MESSAGES[l]
  const code = (c: string) => `<pre><code>${esc(c)}</code></pre>`
  return `<div class="prerender">
      <header>
        <h1>Blindfold<span> — ${esc(m.meta.headline)}</span></h1>
        <p><strong>${esc(m.story.heroTag.join(' '))}</strong></p>
        <p>${esc(m.story.heroDesc)}</p>
        ${code(QUICK_INSTALL)}
      </header>
      <main>
        <section>
          <p>${m.story.chapters.map(esc).join(' ')}</p>
          <p>${esc(m.story.lead.replace(/\n/g, ' '))}</p>
        </section>
        <section>
          <h2>${esc(m.why.label)}</h2>
          <p>${esc(m.why.manifesto)}</p>
        </section>
        <section>
          <h2>${esc(m.how.label)}</h2>
          <ol>${m.how.steps.map((s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.desc)}</li>`).join('')}</ol>
        </section>
        <section>
          <h2>${esc(m.compare.title)}</h2>
          <p>${esc(m.compare.ask)}: “${esc(m.compare.prompt)}”</p>
          <p>${esc(m.compare.verdictWithout)} ${esc(m.compare.verdictWith)}</p>
          <ul>${m.compare.alts.map((a) => `<li><strong>${esc(a.title)}</strong> — ${esc(a.desc)}</li>`).join('')}</ul>
          <p>${esc(m.compare.pickHint)} ${esc(m.compare.pickThen)}</p>
        </section>
        <section>
          <h2>${esc(m.start.label)}</h2>
          <p>${esc(m.start.when)}</p>
          <p>${esc(m.start.get)}</p>
          <p>${esc(m.start.then)}</p>
        </section>
        <section>
          <h2>${esc(m.install.title)}</h2>
          <h3>Skills CLI</h3>
          ${code(QUICK_INSTALL)}
          <h3>Claude Code</h3>
          ${code(`/plugin marketplace add ${REPO}\n/plugin install blindfold@blindfold`)}
          <h3>Codex</h3>
          ${code(`codex plugin marketplace add ${REPO}\ncodex plugin add blindfold@blindfold`)}
          <p><a href="${REPO_URL}">GitHub · ${esc(REPO)}</a></p>
        </section>
      </main>
      <noscript><p>${esc(m.meta.noscript)}</p></noscript>
    </div>`
}

/**
 * One HTML page per locale (/, /ko/, /zh/, …) with translated <head>, self
 * canonical and hreflang alternates, plus robots.txt and a sitemap that lists
 * every locale. Site URL comes from VITE_SITE_URL (.env, or the CI environment).
 */
function i18nPages(siteUrl: string): Plugin {
  const pageUrl = (l: Locale) => siteUrl + LOCALE_INFO[l].path
  const alternates =
    LOCALES.map((l) => `<link rel="alternate" hreflang="${LOCALE_INFO[l].htmlLang}" href="${pageUrl(l)}" />`).join('\n    ') +
    `\n    <link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LOCALE)}" />`

  const render = (html: string, l: Locale) => {
    const m = MESSAGES[l].meta
    const info = LOCALE_INFO[l]
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Blindfold',
      url: pageUrl(l),
      image: `${siteUrl}/og.png`,
      description: m.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      inLanguage: info.htmlLang,
      softwareVersion: VERSION,
      codeRepository: REPO_URL,
      license: 'https://opensource.org/licenses/MIT',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }
    const head = [
      alternates,
      ...LOCALES.filter((o) => o !== l).map((o) => `<meta property="og:locale:alternate" content="${LOCALE_INFO[o].ogLocale}" />`),
      `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
    ].join('\n    ')
    const vars: Record<string, string> = {
      __LANG__: info.htmlLang,
      __TITLE__: esc(m.title),
      __DESC__: esc(m.description),
      __SHARE__: esc(m.share),
      __IMAGE_ALT__: esc(m.imageAlt),
      __KEYWORDS__: esc(m.keywords),
      __OG_LOCALE__: info.ogLocale,
      __PAGE_URL__: pageUrl(l),
      __SITE_URL__: siteUrl,
      __NOSCRIPT__: esc(m.noscript),
      __CONTENT__: staticContent(l),
    }
    return html
      .replace('<!--__HEAD__-->', head)
      .replace(/__[A-Z_]+__/g, (k) => vars[k] ?? k)
  }

  const sitemap = () => {
    const today = new Date().toISOString().slice(0, 10)
    const links = LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_INFO[l].htmlLang}" href="${pageUrl(l)}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LOCALE)}"/>`).join('\n')
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
      LOCALES.map((l) => `  <url>\n    <loc>${pageUrl(l)}</loc>\n    <lastmod>${today}</lastmod>\n${links}\n  </url>\n`).join('') +
      '</urlset>\n'
  }

  return {
    name: 'i18n-pages',
    enforce: 'post',
    // dev server: render the template for whichever locale path was requested
    transformIndexHtml(html, ctx) {
      return ctx.server ? render(html, localeFromPath(ctx.originalUrl ?? '/')) : html
    },
    generateBundle(_, bundle) {
      const page = bundle['index.html']
      if (!page || page.type !== 'asset') return
      const tpl = String(page.source)
      for (const l of LOCALES) {
        const html = render(tpl, l)
        if (l === DEFAULT_LOCALE) page.source = html
        else this.emitFile({ type: 'asset', fileName: `${l}/index.html`, source: html })
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || 'https://blindfold.cmdrun.net').replace(/\/+$/, '')
  return {
    plugins: [react(), i18nPages(siteUrl)],
  }
})
