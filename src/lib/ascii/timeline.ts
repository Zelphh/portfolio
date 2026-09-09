import type { TimelineEntry } from '@/content/types'
import type { Locale } from '@/i18n/config'
import { escapeHtml } from './render'

/**
 * The career timeline drawn as a box-drawing tree. Pure: given the same
 * inputs it returns the same markup, so it can render on the server and only
 * needs the client for the blinking cursor on the open-ended last entry.
 */

export const TIMELINE_FPS = 12

const COLORS = {
  accent: '#c8b820',
  rule: '#333',
  dot: '#555',
  date: '#666',
  label: '#888',
  current: '#c8c8c8',
} as const

/** Gap between the date gutter and the rule, plus the glyph and its padding. */
const GLYPH_WIDTH = 4

const span = (text: string, color: string) =>
  `<span style="color:${color}">${escapeHtml(text)}</span>`

export interface TimelineOptions {
  readonly entries: readonly TimelineEntry[]
  readonly locale: Locale
  readonly label: string
  /** Available width in characters, used to size the header rule. */
  readonly width: number
  /** Frame counter; only drives the cursor blink. */
  readonly tick: number
}

/** One printed line: a date in the gutter, a glyph on the rule, then text. */
interface Row {
  readonly date: string
  readonly glyph: string
  readonly glyphColor: string
  readonly text: string
  readonly textColor: string
}

export function buildTimelineHtml({
  entries,
  locale,
  label,
  width,
  tick,
}: TimelineOptions): string {
  const rows: Row[] = []

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1
    const role = entry.role[locale]

    if (isLast) {
      const cursor = entry.current && Math.floor(tick / 18) % 2 === 0 ? '_' : ' '
      rows.push({
        date: '',
        glyph: '→',
        glyphColor: COLORS.accent,
        text: role + cursor,
        textColor: COLORS.accent,
      })
      return
    }

    if (entry.company) {
      rows.push({
        date: entry.period?.start[locale] ?? '',
        glyph: '│',
        glyphColor: COLORS.rule,
        text: entry.company,
        textColor: COLORS.label,
      })
    }

    rows.push({
      date: entry.period?.end[locale] ?? '',
      glyph: entry.current ? '◆' : '·',
      glyphColor: entry.current ? COLORS.accent : COLORS.dot,
      text: role,
      textColor: entry.current ? COLORS.current : COLORS.label,
    })
    rows.push(rule(), rule())
  })

  const gutter = rows.reduce(
    (longest, row) => Math.max(longest, row.date.length),
    0,
  )
  const longestText = rows.reduce(
    (longest, row) => Math.max(longest, row.text.length),
    0,
  )

  /**
   * The gutter only fits on wide columns. When it does not, the dates move
   * under the role they belong to so nothing spills out of the container.
   */
  const inline = gutter + GLYPH_WIDTH + longestText > width

  const lines: string[] = [
    span(`${label} `, COLORS.accent) +
      span('─'.repeat(Math.max(width - label.length - 1, 0)), COLORS.rule),
    '',
  ]

  if (inline) {
    entries.forEach((entry, index) => {
      lines.push(
        ...inlineEntry(entry, index === entries.length - 1, locale, tick),
      )
    })
    return lines.join('\n')
  }

  rows.forEach((row) => {
    lines.push(
      span(row.date.padStart(gutter) + ' ', COLORS.date) +
        span(row.text ? `${row.glyph}  ` : row.glyph, row.glyphColor) +
        span(row.text, row.textColor),
    )
  })

  return lines.join('\n')
}

const rule = (): Row => ({
  date: '',
  glyph: '│',
  glyphColor: COLORS.rule,
  text: '',
  textColor: COLORS.rule,
})

/** Narrow-column layout: the original tree with the dates on their own line. */
function inlineEntry(
  entry: TimelineEntry,
  isLast: boolean,
  locale: Locale,
  tick: number,
): string[] {
  const role = entry.role[locale]
  const lines: string[] = []

  if (isLast) {
    const cursor = entry.current && Math.floor(tick / 18) % 2 === 0 ? '_' : ' '
    lines.push(
      span('   →  ', COLORS.accent) + span(role + cursor, COLORS.accent),
    )
    return lines
  }

  if (entry.company) {
    lines.push(span('   │  ', COLORS.rule) + span(entry.company, COLORS.label))
  }

  lines.push(
    span(
      `   ${entry.current ? '◆' : '·'}  `,
      entry.current ? COLORS.accent : COLORS.dot,
    ) + span(role, entry.current ? COLORS.current : COLORS.label),
  )

  if (entry.period) {
    lines.push(
      span('   │  ', COLORS.rule) +
        span(
          `${entry.period.start[locale]} – ${entry.period.end[locale]}`,
          COLORS.date,
        ),
    )
  }

  lines.push(span('   │', COLORS.rule), span('   │', COLORS.rule))
  return lines
}
