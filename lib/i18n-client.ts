'use client'

import i18n from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

// Only initialize on client side
if (typeof window !== 'undefined') {
  i18n
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        return import(`../locales/${language}/${namespace}.json`)
      }),
    )
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',

      defaultNS: 'default',
      ns: ['default', 'home', 'about', 'projects', 'services'],

      interpolation: {
        escapeValue: false,
      },

      detection: {
        order: [],
      },

      react: {
        useSuspense: false,
      },
    })
}

export default i18n
