import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { TFunction } from 'i18next'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

import { AppStore } from '@/app/components/ui/AppStore/AppStore'
import { PlayStore } from '@/app/components/ui/PlayStore/PlayStore'

interface IHero {
  t: TFunction
}

export const Hero: FC<IHero> = (props) => {
  const { t } = props

  return (
    <div className='flex items-center justify-center px-[0.875rem] sm:px-10'>
      <div className='relative h-full w-full'>
        <div className='absolute inset-0 z-10 rounded-xl bg-black/45'></div>
        <div className='absolute left-0 z-20 flex h-full w-full flex-col justify-center gap-5 p-6 text-white md:justify-center lg:flex-row lg:items-center lg:justify-between lg:p-[2.625rem]'>
          <div className='flex flex-col gap-1 font-semibold lg:w-2/3 lg:gap-4'>
            <p className='text-md underline'>#GBS</p>
            <p className='text-2xl md:text-6xl lg:text-7xl'>{t('hero_heading')}</p>
            <Link className='flex items-center gap-1 lg:gap-2' href='#'>
              <span className='underline underline-offset-4 lg:text-xl'>{t('hero_heading_production_line')}</span>
              <ArrowUpRightIcon className='h-4 w-4 lg:h-6 lg:w-6' />
            </Link>
          </div>
          <div className='flex h-fit max-w-[26.438rem] flex-col gap-2 self-end rounded-xl bg-[#FFFFFF12] p-5 backdrop-blur-xl md:gap-7 lg:self-auto'>
            <p className='text-lg font-semibold leading-9 lg:text-3xl'>{t('hero_apps_title')}</p>
            <div className='flex gap-2 lg:gap-8'>
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
