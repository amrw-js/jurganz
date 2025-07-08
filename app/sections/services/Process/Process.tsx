import Image from 'next/image'
import { FC } from 'react'

import { Section } from '@/app/components/Section/Section'
import { FlashCircle } from '@/app/components/ui/icons/FlashCircle'
import { IComponent } from '@/app/global.interface'
import { PROJECTS_SECTION } from '@/app/utils/constants'

export const Process: FC<IComponent> = (props) => {
  const { t } = props

  return (
    <Section className='flex flex-col !items-start justify-between gap-6 bg-slate-50 lg:flex-row lg:gap-[94]'>
      <div className='flex flex-col !items-start gap-2 lg:max-w-[650px] lg:gap-5'>
        <p className='text-xl font-medium leading-7 lg:leading-none'>{t('our_process')}</p>
        <div className='flex w-full flex-wrap gap-8 lg:gap-10'>
          <p className='text-xl font-semibold lg:text-4xl'>{t('process_title')}</p>
          <div className='flex w-full flex-col gap-8 lg:gap-10'>
            {PROJECTS_SECTION.map(({ i18n_heading, i18n_desc }, index) => (
              <div key={index} className='flex w-full gap-3'>
                <FlashCircle className='mt-1 size-5 shrink-0 text-gray-700' />
                <div className='flex w-full flex-col gap-3'>
                  <p className='text-xl font-semibold leading-7'>{t(i18n_heading)}</p>
                  <p className='text-sm font-normal leading-5'>{t(i18n_desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Image
        className='h-full min-h-[674px] w-full rounded-xl object-cover lg:max-w-[576px]'
        src='/images/our-process.jpg'
        alt='man welding'
        width={3840}
        height={2560}
      />
    </Section>
  )
}
