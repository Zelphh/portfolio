import type { ExperienceEntry } from './types'

/**
 * Work history, newest first. The single owner of these dates: the ASCII
 * timeline in the about section is derived from this list, so a new job is
 * added here and nowhere else.
 */
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    id: 'hsp-jr',
    company: 'HSP Software',
    role: {
      pt: 'Desenvolvedor full stack jr.',
      en: 'Junior full stack developer',
    },
    period: {
      start: { pt: 'Jul 2026', en: 'Jul 2026' },
      end: { pt: 'Atualmente', en: 'Present' },
    },
    current: true,
    highlights: {
      pt: [
        'Desenvolvimento web full stack com Node.js, React e PostgreSQL.',
        'Criação de workflows de CI/CD para automatizar processos do time.',
        'Docker para padronizar os ambientes de desenvolvimento e deploy.',
        'Rust em demandas do próprio trabalho.',
      ],
      en: [
        'Full stack web development with Node.js, React and PostgreSQL.',
        "CI/CD workflows that automate the team's processes.",
        'Docker to keep development and deploy environments consistent.',
        'Rust for work-related tasks.',
      ],
    },
    stack: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'CI/CD', 'Rust'],
  },
  {
    id: 'hsp-intern',
    company: 'HSP Software',
    role: { pt: 'Estagiário full stack', en: 'Full stack intern' },
    period: {
      start: { pt: 'Set 2025', en: 'Sep 2025' },
      end: { pt: 'Jun 2026', en: 'Jun 2026' },
    },
    current: false,
    highlights: {
      pt: ['Desenvolvimento full stack com Node.js, React e PostgreSQL.'],
      en: ['Full stack development with Node.js, React and PostgreSQL.'],
    },
    stack: ['Node.js', 'React', 'PostgreSQL'],
  },
  {
    id: 'ambev',
    company: 'Ambev',
    role: { pt: 'Jovem aprendiz', en: 'Young apprentice' },
    period: {
      start: { pt: 'Jul 2024', en: 'Jul 2024' },
      end: { pt: 'Set 2025', en: 'Sep 2025' },
    },
    current: false,
    highlights: { pt: [], en: [] },
    stack: [],
  },
]
