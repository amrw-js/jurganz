import { dir } from 'i18next'
import { Inter } from 'next/font/google'
import { FC, ReactNode } from 'react'

import { initTranslations } from '@/i18n'
import i18nConfig from '@/i18nConfig'

import { Footer } from '../components/Footer/Footer'
import { Header } from '../components/Header/Header'
import '../globals.css'
import TranslationsProvider from '../providers/TranslationsProvider'

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
  const { t, resources } = await initTranslations({ locale, namespaces })

  return (
    <html lang={locale} dir={dir(locale)} className={inter.className}>
      <TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
        <body>
          <Header t={t} />
          {children}
          <Footer />
        </body>
      </TranslationsProvider>
    </html>
  )
}

export default RootLayout
