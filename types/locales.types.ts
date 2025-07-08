export interface Locale {
  id: string
  key: string
  en?: string
  ar?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateLocale {
  key: string
  en?: string
  ar?: string
}

export interface UpdateLocale {
  en?: string
  ar?: string
}

export interface BulkCreateLocale {
  locales: CreateLocale[]
}

export interface LocaleTranslations {
  [key: string]: string
}

export interface LocalesByKeys {
  [key: string]: Locale
}

export type Language = 'en' | 'ar'
