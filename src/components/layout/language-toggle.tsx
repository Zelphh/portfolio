'use client'

import Link from 'next/link'
import { LOCALE_COOKIE, LOCALES, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

const ONE_YEAR = 60 * 60 * 24 * 365

interface LanguageToggleProps {
  current: Locale
  /** `pt` → `português`, used for the accessible label. */
  otherLanguageName: string
  switchLabel: string
}

/**
 * Language switch.
 *
 * Each language is its own statically generated route, so switching is a
 * prefetched navigation rather than a client-side re-render of every string.
 * The choice is also written to a cookie so a later visit to `/` lands on the
 * right language without a flash of the wrong one.
 */
export function LanguageToggle({
  current,
  otherLanguageName,
  switchLabel,
}: LanguageToggleProps) {
  const target: Locale = current === 'pt' ? 'en' : 'pt'

  const remember = () => {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${ONE_YEAR}; samesite=lax`
  }

  return (
    <Link
      href={`/${target}`}
      onClick={remember}
      aria-label={switchLabel.replace('{language}', otherLanguageName)}
      className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-fg-subtle transition-colors hover:border-moss hover:text-accent"
    >
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 && <span className="text-line-strong">/</span>}
          <span className={cn(locale === current ? 'text-accent' : 'text-fg-ghost')}>
            {locale}
          </span>
        </span>
      ))}
    </Link>
  )
}
