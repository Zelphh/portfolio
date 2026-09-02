import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import type { Locale } from '@/i18n/config'

/**
 * The GitHub-style contribution heatmap.
 *
 * The data is generated from a fixed seed and a fixed reference date, which
 * makes it deterministic: the same grid comes out of every build, on every
 * machine, in every timezone. That is what lets the whole section render on
 * the server and ship as plain HTML with zero client-side JavaScript.
 *
 * Swapping in the real GitHub API later means replacing `generateDays` — the
 * shape returned by `buildContributionGrid` stays the same.
 */

const WEEKS = 53
const DAYS_PER_WEEK = 7
const SEED = 20_260_827
/** Last day shown on the grid, in UTC so builds never drift by a timezone. */
const REFERENCE_DATE = Date.UTC(2026, 7, 27)

const DAY_MS = 86_400_000

/** Tailwind classes for heat levels 0-4; written out so the JIT can see them. */
export const HEAT_CLASSES = [
  'bg-heat-0',
  'bg-heat-1',
  'bg-heat-2',
  'bg-heat-3',
  'bg-heat-4',
] as const

export type HeatLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** `null` for days after the reference date — rendered as a blank cell. */
  readonly level: HeatLevel | null
  readonly label: string
}

export interface ContributionGrid {
  readonly weeks: ReadonlyArray<{ readonly days: readonly ContributionDay[] }>
  readonly total: string
  readonly streak: number
}

const INTL_LOCALES: Readonly<Record<Locale, string>> = {
  pt: 'pt-BR',
  en: 'en-US',
}

/** Linear congruential generator — small, fast and reproducible. */
function createRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function toLevel(count: number): HeatLevel {
  if (count === 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 10) return 3
  return 4
}

export function buildContributionGrid(
  locale: Locale,
  dictionary: Dictionary['contributions'],
): ContributionGrid {
  const random = createRandom(SEED)
  const referenceWeekday = new Date(REFERENCE_DATE).getUTCDay()
  const startDate =
    REFERENCE_DATE - (WEEKS * DAYS_PER_WEEK - 1 + referenceWeekday) * DAY_MS

  const dateFormatter = new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  })

  const weeks: Array<{ days: ContributionDay[] }> = []
  let total = 0
  let streak = 0

  for (let week = 0; week < WEEKS; week++) {
    const days: ContributionDay[] = []

    for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday++) {
      const timestamp = startDate + (week * DAYS_PER_WEEK + weekday) * DAY_MS

      if (timestamp > REFERENCE_DATE) {
        days.push({ level: null, label: '' })
        continue
      }

      // Weekends are quieter, and busy days are busier on weekdays.
      const isWeekend = weekday === 0 || weekday === DAYS_PER_WEEK - 1
      const roll = random()
      const count =
        roll > (isWeekend ? 0.62 : 0.24)
          ? 1 + Math.floor(random() * (isWeekend ? 5 : 13))
          : 0

      total += count
      streak = count > 0 ? streak + 1 : 0

      const date = dateFormatter.format(new Date(timestamp))
      days.push({
        level: toLevel(count),
        label:
          count === 0
            ? format(dictionary.noCommits, { date })
            : format(dictionary.someCommits, { date, count }),
      })
    }

    weeks.push({ days })
  }

  return {
    weeks,
    total: total.toLocaleString(INTL_LOCALES[locale]),
    streak,
  }
}
