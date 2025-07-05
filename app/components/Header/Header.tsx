'use client'

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react'
import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NAVBAR_ITEMS } from '@/app/utils/constants'

import { LanguageToggleCompact } from '../LanguageToggle'
import { FacebookIcon } from '../ui/icons/FacebookIcon'
import { LinkedInIcon } from '../ui/icons/LinkedInIcon'

// Import the compact language toggle

export const Header = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActiveLink = (path: string): boolean => pathname.includes(path)

  return (
    <Navbar
      maxWidth='full'
      classNames={{ wrapper: 'px-[0.875rem] sm:px-10 w-full h-[4.75rem] lg:h-20' }}
      className={cn(
        'w-full justify-start px-0 transition-all duration-300 lg:mb-6',
        isMenuOpen ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent',
      )}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className='flex w-full flex-row-reverse !justify-between'>
        <li className='shrink-0'>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className='h-6 w-full shrink-0 p-2 font-bold lg:hidden'
          />
        </li>

        <li className='shrink-0 basis-auto'>
          <NavbarBrand>
            <Image className='shrink-0' src='/images/logo.png' alt='gbs logo' width={154} height={40} />
          </NavbarBrand>
        </li>
      </NavbarContent>

      <NavbarContent className='hidden gap-10 lg:flex'>
        {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
          <NavbarItem key={i18nKey}>
            <Link
              className={cn(
                'relative font-medium text-black transition-all hover:text-primary focus:text-primary',
                isActiveLink(href) &&
                  'text-primary after:absolute after:inset-0 after:top-6 after:w-1/2 after:border-b-1 after:border-primary',
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
        <NavbarItem>
          <LanguageToggleCompact />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className='gap-0 py-4'>
        {NAVBAR_ITEMS.map(({ i18nKey, href }, index) => (
          <NavbarMenuItem key={i18nKey}>
            <Link
              className={cn(
                'w-full border-b border-[#E6E6E3] py-6 text-lg font-semibold text-black transition-all hover:text-zinc-500',
                isActiveLink(href) && 'text-primary',
                index === NAVBAR_ITEMS.length - 1 && 'border-none',
              )}
              href={href}
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
            className='flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-100'
          >
            <FacebookIcon aria-label='Facebook' className='size-3 text-black' />
          </Link>
          <Link
            href='#'
            className='flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-100'
          >
            <LinkedInIcon aria-label='LinkedIn' className='size-3 text-black' />
          </Link>

          <LanguageToggleCompact />
        </li>
      </NavbarMenu>
    </Navbar>
  )
}
