import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { localesApi } from '@/apis/locales.api'
import {
  BulkCreateLocale,
  CreateLocale,
  Language,
  Locale,
  LocaleTranslations,
  LocalesByKeys,
  UpdateLocale,
} from '@/types/locales.types'

// Query keys
export const localesKeys = {
  all: ['locales'] as const,
  lists: () => [...localesKeys.all, 'list'] as const,
  list: (lang?: Language) => [...localesKeys.lists(), { lang }] as const,
  details: () => [...localesKeys.all, 'detail'] as const,
  detail: (key: string) => [...localesKeys.details(), key] as const,
  detailWithLang: (key: string, lang?: Language) => [...localesKeys.details(), key, { lang }] as const,
  translations: () => [...localesKeys.all, 'translations'] as const,
  translation: (lang: Language) => [...localesKeys.translations(), lang] as const,
  byKeys: () => [...localesKeys.all, 'byKeys'] as const,
  byKeysWithLang: (keys: string[], lang?: Language) => [...localesKeys.byKeys(), { keys, lang }] as const,
}

// Get all locales
export const useLocales = (lang?: Language) => {
  return useQuery<Locale[], Error>({
    queryKey: localesKeys.list(lang),
    queryFn: () => localesApi.getLocales(lang),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single locale by key
export const useLocale = (key: string, lang?: Language) => {
  return useQuery({
    queryKey: localesKeys.detailWithLang(key, lang),
    queryFn: () => localesApi.getLocale(key, lang),
    enabled: !!key,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get translations for a specific language
export const useTranslations = (lang: Language) => {
  return useQuery<LocaleTranslations, Error>({
    queryKey: localesKeys.translation(lang),
    queryFn: () => localesApi.getTranslations(lang),
    staleTime: 10 * 60 * 1000, // 10 minutes - translations don't change often
  })
}

// Get multiple locales by keys
export const useLocalesByKeys = (keys: string[], lang?: Language) => {
  return useQuery<LocalesByKeys, Error>({
    queryKey: localesKeys.byKeysWithLang(keys, lang),
    queryFn: () => localesApi.getLocalesByKeys(keys, lang),
    enabled: keys.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create locale mutation
export const useCreateLocale = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLocale) => localesApi.createLocale(data),
    onSuccess: (newLocale) => {
      // Add to all locales lists
      queryClient.setQueryData<Locale[]>(localesKeys.list(), (old) => {
        if (!old) return [newLocale]
        return [...old, newLocale]
      })

      // Add to filtered lists if they exist
      queryClient.setQueryData<Locale[]>(localesKeys.list('en'), (old) => {
        if (!old || !newLocale.en) return old
        return [...old, newLocale]
      })

      queryClient.setQueryData<Locale[]>(localesKeys.list('ar'), (old) => {
        if (!old || !newLocale.ar) return old
        return [...old, newLocale]
      })

      // Set individual locale data
      queryClient.setQueryData(localesKeys.detail(newLocale.key), newLocale)

      // Invalidate translations to include new locale
      queryClient.invalidateQueries({ queryKey: localesKeys.translations() })

      // Invalidate byKeys queries
      queryClient.invalidateQueries({ queryKey: localesKeys.byKeys() })
    },
  })
}

// Create bulk locales mutation
export const useCreateBulkLocales = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkCreateLocale) => localesApi.createBulkLocales(data),
    onSuccess: (newLocales) => {
      // Invalidate all locale-related queries since bulk operations are complex
      queryClient.invalidateQueries({ queryKey: localesKeys.all })
    },
  })
}

// Update locale mutation
export const useUpdateLocale = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateLocale }) => localesApi.updateLocale(key, data),
    onSuccess: (updatedLocale) => {
      // Update the specific locale in cache
      queryClient.setQueryData(localesKeys.detail(updatedLocale.key), updatedLocale)

      // Update locale in all lists
      queryClient.setQueryData<Locale[]>(localesKeys.list(), (old) => {
        if (!old) return [updatedLocale]
        return old.map((locale) => (locale.key === updatedLocale.key ? updatedLocale : locale))
      })

      // Update in filtered lists
      queryClient.setQueryData<Locale[]>(localesKeys.list('en'), (old) => {
        if (!old) return updatedLocale.en ? [updatedLocale] : []
        return old
          .map((locale) => (locale.key === updatedLocale.key ? updatedLocale : locale))
          .filter((locale) => locale.en) // Remove if no English translation
      })

      queryClient.setQueryData<Locale[]>(localesKeys.list('ar'), (old) => {
        if (!old) return updatedLocale.ar ? [updatedLocale] : []
        return old
          .map((locale) => (locale.key === updatedLocale.key ? updatedLocale : locale))
          .filter((locale) => locale.ar) // Remove if no Arabic translation
      })

      // Update translations cache
      if (updatedLocale.en) {
        queryClient.setQueryData<LocaleTranslations>(localesKeys.translation('en'), (old) => {
          if (!old) return { [updatedLocale.key]: updatedLocale.en! }
          return { ...old, [updatedLocale.key]: updatedLocale.en! }
        })
      } else {
        // Remove from English translations if no English text
        queryClient.setQueryData<LocaleTranslations>(localesKeys.translation('en'), (old) => {
          if (!old) return {}
          const { [updatedLocale.key]: removed, ...rest } = old
          return rest
        })
      }

      if (updatedLocale.ar) {
        queryClient.setQueryData<LocaleTranslations>(localesKeys.translation('ar'), (old) => {
          if (!old) return { [updatedLocale.key]: updatedLocale.ar! }
          return { ...old, [updatedLocale.key]: updatedLocale.ar! }
        })
      } else {
        // Remove from Arabic translations if no Arabic text
        queryClient.setQueryData<LocaleTranslations>(localesKeys.translation('ar'), (old) => {
          if (!old) return {}
          const { [updatedLocale.key]: removed, ...rest } = old
          return rest
        })
      }

      // Invalidate byKeys queries that might include this key
      queryClient.invalidateQueries({ queryKey: localesKeys.byKeys() })
    },
  })
}

// Delete locale mutation
export const useDeleteLocale = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (key: string) => localesApi.deleteLocale(key),
    onSuccess: (_, deletedKey) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: localesKeys.detail(deletedKey) })

      // Remove from all lists
      queryClient.setQueryData<Locale[]>(localesKeys.list(), (old) => {
        if (!old) return []
        return old.filter((locale) => locale.key !== deletedKey)
      })

      queryClient.setQueryData<Locale[]>(localesKeys.list('en'), (old) => {
        if (!old) return []
        return old.filter((locale) => locale.key !== deletedKey)
      })

      queryClient.setQueryData<Locale[]>(localesKeys.list('ar'), (old) => {
        if (!old) return []
        return old.filter((locale) => locale.key !== deletedKey)
      })

      // Remove from translations
      queryClient.setQueryData<LocaleTranslations>(localesKeys.translation('en'), (old) => {
        if (!old) return {}
        const { [deletedKey]: removed, ...rest } = old
        return rest
      })

      queryClient.setQueryData<LocaleTranslations>(localesKeys.translation('ar'), (old) => {
        if (!old) return {}
        const { [deletedKey]: removed, ...rest } = old
        return rest
      })

      // Invalidate byKeys queries
      queryClient.invalidateQueries({ queryKey: localesKeys.byKeys() })
    },
  })
}

// Utility hook for checking if a key exists
export const useLocaleExists = (key: string) => {
  return useQuery({
    queryKey: [...localesKeys.detail(key), 'exists'],
    queryFn: () => localesApi.checkKeyExists(key),
    enabled: !!key,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Utility hook for getting a specific translation
export const useTranslation = (key: string, lang: Language) => {
  return useQuery({
    queryKey: [...localesKeys.translation(lang), 'key', key],
    queryFn: () => localesApi.getTranslation(key, lang),
    enabled: !!key,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Combined hook for easy translation management
export const useLocaleManager = () => {
  const queryClient = useQueryClient()

  // Prefetch common translations
  const prefetchTranslations = async (lang: Language) => {
    await queryClient.prefetchQuery({
      queryKey: localesKeys.translation(lang),
      queryFn: () => localesApi.getTranslations(lang),
      staleTime: 10 * 60 * 1000,
    })
  }

  // Get cached translations without triggering a request
  const getCachedTranslations = (lang: Language): LocaleTranslations | undefined => {
    return queryClient.getQueryData(localesKeys.translation(lang))
  }

  // Get cached translation for a specific key
  const getCachedTranslation = (key: string, lang: Language): string | undefined => {
    const translations = getCachedTranslations(lang)
    return translations?.[key]
  }

  // Invalidate all locale data
  const invalidateAllLocales = () => {
    queryClient.invalidateQueries({ queryKey: localesKeys.all })
  }

  // Clear all locale cache
  const clearLocaleCache = () => {
    queryClient.removeQueries({ queryKey: localesKeys.all })
  }

  return {
    prefetchTranslations,
    getCachedTranslations,
    getCachedTranslation,
    invalidateAllLocales,
    clearLocaleCache,
  }
}
