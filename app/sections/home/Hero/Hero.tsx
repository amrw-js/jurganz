'use client'

import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { AppStore } from '@/app/components/ui/AppStore/AppStore'
import { PlayStore } from '@/app/components/ui/PlayStore/PlayStore'

export const Hero = () => {
  const { t } = useTranslation()

  return (
    <div className='flex items-center justify-center px-[0.875rem] sm:px-10'>
      <div className='relative h-full w-full'>
        <div className='absolute inset-0 z-10 rounded-xl bg-black/45'></div>
        <div className='absolute left-0 z-20 flex h-full w-full flex-col justify-center p-5 text-white lg:flex-row lg:items-center lg:p-[2.625rem]'>
          <div className='flex flex-col lg:basis-[70%]'>
            <p className='mb-3 text-sm font-semibold underline lg:text-lg'>#GBS</p>
            <p className='mb-5 text-3xl font-semibold leading-9 lg:mb-10 lg:text-7xl lg:leading-none'>
              {t('home:hero_heading')}
            </p>
            <Link className='mb-5 flex items-center gap-1 font-semibold lg:gap-2' href='/production-lines'>
              <span className='text-base underline underline-offset-4 lg:text-xl'>
                {t('home:hero_heading_production_line')}
              </span>
              <ArrowUpRightIcon className='h-4 w-4 lg:h-6 lg:w-6' />
            </Link>
          </div>
          <div className='invisible flex flex-col gap-5 rounded-lg p-3 backdrop-blur lg:p-5'>
            <p className='text-lg font-semibold leading-7 lg:text-3xl lg:leading-9'>{t('home:hero_apps_title')}</p>
            <div className='flex flex-col gap-4 lg:flex-row lg:gap-8'>
              <PlayStore t={t} />
              <AppStore t={t} />
            </div>
          </div>
        </div>
        <Image
          className='max-h-[47.5rem] min-h-[33.1rem] w-full rounded-xl object-cover'
          src='/images/welding.webp'
          alt='man welding'
          width={3840}
          height={2560}
        />
      </div>
    </div>
  )
}
