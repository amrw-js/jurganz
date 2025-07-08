import { API_BASE_URL } from '@/app/utils/constants'
import {
  BulkCreateLocale,
  CreateLocale,
  Language,
  Locale,
  LocaleTranslations,
  LocalesByKeys,
  UpdateLocale,
} from '@/types/locales.types'

export const localesApi = {
  // Create a single locale
  createLocale: async (data: CreateLocale): Promise<Locale> => {
    const response = await fetch(`${API_BASE_URL}/locales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create locale')
    }
    return response.json()
  },

  // Create multiple locales at once
  createBulkLocales: async (data: BulkCreateLocale): Promise<Locale[]> => {
    const response = await fetch(`${API_BASE_URL}/locales/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create locales')
    }
    return response.json()
  },

  // Update a locale by key
  updateLocale: async (key: string, data: UpdateLocale): Promise<Locale> => {
    const response = await fetch(`${API_BASE_URL}/locales/${encodeURIComponent(key)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to update locale')
    }
    return response.json()
  },

  // Get all locales (with optional language filter)
  getLocales: async (lang?: Language): Promise<Locale[]> => {
    const url = new URL(`${API_BASE_URL}/locales`)
    if (lang) {
      url.searchParams.append('lang', lang)
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('Failed to fetch locales')
    }
    return response.json()
  },

  // Get a specific locale by key
  getLocale: async (key: string, lang?: Language): Promise<Locale> => {
    const url = new URL(`${API_BASE_URL}/locales/${encodeURIComponent(key)}`)
    if (lang) {
      url.searchParams.append('lang', lang)
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch locale')
    }
    return response.json()
  },

  // Get multiple locales by keys
  getLocalesByKeys: async (keys: string[], lang?: Language): Promise<LocalesByKeys> => {
    const url = new URL(`${API_BASE_URL}/locales/keys`)
    url.searchParams.append('keys', keys.join(','))
    if (lang) {
      url.searchParams.append('lang', lang)
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch locales by keys')
    }
    return response.json()
  },

  // Get flat translations for a specific language (for frontend consumption)
  getTranslations: async (lang: Language): Promise<LocaleTranslations> => {
    const response = await fetch(`${API_BASE_URL}/locales/translations/${lang}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${lang} translations`)
    }
    return response.json()
  },

  // Delete a locale by key
  deleteLocale: async (key: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/locales/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete locale')
    }
  },

  // Utility method to get all English translations
  getEnglishTranslations: async (): Promise<LocaleTranslations> => {
    return localesApi.getTranslations('en')
  },

  // Utility method to get all Arabic translations
  getArabicTranslations: async (): Promise<LocaleTranslations> => {
    return localesApi.getTranslations('ar')
  },

  // Utility method to check if a key exists
  checkKeyExists: async (key: string): Promise<boolean> => {
    try {
      await localesApi.getLocale(key)
      return true
    } catch (error) {
      return false
    }
  },

  // Utility method to get translation for a specific key and language
  getTranslation: async (key: string, lang: Language): Promise<string | null> => {
    try {
      const locale = await localesApi.getLocale(key, lang)
      return locale[lang] || null
    } catch (error) {
      return null
    }
  },
}
