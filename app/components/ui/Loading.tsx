'use client'

import { Progress } from '@heroui/react'

export default function Loading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-100/90 backdrop-blur-sm'>
      <div className='w-80'>
        <Progress isIndeterminate />
      </div>
    </div>
  )
}
