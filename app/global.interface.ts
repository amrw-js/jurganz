import { TFunction } from 'i18next'

import { Locale } from '@/lib/i18n-server'

export type ILogo = {
  src: string
  alt: string
  width: number
  height: number
}

export interface IPage {
  params: Promise<{
    locale: Locale
  }>
}

export interface IComponent {
  t: TFunction
}
