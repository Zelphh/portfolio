import { EXPERIENCE } from './experience'
import type { Localized } from '@/i18n/config'
import type { TimelineEntry } from './types'

/** The open-ended line that closes the career tree, on the page and in the terminal. */
export const NEXT_STEP: Localized<string> = {
  pt: 'O próximo passo é com você? 👀',
  en: 'Could the next step be with you? 👀',
}

/**
 * The terminal `timeline`: every job from `EXPERIENCE`, oldest first, then
 * the invitation that closes it. Dates live in `experience.ts`; this only
 * reshapes them.
 */
export const TIMELINE: readonly TimelineEntry[] = [
  ...[...EXPERIENCE].reverse().map(
    ({ company, role, period }): TimelineEntry => ({
      company,
      role,
      period,
      current: false,
    }),
  ),
  {
    company: null,
    role: NEXT_STEP,
    period: null,
    current: true,
  },
]
