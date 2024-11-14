'use client'

import { NextUIProvider } from '@nextui-org/react'
import { FC, ReactNode } from 'react'

import TranslationsProvider from './TranslationsProvider'

interface IProviders {
  children: ReactNode
  locale: string
  namespaces: string[] | string
  resources?: any
}
export const Providers: FC<IProviders> = ({ children, namespaces, locale, resources }) => {
  return (
    <TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
      <NextUIProvider>{children}</NextUIProvider>
    </TranslationsProvider>
  )
}
