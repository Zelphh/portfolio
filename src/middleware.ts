import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, LOCALES } from '@/i18n/config'

/**
 * Sends `/` to a language.
 *
 * Doing this in middleware instead of a redirecting page keeps both language
 * routes fully static: the choice is resolved at the edge, and the pages
 * themselves stay cacheable HTML with no per-request work.
 *
 * Preference order: the cookie set by the language toggle, then the browser's
 * `Accept-Language`, then Portuguese.
 */
export function middleware(request: NextRequest) {
  const stored = request.cookies.get(LOCALE_COOKIE)?.value
  const preferred = isLocale(stored) ? stored : detectFromHeader(request)

  return NextResponse.redirect(new URL(`/${preferred}`, request.url))
}

function detectFromHeader(request: NextRequest) {
  const header = request.headers.get('accept-language') ?? ''

  for (const entry of header.split(',')) {
    const tag = entry.split(';')[0]?.trim().slice(0, 2).toLowerCase()
    if (tag && LOCALES.includes(tag as (typeof LOCALES)[number])) {
      return tag
    }
  }

  return DEFAULT_LOCALE
}

export const config = {
  matcher: '/',
}
