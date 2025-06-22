'use client'

import { HeroUIProvider } from '@heroui/react'
import { FC, ReactNode } from 'react'

import I18nClientProvider from './TranslationsProvider'

interface IProviders {
  children: ReactNode
}

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <HeroUIProvider>
      <I18nClientProvider>{children}</I18nClientProvider>
    </HeroUIProvider>
  )
}
