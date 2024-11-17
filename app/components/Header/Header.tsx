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

export const Header = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActiveLink = (path: string): boolean => pathname.includes(path)
  return (
    <Navbar
      maxWidth='full'
      classNames={{ wrapper: 'px-[0.875rem] sm:px-10 w-full' }}
      className='w-full justify-start px-0'
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
      <NavbarMenu className='gap-5 py-10'>
        {NAVBAR_ITEMS.map(({ i18nKey, href }) => (
          <NavbarMenuItem key={i18nKey}>
            <Link
              className={cn(
                'w-full text-2xl font-semibold text-black transition-all hover:text-zinc-500',
                isActiveLink(href) && 'text-primary',
              )}
              href={href}
              size='lg'
            >
              {t(i18nKey)}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
