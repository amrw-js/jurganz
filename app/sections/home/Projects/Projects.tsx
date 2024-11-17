'use client'

import Link from 'next/link'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableCards } from '@/app/components/ui/ScrollableCards/ScrollableCards'
import { PROJECTS } from '@/app/utils/constants'

import { IProject } from './projects.interface'

export const Projects: FC = () => {
  const { t } = useTranslation()

  const renderItem = useCallback((item: IProject) => {
    const { i18n_scope, i18n_line_type, i18n_line_speed, i18n_location } = item
    return (
      <div className='flex flex-1 shrink-0 justify-between rounded-lg border border-dashed border-zinc-300 px-5 py-[0.625rem]'>
        <div className='flex flex-col gap-3 py-3'>
          <p className='text-xl font-semibold leading-7'>{i18n_scope}</p>
          <div>
            {i18n_scope && (
              <p className='flex items-center gap-1'>
                <span className='font-semibold'>{t('line_type')}</span>
                {i18n_line_type}
              </p>
            )}
            {i18n_line_type && (
              <p className='flex items-center gap-1'>
                <span className='font-semibold'>{t('line_speed')}</span>
                {i18n_line_speed}
              </p>
            )}
            {i18n_line_speed && (
              <p className='flex items-center gap-1'>
                <span className='font-semibold'>{t('line_speed')}</span>
                {i18n_line_speed}
              </p>
            )}
            {i18n_location && (
              <p className='flex items-center gap-1'>
                <span className='font-semibold'>{t('location')}</span>
                {i18n_location}
              </p>
            )}
          </div>
        </div>
        <div>Right</div>
      </div>
    )
  }, [])

  return (
    <div className='mt-10 flex flex-col gap-7 px-[0.875rem] py-10 sm:px-10 lg:mt-[3.375rem] lg:gap-[11.25rem]'>
      <div className='flex w-full flex-col items-center justify-center gap-3 text-center lg:text-left'>
        <p className='text-2xl font-semibold leading-8 lg:text-4xl lg:leading-10'>{t('projects_heading')}</p>
        <p className='text-sm font-medium leading-5 text-gray-500 lg:text-lg lg:leading-7'>{t('projects_desc')}</p>
      </div>
      <div>
        <ScrollableCards
          slides={PROJECTS}
          renderItem={renderItem}
          slideClassName='flex-shrink-0 flex-grow-0 basis-[100%] md:basis-[50%] lg:basis-[33.33%]'
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
