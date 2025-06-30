'use client'

import { Button } from '@heroui/react'
import { useTranslation } from 'react-i18next'

import { FlashCircle } from '@/app/components/ui/icons/FlashCircle'
import { GOALS } from '@/app/utils/constants'

export const Goals = () => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-start gap-y-5 px-[0.875rem] pb-10 sm:px-10 lg:gap-y-10 lg:pb-20'>
      <h3 className='text-center text-2xl font-semibold leading-8 lg:text-left lg:text-3xl lg:leading-9'>
        {t('home:goals_heading')}
      </h3>
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {GOALS.map(({ i18n_heading, i18n_desc }) => (
          <div key={i18n_heading} className='flex items-start gap-3'>
            <FlashCircle className='gap mt-1 size-5 shrink-0 text-gray-700' />
            <div className='flex flex-col gap-2 lg:gap-3'>
              <p className='text-base font-semibold leading-6 sm:text-lg sm:leading-7'>{t(i18n_heading)}</p>
              <p>{t(i18n_desc)}</p>
            </div>
          </div>
        ))}
      </div>
      <Button color='primary' size='md'>
        {t('get_in_touch')}
      </Button>
    </div>
  )
}
