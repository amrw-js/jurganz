'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { HeroUIProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode, useState } from 'react'

import { queryClient } from '../clients/reactQuery.client'
import { SideBar } from '../components/dashboard/SideBar'
import { TopBar } from '../components/dashboard/TopBar'
import '../globals.css'

interface IDashboardLayout {
  children: ReactNode
}

const DashboardLayout: FC<IDashboardLayout> = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setSideBarOpen(isOpen)
  }

  return (
    <html>
      <body>
        <HeroUIProvider>
          <ClerkProvider>
            <QueryClientProvider client={queryClient}>
              <TopBar onOpenChange={handleOpenChange} />
              <SideBar isOpen={sideBarOpen} onOpenChange={handleOpenChange} />
              <div className='px-6'>{children}</div>
            </QueryClientProvider>
          </ClerkProvider>
        </HeroUIProvider>
      </body>
    </html>
  )
}

export default DashboardLayout
