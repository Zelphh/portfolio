import { GrassArt, TimelineArt } from '@/components/ascii'
import { SectionHeading } from '@/components/ui/section-heading'
import { TIMELINE } from '@/content/timeline'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'

interface AboutSectionProps {
  locale: Locale
  copy: Dictionary['about']
  label: string
  timelineLabel: string
  grassLabel: string
}

export function AboutSection({
  locale,
  copy,
  label,
  timelineLabel,
  grassLabel,
}: AboutSectionProps) {
  return (
    <section
      id="sobre"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-11" />

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
          <div className="max-w-[66ch] text-[17px] leading-[1.95] text-fg-muted">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="min-w-0">
            <TimelineArt
              entries={TIMELINE}
              locale={locale}
              label={timelineLabel}
              heading={copy.timelineLabel}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none -mx-6 -mb-24 mt-[-46px] lg:-mx-10 lg:-mb-28">
        <GrassArt label={grassLabel} />
      </div>
    </section>
  )
}
