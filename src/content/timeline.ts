import { EXPERIENCE } from './experience'
import type { TimelineEntry } from './types'

/**
 * The about section's ASCII career tree: every job from `EXPERIENCE`, oldest
 * first, then the open-ended invitation that closes it. Dates live in
 * `experience.ts`; this only reshapes them.
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
    role: {
      pt: 'O próximo passo é com você? 👀',
      en: 'The next step is up to you? 👀',
    },
    period: null,
    current: true,
  },
]
