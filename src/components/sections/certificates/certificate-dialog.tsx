'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import type { Certificate } from '@/content/types'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { cn } from '@/lib/utils'
import { KIND_PILL } from './certificate-kind'
import { CertificateLightbox } from './certificate-lightbox'

/** Glyphs the hero's static is drawn from. */
const NOISE = ".,:;'~-_+*"
/** Enough characters to fill the hero at any width it is given. */
const NOISE_LENGTH = 900
/** Inset of the scan inside the hero; matches the image's `p-7`. */
const HERO_PADDING = 28
/** Landscape ratio used when a certificate has no aspect on file. */
const FALLBACK_ASPECT = 3 / 2

/**
 * Where the scan actually sits inside the hero button: the padded box,
 * shrunk to the image's aspect the way `object-contain` does it. The
 * lightbox grows out of exactly this rectangle.
 */
function containedRect(box: DOMRect, aspect: number): DOMRect {
  const width = Math.max(box.width - HERO_PADDING * 2, 1)
  const height = Math.max(box.height - HERO_PADDING * 2, 1)
  const fitWidth = Math.min(width, height * aspect)
  const fitHeight = fitWidth / aspect

  return new DOMRect(
    box.left + (box.width - fitWidth) / 2,
    box.top + (box.height - fitHeight) / 2,
    fitWidth,
    fitHeight,
  )
}

function parseAspect(value: string | undefined): number {
  if (!value) return FALLBACK_ASPECT
  const [width = 0, height = 0] = value.split('/').map((part) => parseFloat(part))
  return width > 0 && height > 0 ? width / height : FALLBACK_ASPECT
}

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
 * in the DOM unread. Built on the same `Modal` as `ProjectDialog`, so the two
 * overlays share one design language. Where there is a scan on file it
 * becomes the hero and clicking it grows it into a lightbox; everything
 * else gets its mark over static.
 */
export function CertificateDialog({
  certificate,
  locale,
  copy,
  onClose,
}: CertificateDialogProps) {
  // The rectangle the lightbox grows from; set means the lightbox is up.
  const [zoomOrigin, setZoomOrigin] = useState<DOMRect | null>(null)

  const noise = useMemo(() => noiseFor(certificate.id), [certificate.id])

  const { image } = certificate

  return (
    <>
      <Modal
        onClose={onClose}
        closeLabel={copy.close}
        path={`~/studies/${certificate.id}.md`}
        width="680px"
        labelledBy="certificate-dialog-title"
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
              onClick={(event) =>
                setZoomOrigin(
                  containedRect(
                    event.currentTarget.getBoundingClientRect(),
                    parseAspect(certificate.imageAspect),
                  ),
                )
              }
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

          <span className="absolute right-0 top-0 rounded-bl-[10px] bg-accent px-4 py-2.5 text-[13px] font-bold text-ink">
            {certificate.year}
          </span>
        </div>

        <div className="grid gap-[18px] px-5 pb-7 pt-6 sm:px-8 sm:pt-[30px]">
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
      </Modal>

      {/* A sibling, not a child: nested inside the dialog, every click that
          dismissed the lightbox would bubble on through React and reach the
          dialog's own handlers too. */}
      {zoomOrigin && image && (
        <CertificateLightbox
          certificate={{ ...certificate, image }}
          locale={locale}
          closeLabel={copy.close}
          origin={zoomOrigin}
          onClose={() => setZoomOrigin(null)}
        />
      )}
    </>
  )
}
