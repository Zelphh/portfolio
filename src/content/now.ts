import type { Localized } from '@/i18n/config'
import type { NowEntry } from './types'

/**
 * The "now" page: what is on the desk this month. Short on purpose — it is
 * meant to be rewritten, not maintained — and `NOW_UPDATED` is bumped with
 * every rewrite so a stale list admits it.
 */
export const NOW_UPDATED: Localized<string> = { pt: 'Out 2026', en: 'Oct 2026' }

export const NOW: readonly NowEntry[] = [
  {
    id: 'work',
    label: { pt: 'Trabalhando', en: 'Working' },
    text: {
      pt: 'Como desenvolvedor full stack jr. na HSP Software, com Node, React e Postgres, e cuidando de CI/CD e Docker no caminho.',
      en: 'As a junior full stack developer at HSP Software, with Node, React and Postgres, and looking after CI/CD and Docker along the way.',
    },
  },
  {
    id: 'building',
    label: { pt: 'Construindo', en: 'Building' },
    text: {
      pt: 'A camada de IA do WhatsRecap: embeddings, RAG e um modelo de linguagem rodando local, sem nada sair da máquina.',
      en: "WhatsRecap's AI layer: embeddings, RAG and a language model running locally, with nothing leaving the machine.",
    },
  },
  {
    id: 'learning',
    label: { pt: 'Aprendendo', en: 'Learning' },
    text: {
      pt: 'Rust, por curiosidade e porque o trabalho começou a pedir.',
      en: 'Rust, out of curiosity and because work started asking for it.',
    },
  },
  {
    id: 'studying',
    label: { pt: 'Estudando', en: 'Studying' },
    text: {
      pt: 'Análise e desenvolvimento de sistemas na UDESC, com formatura prevista para 2027.',
      en: 'Systems analysis and development at UDESC, due to graduate in 2027.',
    },
  },
]
