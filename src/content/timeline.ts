import type { TimelineEntry } from './types'

export const TIMELINE: readonly TimelineEntry[] = [
  {
    company: 'ambev',
    role: { pt: 'jovem aprendiz', en: 'young apprentice' },
    current: false,
  },
  {
    company: 'hsp software',
    role: { pt: 'estagiário full stack', en: 'full stack internship' },
    current: false,
  },
  {
    company: 'hsp software',
    role: {
      pt: 'desenvolvedor full stack jr.',
      en: 'junior full stack developer',
    },
    current: false,
  },
  {
    company: null,
    role: {
      pt: 'o próximo passo é com você? 👀',
      en: 'the next step is up to you? 👀',
    },
    current: true,
  },
]
