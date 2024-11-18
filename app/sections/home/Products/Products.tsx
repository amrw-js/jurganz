'use client'

import { Button } from '@nextui-org/button'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableCards } from '@/app/components/ui/ScrollableCards/ScrollableCards'
import { PROJECTS } from '@/app/utils/constants'

import { IProject } from '../Projects/projects.interface'

export const Products: FC = () => {
  const { t } = useTranslation()

  const renderItem = useCallback(
    (item: IProject) => {
      const { i18n_scope, i18n_line_type, i18n_line_speed, i18n_location } = item
      return (
        <div className='flex flex-col items-start overflow-hidden rounded-xl text-black'>
          <div className='w-full'>
            <Image className='w-full object-cover' src='/images/welding.webp' width={500} height={500} alt='' />
          </div>
          <div className='flex flex-col items-start gap-[0.375rem] bg-white px-4 py-3'>
            <p className='text-lg font-semibold leading-7'>Product name</p>
            <p className='text-start text-sm font-medium leading-5'>
              High-performance, durable, and designed for precision. Engineered to meet industry standards..
            </p>
            <div className='mt-3 flex w-full items-center justify-center gap-[0.625rem]'>
              <Button className='flex-1' variant='light'>
                {t('more_details')}
              </Button>
              <Button className='flex-1' color='primary'>
                {t('contact_us')}
              </Button>
            </div>
          </div>
        </div>
      )
    },
    [t],
  )

  return (
    <div className='relative bg-factory bg-cover bg-fixed bg-center bg-no-repeat px-[0.875rem] py-10 text-center text-white sm:px-10 lg:py-20'>
      <div className='absolute inset-0 z-0 h-full w-full bg-black/70'></div>

      <div className='relative z-10 mb-10 lg:mb-20'>
        <h3 className='text-2xl font-semibold leading-8 sm:text-4xl sm:leading-10'>{t('products_heading')}</h3>
        <h5 className='text-sm font-medium leading-5 sm:text-lg sm:leading-7'>{t('products_desc')}</h5>
      </div>

      <div className='relative z-10'>
        <ScrollableCards
          arrows={false}
          slides={PROJECTS}
          renderItem={renderItem}
          slideClassName='flex-shrink-0 flex-grow-0 basis-[100%] md:basis-[50%] lg:basis-[25%]'
          renderLeftContent={() => (
            <Link href='#' className='text-lg font-semibold underline hover:text-gray-500'>
              {t('see_all_projects')}
            </Link>
          )}
        />
      </div>
    </div>
  )
}
