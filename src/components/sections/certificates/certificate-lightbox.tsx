'use client'

import Image from 'next/image'
import { Modal } from '@/components/ui/modal'
import type { Certificate } from '@/content/types'
import type { Locale } from '@/i18n/config'

/** Landscape ratio used when a certificate has no scan, so parsing never fails. */
const FALLBACK_ASPECT = '3 / 2'

interface CertificateLightboxProps {
  /** Only ever mounted for a certificate that has a scan — see the call site. */
  certificate: Certificate & { image: string }
  locale: Locale
  closeLabel: string
  /** Where the scan sits in the dialog's hero; the preview grows out of it. */
  origin: DOMRect
  onClose: () => void
}

/**
 * Full-screen preview of a scan, opened by clicking the hero inside
 * `CertificateDialog` — the same click-to-expand a chat image viewer gives
 * you. It grows out of the thumbnail and shrinks back into it on close, and
 * as a second `<dialog>` it stacks above the first and takes escape for
 * itself while it is up.
 */
export function CertificateLightbox({
  certificate,
  locale,
  closeLabel,
  origin,
  onClose,
}: CertificateLightboxProps) {
  const [width, height] = (certificate.imageAspect ?? FALLBACK_ASPECT)
    .split('/')
    .map((part) => parseFloat(part.trim()))

  return (
    <Modal
      variant="lightbox"
      onClose={onClose}
      closeLabel={closeLabel}
      origin={origin}
      label={certificate.name[locale]}
    >
      <Image
        src={certificate.image}
        alt={certificate.name[locale]}
        width={width}
        height={height}
        sizes="92vw"
        className="block h-auto max-h-[85vh] w-auto max-w-[92vw] rounded-sm shadow-float"
      />
    </Modal>
  )
}
