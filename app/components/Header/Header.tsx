'use client'

import { Button } from '@nextui-org/button'
import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { NAVBAR_ITEMS } from '@/app/utils/constants'

export const Header: FC = () => {
  const { t } = useTranslation()
  const pathname = usePathname()

  const isActiveLink = (path: string): boolean => pathname.includes(path)

  return (
    <nav className='mb-6 flex w-full items-center justify-between px-10 py-5'>
      <div className='flex items-center gap-x-[3.75rem]'>
        <Image src='/images/logo.png' alt='gbs logo' width={154} height={40} />
        <ul className='flex gap-x-10'>
          {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
            <li key={i18nKey}>
              <Link
                scroll
                className={cn(
                  'hover:text-primary focus:text-primary relative font-medium transition-all',
                  isActiveLink(href) &&
                    'text-primary after:border-primary after:border-b-1 after:absolute after:inset-0 after:top-6 after:w-1/2',
                )}
                href={href}
              >
                {t(i18nKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Button color='primary'>{t('contact_us')}</Button>
    </nav>
  )
}
