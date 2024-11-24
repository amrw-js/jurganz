'use client'

import { Button } from '@nextui-org/button'
import { MotionProps, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FC, HTMLAttributes, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// Import motion for animations
import { ScrollableCards } from '@/app/components/ui/ScrollableCards/ScrollableCards'
import { PROJECTS } from '@/app/utils/constants'

import { IProject } from '../Projects/projects.interface'

import { ProductsPlaceholder } from './ProductsPlaceholder'

export const Products: FC = () => {
  const { t } = useTranslation()
  const MotionDiv = motion.div as FC<HTMLAttributes<HTMLDivElement> & MotionProps>
  const MotionH3 = motion.h3 as FC<HTMLAttributes<HTMLHeadingElement> & MotionProps>
  const MotionP = motion.p as FC<HTMLAttributes<HTMLHeadingElement> & MotionProps>

  const renderItem = useCallback(
    (item: IProject) => {
      const { i18n_scope, i18n_line_type, i18n_line_speed, i18n_location } = item
      return (
        <MotionDiv
          className='flex flex-col items-start overflow-hidden rounded-xl text-black shadow-md'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
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
        </MotionDiv>
      )
    },
    [t],
  )

  return (
    <div className='relative bg-factory bg-cover bg-fixed bg-center bg-no-repeat px-[0.875rem] py-10 text-center text-white sm:px-10 lg:py-[7.75rem]'>
      <div className='absolute inset-0 z-0 h-full w-full bg-black/70'></div>
      <div className='relative z-10 mb-10 lg:mb-20'>
        <MotionH3
          className='text-2xl font-semibold leading-8 sm:text-4xl sm:leading-10'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeInOut' }}
        >
          {t('products_heading')}
        </MotionH3>
        <MotionP
          className='text-sm font-medium leading-5 sm:text-lg sm:leading-7'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
        >
          {t('products_desc')}
        </MotionP>
      </div>
      <div className='relative z-10'>
        {true ? (
          <ProductsPlaceholder />
        ) : (
          <>
            <ScrollableCards
              arrows={false}
              slides={PROJECTS}
              renderItem={renderItem}
              slideClassName='flex-shrink-0 flex-grow-0 basis-[100%] sm:basis-[50%] lg:basis-[25%]'
              renderLeftContent={() => (
                <Link href='#' className='text-lg font-semibold underline hover:text-gray-500'>
                  {t('see_all_projects')}
                </Link>
              )}
            />
            <Link
              href='#'
              className='relative z-10 mt-5 block text-white underline transition-all hover:text-gray-300 lg:mt-10'
            >
              {t('see_all_items')}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
