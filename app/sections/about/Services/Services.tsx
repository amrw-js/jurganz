import Link from 'next/link'
import { FC } from 'react'

import { Section } from '@/app/components/Section/Section'
import { IComponent } from '@/app/global.interface'
import { SERVICES } from '@/app/utils/constants'

export const Services: FC<IComponent> = (props) => {
  const { t } = props
  return (
    <Section className='flex flex-col gap-5 bg-slate-50 lg:gap-10'>
      <p className='text-2xl font-semibold leading-9 lg:text-4xl lg:leading-none'>{t('about:services_title')}</p>
      <div className='flex w-full flex-wrap gap-2 lg:gap-5'>
        {SERVICES.map(({ i18nKey }, index) => (
          <div
            key={i18nKey}
            className='flex h-[11.25rem] w-full flex-col gap-3 rounded-lg border border-zinc-300 px-5 py-[1.625rem] font-medium lg:w-[calc(25%-0.94rem)]'
          >
            <p className='text-lg leading-7 text-gray-300'>0{index + 1}</p>
            <div className='flex h-full flex-col justify-between'>
              <p className='text-2xl'>{t(i18nKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
