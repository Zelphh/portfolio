'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { CERTIFICATES } from '@/content/certificates'
import { useDragSwipe } from '@/hooks/use-drag-swipe'
import { useRingCarousel } from '@/hooks/use-ring-carousel'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { pad2 } from '@/lib/utils'
import { CertificateLightbox } from './certificate-lightbox'
import { CertificateStack } from './certificate-stack'

/** How long the discarded card is animated off screen. */
const FLY_MS = 260
/** Pointer travel, in pixels, past which a tap counts as a drag instead of a click. */
const CLICK_SLOP = 6

/**
 * A hand mid-grab, wiggling left and right below the stack. The sheets
 * themselves lost their card frame, so nothing else on screen reads as
 * "grab here" — this is the only cue that the artwork is the drag target.
 */
function DragHandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 13.5V6a1.2 1.2 0 0 1 2.4 0v6" />
      <path d="M10.4 12V4.8a1.2 1.2 0 0 1 2.4 0V12" />
      <path d="M12.8 12V6a1.2 1.2 0 0 1 2.4 0v7" />
      <path d="M15.2 13V9a1.2 1.2 0 0 1 2.4 0v5.5c0 3.6-2.1 6-5.6 6h-.8c-2 0-3.1-.5-4.2-2.1l-2-3c-.6-.9.5-2 1.5-1.3l1.1.9" />
    </svg>
  )
}

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

  const [zoomed, setZoomed] = useState(false)
  const pointerOriginRef = useRef<{ x: number; y: number } | null>(null)
  const draggedRef = useRef(false)

  const openZoom = useCallback(() => {
    if (certificate.image) setZoomed(true)
  }, [certificate.image])

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pointerOriginRef.current = { x: event.clientX, y: event.clientY }
      draggedRef.current = false
      handlers.onPointerDown(event)
    },
    [handlers],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const origin = pointerOriginRef.current
      if (origin && !draggedRef.current) {
        const travelled = Math.hypot(
          event.clientX - origin.x,
          event.clientY - origin.y,
        )
        if (travelled > CLICK_SLOP) draggedRef.current = true
      }
      handlers.onPointerMove(event)
    },
    [handlers],
  )

  const onClick = useCallback(() => {
    if (!draggedRef.current) openZoom()
  }, [openZoom])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openZoom()
      }
    },
    [openZoom],
  )

  // `cert <id>` in the console. A sheet with no scan has nothing to enlarge,
  // so that one only gets dealt to the top of the stack.
  useConsoleSignal('openCertificate', ({ index }) => {
    carousel.goTo(index)
    if (CERTIFICATES[index]?.image) setZoomed(true)
  })

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
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onClick={onClick}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex={0}
            aria-label={copy.enlarge}
            className="relative h-[420px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
          >
            <CertificateStack
              certificates={CERTIFICATES}
              activeIndex={carousel.index}
              drag={drag}
              flick={flick}
              flying={flying}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
            >
              <DragHandIcon className="h-5 w-5 animate-drag-hint text-fg-fainter" />
            </div>
          </div>
        </div>
      </div>

      {zoomed && certificate.image && (
        <CertificateLightbox
          certificate={{ ...certificate, image: certificate.image }}
          locale={locale}
          closeLabel={copy.close}
          onClose={() => setZoomed(false)}
        />
      )}
    </section>
  )
}
