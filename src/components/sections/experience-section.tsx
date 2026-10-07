import { SectionHeading } from '@/components/ui/section-heading'
import { EXPERIENCE } from '@/content/experience'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { cn } from '@/lib/utils'

interface ExperienceSectionProps {
  locale: Locale
  label: string
  copy: Dictionary['experience']
}

/**
 * Work history in full. The about section's timeline is the glance; this is
 * the read — every job with what it involved, newest first, laid out like a
 * log: the period in a gutter, the entry beside it. Static, so it ships as
 * plain HTML.
 */
export function ExperienceSection({
  locale,
  label,
  copy,
}: ExperienceSectionProps) {
  return (
    <section
      id="experiencia"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-11" />

        <ol className="grid">
          {EXPERIENCE.map((job) => {
            const highlights = job.highlights[locale]

            return (
              <li
                key={job.id}
                className="grid gap-x-10 gap-y-3 border-b border-dashed border-line py-8 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[220px_minmax(0,1fr)]"
              >
                <p
                  className={cn(
                    'text-[13px] tracking-[0.08em] md:whitespace-nowrap md:pt-1.5',
                    job.current ? 'text-accent' : 'text-fg-fainter',
                  )}
                >
                  {job.period.start[locale]}
                  <span className="text-line-bright"> → </span>
                  {job.period.end[locale]}
                </p>

                <div className="grid gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-display text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-fg">
                      {job.company}
                    </h3>
                    <span className="text-[15px] text-fg-dim">
                      {job.role[locale]}
                    </span>
                    {job.current && (
                      <span className="rounded-md border border-accent-dim px-2 py-[3px] text-[10px] uppercase tracking-[0.22em] text-accent">
                        {copy.current}
                      </span>
                    )}
                  </div>

                  {highlights.length > 0 && (
                    <ul className="grid max-w-[72ch] gap-1.5 text-[15px] leading-[1.8] text-fg-muted">
                      {highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span aria-hidden className="text-moss-light">
                            ›
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {job.stack.length > 0 && (
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {job.stack.map((tool) => (
                        <li
                          key={tool}
                          className="rounded-full border border-line-strong px-2.5 py-[5px] text-[11px] tracking-[0.12em] text-fg-subtle"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
