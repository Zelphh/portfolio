import type { TimelineEntry } from './types'

export const TIMELINE: readonly TimelineEntry[] = [
  {
    company: 'ambev',
    role: { pt: 'jovem aprendiz', en: 'young apprentice' },
    period: {
      start: { pt: 'jul 2024', en: 'jul 2024' },
      end: { pt: 'set 2025', en: 'sep 2025' },
    },
    current: false,
  },
  {
    company: 'hsp software',
    role: { pt: 'estagiário full stack', en: 'full stack internship' },
    period: {
      start: { pt: 'set 2025', en: 'sep 2025' },
      end: { pt: 'jun 2026', en: 'jun 2026' },
    },
    current: false,
  },
  {
    company: 'hsp software',
    role: {
      pt: 'desenvolvedor full stack jr.',
      en: 'junior full stack developer',
    },
    period: {
      start: { pt: 'jul 2026', en: 'jul 2026' },
      end: { pt: 'atualmente', en: 'present' },
    },
    current: false,
  },
  {
    company: null,
    role: {
      pt: 'o próximo passo é com você? 👀',
      en: 'the next step is up to you? 👀',
    },
    period: null,
    current: true,
  },
]
