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
    icon: '/icons/briefcase.svg',
    tags: [
      { label: 'Node', icon: '/icons/nodejs.svg' },
      { label: 'React', icon: '/icons/react.svg' },
      { label: 'Postgres', icon: '/icons/postgresql.svg' },
      { label: 'Docker', icon: '/icons/docker.svg' },
      { label: 'Rust', icon: '/icons/rust.svg' },
      { label: 'CI/CD' },
    ],
    text: {
      pt: 'Como desenvolvedor full stack jr. na HSP Software, com Node, React, Rust, Postgres e Docker.',
      en: 'As a junior full stack developer at HSP Software, with Node, React, Rust and Postgres, and looking after CI/CD and Docker along the way.',
    },
  },
  {
    id: 'building',
    label: { pt: 'Construindo', en: 'Building' },
    icon: '/icons/cube.svg',
    tags: [
      { label: 'WhatsRecap' },
      { label: 'Embeddings' },
      { label: 'RAG' },
      { label: 'LLM' },
    ],
    text: {
      pt: 'A camada de IA do WhatsRecap: embeddings, RAG e um modelo de linguagem rodando no meu computador, tudo localmente.',
      en: "WhatsRecap's AI layer: embeddings, RAG and a language model running locally, with nothing leaving my machine.",
    },
  },
  {
    id: 'learning',
    label: { pt: 'Aprendendo', en: 'Learning' },
    icon: '/icons/book.svg',
    tags: [{ label: 'Rust', icon: '/icons/rust.svg' }],
    text: {
      pt: 'Rust, por curiosidade e pelo engajamento que a linguagem está tendo nos últimos tempos',
      en: 'Rust, out of curiosity and because work started asking for it.',
    },
  },
  {
    id: 'studying',
    label: { pt: 'Estudando', en: 'Studying' },
    icon: '/icons/graduation.svg',
    tags: [
      { label: 'UDESC' },
      { label: 'TADS' },
      { label: '2027' },
    ],
    text: {
      pt: 'Análise e desenvolvimento de sistemas na UDESC, com formatura prevista para 2027.',
      en: 'Systems analysis and development at UDESC, due to graduate in 2027.',
    },
  },
]
