import type { TimelineEntry } from './types'

export const TIMELINE: readonly TimelineEntry[] = [
  {
    company: 'Ambev',
    role: { pt: 'Jovem aprendiz', en: 'Young apprentice' },
    period: {
      start: { pt: 'Jul 2024', en: 'Jul 2024' },
      end: { pt: 'Set 2025', en: 'Sep 2025' },
    },
    current: false,
  },
  {
    company: 'HSP Software',
    role: { pt: 'Estagiário full stack', en: 'Full stack internship' },
    period: {
      start: { pt: 'Set 2025', en: 'Sep 2025' },
      end: { pt: 'Jun 2026', en: 'Jun 2026' },
    },
    current: false,
  },
  {
    company: 'HSP Software',
    role: {
      pt: 'Desenvolvedor full stack jr.',
      en: 'Junior full stack developer',
    },
    period: {
      start: { pt: 'Jul 2026', en: 'Jul 2026' },
      end: { pt: 'Atualmente', en: 'Present' },
    },
    current: false,
  },
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
