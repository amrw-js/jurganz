'use client'

import { HeroUIProvider } from '@heroui/react'
import { FC, ReactNode, useState } from 'react'

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
          <TopBar onOpenChange={handleOpenChange} />
          <SideBar isOpen={sideBarOpen} onOpenChange={handleOpenChange} />
          <div className='px-6'>{children}</div>
        </HeroUIProvider>
      </body>
    </html>
  )
}

export default DashboardLayout
