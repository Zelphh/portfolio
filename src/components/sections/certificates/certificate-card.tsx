import type { CSSProperties } from 'react'
import type { Certificate } from '@/content/types'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'
import { KIND_PILL } from './certificate-kind'

interface CertificateCardProps {
  certificate: Certificate
  locale: Locale
  kindLabel: string
  /** Grid spans for this position, handed to the CSS in `globals.css`. */
  span: CSSProperties
  /** The tall tile: bigger mark, bigger title, more room for the summary. */
  featured: boolean
  onOpen: () => void
}

/**
 * One tile in the studies bento.
 *
 * The mark is drawn twice: once at reading size above the title, and once
 * oversized and nearly invisible in the corner, so the grid reads as a
 * shelf of different things at a glance rather than a wall of text. The
 * featured tile only grows at `lg`, where the layout actually gives it two
 * rows — at narrower widths every tile is the same size and the larger type
 * would just overflow.
 */
export function CertificateCard({
  certificate,
  locale,
  kindLabel,
  span,
  featured,
  onOpen,
}: CertificateCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={span}
      className={cn(
        // Tailwind's translate utilities set the `translate` property, not
        // `transform`, so naming `transform` here would leave the lift
        // snapping instead of easing.
        'study-card group relative flex flex-col justify-between gap-4 overflow-hidden rounded-[0.9375rem] border border-line bg-surface p-6 text-left transition-[border-color,translate] duration-[350ms] ease-[var(--ease-out-soft)] hover:-translate-y-[0.1875rem] hover:border-moss',
        featured && 'lg:bg-surface-raised',
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          Local, already-minimal SVGs: the optimizer cannot improve a 1 kB
          vector and would only add a request through /_next/image. */}
      <img
        src={certificate.icon}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={cn(
          'pointer-events-none absolute -bottom-10 -right-10 h-[10.625rem] w-[10.625rem] opacity-[0.07] grayscale',
          featured && 'lg:-bottom-[4.375rem] lg:-right-[4.375rem] lg:h-[20rem] lg:w-[20rem]',
        )}
      />

      <span
        aria-hidden
        className="absolute right-[1.125rem] top-3.5 text-xs text-line-bright transition-colors group-hover:text-accent"
      >
        +
      </span>

      <div className="relative flex flex-wrap items-center gap-2.5 pr-5 text-[0.625rem] uppercase tracking-[0.22em] text-fg-fainter">
        <span
          className={cn('rounded-md border px-2 py-[0.1875rem]', KIND_PILL[certificate.kind])}
        >
          {kindLabel}
        </span>
        <span>{certificate.year}</span>
      </div>

      <div className="relative flex flex-col gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- see above. */}
        <img
          src={certificate.icon}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={cn('block h-10 w-10', featured && 'lg:h-[4.5rem] lg:w-[4.5rem]')}
        />

        <span
          className={cn(
            'text-balance font-display text-[1.375rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-fg',
            featured && 'lg:text-[clamp(1.75rem,3vw,2.5rem)]',
          )}
        >
          {certificate.name[locale]}
        </span>

        <span
          className={cn(
            'line-clamp-2 max-w-[46ch] text-[0.8125rem] leading-[1.7] text-fg-subtle',
            featured && 'lg:line-clamp-4',
          )}
        >
          {certificate.summary[locale]}
        </span>
      </div>
    </button>
  )
}
