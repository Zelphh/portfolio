import type { Metadata } from 'next'
import { SITE } from '@/content/site'
import { getDictionary } from '@/i18n'
import { LOCALES, toLocale, type Locale } from '@/i18n/config'
import { display, mono } from '../fonts'
import '../globals.css'

/**
 * Each language is its own statically generated route. `dynamicParams: false`
 * means the only pages that exist are the ones enumerated below — anything
 * else 404s at the edge instead of rendering on demand.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

interface LocaleParams {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const { meta } = getDictionary(locale)

  return {
    metadataBase: new URL(SITE.url),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        LOCALES.map((code) => [code === 'pt' ? 'pt-BR' : 'en', `/${code}`]),
      ),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      url: `${SITE.url}/${locale}`,
      title: meta.title,
      description: meta.description,
      siteName: SITE.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const locale: Locale = toLocale((await params).locale)

  return (
    <html lang={locale === 'pt' ? 'pt-BR' : 'en'} className={`${display.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
