import { CoffeeArt } from '@/components/ascii'
import { SectionHeading } from '@/components/ui/section-heading'
import type { Dictionary } from '@/i18n/types'

interface AboutSectionProps {
  copy: Dictionary['about']
  label: string
  coffeeLabel: string
}

/**
 * The bio, with the coffee cup beside it. The cup only appears once there
 * is room for a second column; on narrow screens it would just push the
 * text further down.
 */
export function AboutSection({ copy, label, coffeeLabel }: AboutSectionProps) {
  return (
    <section
      id="sobre"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[73.75rem]">
        <SectionHeading label={label} className="mb-11" />

        <div className="grid items-stretch gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="max-w-[66ch] text-[1.0625rem] leading-[1.95] text-fg-muted">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <CoffeeArt
            label={coffeeLabel}
            className="hidden min-h-[16.25rem] cursor-crosshair md:block"
          />
        </div>
      </div>
    </section>
  )
}
