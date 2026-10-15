import type { ReactNode } from 'react'
import { GrassArt } from '@/components/ascii'
import { SectionHeading } from '@/components/ui/section-heading'
import type { Dictionary } from '@/i18n/types'

interface AboutSectionProps {
  copy: Dictionary['about']
  label: string
  grassLabel: string
  /** Right-hand column, beside the bio — the career tree. */
  children: ReactNode
}

/**
 * Bio on the left, the career tree on the right. The two only stack on
 * narrow screens, where half a column is too thin to read.
 */
export function AboutSection({
  copy,
  label,
  grassLabel,
  children,
}: AboutSectionProps) {
  return (
    <section
      id="sobre"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1180px] items-start gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="min-w-0">
          <SectionHeading label={label} className="mb-11" />

          <div className="max-w-[66ch] text-[17px] leading-[1.95] text-fg-muted">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {children}
      </div>

      <div className="pointer-events-none -mx-6 -mb-24 mt-[-46px] lg:-mx-10 lg:-mb-28">
        <GrassArt label={grassLabel} />
      </div>
    </section>
  )
}
