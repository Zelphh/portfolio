'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { CERTIFICATES } from '@/content/certificates'
import { useDragSwipe } from '@/hooks/use-drag-swipe'
import { useRingCarousel } from '@/hooks/use-ring-carousel'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { pad2 } from '@/lib/utils'
import { CertificateStack } from './certificate-stack'

/** How long the discarded card is animated off screen. */
const FLY_MS = 260

interface CertificatesSectionProps {
  locale: Locale
  label: string
  copy: Dictionary['certificates']
}

export function CertificatesSection({
  locale,
  label,
  copy,
}: CertificatesSectionProps) {
  const carousel = useRingCarousel(CERTIFICATES.length)
  const [flick, setFlick] = useState<1 | -1>(-1)
  const [flying, setFlying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flip = useCallback(
    (direction: 1 | -1) => {
      setFlick(direction > 0 ? -1 : 1)
      setFlying(true)
      if (direction > 0) carousel.next()
      else carousel.previous()

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setFlying(false), FLY_MS)
    },
    [carousel],
  )

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const { drag, handlers } = useDragSwipe(flip)
  const certificate = CERTIFICATES[carousel.index] as (typeof CERTIFICATES)[number]

  return (
    <section
      id="certificados"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-11" />

        <div className="grid min-h-[420px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-15">
          <div className="grid gap-6">
            <div key={certificate.id} className="grid animate-rise gap-3.5">
              <div className="flex items-center gap-3.5 text-xs uppercase tracking-[0.2em] text-fg-fainter">
                <span>{certificate.issuer}</span>
                <span className="text-line-strong">·</span>
                <span>{certificate.year}</span>
                <span className="text-line-strong">·</span>
                <span>{certificate.hours}</span>
              </div>

              <h3 className="font-display text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.06] tracking-[-0.02em] text-fg">
                {certificate.name[locale]}
              </h3>

              <p className="max-w-[52ch] text-[15px] leading-[1.85] text-fg-dim">
                {certificate.description[locale]}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4.5 text-[13px] text-fg-faint">
              <button
                type="button"
                onClick={() => flip(-1)}
                aria-label={copy.previous}
                className="transition-colors hover:text-accent"
              >
                [ &lt; ]
              </button>
              <button
                type="button"
                onClick={() => flip(1)}
                aria-label={copy.next}
                className="transition-colors hover:text-accent"
              >
                [ &gt; ]
              </button>
              <span className="text-moss">
                {format(copy.counter, {
                  current: pad2(carousel.index + 1),
                  total: pad2(CERTIFICATES.length),
                })}
              </span>
              <a
                href={certificate.url}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-1.5 text-accent transition-colors hover:text-fg"
              >
                {copy.openPdf}
              </a>
              <span className="ml-1.5 text-moss">{copy.dragHint}</span>
            </div>
          </div>

          <div
            {...handlers}
            className="relative h-[420px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
          >
            <CertificateStack
              certificates={CERTIFICATES}
              locale={locale}
              activeIndex={carousel.index}
              drag={drag}
              flick={flick}
              flying={flying}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
