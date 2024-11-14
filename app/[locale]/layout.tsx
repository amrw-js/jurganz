import { dir } from 'i18next'
import { Inter } from 'next/font/google'
import { FC, ReactNode } from 'react'

import { initTranslations } from '@/i18n'
import i18nConfig from '@/i18nConfig'

import { Footer } from '../components/Footer/Footer'
import { Header } from '../components/Header/Header'
import '../globals.css'
import { Providers } from '../providers/Providers'

interface IRootLayout {
  params: Promise<{
    locale: string
  }>
  children: ReactNode
}
const namespaces = ['default', 'home']

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }))
}

const RootLayout: FC<IRootLayout> = async ({ children, params }) => {
  const { locale } = await params
  const { resources } = await initTranslations({ locale, namespaces })

  return (
    <html lang={locale} dir={dir(locale)} className={inter.className}>
      <body>
        <Providers namespaces={namespaces} locale={locale} resources={resources}>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
