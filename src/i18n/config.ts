export const LOCALES = ['pt', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt'

/** Cookie the root route reads to send returning visitors to their language. */
export const LOCALE_COOKIE = 'zelph-lang'

/** A value that exists in every supported language. */
export type Localized<T> = Readonly<Record<Locale, T>>

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

/** Narrows an unknown route/cookie segment to a supported locale. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** Picks the current language out of a localized value. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale]
}
