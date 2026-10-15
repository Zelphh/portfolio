import { SectionHeading } from '@/components/ui/section-heading'
import { EXPERIENCE } from '@/content/experience'
import { NEXT_STEP } from '@/content/timeline'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { cn } from '@/lib/utils'

interface ExperienceLogProps {
  locale: Locale
  label: string
  copy: Dictionary['experience']
}

/** Shared by every node on the rule, so the glyphs line up with the period. */
const NODE =
  'absolute left-0 top-0 -translate-x-1/2 bg-ink px-1 text-[13px] leading-[1.5]'

/**
 * Work history as a career tree, the right-hand column of the about section:
 * every job hangs off one dashed rule, newest first, with the current one
 * marked and an open invitation closing the tree. Keeps its own id so nav,
 * `goto` and deep links still land on it once the columns stack. Static
 * apart from a CSS cursor blink, so it ships as plain HTML.
 */
export function ExperienceLog({ locale, label, copy }: ExperienceLogProps) {
  return (
    <div id="experiencia" className="min-w-0">
      <SectionHeading label={label} className="mb-11" />

      <ol className="ml-1.5 grid">
        {EXPERIENCE.map((job) => {
          const highlights = job.highlights[locale]

          return (
            <li
              key={job.id}
              className="relative grid gap-3 border-l border-dashed border-line-bright pb-12 pl-8"
            >
              <span
                aria-hidden
                className={cn(
                  NODE,
                  job.current ? 'text-accent' : 'text-fg-fainter',
                )}
              >
                {job.current ? '◆' : '·'}
              </span>

              <p
                className={cn(
                  'text-[13px] leading-[1.5] tracking-[0.08em]',
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

        <li className="relative pl-8 text-[15px] leading-[1.3] text-accent">
          <span aria-hidden className={NODE}>
            →
          </span>
          {NEXT_STEP[locale]}
          <span aria-hidden className="animate-blink">
            _
          </span>
        </li>
      </ol>
    </div>
  )
}
