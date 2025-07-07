'use client'

import { i18n } from 'i18next'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import Loading from '../components/ui/Loading'

interface I18nClientProviderProps {
  children: React.ReactNode
}

export default function I18nClientProvider({ children }: I18nClientProviderProps) {
  const [i18n, setI18n] = useState<i18n | null>(null)
  const [isReady, setIsReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const initI18n = async () => {
      // Dynamic import to ensure it only runs on client
      const { default: i18nInstance } = await import('@/lib/i18n-client')

      // Extract locale from pathname
      const locale = pathname.split('/')[1] as 'en' | 'ar'

      // Wait for i18n to initialize
      if (i18nInstance.isInitialized) {
        await i18nInstance.changeLanguage(locale)
        setI18n(i18nInstance)
        setIsReady(true)
      } else {
        // Wait for initialization
        i18nInstance.on('initialized', async () => {
          await i18nInstance.changeLanguage(locale)
          setI18n(i18nInstance)
          setIsReady(true)
        })
      }

      // Update document direction
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = locale
    }

    initI18n()
  }, [pathname])

  if (!isReady || !i18n) {
    return <Loading />
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
