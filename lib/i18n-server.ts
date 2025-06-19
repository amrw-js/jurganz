import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

export type Locale = 'en' | 'ar'

const initI18next = async (lng: Locale, ns: string | string[]) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        return import(`../locales/${language}/${namespace}.json`)
      }),
    )
    .init({
      lng,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ar'],
      defaultNS: Array.isArray(ns) ? ns[0] : ns,
      fallbackNS: Array.isArray(ns) ? ns[0] : ns,
      ns,
      interpolation: {
        escapeValue: false,
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
