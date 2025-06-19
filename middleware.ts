import { NextRequest, NextResponse } from 'next/server'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

// Get the preferred locale from Accept-Language header
function getLocale(request: NextRequest): Locale {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    return pathname.split('/')[1] as Locale
  }

  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => {
        const shortLang = lang.split('-')[0]
        return locales.includes(shortLang as Locale)
      })

    if (preferredLocale) {
      const shortLang = preferredLocale.split('-')[0]
      return shortLang as Locale
    }
  }

  // Get locale from cookie
  const localeCookie = request.cookies.get('locale')?.value
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale
  }

  // Default to 'en'
  return 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // Skip if pathname already has locale or is an API route/static file
  if (
    pathnameHasLocale ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Redirect to locale-prefixed URL
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  const response = NextResponse.redirect(newUrl)

  // Set locale cookie for future requests
  response.cookies.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
