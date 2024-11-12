import { TFunction } from 'i18next'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

import { NAVBAR_ITEMS } from '@/app/utils/constants'

interface IHeader {
  t: TFunction
}

export const Header: FC<IHeader> = ({ t }) => {
  return (
    <div className='flex w-full items-center gap-x-[3.75rem] px-10 py-5'>
      <Image src='/logo.png' alt='gbs logo' width={154} height={40} />
      <div>
        {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
          <Link key={i18nKey} href={href}>
            {t(i18nKey)}
          </Link>
        ))}
      </div>
      {t('test_new')}
    </div>
  )
}
