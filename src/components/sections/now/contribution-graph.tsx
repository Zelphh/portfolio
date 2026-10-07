import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import type { ContributionCalendar, ContributionLevel } from '@/lib/github'

/** Literal class names, so Tailwind can see every one of them. */
const HEAT: Readonly<Record<ContributionLevel, string>> = {
  0: 'bg-heat-0',
  1: 'bg-heat-1',
  2: 'bg-heat-2',
  3: 'bg-heat-3',
  4: 'bg-heat-4',
}

const LEVELS = [0, 1, 2, 3, 4] as const

/**
 * Cell edge and gap. The edge is a CSS variable so it can grow on wide
 * screens, where the year fits without scrolling; month labels share the
 * same column track, so they grow with it.
 */
const CELL = 'var(--cell)'
const GAP = 3

/** A month label needs about this many columns before the next one fits. */
const LABEL_COLUMNS = 3

const TAGS: Readonly<Record<Locale, string>> = { pt: 'pt-BR', en: 'en-US' }

/** `out.` → `Out`, `Oct` → `Oct`. */
const tidy = (label: string) =>
  label.charAt(0).toUpperCase() + label.slice(1).replace(/\.$/, '')

interface ContributionGraphProps {
  calendar: ContributionCalendar
  locale: Locale
  copy: Dictionary['now']
  label: string
}

/**
 * The year of commits as a GitHub-style grid: one column per week, Sunday
 * on top. A server component — the calendar is fixed at build time, so the
 * 371 cells ship as plain HTML with no script behind them.
 *
 * Narrow screens scroll it sideways inside its own box. The scroller is
 * `dir="rtl"` so it opens on the most recent weeks rather than a year ago,
 * with the grid itself set back to `ltr`.
 */
export function ContributionGraph({
  calendar,
  locale,
  copy,
  label,
}: ContributionGraphProps) {
  const tag = TAGS[locale]
  const dayFormat = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const monthFormat = new Intl.DateTimeFormat(tag, {
    month: 'short',
    timeZone: 'UTC',
  })
  const plural = new Intl.PluralRules(tag)

  const { weeks } = calendar

  // A label goes on the first week whose Sunday-or-first day starts a new
  // month, unless the previous label is still too close to fit beside it.
  const months: { column: number; text: string }[] = []
  let previousMonth = ''
  weeks.forEach((week, column) => {
    const day = week.find((cell) => cell !== null)
    if (!day) return
    const month = day.date.slice(0, 7)
    if (month === previousMonth) return
    previousMonth = month

    const last = months.at(-1)
    if (last && column - last.column < LABEL_COLUMNS) months.pop()
    if (column > weeks.length - LABEL_COLUMNS) return
    months.push({
      column,
      text: tidy(monthFormat.format(Date.parse(day.date))),
    })
  })

  const track = `repeat(${weeks.length}, ${CELL})`

  const stats = [
    { label: copy.total, value: calendar.total.toLocaleString(tag) },
    { label: copy.activeDays, value: calendar.activeDays.toLocaleString(tag) },
    {
      label: copy.longestStreak,
      value: `${calendar.longestStreak} ${copy.days[plural.select(calendar.longestStreak) === 'one' ? 'one' : 'other']}`,
    },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
      <div className="min-w-0">
        <div
          dir="rtl"
          className="scrollbar-thin w-fit max-w-full overflow-x-auto pb-2 [--cell:11px] xl:[--cell:14px]"
        >
          <div dir="ltr" className="w-max">
            <div
              aria-hidden
              className="mb-2 grid text-[10px] text-fg-fainter"
              style={{ gridTemplateColumns: track, columnGap: GAP }}
            >
              {months.map(({ column, text }) => (
                <span
                  key={column}
                  className="whitespace-nowrap"
                  style={{ gridColumn: `${column + 1} / span ${LABEL_COLUMNS}` }}
                >
                  {text}
                </span>
              ))}
            </div>

            <div
              role="img"
              aria-label={label}
              className="grid grid-flow-col"
              style={{
                gridTemplateRows: `repeat(7, ${CELL})`,
                gridAutoColumns: CELL,
                gap: GAP,
              }}
            >
              {weeks.flatMap((week, column) =>
                week.map((day, row) =>
                  day ? (
                    <span
                      key={day.date}
                      title={format(copy.dayTitle, {
                        date: dayFormat.format(Date.parse(day.date)),
                        count: day.count,
                      })}
                      className={`rounded-[2px] ${HEAT[day.level]}`}
                    />
                  ) : (
                    <span key={`${column}-${row}`} />
                  ),
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-fg-fainter">
          <span>
            {format(copy.range, {
              date: dayFormat.format(Date.parse(calendar.lastDate)),
            })}
          </span>
          <span aria-hidden className="flex items-center gap-1.5">
            {copy.less}
            {LEVELS.map((level) => (
              <span
                key={level}
                className={`inline-block rounded-[2px] ${HEAT[level]}`}
                style={{ width: 11, height: 11 }}
              />
            ))}
            {copy.more}
          </span>
        </div>
      </div>

      <dl className="flex flex-wrap gap-x-10 gap-y-5 lg:grid lg:gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="grid gap-1">
            <dt className="text-[10px] uppercase tracking-[0.22em] text-fg-fainter">
              {stat.label}
            </dt>
            <dd className="whitespace-nowrap font-display text-[26px] font-extrabold leading-none tracking-[-0.02em] text-fg">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
