'use client'

import { Button, Chip, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react'
import { BookOpen, ChevronRight, Factory, FolderOpen, Languages } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import type { FC } from 'react'

type SideBar = {
  isOpen?: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const SideBar: FC<SideBar> = ({ isOpen, onOpenChange }) => {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      href: '/dashboard/projects',
      description: 'Manage your projects and media',
      available: true,
    },
    {
      id: 'blogs',
      label: 'Blogs',
      icon: BookOpen,
      href: '/dashboard/blogs',
      description: 'Create and manage blog posts',
      available: true,
    },
    {
      id: 'production-lines',
      label: 'Production Lines',
      icon: Factory,
      href: '/dashboard/lines',
      description: 'Manage production workflows',
      available: true,
    },
    {
      id: 'localization',
      label: 'Localization',
      icon: Languages,
      href: '/dashboard/locales',
      description: 'Manage content localization',
      available: true,
    },
  ]

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    if (item.available) {
      router.push(item.href)
      onOpenChange(false) // Close drawer after navigation
    }
  }

  const isCurrentPage = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <Drawer placement='left' isOpen={isOpen} onOpenChange={onOpenChange} size='sm'>
      <DrawerContent>
        {(onClose: () => void) => (
          <>
            <DrawerHeader className='flex flex-col gap-1 pb-4'>
              <h2 className='text-xl font-semibold text-foreground'>Dashboard</h2>
              <p className='text-sm text-default-500'>Navigate through your workspace</p>
            </DrawerHeader>

            <Divider />

            <DrawerBody className='py-4'>
              <nav className='space-y-2'>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isCurrent = isCurrentPage(item.href)
                  const isAvailable = item.available

                  return (
                    <Button
                      key={item.id}
                      className={`h-auto w-full justify-start p-4 ${
                        isCurrent
                          ? 'border-primary/20 bg-primary/10 text-primary'
                          : isAvailable
                            ? 'bg-transparent hover:bg-default-100'
                            : 'cursor-not-allowed bg-transparent opacity-60'
                      }`}
                      variant={isCurrent ? 'bordered' : 'light'}
                      onPress={() => handleNavigation(item)}
                      isDisabled={!isAvailable}
                    >
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`rounded-lg p-2 ${
                              isCurrent ? 'bg-primary/20' : isAvailable ? 'bg-default-100' : 'bg-default-50'
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                isCurrent ? 'text-primary' : isAvailable ? 'text-default-600' : 'text-default-400'
                              }`}
                            />
                          </div>
                          <div className='text-left'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm font-medium'>{item.label}</span>
                              {!isAvailable && (
                                <Chip size='sm' color='warning' variant='flat' className='text-xs'>
                                  Coming Soon
                                </Chip>
                              )}
                            </div>
                            <p className='mt-1 text-xs text-default-500'>{item.description}</p>
                          </div>
                        </div>
                        {isAvailable && (
                          <ChevronRight className={`h-4 w-4 ${isCurrent ? 'text-primary' : 'text-default-400'}`} />
                        )}
                      </div>
                    </Button>
                  )
                })}
              </nav>
            </DrawerBody>

            <Divider />

            <div className='p-4'>
              <Button color='danger' variant='light' onPress={onClose} className='w-full'>
                Close Menu
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
