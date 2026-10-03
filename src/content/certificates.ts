import type { Certificate } from './types'

/**
 * Order is the layout: the first entry gets the tall featured tile, the
 * second the wide one beside it, and the rest share the row underneath —
 * see `LAYOUT` in `certificates-section`.
 */
export const CERTIFICATES: readonly Certificate[] = [
  {
    id: 'udesc-ads',
    kind: 'degree',
    issuer: 'UDESC — Universidade do Estado de Santa Catarina',
    year: '2024 → 2027',
    icon: '/icons/graduation.svg',
    logo: '/logos/udesc.png',
    name: {
      pt: 'Análise e desenvolvimento de sistemas',
      en: 'Systems analysis and development',
    },
    summary: {
      pt: 'Graduação em andamento: algoritmos, estrutura de dados, banco relacional, engenharia de software e redes.',
      en: 'Degree in progress: algorithms, data structures, relational databases, software engineering and networks.',
    },
    story: {
      pt: [
        'Graduação tecnológica na Universidade do Estado de Santa Catarina, em andamento. A grade cobre a base que não se aprende só na prática: complexidade de algoritmo, estrutura de dados, modelagem relacional, engenharia de software e redes.',
        'É onde a teoria encosta no que eu já faço todo dia. Boa parte do que eu sei explicar — e não só fazer — veio de trabalho de disciplina que acabei levando mais longe do que precisava.',
      ],
      en: [
        'A technologist degree at Universidade do Estado de Santa Catarina, in progress. The syllabus covers the ground you do not pick up from practice alone: algorithmic complexity, data structures, relational modelling, software engineering and networks.',
        'This is where the theory meets what I already do daily. Most of what I can explain — not just build — came out of coursework I took further than it needed to go.',
      ],
    },
    topics: {
      pt: ['Algoritmos', 'Estrutura de dados', 'Banco de dados', 'Engenharia de software', 'Redes'],
      en: ['Algorithms', 'Data structures', 'Databases', 'Software engineering', 'Networks'],
    },
  },
  {
    id: 'cs50x',
    kind: 'course',
    issuer: 'Harvard University (CS50)',
    year: '2025',
    hours: '24h',
    icon: '/icons/terminal.svg',
    url: 'https://cs50.harvard.edu/certificates/5f5ac8da-16c8-49d3-894c-023d9845a481',
    image: '/certificates/cs50x.jpg',
    imageAspect: '1600 / 1131',
    name: {
      pt: 'CS50x',
      en: 'CS50x',
    },
    summary: {
      pt: 'Dez semanas com atividade práticas e um projeto final, de C a Python, SQL e desenvolvimento web. A base mais purista de algoritmos e estrutura de dados que eu já tive.',
      en: 'Ten problem sets and one final project, from C to Python, SQL and web development. The most purist base in algorithms and data structures I have had.',
    },
    story: {
      pt: [
        'Dez semanas com atividade práticas e um projeto final, de C a Python, SQL e desenvolvimento web. A base mais purista de algoritmos e estrutura de dados que eu já tive. Recomendaria com confiança até mesmo para programadores já expirientes.',
        'As atividades práticas são extremamente criativas e desafiadoras, forçam você a entender o assunto da semana de fato com um contexto interativo, lógico e que faz sentido.',
      ],
      en: [
        'Ten problem sets and one final project, from C to Python, SQL and web development. The most purist base in algorithms and data structures I have had.',
        'Starting in C changes how you write every language after it: allocating memory by hand, understanding pointers and paying for every copy makes it obvious what the high-level languages are hiding.',
      ],
    },
    topics: {
      pt: ['C', 'Python', 'SQL', 'Flask', 'Big-O'],
      en: ['C', 'Python', 'SQL', 'Flask', 'Big-O'],
    },
  },
  {
    id: 'java-spring-professional',
    kind: 'course',
    issuer: 'DevSuperior',
    year: '2024',
    hours: '120h',
    icon: '/icons/spring.svg',
    url: 'https://devsuperior.club/c/5-207',
    image: '/certificates/java-spring-professional.png',
    imageAspect: '1807 / 1019',
    name: {
      pt: 'Java Spring Professional',
      en: 'Java Spring Professional',
    },
    summary: {
      pt: 'REST API, modelagem de domínio, ORM com JPA, camadas, tratamento de exceções, validação e autenticação com OAuth2 e JWT.',
      en: 'REST API, domain modelling, ORM with JPA, layers, exception handling, validation and authentication with OAuth2 and JWT.',
    },
    story: {
      pt: [
        'REST API, modelagem de domínio, ORM com JPA, camadas, tratamento de exceções, validação de dados, otimização deconsultas SQL e JPQL, OAuth2 e JWT.',
        'Foi também meu primeiro contato com infra: tokens, claims, expiração e refresh. Foi de fato onde comecei a enteder de verdade autenticação.',
      ],
      en: [
        'REST API, domain modelling, ORM with JPA, layers, exception handling, data validation, SQL and JPQL queries, OAuth2 and JWT.',
        'This is where stateless authentication stopped being magic: signed tokens, claims, expiry and refresh became things I can draw on a whiteboard before writing the first line.',
      ],
    },
    topics: {
      pt: ['JPA', 'Hibernate', 'JPQL', 'OAuth2', 'JWT'],
      en: ['JPA', 'Hibernate', 'JPQL', 'OAuth2', 'JWT'],
    },
  },
  {
    id: 'english-c2',
    kind: 'certification',
    issuer: 'CEFR C2',
    year: '2023',
    icon: '/icons/language.svg',
    name: {
      pt: 'Inglês — proficiência C2',
      en: 'English — C2 proficiency',
    },
    summary: {
      pt: 'Nível C2 do Quadro Europeu Comum: leitura técnica, escrita e conversa sem camada de tradução no meio.',
      en: 'C2 on the Common European Framework: technical reading, writing and conversation with no translation layer in between.',
    },
    story: {
      pt: [
        'Nível C2 do Quadro Europeu Comum de Referência — o topo da escala, usuário proficiente.',
        'Na prática é o que faz documentação, RFC, issue e code review em inglês serem o meu padrão e não um esforço extra. A maior parte do que eu estudo nunca foi traduzida, e esperar tradução é abrir mão de chegar primeiro.',
      ],
      en: [
        'C2 on the Common European Framework of Reference — the top of the scale, proficient user.',
        'In practice it is what makes documentation, RFCs, issues and code review in English my default rather than extra effort. Most of what I study was never translated, and waiting for a translation means giving up on getting there first.',
      ],
    },
    topics: {
      pt: ['Leitura técnica', 'Escrita', 'Conversação', 'Compreensão'],
      en: ['Technical reading', 'Writing', 'Speaking', 'Listening'],
    },
  },
]
