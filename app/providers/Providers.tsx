'use client'

import { NextUIProvider } from '@nextui-org/react'
import { FC, ReactNode } from 'react'

import I18nClientProvider from './TranslationsProvider'

interface IProviders {
  children: ReactNode
}

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <NextUIProvider>
      <I18nClientProvider>{children}</I18nClientProvider>
    </NextUIProvider>
  )
}
