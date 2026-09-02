'use client'

import type { Certificate } from '@/content/types'
import type { DragState } from '@/hooks/use-drag-swipe'
import type { Locale } from '@/i18n/config'
import { mod } from '@/lib/utils'

/** Card backgrounds by stack depth; deeper cards sink into the page. */
const DEPTH_BACKGROUNDS = ['#1b1c18', '#191a16', '#171814', '#151612'] as const

interface CertificateStackProps {
  certificates: readonly Certificate[]
  locale: Locale
  activeIndex: number
  drag: DragState
  /** -1 when the top card flies left, +1 when it flies right. */
  flick: 1 | -1
  /** True while the discarded card is still animating away. */
  flying: boolean
}

/**
 * The physical-feeling card stack. Every card's resting transform is derived
 * from its depth, so adding a certificate needs no layout change — and the
 * top card follows the pointer by swapping that transform for the live drag
 * offset, with transitions disabled so it tracks 1:1.
 */
export function CertificateStack({
  certificates,
  locale,
  activeIndex,
  drag,
  flick,
  flying,
}: CertificateStackProps) {
  const count = certificates.length

  return (
    <>
      {certificates.map((certificate, index) => {
        const depth = mod(index - activeIndex, count)
        const isFront = depth === 0
        const isLeaving = depth === count - 1 && flying

        const resting = `translateX(${depth * 16}px) translateY(${depth * -6}px) rotate(${depth * 3.5}deg) scale(${1 - depth * 0.05})`
        const transform = isLeaving
          ? `translateX(${flick * 150}%) rotate(${flick * 14}deg) scale(0.9)`
          : isFront && drag.dragging
            ? `translate(${drag.x}px, ${drag.y}px) rotate(${(drag.x * 0.045).toFixed(2)}deg)`
            : resting

        return (
          <article
            key={certificate.id}
            aria-hidden={!isFront}
            className="absolute left-1/2 top-1/2 -ml-[135px] -mt-[180px] grid h-[360px] w-[270px] grid-rows-[auto_1fr_auto] rounded-[15px] border border-line-strong p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            style={{
              background:
                DEPTH_BACKGROUNDS[Math.min(depth, DEPTH_BACKGROUNDS.length - 1)],
              zIndex: count - depth,
              opacity: isLeaving ? 0 : Math.max(1 - depth * 0.16, 0.35),
              transform,
              transition:
                drag.dragging && isFront
                  ? 'none'
                  : 'transform 500ms var(--ease-out-soft), opacity 400ms',
            }}
          >
            <header className="flex justify-between text-[10px] uppercase tracking-[0.18em] text-fg-fainter">
              <span>{certificate.issuer}</span>
              <span>{certificate.year}</span>
            </header>

            <div className="my-4 grid place-items-center border border-dashed border-[#3a3d34] text-[11px] tracking-[0.2em] text-[#55584f]">
              PDF
            </div>

            <p className="text-xs leading-[1.5] text-fg-muted">
              {certificate.name[locale]}
            </p>
          </article>
        )
      })}
    </>
  )
}
