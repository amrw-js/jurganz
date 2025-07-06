import type { Metadata, Viewport } from 'next'
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

export const metadata: Metadata = {
  title: {
    default: 'GBS - Industrial Services & Consultancy | Middle East & Africa',
    template: '%s | GBS',
  },
  description:
    'GBS is a cooperation of experts and technicians from Egypt and Algeria providing industrial services and consultancy for Middle East & Africa agencies.',
  keywords: [
    'industrial services',
    'consultancy',
    'Middle East',
    'Africa',
    'Egypt',
    'Algeria',
    'engineering',
    'technical solutions',
    'industrial consulting',
  ],
  authors: [{ name: 'GBS Team' }],
  creator: 'GBS',
  publisher: 'GBS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Add favicon configuration here
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#2563eb',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#ffffff',
  },
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

const RootLayout: FC<IRootLayout> = async ({ children, params }) => {
  const { locale } = await params
  await getTranslation(locale)
  const isRTL = locale === 'ar'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={inter.className}>
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='GBS' />

        {/* Preconnect to external domains for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />

        {/* DNS prefetch for better performance */}
        <link rel='dns-prefetch' href='https://cdn.jsdelivr.net' />

        {/* Language alternates */}
        <link rel='alternate' hrefLang='en' href={`https://gbs.agency/en${isRTL ? '' : ''}`} />
        <link rel='alternate' hrefLang='ar' href={`https://gbs.agency/ar${isRTL ? '' : ''}`} />
        <link rel='alternate' hrefLang='x-default' href='https://gbs.agency/' />

        {/* Security headers */}
        <meta httpEquiv='X-Content-Type-Options' content='nosniff' />
        <meta httpEquiv='X-Frame-Options' content='DENY' />
        <meta httpEquiv='X-XSS-Protection' content='1; mode=block' />
      </head>
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
