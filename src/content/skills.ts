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
    name: 'React',
    tier: 'pro',
    visual: { kind: 'ascii', logo: 'react' },
    marqueeIcon: icon('react'),
    note: { pt: 'Front-end', en: 'Front-end' },
    blurb: {
      pt: [
        'Minha principal skill front-end: trabalho ativamente com ela e uso diariamente nos meus projetos secundários.',
        'Conheço o suficiente para criar páginas bem estruturadas, otimizadas e responsivas com SCSS.',
      ],
      en: [
        'My main front-end skill: I work with it actively and use it daily on my side projects.',
        'I know enough to build well-structured, optimised and responsive pages with SCSS.',
      ],
    },
  },
  {
    id: 'node',
    name: 'Node.js',
    tier: 'pro',
    visual: { kind: 'ascii', logo: 'node' },
    marqueeIcon: icon('nodejs'),
    note: { pt: 'Back-end', en: 'Back-end' },
    blurb: {
      pt: [
        'Minha skill profissional em back-end: uso bastante no trabalho, porém não é a que eu penso na hora de fazer um projeto secundário.',
        'Acredito que hoje em dia há tecnologias melhores para fazer um back-end, como Rust ou Go.',
      ],
      en: [
        'My professional back-end skill: I use it a lot at work, but it is not the one I reach for on a side project.',
        'I think there are better technologies for a back-end today, like Rust or Go.',
      ],
    },
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    tier: 'pro',
    visual: { kind: 'icon', src: icon('postgresql') },
    marqueeIcon: icon('postgresql'),
    note: { pt: 'Dados', en: 'Data' },
    blurb: {
      pt: [
        'Um ótimo gerenciador de banco de dados, sempre que necessário uso nos meus projetos pessoais.',
        'Prefiro ele ao MySQL por razões de performance, coerência, extensibilidade e entre outros motivos.',
        'Recomendo dar uma olhada no site: https://youjustneedpostgres.com/',
      ],
      en: [
        'A great database manager, I use it on my personal projects whenever it is needed.',
        'I prefer it over MySQL for reasons of performance, consistency, extensibility and others.',
        'Worth a look: https://youjustneedpostgres.com/',
      ],
    },
  },
  {
    id: 'git',
    name: 'Git',
    tier: 'pro',
    visual: { kind: 'ascii', logo: 'git' },
    marqueeIcon: icon('git'),
    note: { pt: 'Versionamento', en: 'Versioning' },
    blurb: {
      pt: [
        'A ferramenta básica e, acredito, a mais usada para o versionamento de código.',
        'Já resolvi muitos problemas com branches no GitHub, então acredito ter uma boa experiência.',
        'No meu trabalho já produzi workflows para automatizar processos, como CI/CD.',
      ],
      en: [
        'The basic and, I believe, most used tool for versioning code.',
        'I have solved plenty of branch problems on GitHub, so I believe I have good experience with it.',
        'At work I have built workflows to automate processes, such as CI/CD.',
      ],
    },
  },
  {
    id: 'docker',
    name: 'Docker',
    tier: 'pro',
    visual: { kind: 'icon', src: icon('docker') },
    marqueeIcon: icon('docker'),
    note: { pt: 'Infra', en: 'Infra' },
    blurb: {
      pt: [
        'Uso no dia a dia para garantir que o projeto seja o mesmo em qualquer máquina, sem depender do sistema operacional.',
        'Combinado com os workflows de CI/CD que já montei, essa mesma garantia continua valendo fora da minha máquina.',
        'Ainda quero me aprofundar nas partes mais avançadas, como multi-stage build e reduzir o tamanho final das imagens.',
      ],
      en: [
        'I use it daily to make sure the project is the same on any machine, without depending on the operating system.',
        'Combined with the CI/CD workflows I have built, that same guarantee holds outside my own machine.',
        'I still want to go deeper into the more advanced parts, like multi-stage builds and shrinking the final image size.',
      ],
    },
  },
  {
    id: 'rust',
    name: 'Rust',
    tier: 'pro',
    visual: { kind: 'icon', src: icon('rust') },
    marqueeIcon: icon('rust'),
    note: { pt: 'Aprendendo', en: 'Learning' },
    blurb: {
      pt: [
        'Estou estudando bastante sobre essa linguagem devido à atenção que ela está ganhando recentemente.',
        'E acredito que não seja à toa: do que já estudei e usei no trabalho, ela é uma linguagem absurdamente otimizada se comparada com Node, por exemplo.',
        'Apesar do código seguir paradigmas nada convencionais (o que complica um pouco o aprendizado), planejo usar muito nos meus projetos pessoais.',
      ],
      en: [
        'I have been studying this language a lot because of the attention it has been getting lately.',
        'And I believe that is not for nothing: from what I have studied and used at work, it is an absurdly optimised language compared to Node, for example.',
        'Even though the code follows rather unconventional paradigms (which makes learning it a bit harder), I plan to use it a lot on my personal projects.',
      ],
    },
  },
  {
    id: 'java',
    name: 'Java',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('java') },
    marqueeIcon: icon('java'),
    note: { pt: 'Back-end', en: 'Back-end' },
    blurb: {
      pt: [
        'Já usei bastante em projetos pessoais, foi a primeira linguagem em que me aprofundei de verdade.',
        'Foi ela quem estruturou toda a base de programação orientada a objetos que sei hoje, e posso dizer com segurança que isso me ajudou a aprender diversas outras linguagens e a pensar de forma estruturada.',
      ],
      en: [
        'I used it a lot on personal projects, it was the first language I really went deep into.',
        'It built the whole object-oriented foundation I have today, and I can safely say that helped me pick up several other languages and think in a structured way.',
      ],
    },
  },
  {
    id: 'python',
    name: 'Python',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('python') },
    marqueeIcon: icon('python'),
    note: { pt: 'Fundamentos', en: 'Fundamentals' },
    blurb: {
      pt: [
        'Foi a linguagem que me introduziu ao mundo da programação.',
        'Já usei para alguns projetos pessoais, como jogos e atividades da escola.',
        'Foi nela que aprendi todos os conceitos básicos da programação.',
      ],
      en: [
        'The language that introduced me to programming.',
        'I have used it on a few personal projects, like games and school assignments.',
        'It is where I learned all the basic programming concepts.',
      ],
    },
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('spring') },
    marqueeIcon: icon('spring'),
    note: { pt: 'Back-end', en: 'Back-end' },
    // TODO: link `dscommerce` to its card.
    blurb: {
      pt: [
        'Primeiro framework que eu aprendi. Me aprofundei bastante, ao ponto de poder construir um back-end sólido com ele, como o DSCommerce.',
        'Foi de extrema importância para eu aprender conceitos básicos como API REST, métodos HTTP e até otimização de queries.',
      ],
      en: [
        'The first framework I learned. I went deep enough to build a solid back-end with it, like DSCommerce.',
        'It was extremely important for me to learn basic concepts such as REST APIs, HTTP methods and even query optimisation.',
      ],
    },
  },
  {
    id: 'c',
    name: 'C',
    tier: 'secondary',
    visual: { kind: 'icon', src: icon('c') },
    marqueeIcon: icon('c'),
    note: { pt: 'Fundamentos', en: 'Fundamentals' },
    // TODO: link `keyboard-fix` and the image editor to their cards.
    blurb: {
      pt: [
        'Muitos cursos que eu fiz (CS50x é um exemplo) usaram ela para ensinar lógica de programação.',
        'Já fiz alguns projetos pessoais como o keyboard-fix e um editor simples de imagens.',
        'Também foi a linguagem onde eu aprendi todo o assunto de estrutura de dados.',
      ],
      en: [
        'Many courses I took (CS50x being one) used it to teach programming logic.',
        'I have built a few personal projects with it, like keyboard-fix and a simple image editor.',
        'It is also the language where I learned everything about data structures.',
      ],
    },
  },
]
