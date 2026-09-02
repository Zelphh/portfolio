import type { Certificate } from './types'

export const CERTIFICATES: readonly Certificate[] = [
  {
    id: 'fullstack',
    issuer: 'rocketseat',
    year: '2025',
    hours: '180h',
    url: '#',
    name: {
      pt: 'desenvolvimento web full stack',
      en: 'full stack web development',
    },
    description: {
      pt: 'trilha completa de node e react: apis rest, autenticação com jwt, testes e deploy. o projeto final foi uma api de agendamentos com fila de notificações.',
      en: 'complete node and react track: rest apis, jwt authentication, tests and deploy. the final project was a scheduling api with a notification queue.',
    },
  },
  {
    id: 'postgresql',
    issuer: 'udemy',
    year: '2025',
    hours: '42h',
    url: '#',
    name: {
      pt: 'postgresql para desenvolvedores',
      en: 'postgresql for developers',
    },
    description: {
      pt: 'modelagem relacional, índices, planos de execução e otimização de query. onde eu finalmente entendi ler um explain analyze sem chutar.',
      en: 'relational modeling, indexes, execution plans and query optimization. where i finally learned to read an explain analyze without guessing.',
    },
  },
  {
    id: 'docker',
    issuer: 'alura',
    year: '2024',
    hours: '36h',
    url: '#',
    name: {
      pt: 'docker e containers na prática',
      en: 'docker and containers in practice',
    },
    description: {
      pt: "imagens, volumes, redes e compose. subir o mesmo ambiente em qualquer máquina e parar de depender do 'na minha aqui funciona'.",
      en: "images, volumes, networks and compose. bringing the same environment up on any machine and dropping the 'works on mine'.",
    },
  },
  {
    id: 'rust',
    issuer: "let's get rusty",
    year: '2024',
    hours: '24h',
    url: '#',
    name: {
      pt: 'rust: fundamentos da linguagem',
      en: 'rust: language fundamentals',
    },
    description: {
      pt: 'ownership, borrow checker, traits e error handling. curso curto que serviu de porta de entrada pro que ando estudando hoje.',
      en: "ownership, borrow checker, traits and error handling. a short course that opened the door to what i'm studying today.",
    },
  },
  {
    id: 'git',
    issuer: 'digital innovation one',
    year: '2023',
    hours: '16h',
    url: '#',
    name: {
      pt: 'git e github: fluxo de trabalho',
      en: 'git and github: workflow',
    },
    description: {
      pt: 'branches, rebase, resolução de conflito e convenção de commit. base pra trabalhar em equipe sem quebrar a main.',
      en: 'branches, rebase, conflict resolution and commit conventions. the base for working in a team without breaking main.',
    },
  },
]
