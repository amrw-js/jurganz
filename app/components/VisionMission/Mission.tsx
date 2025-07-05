import { FC } from 'react'

import { IComponent } from '@/app/global.interface'

import { MissionIcon } from '../ui/icons/MissionIcon'
import { SupportIcon } from '../ui/icons/SupportIcon'

export const Mission: FC<IComponent> = (props) => {
  const { t } = props

  return (
    <div className='flex flex-1 flex-col gap-5 rounded-md border border-gray-400 p-5 lg:p-10'>
      <MissionIcon className='box-content size-10 rounded-full bg-cyan-700 p-4 text-white' />
      <p className='text-4xl font-semibold leading-10'>{t('about:mission')}</p>
      <div className='mt-5 flex flex-col gap-10'>
        <div className='flex gap-5'>
          <SupportIcon className='box-content size-6 shrink-0 rounded-full bg-cyan-50 p-2 text-cyan-700' />
          <p className='text-xl leading-7'>{t('about:vision_one')}</p>
        </div>
      </div>
    </div>
  )
}
