import { FC } from 'react'

import { IComponent } from '@/app/global.interface'

import { ObligationIcon } from '../ui/icons/ObligationIcon'
import { OperationsIcon } from '../ui/icons/OperationsIcon'
import { TransparencyIcon } from '../ui/icons/TransparencyIcon'
import { VisionIcon } from '../ui/icons/VisionIcon'

export const Vision: FC<IComponent> = (props) => {
  const { t } = props

  return (
    <div className='flex flex-1 flex-col gap-5 rounded-md border border-gray-400 p-5 lg:p-10'>
      <VisionIcon className='box-content size-10 rounded-full bg-cyan-700 p-4 text-white' />
      <p className='text-4xl font-semibold leading-10'>{t('vision')}</p>
      <div className='mt-5 flex flex-col gap-10'>
        <div className='flex gap-5'>
          <TransparencyIcon className='box-content size-6 shrink-0 rounded-full bg-cyan-50 p-2 text-cyan-700' />
          <p className='text-xl leading-7'>{t('vision_one')}</p>
        </div>
        <div className='flex gap-5'>
          <ObligationIcon className='box-content size-6 shrink-0 rounded-full bg-cyan-50 p-2 text-cyan-700' />
          <p className='text-xl leading-7'>{t('vision_two')}</p>
        </div>
        <div className='flex gap-5'>
          <OperationsIcon className='box-content size-6 shrink-0 rounded-full bg-cyan-50 p-2 text-cyan-700' />
          <p className='text-xl leading-7'>{t('vision_three')}</p>
        </div>
      </div>
    </div>
  )
}
