import { TFunction } from 'i18next'
import { FC } from 'react'

import { PlayStoreIcon } from '../icons/PlayStoreIcon'

interface IPlayStore {
  t: TFunction
}

export const PlayStore: FC<IPlayStore> = (props) => {
  const { t } = props

  return (
    <div className='flex items-center gap-3 rounded-xl bg-white px-4 py-2'>
      <PlayStoreIcon className='h-6 w-6 shrink-0' />
      <div className='flex flex-col text-nowrap text-black'>
        <p className='shrink-0 text-xs font-medium leading-4'>{t('mobile_get_it')}</p>
        <p className='shrink-0 text-base font-semibold leading-6'>{t('play_store')}</p>
      </div>
    </div>
  )
}
