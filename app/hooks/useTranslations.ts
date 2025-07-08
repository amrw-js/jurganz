import { useQuery } from '@tanstack/react-query'
import { useTranslation as useI18nextTranslation } from 'react-i18next'

import { localesApi } from '@/apis/locales.api'
import { Locale } from '@/middleware'

import { localesKeys } from './useLocales'

export const useTranslations = (lng?: Locale) => {
  const { t, i18n } = useI18nextTranslation()

  // Prefetch translations using React Query for better cache management
  const { data: translations, isLoading } = useQuery({
    queryKey: localesKeys.translation(lng || (i18n.language as Locale)),
    queryFn: () => localesApi.getTranslations(lng || (i18n.language as Locale)),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(lng || i18n.language),
  })

  const changeLanguage = async (newLng: Locale) => {
    await i18n.changeLanguage(newLng)
  }

  return {
    t,
    i18n,
    translations,
    isLoading,
    currentLanguage: i18n.language as Locale,
    changeLanguage,
  }
}
