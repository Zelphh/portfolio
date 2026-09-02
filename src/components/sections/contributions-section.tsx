import { SectionHeading } from '@/components/ui/section-heading'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { buildContributionGrid, HEAT_CLASSES } from '@/lib/contributions'

interface ContributionsSectionProps {
  locale: Locale
  label: string
  copy: Dictionary['contributions']
}

/**
 * Commit heatmap.
 *
 * A Server Component on purpose: the grid is deterministic, so all 371 cells
 * are computed at build time and shipped as static HTML. This section adds
 * exactly zero bytes of JavaScript to the bundle.
 */
export function ContributionsSection({
  locale,
  label,
  copy,
}: ContributionsSectionProps) {
  const { weeks, total, streak } = buildContributionGrid(locale, copy)

  return (
    <section className="px-6 py-24 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-11" />

        <div className="rounded-[15px] border border-line-soft bg-surface p-[30px] pb-6.5">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-5">
            <p className="flex items-baseline gap-3">
              <span className="font-display text-[34px] font-extrabold tracking-[-0.02em] text-fg">
                {total}
              </span>
              <span className="text-[13px] text-fg-subtle">
                {copy.commitsInYear}
              </span>
            </p>
            <span className="text-xs text-fg-fainter">
              {format(copy.streak, { days: streak })}
            </span>
          </div>

          <div className="overflow-x-auto pb-1.5">
            <div className="flex min-w-max gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="grid grid-rows-7 gap-[3px] [grid-auto-rows:12px]"
                >
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      title={day.label || undefined}
                      className={`h-3 w-3 rounded-sm ${
                        day.level === null ? '' : HEAT_CLASSES[day.level]
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[11px] text-fg-fainter">
            <span>{copy.lastTwelveMonths}</span>
            <div className="flex items-center gap-[7px]">
              <span>{copy.less}</span>
              {HEAT_CLASSES.map((heatClass) => (
                <span
                  key={heatClass}
                  aria-hidden
                  className={`h-3 w-3 rounded-sm ${heatClass}`}
                />
              ))}
              <span>{copy.more}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
