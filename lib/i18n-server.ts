import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'

import { localesApi } from '@/apis/locales.api'

export type Locale = 'en' | 'ar'

const customServerBackend = {
  type: 'backend' as const,

  read: async function (language: string, namespace: string, callback: (err: unknown, data?: unknown) => void) {
    try {
      const translations = await localesApi.getTranslations(language as Locale)

      // Filter by namespace if needed
      let filteredTranslations = translations

      if (namespace && namespace !== 'default') {
        filteredTranslations = Object.keys(translations)
          .filter((key) => key.startsWith(`${namespace}.`))
          .reduce(
            (obj, key) => {
              const keyWithoutNamespace = key.replace(`${namespace}.`, '')
              obj[keyWithoutNamespace] = translations[key]
              return obj
            },
            {} as Record<string, string>,
          )
      }

      callback(null, filteredTranslations)
    } catch (error) {
      console.error(`Failed to load server translations for ${language}/${namespace}:`, error)
      callback(error, {})
    }
  },
}

const initI18next = async (lng: Locale, ns: string | string[] = 'default') => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(customServerBackend)
    .init({
      lng,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ar'],
      defaultNS: Array.isArray(ns) ? ns[0] : ns,
      fallbackNS: Array.isArray(ns) ? ns[0] : ns,
      ns: Array.isArray(ns) ? ns : [ns],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
  return i18nInstance
}

export async function getTranslation(lng: Locale, ns: string | string[] = 'default') {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  }
}
