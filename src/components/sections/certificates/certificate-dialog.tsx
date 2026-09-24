'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Certificate } from '@/content/types'
import { useEscapeKey } from '@/hooks/use-escape-key'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { cn } from '@/lib/utils'
import { KIND_PILL } from './certificate-kind'
import { CertificateLightbox } from './certificate-lightbox'

/** Glyphs the hero's static is drawn from. */
const NOISE = ".,:;'~-_+*"
/** Enough characters to fill the hero at any width it is given. */
const NOISE_LENGTH = 900

/**
 * Deterministic static for the hero, seeded by the entry so each one gets
 * its own pattern and the same entry always gets the same one — a random
 * fill would reshuffle on every re-render.
 */
function noiseFor(seed: string): string {
  const offset = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return Array.from(
    { length: NOISE_LENGTH },
    (_, k) => NOISE[(k * 7 + k * k * 3 + offset) % NOISE.length],
  ).join('')
}

interface CertificateDialogProps {
  certificate: Certificate
  locale: Locale
  copy: Dictionary['certificates']
  onClose: () => void
}

/**
 * Full write-up for one study.
 *
 * Mounted only while open, so the long-form copy for every entry never sits
 * in the DOM unread. Mirrors `ProjectDialog`'s conventions — backdrop,
 * escape key, focus handling — so the two overlays feel like one design
 * language. Where there is a scan on file it becomes the hero and clicking
 * it enlarges it; everything else gets its mark over static.
 */
export function CertificateDialog({
  certificate,
  locale,
  copy,
  onClose,
}: CertificateDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [zoomed, setZoomed] = useState(false)

  const noise = useMemo(() => noiseFor(certificate.id), [certificate.id])

  // The lightbox owns escape while it is up, so this only closes the dialog
  // once nothing is stacked on top of it.
  useEscapeKey(!zoomed, onClose)

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

  const { image } = certificate

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        className="fixed inset-0 z-[60] grid animate-rise place-items-center overflow-y-auto overscroll-contain bg-[rgba(10,10,10,0.84)] p-5 backdrop-blur-[3px]"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-dialog-title"
          onClick={(event) => event.stopPropagation()}
          className="relative max-h-full w-[min(680px,100%)] cursor-default overflow-y-auto overscroll-contain rounded-[15px] border border-line-strong bg-surface"
        >
          <div className="relative grid h-[clamp(170px,30vh,260px)] place-items-center overflow-hidden border-b border-line-soft bg-surface-raised">
            <pre
              aria-hidden
              className="pointer-events-none absolute inset-0 m-0 select-none overflow-hidden whitespace-pre-wrap break-all px-[18px] py-3.5 text-xs leading-[1.5] text-[#262822]"
            >
              {noise}
            </pre>

            {image ? (
              <button
                type="button"
                onClick={() => setZoomed(true)}
                aria-label={copy.enlarge}
                className="relative h-full w-full cursor-zoom-in"
              >
                <Image
                  src={image}
                  alt={certificate.name[locale]}
                  fill
                  sizes="680px"
                  className="object-contain p-7 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                />
              </button>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element --
                 Local SVG: the optimizer has nothing to do with a 1 kB
                 vector, and would only add a request through /_next/image. */
              <img
                src={certificate.icon}
                alt=""
                aria-hidden
                className="relative block h-24 w-24"
              />
            )}

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="absolute left-[18px] top-4 rounded-[10px] border border-line-strong bg-[rgba(20,20,20,0.7)] px-2.5 py-1.5 text-xs text-fg-dim transition-colors hover:text-accent"
            >
              [ x ]
            </button>

            <span className="absolute right-0 top-0 rounded-bl-[10px] bg-accent px-4 py-2.5 text-[13px] font-bold text-ink">
              {certificate.year}
            </span>
          </div>

          <div className="grid gap-[18px] px-8 pb-7 pt-[30px]">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-fg-fainter">
              <span
                className={cn(
                  'rounded-md border px-2 py-[3px]',
                  KIND_PILL[certificate.kind],
                )}
              >
                {copy.kinds[certificate.kind]}
              </span>
              <span>{certificate.issuer}</span>
              {certificate.hours && (
                <>
                  <span className="text-line-strong">·</span>
                  <span>{certificate.hours}</span>
                </>
              )}
            </div>

            <h3
              id="certificate-dialog-title"
              className="text-balance font-display text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-fg"
            >
              {certificate.name[locale]}
            </h3>

            <div className="grid gap-4 text-pretty text-[15px] leading-[1.9] text-fg-dim">
              {certificate.story[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ul className="flex flex-wrap gap-2">
              {certificate.topics[locale].map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-line-strong px-2.5 py-[5px] text-[11px] tracking-[0.12em] text-fg-subtle"
                >
                  {topic}
                </li>
              ))}
            </ul>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-line pt-[18px]">
              <span className="text-xs text-fg-ghost">
                {certificate.url ? copy.certNote : copy.noCert}
              </span>
              {certificate.url && (
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[13px] text-accent transition-colors hover:text-fg"
                >
                  {copy.openCertificate}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* A sibling, not a child: nested inside the backdrop, every click that
          dismissed the lightbox would bubble on and close the dialog too. */}
      {zoomed && image && (
        <CertificateLightbox
          certificate={{ ...certificate, image }}
          locale={locale}
          closeLabel={copy.close}
          onClose={() => setZoomed(false)}
        />
      )}
    </>
  )
}
