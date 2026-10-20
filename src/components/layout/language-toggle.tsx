'use client'

import Link from 'next/link'
import { LOCALES, type Locale } from '@/i18n/config'
import { rememberLocale } from '@/lib/locale-cookie'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  current: Locale
  /** Page within the language to land on, e.g. `/projects`. Defaults to home. */
  path?: string
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
  path = '',
  otherLanguageName,
  switchLabel,
}: LanguageToggleProps) {
  const target: Locale = current === 'pt' ? 'en' : 'pt'

  return (
    <Link
      href={`/${target}${path}`}
      onClick={() => rememberLocale(target)}
      aria-label={switchLabel.replace('{language}', otherLanguageName)}
      className="group flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-fg-subtle transition-colors hover:border-moss hover:text-accent"
    >
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 && <span className="text-line-strong">/</span>}
          <span
            className={cn(
              'flex items-center gap-1.5',
              locale === current ? 'text-accent' : 'text-fg-ghost',
            )}
          >
            <Flag
              locale={locale}
              className={cn(
                'h-2.5 w-3.5 rounded-[2px] transition-[filter,opacity]',
                locale !== current &&
                  'opacity-50 grayscale group-hover:opacity-90 group-hover:grayscale-0',
              )}
            />
            {locale}
          </span>
        </span>
      ))}
    </Link>
  )
}

/**
 * Flags drawn inline rather than as emoji: Windows renders flag emoji as bare
 * letters. Simplified for a 14×10 slot, so no stars or motto band.
 */
function Flag({ locale, className }: { locale: Locale; className?: string }) {
  if (locale === 'pt') {
    return (
      <svg viewBox="0 0 14 10" aria-hidden className={className}>
        <rect width="14" height="10" fill="#229e45" />
        <path d="M7 1.2 12.6 5 7 8.8 1.4 5Z" fill="#f8e509" />
        <circle cx="7" cy="5" r="2.1" fill="#2b49a3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 14 10" aria-hidden className={className}>
      <rect width="14" height="10" fill="#fff" />
      {/* 7 red of the 13 stripes, top and bottom included. */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          y={(i * 20) / 13}
          width="14"
          height={10 / 13}
          fill="#b22234"
        />
      ))}
      <rect width="6" height={70 / 13} fill="#3c3b6e" />
    </svg>
  )
}
