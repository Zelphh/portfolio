import type { Skill } from './types'

const icon = (name: string) => `/icons/${name}.svg`

/**
 * Order matters: the wheel, the marquee and the terminal `skills` output all
 * read this list top to bottom.
 *
 * TODO: some blurbs name a project that should link to its own card. Two
 * things block that: those projects are not in PROJECTS yet, and the open
 * card lives in ProjectsSection's local `openIndex`, so a trigger from this
 * section needs shared state (or a URL hash) first. Entries carrying such a
 * name are marked with their own TODO.
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
      pt: [
        'minha principal skill front-end: trabalho ativamente com ela e uso diariamente nos meus projetos secundários.',
        'conheço o suficiente para criar páginas bem estruturadas, otimizadas e responsivas com scss.',
      ],
      en: [
        'my main front-end skill: i work with it actively and use it daily on my side projects.',
        'i know enough to build well-structured, optimised and responsive pages with scss.',
      ],
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
      pt: [
        'minha skill profissional em back-end: uso bastante no trabalho, porém não é a que eu penso na hora de fazer um projeto secundário.',
        'acredito que hoje em dia há tecnologias melhores para fazer um back-end, como rust ou go.',
      ],
      en: [
        'my professional back-end skill: i use it a lot at work, but it is not the one i reach for on a side project.',
        'i think there are better technologies for a back-end today, like rust or go.',
      ],
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
      pt: [
        'um ótimo gerenciador de banco de dados, sempre que necessário uso nos meus projetos pessoais.',
        'prefiro ele ao mysql por razões de performance, coerência, extensibilidade e entre outros motivos.',
        'recomendo dar uma olhada no site: https://youjustneedpostgres.com/',
      ],
      en: [
        'a great database manager, i use it on my personal projects whenever it is needed.',
        'i prefer it over mysql for reasons of performance, consistency, extensibility and others.',
        'worth a look: https://youjustneedpostgres.com/',
      ],
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
      pt: [
        'a ferramenta básica e, acredito, a mais usada para o versionamento de código.',
        'já resolvi muitos problemas com branches no github, então acredito ter uma boa experiência.',
        'no meu trabalho já produzi workflows para automatizar processos, como ci/cd.',
      ],
      en: [
        'the basic and, i believe, most used tool for versioning code.',
        'i have solved plenty of branch problems on github, so i believe i have good experience with it.',
        'at work i have built workflows to automate processes, such as ci/cd.',
      ],
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
      pt: [
        'uso no dia a dia para garantir que o projeto seja o mesmo em qualquer máquina, sem depender do sistema operacional.',
        'combinado com os workflows de ci/cd que já montei, essa mesma garantia continua valendo fora da minha máquina.',
        'ainda quero me aprofundar nas partes mais avançadas, como multi-stage build e reduzir o tamanho final das imagens.',
      ],
      en: [
        'i use it daily to make sure the project is the same on any machine, without depending on the operating system.',
        'combined with the ci/cd workflows i have built, that same guarantee holds outside my own machine.',
        'i still want to go deeper into the more advanced parts, like multi-stage builds and shrinking the final image size.',
      ],
    },
  },
  {
    id: 'rust',
    name: 'rust',
    tier: 'pro',
    visual: { kind: 'icon', src: icon('rust') },
    marqueeIcon: icon('rust'),
    note: { pt: 'aprendendo', en: 'learning' },
    blurb: {
      pt: [
        'estou estudando bastante sobre essa linguagem devido à atenção que ela está ganhando recentemente.',
        'e acredito que não seja à toa: do que já estudei e usei no trabalho, ela é uma linguagem absurdamente otimizada se comparada com node, por exemplo.',
        'apesar do código seguir paradigmas nada convencionais (o que complica um pouco o aprendizado), planejo usar muito nos meus projetos pessoais.',
      ],
      en: [
        'i have been studying this language a lot because of the attention it has been getting lately.',
        'and i believe that is not for nothing: from what i have studied and used at work, it is an absurdly optimised language compared to node, for example.',
        'even though the code follows rather unconventional paradigms (which makes learning it a bit harder), i plan to use it a lot on my personal projects.',
      ],
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
      pt: [
        'já usei bastante em projetos pessoais, foi a primeira linguagem em que me aprofundei de verdade.',
        'foi ela quem estruturou toda a base de programação orientada a objetos que sei hoje, e posso dizer com segurança que isso me ajudou a aprender diversas outras linguagens e a pensar de forma estruturada.',
      ],
      en: [
        'i used it a lot on personal projects, it was the first language i really went deep into.',
        'it built the whole object-oriented foundation i have today, and i can safely say that helped me pick up several other languages and think in a structured way.',
      ],
    },
  },
  {
    id: 'python',
    name: 'python',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('python') },
    marqueeIcon: icon('python'),
    note: { pt: 'fundamentos', en: 'fundamentals' },
    blurb: {
      pt: [
        'foi a linguagem que me introduziu ao mundo da programação.',
        'já usei para alguns projetos pessoais, como jogos e atividades da escola.',
        'foi nela que aprendi todos os conceitos básicos da programação.',
      ],
      en: [
        'the language that introduced me to programming.',
        'i have used it on a few personal projects, like games and school assignments.',
        'it is where i learned all the basic programming concepts.',
      ],
    },
  },
  {
    id: 'spring-boot',
    name: 'spring boot',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('spring') },
    marqueeIcon: icon('spring'),
    note: { pt: 'back-end', en: 'back-end' },
    // TODO: link `dscommerce` to its card.
    blurb: {
      pt: [
        'primeiro framework que eu aprendi. me aprofundei bastante, ao ponto de poder construir um back-end sólido com ele, como o dscommerce.',
        'foi de extrema importância para eu aprender conceitos básicos como api rest, métodos http e até otimização de queries.',
      ],
      en: [
        'the first framework i learned. i went deep enough to build a solid back-end with it, like dscommerce.',
        'it was extremely important for me to learn basic concepts such as rest apis, http methods and even query optimisation.',
      ],
    },
  },
  {
    id: 'c',
    name: 'c',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('c') },
    marqueeIcon: icon('c'),
    note: { pt: 'fundamentos', en: 'fundamentals' },
    // TODO: link `keyboard-fix` and the image editor to their cards.
    blurb: {
      pt: [
        'muitos cursos que eu fiz (cs50x é um exemplo) usaram ela para ensinar lógica de programação.',
        'já fiz alguns projetos pessoais como o keyboard-fix e um editor simples de imagens.',
        'também foi a linguagem onde eu aprendi todo o assunto de estrutura de dados.',
      ],
      en: [
        'many courses i took (cs50x being one) used it to teach programming logic.',
        'i have built a few personal projects with it, like keyboard-fix and a simple image editor.',
        'it is also the language where i learned everything about data structures.',
      ],
    },
  },
]
