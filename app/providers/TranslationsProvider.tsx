'use client'

import { createInstance, i18n } from 'i18next'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import { initTranslations } from '@/i18n'

interface ITranslationsProvider {
  children: ReactNode
  locale: string
  namespaces: string[] | string
  resources?: i18n['reloadResources']
}
export default function TranslationsProvider({ children, locale, namespaces, resources }: ITranslationsProvider) {
  const i18nInstance = createInstance()

  initTranslations({ locale, namespaces, i18nInstance, resources })

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
