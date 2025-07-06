'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export type Locale = 'en' | 'ar'

export function useLanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()

  // Get current locale from pathname
  const getCurrentLocale = useCallback((): Locale => {
    const segments = pathname.split('/')
    const firstSegment = segments[1]

    if (firstSegment === 'en' || firstSegment === 'ar') {
      return firstSegment as Locale
    }

    return 'en' // fallback
  }, [pathname])

  // Set cookies function
  const setCookies = useCallback((locale: Locale) => {
    const maxAge = 60 * 60 * 24 * 365 // 1 year
    const cookieOptions = `path=/; max-age=${maxAge}; SameSite=Lax`

    // Set multiple cookie names for maximum compatibility
    document.cookie = `locale=${locale}; ${cookieOptions}`
    document.cookie = `NEXT_LOCALE=${locale}; ${cookieOptions}`
    document.cookie = `NEXT_INTL_LOCALE=${locale}; ${cookieOptions}`
  }, [])

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    const currentLocale = getCurrentLocale()
    const newLocale: Locale = currentLocale === 'en' ? 'ar' : 'en'

    // Set cookies first
    setCookies(newLocale)

    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/')
    const pathWithoutLocale = segments.slice(2).join('/') // Remove empty string and current locale
    const newPath = `/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`

    // Small delay to ensure cookies are set before navigation
    setTimeout(() => {
      router.replace(newPath)
    }, 10)
  }, [pathname, router, getCurrentLocale, setCookies])

  // Set specific language
  const setLanguage = useCallback(
    (locale: Locale) => {
      const currentLocale = getCurrentLocale()

      if (currentLocale === locale) return // No change needed

      // Set cookies first
      setCookies(locale)

      // Remove current locale from pathname and add new locale
      const segments = pathname.split('/')
      const pathWithoutLocale = segments.slice(2).join('/') // Remove empty string and current locale
      const newPath = `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`

      // Small delay to ensure cookies are set before navigation
      setTimeout(() => {
        router.replace(newPath)
      }, 10)
    },
    [pathname, router, getCurrentLocale, setCookies],
  )

  const currentLocale = getCurrentLocale()
  const isArabic = currentLocale === 'ar'

  return {
    currentLocale,
    isArabic,
    toggleLanguage,
    setLanguage,
  }
}
