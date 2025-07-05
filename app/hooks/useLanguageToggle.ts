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

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    const currentLocale = getCurrentLocale()
    const newLocale: Locale = currentLocale === 'en' ? 'ar' : 'en'

    // Remove current locale from pathname and add new locale
    const segments = pathname.split('/')
    const pathWithoutLocale = segments.slice(2).join('/') // Remove empty string and current locale
    const newPath = `/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`

    // Update locale cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`

    // Navigate to new path
    router.push(newPath)
  }, [pathname, router, getCurrentLocale])

  // Set specific language
  const setLanguage = useCallback(
    (locale: Locale) => {
      const currentLocale = getCurrentLocale()

      if (currentLocale === locale) return // No change needed

      // Remove current locale from pathname and add new locale
      const segments = pathname.split('/')
      const pathWithoutLocale = segments.slice(2).join('/') // Remove empty string and current locale
      const newPath = `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`

      // Update locale cookie
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`

      // Navigate to new path
      router.push(newPath)
    },
    [pathname, router, getCurrentLocale],
  )

  return {
    currentLocale: getCurrentLocale(),
    toggleLanguage,
    setLanguage,
  }
}
