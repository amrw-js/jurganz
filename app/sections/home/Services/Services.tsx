'use client'

import { Button } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

import { useTranslations } from '@/app/hooks/useTranslations'
import { SERVICES } from '@/app/utils/constants'

export const Services = () => {
  const { t } = useTranslations()

  return (
    <div className='mt-10 flex flex-col-reverse gap-7 bg-zinc-50 px-[0.875rem] py-10 sm:px-10 sm:py-20 lg:mt-[7.5rem] lg:gap-[11.25rem] xl:flex-row'>
      <div className='flex-1'>
        <div className='mb-5 flex flex-col items-center justify-center gap-y-4 lg:mb-28 lg:items-start lg:gap-y-5'>
          <p className='text-center text-2xl font-semibold leading-10 sm:text-4xl lg:!text-left'>
            {t('services_heading')}
          </p>
          <Button as={Link} href='#contact-us' color='primary'>
            {t('contact_us')}
          </Button>
        </div>
        <div className='flex flex-wrap gap-y-5 lg:gap-x-11 lg:gap-y-5'>
          {SERVICES.map(({ i18nKey }, index) => (
            <div
              key={i18nKey}
              className='w-full rounded-lg border border-zinc-300 px-5 py-[1.625rem] font-medium lg:w-[calc(50%-1.375rem)]'
            >
              <p className='text-lg leading-7 text-gray-300'>0{index + 1}</p>
              <p className='mt-3 text-2xl'>{t(i18nKey)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='h-full flex-1'>
        <Image
          src='/images/image-1.jpg'
          alt='welding'
          width={1960}
          height={2213}
          className='max-h-[18rem] w-full rounded-lg object-cover object-left-bottom shadow-lg sm:max-h-[22rem] md:max-h-[28rem] lg:max-h-[40rem]'
        />
      </div>
    </div>
  )
}
