import { en } from './dictionaries/en'
import { pt } from './dictionaries/pt'
import type { Locale } from './config'
import type { Dictionary } from './types'

const DICTIONARIES: Readonly<Record<Locale, Dictionary>> = { pt, en }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

/** The language a visitor would switch *to* from the current one. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'pt' ? 'en' : 'pt'
}

export { format } from './format'
export type { Dictionary } from './types'
export * from './config'
