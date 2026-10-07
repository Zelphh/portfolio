import { SITE } from '@/content/site'

/**
 * The GitHub contribution calendar, read once at build time.
 *
 * The site is a static export, so there is no request to fetch on: the
 * calendar is as fresh as the last build. It comes from the public HTML
 * fragment GitHub's own profile page loads, which needs no token — the CI
 * build works without a secret, and so does a local one. That fragment is
 * not an API and may change shape; every failure therefore resolves to
 * `null`, and the section simply renders without the graph.
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** `YYYY-MM-DD`, in the calendar's own (UTC-free) date. */
  readonly date: string
  readonly count: number
  /** GitHub's own bucketing, relative to the user's busiest day. */
  readonly level: ContributionLevel
}

export interface ContributionCalendar {
  /** Columns of seven, Sunday first. The first and last may be partial. */
  readonly weeks: readonly (readonly (ContributionDay | null)[])[]
  readonly total: number
  readonly activeDays: number
  readonly longestStreak: number
  /** The most recent day on the calendar, `YYYY-MM-DD`. */
  readonly lastDate: string
}

const DAY_MS = 86_400_000

const CELL = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g
const TOOLTIP = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g

const attribute = (tag: string, name: string) =>
  new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1]

/** `3 contributions on February 8th.` → 3; `No contributions…` → 0. */
const countFrom = (tooltip: string) =>
  Number.parseInt(/^([\d,]+) contributions?/.exec(tooltip)?.[1]?.replace(/,/g, '') ?? '0', 10)

export function parseContributions(html: string): ContributionCalendar | null {
  const counts = new Map<string, number>()
  for (const [, id, text] of html.matchAll(TOOLTIP)) {
    if (id && text) counts.set(id, countFrom(text.trim()))
  }

  const days: ContributionDay[] = []
  for (const [tag, date] of html.matchAll(CELL)) {
    const level = Number(attribute(tag, 'data-level'))
    const id = attribute(tag, 'id')
    if (!date || !(level >= 0 && level <= 4)) continue

    days.push({
      date,
      level: level as ContributionLevel,
      count: (id && counts.get(id)) || 0,
    })
  }

  // The fragment lists cells row by row (all Sundays, then all Mondays…);
  // sorting by date turns that back into a timeline.
  days.sort((a, b) => a.date.localeCompare(b.date))

  const first = days[0]
  const last = days.at(-1)
  if (!first || !last) return null

  const firstTime = Date.parse(first.date)
  const leadingBlanks = new Date(firstTime).getUTCDay()

  const weeks: (ContributionDay | null)[][] = []
  for (const day of days) {
    const slot = leadingBlanks + Math.round((Date.parse(day.date) - firstTime) / DAY_MS)
    const week = (weeks[Math.floor(slot / 7)] ??= Array<ContributionDay | null>(7).fill(null))
    week[slot % 7] = day
  }

  let total = 0
  let activeDays = 0
  let streak = 0
  let longestStreak = 0
  for (const day of days) {
    total += day.count
    if (day.count > 0) {
      activeDays += 1
      streak += 1
      longestStreak = Math.max(longestStreak, streak)
    } else {
      streak = 0
    }
  }

  return { weeks, total, activeDays, longestStreak, lastDate: last.date }
}

export async function fetchContributions(
  user: string = SITE.github,
): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { 'user-agent': SITE.url },
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return null
    return parseContributions(await response.text())
  } catch {
    return null
  }
}
