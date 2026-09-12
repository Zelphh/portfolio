import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'
import { LOCALES } from '@/i18n/config'

// Nothing here depends on the request, so it can render once at build time —
// required anyway once `output: 'export'` takes the server away.
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === 'pt' ? 1 : 0.8,
  }))
}
