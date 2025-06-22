import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { FC } from 'react'

import { IComponent } from '@/app/global.interface'

export const Hero: FC<IComponent> = (props) => {
  const { t } = props
  return (
    <div className='relative flex h-[35.625rem] items-center bg-white bg-servicesHero bg-cover bg-fixed bg-center bg-no-repeat px-10 lg:h-[34.5rem]'>
      <div className='absolute inset-0 z-0 bg-black/70' />
      <div className='relative z-10 flex flex-col gap-3 px-[0.875rem] py-10 text-white sm:px-10 sm:py-20 lg:gap-5'>
        <p className='text-sm font-semibold underline lg:text-lg'>#{t('projects_gbs')}</p>
        <h3 className='mb-2 text-3xl font-semibold leading-9 lg:mb-5 lg:text-7xl lg:leading-none'>
          {t('projects_hero_desc')}
        </h3>
        <Link className='flex items-center gap-1 font-semibold lg:gap-2' href='#'>
          <span className='text-base underline underline-offset-4 lg:text-xl'>{t('default:contact_us')}</span>
          <ArrowUpRightIcon className='h-4 w-4 lg:h-6 lg:w-6' />
        </Link>
      </div>
    </div>
  )
}
