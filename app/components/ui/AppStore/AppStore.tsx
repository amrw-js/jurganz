import { TFunction } from 'i18next'
import { FC } from 'react'

import { AppStoreIcon } from '../icons/AppStoreIcon'

interface IAppStore {
  t: TFunction
}
export const AppStore: FC<IAppStore> = (props) => {
  const { t } = props

  return (
    <div className='flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-2 transition-all hover:bg-gray-200'>
      <AppStoreIcon className='h-6 w-6 shrink-0' />
      <div className='flex flex-col text-nowrap text-black'>
        <p className='text-xs font-medium leading-4'>{t('mobile_get_it')}</p>
        <p className='text-base font-semibold leading-6'>{t('app_store')}</p>
      </div>
    </div>
  )
}
