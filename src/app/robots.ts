import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'

// Nothing here depends on the request, so it can render once at build time —
// required anyway once `output: 'export'` takes the server away.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
