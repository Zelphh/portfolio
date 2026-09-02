import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'
import { LOCALES } from '@/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === 'pt' ? 1 : 0.8,
  }))
}
