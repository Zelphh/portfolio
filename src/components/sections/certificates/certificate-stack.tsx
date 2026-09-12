'use client'

import Image from 'next/image'
import type { Certificate } from '@/content/types'
import type { DragState } from '@/hooks/use-drag-swipe'
import { mod } from '@/lib/utils'

/** Landscape ratio used for certificates with no scan on file yet. */
const PLACEHOLDER_ASPECT = '3 / 2'

interface CertificateStackProps {
  certificates: readonly Certificate[]
  activeIndex: number
  drag: DragState
  /** -1 when the top card flies left, +1 when it flies right. */
  flick: 1 | -1
  /** True while the discarded card is still animating away. */
  flying: boolean
}

/**
 * The physical-feeling sheet stack. Each certificate is drawn at its own
 * aspect ratio with no frame around it — a scan on a shadow, not a card —
 * so nothing is cropped to fit a fixed box. Every sheet's resting transform
 * is derived from its depth, and the top one follows the pointer by
 * swapping that transform for the live drag offset, with transitions
 * disabled so it tracks 1:1.
 */
export function CertificateStack({
  certificates,
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

        const centering = 'translate(-50%, -50%)'
        const resting = `${centering} translateX(${depth * 16}px) translateY(${depth * -6}px) rotate(${depth * 3.5}deg) scale(${1 - depth * 0.05})`
        const transform = isLeaving
          ? `${centering} translateX(${flick * 150}%) rotate(${flick * 14}deg) scale(0.9)`
          : isFront && drag.dragging
            ? `${centering} translate(${drag.x}px, ${drag.y}px) rotate(${(drag.x * 0.045).toFixed(2)}deg)`
            : resting

        return (
          <article
            key={certificate.id}
            aria-hidden={!isFront}
            className="absolute left-1/2 top-1/2 w-[300px] overflow-hidden rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            style={{
              aspectRatio: certificate.imageAspect ?? PLACEHOLDER_ASPECT,
              zIndex: count - depth,
              opacity: isLeaving ? 0 : Math.max(1 - depth * 0.16, 0.35),
              transform,
              transition:
                drag.dragging && isFront
                  ? 'none'
                  : 'transform 500ms var(--ease-out-soft), opacity 400ms',
            }}
          >
            {certificate.image ? (
              <Image
                src={certificate.image}
                alt=""
                fill
                sizes="300px"
                className="object-contain"
              />
            ) : (
              <div className="grid h-full place-items-center bg-[#f5f4ef] text-[11px] tracking-[0.2em] text-[#8a8a82]">
                PDF
              </div>
            )}
          </article>
        )
      })}
    </>
  )
}
