'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getDictionary } from '@/i18n'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from '@/i18n/config'

/**
 * The language a lost visitor was most likely browsing in: the path they
 * typed (`/en/...`), then the language they last picked on the site.
 */
function detectLocale(): Locale {
  const segment = window.location.pathname.split('/')[1]
  if (isLocale(segment)) return segment

  const stored = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`),
  )?.[1]
  return isLocale(stored) ? stored : DEFAULT_LOCALE
}

/**
 * Body of the 404 page. The export is a single static file shared by every
 * language, so it renders in the default one and switches after mount.
 */
export function NotFoundView() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const detected = detectLocale()
    setLocale(detected)
    document.documentElement.lang = detected === 'pt' ? 'pt-BR' : 'en'
  }, [])

  const copy = getDictionary(locale).notFound

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="grid w-full max-w-[560px] animate-rise justify-items-center gap-6 text-center">
        <Image
          src="/errors/404.jpg"
          alt={`404 — ${copy.title}`}
          width={750}
          height={600}
          priority
          className="h-auto w-full rounded-[15px] border border-line-strong shadow-modal"
        />

        <div className="grid gap-2">
          <h1 className="font-display text-[clamp(24px,5vw,32px)] font-extrabold tracking-[-0.02em] text-fg">
            {copy.title}
          </h1>
          <p className="text-pretty text-sm leading-[1.8] text-fg-dim">
            {copy.message}
          </p>
        </div>

        <a
          href={`/${locale}/`}
          className="text-[13px] text-accent transition-colors hover:text-fg"
        >
          {copy.back}
        </a>
      </div>
    </main>
  )
}
