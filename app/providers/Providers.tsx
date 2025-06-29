'use client'

import { HeroUIProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

import { queryClient } from '../clients/reactQuery.client'

import I18nClientProvider from './TranslationsProvider'

interface IProviders {
  children: ReactNode
}

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <I18nClientProvider>{children}</I18nClientProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  )
}
