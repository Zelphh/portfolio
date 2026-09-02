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
  label: '#888',
  current: '#c8c8c8',
} as const

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

export function buildTimelineHtml({
  entries,
  locale,
  label,
  width,
  tick,
}: TimelineOptions): string {
  const ruleLength = Math.max(width - label.length - 1, 0)
  const lines: string[] = [
    span(`${label} `, COLORS.accent) + span('─'.repeat(ruleLength), COLORS.rule),
    '',
  ]

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1
    const role = entry.role[locale]

    if (entry.company) {
      lines.push(
        span(`   ${isLast ? ' ' : '│'}  `, COLORS.rule) +
          span(entry.company, COLORS.label),
      )
    }

    if (isLast) {
      const cursor = entry.current && Math.floor(tick / 18) % 2 === 0 ? '_' : ' '
      lines.push(
        span('   →  ', COLORS.accent) +
          span(role, COLORS.accent) +
          span(cursor, COLORS.accent),
      )
      return
    }

    lines.push(
      span(`   ${entry.current ? '◆' : '·'}  `, entry.current ? COLORS.accent : COLORS.dot) +
        span(role, entry.current ? COLORS.current : COLORS.label),
    )
    lines.push(span('   │', COLORS.rule), span('   │', COLORS.rule))
  })

  return lines.join('\n')
}
