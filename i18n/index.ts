import { createInstance, i18n } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

import i18nConfig from '@/i18nConfig'

interface IInitTranslations {
  locale: string
  namespaces: string[] | string
  i18nInstance?: any
  resources?: i18n['reloadResources']
}
export const initTranslations = async ({ locale, namespaces, i18nInstance, resources }: IInitTranslations) => {
  i18nInstance = i18nInstance || createInstance()

  i18nInstance.use(initReactI18next)

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend((language: string, namespace: string) => import(`@/locales/${language}/${namespace}.json`)),
    )
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces,
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  })

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  }
}
