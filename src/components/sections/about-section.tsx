import type { ReactNode } from 'react'
import { CoffeeArt, GrassArt } from '@/components/ascii'
import { SectionHeading } from '@/components/ui/section-heading'
import type { Dictionary } from '@/i18n/types'

interface AboutSectionProps {
  copy: Dictionary['about']
  label: string
  grassLabel: string
  coffeeLabel: string
  /** Right-hand column, beside the bio — the career tree. */
  children: ReactNode
}

/**
 * Bio on the left, the career tree on the right. The two only stack on
 * narrow screens, where half a column is too thin to read.
 *
 * The bio is much shorter than the tree beside it, so the column it leaves
 * behind is given to the coffee cup: the columns stretch, and the art takes
 * whatever height the paragraphs did not. That space only exists once the
 * two sit side by side, which is why the cup is not drawn while they are
 * stacked — there would be nothing for it to fill.
 */
export function AboutSection({
  copy,
  label,
  grassLabel,
  coffeeLabel,
  children,
}: AboutSectionProps) {
  return (
    <section
      id="sobre"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1180px] items-start gap-16 md:grid-cols-2 md:items-stretch md:gap-10 lg:gap-16">
        <div className="flex min-w-0 flex-col">
          <SectionHeading label={label} className="mb-11" />

          <div className="max-w-[66ch] text-[17px] leading-[1.95] text-fg-muted">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <CoffeeArt
            label={coffeeLabel}
            className="mt-12 hidden min-h-[260px] grow cursor-crosshair md:block"
          />
        </div>

        {children}
      </div>

      <div className="pointer-events-none -mx-6 -mb-24 mt-[-46px] lg:-mx-10 lg:-mb-28">
        <GrassArt label={grassLabel} />
      </div>
    </section>
  )
}
