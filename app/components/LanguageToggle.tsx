'use client'

import { Button } from '@heroui/react'

import { useLanguageToggle } from '../hooks/useLanguageToggle'

// Alternative compact version
export function LanguageToggleCompact() {
  const { currentLocale, toggleLanguage } = useLanguageToggle()

  return (
    <Button
      onPress={toggleLanguage}
      className={`relative overflow-hidden font-semibold text-white transition-all duration-200 hover:scale-105 ${
        currentLocale === 'en'
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
      } `}
    >
      <div className='flex items-center gap-2'>
        <span className='text-sm'>{currentLocale === 'en' ? 'ع' : 'EN'}</span>
        <span className='text-xs opacity-90'>{currentLocale === 'en' ? 'العربية' : 'English'}</span>
      </div>
      <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full' />
    </Button>
  )
}
