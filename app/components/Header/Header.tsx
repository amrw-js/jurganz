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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NAVBAR_ITEMS } from '@/app/utils/constants'

import { LanguageToggleCompact } from '../LanguageToggle'
import { FacebookIcon } from '../ui/icons/FacebookIcon'
import { LinkedInIcon } from '../ui/icons/LinkedInIcon'

export const Header = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Fixed active link detection
  const isActiveLink = (path: string): boolean => {
    if (path === '/' || path === '') {
      return pathname === '/' || pathname === ''
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <Navbar
      maxWidth='full'
      classNames={{
        wrapper: 'px-4 sm:px-6 lg:px-10 w-full h-[4.75rem] lg:h-20',
        menu: 'pt-0 pb-0 gap-0',
      }}
      className={cn(
        'relative z-50 w-full justify-start px-0 transition-all duration-300 lg:mb-6',
        isMenuOpen ? 'bg-white/95 shadow-lg backdrop-blur-lg' : 'bg-transparent',
      )}
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
    >
      <NavbarContent className='flex w-full flex-row-reverse !justify-between'>
        <li className='shrink-0'>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'h-8 w-8 shrink-0 p-1 font-bold transition-all duration-200 lg:hidden',
              'rounded-md hover:bg-gray-100',
              isMenuOpen && 'rotate-90',
            )}
          />
        </li>

        <li className='shrink-0 basis-auto'>
          <NavbarBrand as={Link} href='/'>
            <Image
              className='shrink-0 transition-all duration-200 hover:scale-105'
              src='/images/logo.png'
              alt='gbs logo'
              width={154}
              height={40}
            />
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
          <Button as='a' href='#contact-us' className='w-[7.5rem]' color='primary'>
            {t('contact_us')}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <LanguageToggleCompact />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu
        className={cn(
          'bg-white/98 gap-0 px-0 py-0 backdrop-blur-xl',
          'animate-in slide-in-from-top-2 duration-300 ease-out',
          'border-t border-gray-100 shadow-xl',
        )}
      >
        {/* Enhanced menu content with better spacing and animations */}
        <div className='flex h-full flex-col'>
          {/* Navigation Links */}
          <div className='flex-1 space-y-1 px-4 py-6'>
            {NAVBAR_ITEMS.map(({ i18nKey, href }, index) => (
              <NavbarMenuItem key={i18nKey} className='w-full'>
                <Link
                  className={cn(
                    'flex w-full items-center px-4 py-4 text-lg font-medium text-gray-900 transition-all duration-200',
                    'rounded-xl hover:bg-gray-50 hover:text-primary',
                    'focus:bg-gray-50 focus:text-primary focus:outline-none',
                    'active:scale-95 active:bg-gray-100',
                    isActiveLink(href) && 'border-l-4 border-primary bg-primary/5 text-primary',
                  )}
                  href={href}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <span className='relative'>
                    {t(i18nKey)}
                    {isActiveLink(href) && (
                      <span className='absolute -right-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary' />
                    )}
                  </span>
                </Link>
              </NavbarMenuItem>
            ))}
          </div>

          {/* Contact Button */}
          <div className='border-t border-gray-100 px-4 py-4'>
            <Button
              as='a'
              href='#contact-us'
              className='h-12 w-full text-base font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95'
              color='primary'
              radius='lg'
            >
              {t('contact_us')}
            </Button>
          </div>

          {/* Social Links and Language Toggle */}
          <div className='border-t border-gray-100 bg-gray-50/50 px-4 py-6'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-3'>
                <Link
                  href='#'
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    'bg-white shadow-md transition-all duration-200 hover:shadow-lg',
                    'hover:scale-105 hover:bg-gray-100 active:scale-95',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  )}
                >
                  <FacebookIcon aria-label='Facebook' className='h-4 w-4 text-gray-700' />
                </Link>
                <Link
                  href='#'
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    'bg-white shadow-md transition-all duration-200 hover:shadow-lg',
                    'hover:scale-105 hover:bg-gray-100 active:scale-95',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  )}
                >
                  <LinkedInIcon aria-label='LinkedIn' className='h-4 w-4 text-gray-700' />
                </Link>
              </div>

              <div className='flex items-center'>
                <LanguageToggleCompact />
              </div>
            </div>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  )
}
