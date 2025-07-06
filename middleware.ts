import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

// Get the preferred locale - PRIORITIZE COOKIE FIRST
function getLocale(request: NextRequest): Locale {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    return pathname.split('/')[1] as Locale
  }

  // PRIORITY 1: Get locale from cookie (user's explicit choice)
  const localeCookie =
    request.cookies.get('locale')?.value ||
    request.cookies.get('NEXT_LOCALE')?.value ||
    request.cookies.get('NEXT_INTL_LOCALE')?.value

  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale
  }

  // PRIORITY 2: Get locale from Accept-Language header (only if no cookie)
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

  // Default to 'en'
  return 'en'
}

// Internationalization middleware
function handleI18n(request: NextRequest) {
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
    return null // Return null instead of NextResponse.next()
  }

  // Redirect to locale-prefixed URL
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  const response = NextResponse.redirect(newUrl)

  // Set multiple locale cookies for compatibility
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax' as const,
  }

  response.cookies.set('locale', locale, cookieOptions)
  response.cookies.set('NEXT_LOCALE', locale, cookieOptions)
  response.cookies.set('NEXT_INTL_LOCALE', locale, cookieOptions)

  return response
}

export default clerkMiddleware(async (auth, req) => {
  // Handle internationalization first for non-dashboard routes
  if (!req.nextUrl.pathname.startsWith('/dashboard')) {
    const i18nResponse = handleI18n(req)
    if (i18nResponse) {
      return i18nResponse
    }
  }

  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    // Allow access to signin and signup pages without authentication
    if (req.nextUrl.pathname === '/dashboard/signin' || req.nextUrl.pathname === '/dashboard/signup') {
      return NextResponse.next()
    }

    // Check authentication and redirect if needed
    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL('/dashboard/signin', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
