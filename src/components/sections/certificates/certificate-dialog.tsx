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
/** Hero proportions for a scan with no aspect on file. */
const FALLBACK_ASPECT = '3 / 2'

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
 * fills the hero edge to edge and clicking it grows it into a lightbox;
 * everything else gets its institution's logo, or its mark, over static.
 */
export function CertificateDialog({
  certificate,
  locale,
  copy,
  onClose,
}: CertificateDialogProps) {
  // The hero's rectangle, which the lightbox grows from; set means it is up.
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
        <div
          className={cn(
            'relative grid place-items-center overflow-hidden border-b border-line-soft bg-surface-raised',
            image ? 'max-h-[60vh]' : 'h-[clamp(170px,30vh,260px)]',
          )}
          // The hero takes the scan's own proportions, so it fills edge to
          // edge uncropped; only on short viewports does the cap trim it.
          style={image ? { aspectRatio: certificate.imageAspect ?? FALLBACK_ASPECT } : undefined}
        >
          {image ? (
            <button
              type="button"
              onClick={(event) =>
                setZoomOrigin(event.currentTarget.getBoundingClientRect())
              }
              aria-label={copy.enlarge}
              className="group absolute inset-0 cursor-zoom-in"
            >
              <Image
                src={image}
                alt={certificate.name[locale]}
                fill
                sizes="(width >= 40rem) 680px, 100vw"
                className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.02]"
              />
            </button>
          ) : (
            <>
              <pre
                aria-hidden
                className="pointer-events-none absolute inset-0 m-0 select-none overflow-hidden whitespace-pre-wrap break-all px-[18px] py-3.5 text-xs leading-[1.5] text-[#262822]"
              >
                {noise}
              </pre>
              {certificate.logo ? (
                <Image
                  src={certificate.logo}
                  alt={certificate.issuer}
                  width={614}
                  height={499}
                  className="relative h-[clamp(120px,21vh,185px)] w-auto rounded-xl shadow-float"
                />
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
            </>
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
