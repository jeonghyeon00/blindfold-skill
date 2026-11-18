import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, locale, type Locale } from './i18n'

// Only a language the visitor picked themselves sends them away from the
// default page; browser language alone never redirects (crawlers must see /).
try {
  const saved = localStorage.getItem('lang') as Locale | null
  if (locale === DEFAULT_LOCALE && saved && saved !== DEFAULT_LOCALE && LOCALES.includes(saved)) {
    window.location.replace(LOCALE_INFO[saved].path + window.location.hash)
  }
} catch { /* storage blocked */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
