import { TFunction } from 'i18next'

export type ILogo = {
  src: string
  alt: string
  width: number
  height: number
}

export interface IPage {
  params: Promise<{
    locale: string
  }>
}

export interface IComponent {
  t: TFunction
}
