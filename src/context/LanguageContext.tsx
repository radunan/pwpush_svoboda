'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  type Locale,
  type Translations,
  LOCALES,
  STORAGE_KEY,
  DEFAULT_LOCALE,
  detectLocale,
  translations,
} from '@/lib/i18n'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE],
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const detected = detectLocale()
    setLocaleState(detected)
    document.documentElement.lang = detected
  }, [])

  function setLocale(next: Locale) {
    if (!LOCALES.includes(next)) return
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch { /* ignore */ }
    setLocaleState(next)
    document.documentElement.lang = next
  }

  return (
    <LanguageContext value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext>
  )
}

export function useT(): Translations {
  return useContext(LanguageContext).t
}

export function useLang(): [Locale, (locale: Locale) => void] {
  const { locale, setLocale } = useContext(LanguageContext)
  return [locale, setLocale]
}
