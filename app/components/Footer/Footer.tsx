import { TFunction } from 'i18next'
import Link from 'next/link'
import { FC } from 'react'

import { NAVBAR_ITEMS } from '@/app/utils/constants'

import { ContactUsForm } from '../ContactUsForm/ContactUsForm'
import { FacebookIcon } from '../ui/icons/FacebookIcon'
import { LinkedInIcon } from '../ui/icons/LinkedInIcon'

interface IFooter {
  t: TFunction
}
export const Footer: FC<IFooter> = (props) => {
  const { t } = props

  return (
    <div className='bg-cyan-50 px-6 pb-10 pt-10 lg:px-[3.75rem] lg:pt-20'>
      <div className='flex flex-1 flex-col gap-8 lg:flex-row lg:gap-[3.75rem]'>
        <div className='flex flex-col gap-3 text-center lg:text-left'>
          <h3 className='text-2xl font-semibold leading-8 sm:text-4xl sm:leading-10'>{t('contact_us_heading')}</h3>
          <p className='text-sm font-medium leading-5 sm:text-lg sm:leading-7'>{t('contact_us_desc')}</p>
        </div>
        <ContactUsForm />
      </div>
      <div className='mt-8 flex w-full flex-col gap-5 lg:mt-[3.75rem] lg:flex-row lg:justify-between'>
        <div className='flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-10'>
          {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
            <Link
              key={i18nKey}
              href={href}
              className='hover:text-primary text-base font-medium leading-6 transition-all'
            >
              {t(i18nKey)}
            </Link>
          ))}
        </div>
        <div className='flex justify-center gap-5 lg:justify-start'>
          <Link
            href='#'
            className='flex size-[3.125rem] items-center justify-center rounded-full bg-white transition-all hover:bg-gray-100'
          >
            <FacebookIcon className='size-4 text-black' />
          </Link>
          <Link
            href='#'
            className='flex size-[3.125rem] items-center justify-center rounded-full bg-white transition-all hover:bg-gray-100'
          >
            <LinkedInIcon className='size-4 text-black' />
          </Link>
        </div>
      </div>
      <div className='mt-5 self-center text-center text-sm font-medium leading-5 lg:mt-7'>
        {t('copyright', { year: 2024 })}
      </div>
    </div>
  )
}
