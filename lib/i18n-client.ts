'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { localesApi } from '@/apis/locales.api'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

// Custom backend that fetches from our API
const customBackend = {
  type: 'backend' as const,

  init: function (services: any, backendOptions: any, i18nextOptions: any) {
    // Initialization if needed
  },

  read: async function (language: string, namespace: string, callback: (err: any, data?: any) => void) {
    try {
      // If namespace is provided and not 'default', you could potentially filter by namespace
      // For now, we'll fetch all translations for the language
      const translations = await localesApi.getTranslations(language as Locale)

      // If you want to support namespaces, you could filter keys here
      // For example, if namespace is 'home', only return keys that start with 'home.'
      let filteredTranslations = translations

      if (namespace && namespace !== 'default') {
        filteredTranslations = Object.keys(translations)
          .filter((key) => key.startsWith(`${namespace}.`))
          .reduce(
            (obj, key) => {
              // Remove namespace prefix for i18next
              const keyWithoutNamespace = key.replace(`${namespace}.`, '')
              obj[keyWithoutNamespace] = translations[key]
              return obj
            },
            {} as Record<string, string>,
          )
      }

      callback(null, filteredTranslations)
    } catch (error) {
      console.error(`Failed to load translations for ${language}/${namespace}:`, error)
      callback(error, {})
    }
  },

  save: function (language: string, namespace: string, data: any, callback?: (err?: any) => void) {
    // Optional: implement saving back to backend
    // This would be useful for in-app translation editing
    console.log('Save not implemented')
    callback?.()
  },
}

// Only initialize on client side
if (typeof window !== 'undefined') {
  i18n
    .use(customBackend)
    .use(initReactI18next)
    .init({
      lng: 'en', // default language
      fallbackLng: 'en',
      debug: false,

      // Remove defaultNS and ns since we're fetching all translations
      defaultNS: 'default',
      ns: ['default'], // You can expand this if you implement namespace filtering

      interpolation: {
        escapeValue: false,
      },

      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },

      react: {
        useSuspense: false,
      },

      // Backend options
      backend: {
        // Add any custom options for your backend here
      },

      // Retry logic
      load: 'languageOnly', // Load only language, not region-specific

      // Cache management
      updateMissing: false, // Don't automatically add missing translations
    })
}

export default i18n
