'use client'

import { useState, type CSSProperties } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { CERTIFICATES } from '@/content/certificates'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { CertificateCard } from './certificate-card'
import { CertificateDialog } from './certificate-dialog'

/** `[columns, rows]` a tile spans at a breakpoint. */
type Span = readonly [number, number]

/**
 * Per-position spans for the bento, by breakpoint.
 *
 * The twelve-column layout is the composed one: the first entry runs tall
 * down the left, the second sits wide beside it, and the remaining two
 * share the row underneath — twelve columns either way, so no gaps. Two
 * columns only keeps the first tile oversized, and one column (the base,
 * which needs no entry here) makes everything uniform.
 *
 * Entries past the end fall back to the smallest tile, so adding a
 * certificate never breaks the grid — it just joins the back row until
 * someone gives it a span.
 */
const LAYOUT: readonly { readonly sm: Span; readonly lg: Span }[] = [
  { sm: [2, 2], lg: [6, 2] },
  { sm: [1, 1], lg: [6, 1] },
  { sm: [1, 1], lg: [3, 1] },
  { sm: [1, 1], lg: [3, 1] },
]

const FALLBACK_SPAN = { sm: [1, 1], lg: [3, 1] } as const

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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // `cert <id>` in the console opens the same dialog a click would.
  useConsoleSignal('openCertificate', ({ index }) => setOpenIndex(index))

  const open = openIndex === null ? undefined : CERTIFICATES[openIndex]

  return (
    <section
      id="certificados"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-[18px]" />

        <p className="mb-10 max-w-[56ch] text-pretty text-sm leading-[1.8] text-fg-faint">
          {copy.intro}
        </p>

        <div className="study-grid">
          {CERTIFICATES.map((certificate, index) => {
            const { sm, lg } = LAYOUT[index] ?? FALLBACK_SPAN

            return (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                locale={locale}
                kindLabel={copy.kinds[certificate.kind]}
                featured={lg[1] > 1}
                span={
                  {
                    '--study-col-sm': sm[0],
                    '--study-row-sm': sm[1],
                    '--study-col-lg': lg[0],
                    '--study-row-lg': lg[1],
                  } as CSSProperties
                }
                onOpen={() => setOpenIndex(index)}
              />
            )
          })}
        </div>
      </div>

      {open && (
        <CertificateDialog
          certificate={open}
          locale={locale}
          copy={copy}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  )
}
