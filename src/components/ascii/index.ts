'use client'

import dynamic from 'next/dynamic'

/**
 * Lazy entry points for every animated ASCII component.
 *
 * They are `ssr: false` on purpose: the art is decorative, seeded partly by
 * `Math.random`, and worth nothing in the HTML payload. Keeping it out of the
 * server render trims the document, avoids hydration mismatches on the random
 * seeds, and moves ~10 kB of geometry off the critical path. Each chunk is
 * fetched only when the section that uses it is part of the page.
 */

export const BonfireArt = dynamic(
  () => import('./bonfire-art').then((m) => m.BonfireArt),
  { ssr: false },
)

export const GrassArt = dynamic(
  () => import('./grass-art').then((m) => m.GrassArt),
  { ssr: false },
)

export const TimelineArt = dynamic(
  () => import('./timeline-art').then((m) => m.TimelineArt),
  { ssr: false },
)

export const LogoArt = dynamic(
  () => import('./logo-art').then((m) => m.LogoArt),
  { ssr: false },
)
