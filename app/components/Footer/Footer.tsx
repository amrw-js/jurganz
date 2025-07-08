'use client'

import cn from 'clsx'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import { useLanguageToggle } from '@/app/hooks/useLanguageToggle'
import { useTranslations } from '@/app/hooks/useTranslations'
import { NAVBAR_ITEMS, OFFICE_LOCATIONS } from '@/app/utils/constants'

import { ContactUsForm } from '../ContactUsForm/ContactUsForm'
import { FacebookIcon } from '../ui/icons/FacebookIcon'
import { LinkedInIcon } from '../ui/icons/LinkedInIcon'

export const Footer = () => {
  const { t } = useTranslations()
  const { isArabic } = useLanguageToggle()

  return (
    <div id='contact-us' className='bg-cyan-50 px-6 pb-10 pt-10 lg:px-[3.75rem] lg:pt-20'>
      <div className='flex flex-1 flex-col gap-8 lg:flex-row lg:gap-[3.75rem]'>
        {/* Contact Us Section */}
        <div className={cn('flex flex-col gap-3 text-center', isArabic ? 'lg:text-right' : 'lg:text-left')}>
          <h3 className='text-2xl font-semibold leading-8 sm:text-4xl sm:leading-10'>{t('contact_us_heading')}</h3>
          <p className='text-sm font-medium leading-5 sm:text-lg sm:leading-7'>{t('contact_us_desc')}</p>

          <div className='flex-1'>
            <h4
              className={cn('mb-4 text-center text-lg font-semibold', isArabic ? 'lg:text-right' : 'lg:text-left')}
              style={{ color: '#155E75' }}
            >
              {t('ourOffices')}
            </h4>
            <div className='mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3'>
              {OFFICE_LOCATIONS.map((office, index) => (
                <div key={index} className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
                  <div className='mb-2 flex items-start gap-2'>
                    <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0' style={{ color: '#155E75' }} />
                    <div>
                      <h5 className='font-semibold text-gray-900'>{office.country}</h5>
                      <p className='text-sm text-gray-600'>{office.city}</p>
                    </div>
                  </div>
                  <p className='mb-3 pl-6 text-xs text-gray-500'>{office.address}</p>
                  <div className='space-y-1 pl-6'>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-3 w-3 text-gray-400' />
                      <span className='text-xs text-gray-600'>{office.phone}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-3 w-3 text-gray-400' />
                      <span className='text-xs text-gray-600'>{office.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Office Locations */}

        <ContactUsForm />
      </div>

      <div className='mt-8 flex w-full flex-col gap-5 lg:mt-[3.75rem] lg:flex-row lg:justify-between'>
        <div className='flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-10'>
          {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
            <Link
              key={i18nKey}
              href={href}
              className='text-base font-medium leading-6 transition-all hover:text-primary'
            >
              {t(i18nKey)}
            </Link>
          ))}
        </div>
        <div className='flex justify-center gap-5 lg:justify-start'>
          <Link
            href='#'
            aria-label='Facebook'
            className='flex size-[3.125rem] items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-100'
          >
            <FacebookIcon className='size-4 text-black' />
          </Link>
          <Link
            href='#'
            aria-label='LinkedIn'
            className='flex size-[3.125rem] items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-100'
          >
            <LinkedInIcon className='size-4 text-black' />
          </Link>
        </div>
      </div>

      <div className='mt-5 self-center text-center text-sm font-medium leading-5 lg:mt-7'>
        {t('copyright', { year: 2025 })}
      </div>
    </div>
  )
}
