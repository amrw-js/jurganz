'use client'

import Image from 'next/image'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableCards } from '@/app/components/ui/ScrollableCards/ScrollableCards'
import { ILogo } from '@/app/global.interface'
import { LOGOS } from '@/app/utils/constants'

export const Logos: FC = () => {
  const { t } = useTranslation()

  const Transparency = `<span class="text-primary font-bold">Transparency</span>`
  const Obligation = `<span class="text-primary font-bold">Obligation</span>`
  const Development = `<span class="text-primary font-bold">Development</span>`

  const objectiveText = t('objective', {
    Transparency,
    Obligation,
    Development,
    interpolation: { escapeValue: false }, // Prevent escaping HTML
  })

  const renderItem = useCallback(({ src, alt, width, height }: ILogo) => {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className='max-w-40 opacity-40 transition-all hover:opacity-100'
      />
    )
  }, [])

  return (
    <div className='mt-10 px-[0.875rem] sm:px-10 lg:mt-[3.375rem]'>
      <p
        className='text-xl font-semibold leading-7 text-gray-400 sm:text-4xl sm:leading-10 lg:w-2/3'
        dangerouslySetInnerHTML={{ __html: objectiveText }}
      />

      <div className='mt-5 lg:mt-[3.375rem]'>
        <ScrollableCards
          arrows={false}
          slides={LOGOS}
          autoPlay
          renderItem={renderItem}
          slideClassName='flex-shrink-0 justify-center !pl-0 flex-grow-0 items-center flex basis-[100%] sm:basis-[50%] lg:basis-[25%]'
        />
      </div>
    </div>
  )
}
