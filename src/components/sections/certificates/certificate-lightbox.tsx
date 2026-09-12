'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { Certificate } from '@/content/types'
import { useEscapeKey } from '@/hooks/use-escape-key'
import type { Locale } from '@/i18n/config'

/** Landscape ratio used when a certificate has no scan, so parsing never fails. */
const FALLBACK_ASPECT = '3 / 2'

interface CertificateLightboxProps {
  /** Only ever mounted for a certificate that has a scan — see the call site. */
  certificate: Certificate & { image: string }
  locale: Locale
  closeLabel: string
  onClose: () => void
}

/**
 * Full-screen preview opened by clicking the stack's front sheet — the same
 * click-to-expand a chat image viewer gives you. Mirrors `ProjectDialog`'s
 * conventions (backdrop, escape key, focus handling) so the two overlays
 * feel like one design language.
 */
export function CertificateLightbox({
  certificate,
  locale,
  closeLabel,
  onClose,
}: CertificateLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEscapeKey(true, onClose)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style

    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [])

  const [width, height] = (certificate.imageAspect ?? FALLBACK_ASPECT)
    .split('/')
    .map((part) => parseFloat(part.trim()))

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="animate-rise fixed inset-0 z-[60] grid place-items-center overflow-y-auto overscroll-contain bg-[rgba(10,10,10,0.84)] p-7 backdrop-blur-[3px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={certificate.name[locale]}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-full cursor-default"
      >
        <Image
          src={certificate.image}
          alt={certificate.name[locale]}
          width={width}
          height={height}
          sizes="92vw"
          className="h-auto max-h-[85vh] w-auto max-w-[92vw] rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -right-3 -top-3 rounded-[10px] border border-line-strong bg-[rgba(20,20,20,0.85)] px-2.5 py-1.5 text-xs text-fg-dim transition-colors hover:text-accent"
        >
          [ x ]
        </button>
      </div>
    </div>
  )
}
