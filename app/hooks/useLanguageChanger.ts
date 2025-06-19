'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type Locale = 'en' | 'ar'

export const locales: Locale[] = ['en', 'ar']

export const useLanguageChanger = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')

  // Extract current locale from pathname
  useEffect(() => {
    const pathLocale = pathname.split('/')[1] as Locale
    if (locales.includes(pathLocale)) {
      setCurrentLocale(pathLocale)
      if (i18n.language !== pathLocale) {
        i18n.changeLanguage(pathLocale)
      }

      // Update document direction and language
      document.documentElement.lang = pathLocale
      document.documentElement.dir = pathLocale === 'ar' ? 'rtl' : 'ltr'
    }
  }, [pathname, i18n])

  const changeLanguage = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) {
      console.error(`Locale ${newLocale} is not supported`)
      return
    }

    // Extract the current path without locale
    const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '') || '/'

    // Construct new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`

    // Change i18n language
    i18n.changeLanguage(newLocale)

    // Update document direction immediately for smooth transition
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLocale

    // Navigate to new path
    router.push(newPath)
  }

  const getLocalizedPath = (locale: Locale, path?: string) => {
    const targetPath = path || pathname.replace(/^\/[^\/]+/, '') || '/'
    return `/${locale}${targetPath}`
  }

  const isRTL = currentLocale === 'ar'

  return {
    currentLocale,
    changeLanguage,
    getLocalizedPath,
    availableLocales: locales,
    isRTL,
  }
}
