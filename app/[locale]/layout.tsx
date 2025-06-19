import { Inter } from 'next/font/google'
import { FC, ReactNode } from 'react'

import { Locale } from '@/lib/i18n-client'
import { getTranslation } from '@/lib/i18n-server'

import { Footer } from '../components/Footer/Footer'
import { Header } from '../components/Header/Header'
import '../globals.css'
import { Providers } from '../providers/Providers'

interface IRootLayout {
  params: Promise<{
    locale: Locale
  }>
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const RootLayout: FC<IRootLayout> = async ({ children, params }) => {
  const { locale } = await params
  await getTranslation(locale)
  const isRTL = locale === 'ar'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={inter.className}>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default RootLayout
