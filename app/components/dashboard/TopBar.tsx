import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Image from 'next/image'
import { FC } from 'react'

import { BurgerIcon } from '../ui/icons/BurgerIcon'

type TopBar = {
  onOpenChange: (isOpen: boolean) => void
}

export const TopBar: FC<TopBar> = ({ onOpenChange }) => {
  return (
    <Navbar maxWidth='full'>
      <NavbarBrand className='flex items-center gap-5'>
        <Button size='sm' variant='light' color='primary' onPress={() => onOpenChange(true)}>
          <BurgerIcon className='text-brand size-6 -scale-100' />
        </Button>
        <Image className='shrink-0' src='/images/logo.png' alt='gbs logo' width={154} height={40} />
      </NavbarBrand>
      <NavbarContent justify='end'>
        <p>Logged in as Admin</p>
        <NavbarItem>
          <Button as={Link} color='primary' href='#' variant='flat'>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
