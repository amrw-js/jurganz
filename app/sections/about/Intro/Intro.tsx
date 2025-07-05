import { FC } from 'react'

import { Section } from '@/app/components/Section/Section'
import { IComponent } from '@/app/global.interface'

export const Intro: FC<IComponent> = (props) => {
  const { t } = props
  return (
    <Section className='flex flex-col !items-start justify-between gap-5 lg:flex-row'>
      <p className='flex-1 text-xl font-semibold leading-7 sm:text-4xl sm:leading-10'>{t('about:intro_heading')}</p>
      <p className='flex-1 text-lg sm:text-xl'>{t('intro_desc')}</p>
    </Section>
  )
}
