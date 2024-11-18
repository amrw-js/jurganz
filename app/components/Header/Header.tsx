'use client'

import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import cn from 'clsx'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NAVBAR_ITEMS } from '@/app/utils/constants'

import { FacebookIcon } from '../ui/icons/FacebookIcon'
import { LinkedInIcon } from '../ui/icons/LinkedInIcon'

export const Header = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActiveLink = (path: string): boolean => pathname.includes(path)
  return (
    <Navbar
      maxWidth='full'
      classNames={{ wrapper: 'px-[0.875rem] sm:px-10 w-full h-[4.75rem] lg:h-20' }}
      className='w-full justify-start px-0 lg:mb-6'
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className='flex flex-row-reverse'>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className='font-bold lg:hidden' />
        <NavbarBrand className='shrink-0 basis-auto'>
          <Image className='shrink-0' src='/images/logo.png' alt='gbs logo' width={154} height={40} />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden gap-10 lg:flex'>
        {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
          <NavbarItem key={i18nKey}>
            <Link
              className={cn(
                'hover:text-primary focus:text-primary relative font-medium text-black transition-all',
                isActiveLink(href) &&
                  'text-primary after:border-primary after:border-b-1 after:absolute after:inset-0 after:top-6 after:w-1/2',
              )}
              href={href}
            >
              {t(i18nKey)}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent className='hidden lg:flex' justify='end'>
        <NavbarItem>
          <Button className='w-[7.5rem]' color='primary'>
            {t('contact_us')}
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className='gap-0 py-4'>
        {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
          <NavbarMenuItem key={i18nKey}>
            <Link
              className={cn(
                'w-full border-b border-[#E6E6E3] py-6 text-lg font-semibold text-black transition-all hover:text-zinc-500',
                isActiveLink(href) && 'text-primary',
              )}
              href={href}
              size='lg'
            >
              {t(i18nKey)}
            </Link>
          </NavbarMenuItem>
        ))}
        <li className='mt-1 w-full self-start'>
          <Button className='h-10 w-full' color='primary'>
            {t('contact_us')}
          </Button>
        </li>

        <li className='mt-5 flex justify-center gap-5 lg:justify-start'>
          <Link
            href='#'
            className='flex size-10 items-center justify-center rounded-full bg-white transition-all hover:bg-gray-100'
          >
            <FacebookIcon className='size-3 text-black' />
          </Link>
          <Link
            href='#'
            className='flex size-10 items-center justify-center rounded-full bg-white transition-all hover:bg-gray-100'
          >
            <LinkedInIcon className='size-3 text-black' />
          </Link>
        </li>
      </NavbarMenu>
    </Navbar>
  )
}
