'use client'

import { SignOutButton, useUser } from '@clerk/nextjs'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User,
} from '@heroui/react'
import Image from 'next/image'
import type { FC } from 'react'

import { BurgerIcon } from '../ui/icons/BurgerIcon'

type TopBar = {
  onOpenChange: (isOpen: boolean) => void
}

export const TopBar: FC<TopBar> = ({ onOpenChange }) => {
  const { user, isLoaded } = useUser()

  return (
    <Navbar maxWidth='full' className='border-b border-gray-200 bg-white/80 backdrop-blur-md'>
      <NavbarBrand className='flex items-center gap-5'>
        <Button size='sm' variant='light' color='primary' onPress={() => onOpenChange(true)}>
          <BurgerIcon className='size-6 -scale-100 text-brand' />
        </Button>

        <Image className='shrink-0' src='/images/logo.png' alt='gbs logo' width={154} height={40} />
      </NavbarBrand>

      <NavbarContent justify='end' className='gap-4'>
        {isLoaded && user ? (
          <>
            <NavbarItem className='hidden lg:flex'>
              <Dropdown placement='bottom-end'>
                <DropdownTrigger>
                  <User
                    as='button'
                    avatarProps={{
                      isBordered: true,
                      src: user.imageUrl,
                      size: 'sm',
                    }}
                    className='transition-transform'
                    description={user.primaryEmailAddress?.emailAddress}
                    name={`${user.firstName ?? 'Admin'} ${user.lastName ?? ''}`}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label='User Actions' variant='flat'>
                  <DropdownItem key='profile' className='h-14 gap-2'>
                    <p className='font-bold'>Signed in as</p>
                    <p className='font-bold'>{user.primaryEmailAddress?.emailAddress}</p>
                  </DropdownItem>
                  <DropdownItem key='logout' color='danger'>
                    <SignOutButton>
                      <span className='w-full text-left'>Log Out</span>
                    </SignOutButton>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Button as={Link} color='primary' href='/dashboard/signin' variant='flat' size='sm'>
              Sign In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  )
}
