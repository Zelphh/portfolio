import type { Metadata } from 'next'
import { NotFoundView } from '@/components/not-found-view'
import { SITE } from '@/content/site'
import { display, mono } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: `404 — ${SITE.name}`,
  robots: { index: false, follow: false },
}

/**
 * Served for any path that matches no route. The site's root layouts live
 * under `[locale]`, so this page brings its own document; the static export
 * writes it out as `404.html`.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${display.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <NotFoundView />
      </body>
    </html>
  )
}
