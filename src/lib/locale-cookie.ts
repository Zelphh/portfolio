import { LOCALE_COOKIE, type Locale } from '@/i18n/config'

const ONE_YEAR = 60 * 60 * 24 * 365

/**
 * Remembers the visitor's language so a later visit to `/` lands on it
 * without a flash of the wrong one.
 *
 * Both ways of switching — the header toggle and the console's `lang` — write
 * the same cookie, so it is spelled here once.
 */
export function rememberLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`
}
