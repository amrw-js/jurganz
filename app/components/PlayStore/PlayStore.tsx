import { TFunction } from 'i18next'
import { FC } from 'react'

import { PlayStoreIcon } from '../ui/icons/PlayStoreIcon'

interface IPlayStore {
  t: TFunction
}

export const PlayStore: FC<IPlayStore> = (props) => {
  const { t } = props

  return (
    <div className='flex items-center gap-3 rounded-xl bg-transparent px-4 py-2 sm:bg-white'>
      <PlayStoreIcon className='h-6 w-6 shrink-0' />
      <div className='hidden flex-col text-nowrap text-black sm:flex'>
        <p className='shrink-0 text-xs font-medium leading-4'>{t('mobile_get_it')}</p>
        <p className='shrink-0 text-base font-semibold leading-6'>{t('play_store')}</p>
      </div>
    </div>
  )
}
