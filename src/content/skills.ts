import type { Skill } from './types'

const icon = (name: string) => `/icons/${name}.svg`

/**
 * Order matters: the wheel, the marquee and the terminal `skills` output all
 * read this list top to bottom.
 */
export const SKILLS: readonly Skill[] = [
  {
    id: 'react',
    name: 'react',
    tier: 'pro',
    visual: { kind: 'ascii', logo: 'react' },
    marqueeIcon: icon('react'),
    note: { pt: 'front-end', en: 'front-end' },
    blurb: {
      pt: 'componentes, estado e o mínimo de biblioteca possível.',
      en: 'components, state and as little library as possible.',
    },
  },
  {
    id: 'node',
    name: 'node.js',
    tier: 'pro',
    visual: { kind: 'ascii', logo: 'node' },
    marqueeIcon: icon('nodejs'),
    note: { pt: 'back-end', en: 'back-end' },
    blurb: {
      pt: 'apis, filas e scripts que rodam sozinhos de madrugada.',
      en: 'apis, queues and scripts that run alone at 3am.',
    },
  },
  {
    id: 'postgresql',
    name: 'postgresql',
    tier: 'pro',
    visual: { kind: 'icon', src: icon('postgresql') },
    marqueeIcon: icon('postgresql'),
    note: { pt: 'dados', en: 'data' },
    blurb: {
      pt: 'schema pensado antes, query explicada depois.',
      en: 'schema thought through first, query explained after.',
    },
  },
  {
    id: 'git',
    name: 'git',
    tier: 'pro',
    visual: { kind: 'ascii', logo: 'git' },
    marqueeIcon: icon('git'),
    note: { pt: 'versionamento', en: 'versioning' },
    blurb: {
      pt: 'commit pequeno, mensagem que o eu do futuro entende.',
      en: 'small commits, messages future me can understand.',
    },
  },
  {
    id: 'docker',
    name: 'docker',
    tier: 'pro',
    visual: { kind: 'icon', src: icon('docker') },
    marqueeIcon: icon('docker'),
    note: { pt: 'infra', en: 'infra' },
    blurb: {
      pt: 'ambiente igual na minha máquina e na sua.',
      en: 'same environment on my machine and on yours.',
    },
  },
  {
    id: 'rust',
    name: 'rust',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('rust') },
    marqueeIcon: icon('rust'),
    note: { pt: 'aprendendo', en: 'learning' },
    blurb: {
      pt: 'brigando com o borrow checker e gostando.',
      en: 'fighting the borrow checker and enjoying it.',
    },
  },
  {
    id: 'java',
    name: 'java',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('java') },
    marqueeIcon: icon('java'),
    note: { pt: 'back-end', en: 'back-end' },
    blurb: {
      pt: 'tipagem forte e verbosidade que envelhece bem.',
      en: 'strong typing and verbosity that ages well.',
    },
  },
  {
    id: 'python',
    name: 'python',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('python') },
    marqueeIcon: icon('python'),
    note: { pt: 'scripts', en: 'scripts' },
    blurb: {
      pt: 'automação e experimento rápido quando a ideia é testar.',
      en: 'automation and quick experiments when the point is to test.',
    },
  },
  {
    id: 'spring-boot',
    name: 'spring boot',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('spring') },
    marqueeIcon: icon('spring'),
    note: { pt: 'back-end', en: 'back-end' },
    blurb: {
      pt: 'estudei o ecossistema montando apis com jpa e segurança.',
      en: 'studied the ecosystem building apis with jpa and security.',
    },
  },
  {
    id: 'c',
    name: 'c',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('c') },
    marqueeIcon: icon('c'),
    note: { pt: 'fundamentos', en: 'fundamentals' },
    blurb: {
      pt: 'ponteiro, memória e o respeito que vem junto.',
      en: 'pointers, memory and the respect that comes with them.',
    },
  },
]
