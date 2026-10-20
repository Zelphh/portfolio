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
        'Graduação tecnológica na Universidade do Estado de Santa Catarina (UDESC), em andamento. A grade cobre a base que não se aprende só na prática: complexidade de algoritmo, estrutura de dados, modelagem relacional, engenharia de software e redes.',
        'É onde a teoria encosta no que eu já faço todo dia. Boa parte do que eu sei explicar — e não só fazer — veio de trabalho de disciplina que acabei levando mais longe do que precisava.',
      ],
      en: [
        'Technology degree at the Santa Catarina State University (UDESC), in progress. The curriculum covers the foundation you do not learn from practice alone: algorithmic complexity, data structures, relational modelling, software engineering and networks.',
        'This is where theory meets what I already do every day. A good part of what I can explain — not just do — came from coursework I ended up taking further than it needed to go.',
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
      pt: 'Dez semanas com atividades práticas e um projeto final, de C a Python, SQL e desenvolvimento web. A base mais purista de algoritmos e estrutura de dados que eu já tive.',
      en: 'Ten weeks of problem sets and a final project, from C to Python, SQL and web development. The most purist foundation in algorithms and data structures I have ever had.',
    },
    story: {
      pt: [
        'Dez semanas com atividades práticas e um projeto final, de C a Python, SQL e desenvolvimento web. A base mais purista de algoritmos e estrutura de dados que eu já tive. Recomendaria com confiança até mesmo para programadores já experientes.',
        'As atividades práticas são extremamente criativas e desafiadoras: forçam você a entender de fato o assunto da semana, com um contexto interativo, lógico e que faz sentido.',
      ],
      en: [
        'Ten weeks of problem sets and a final project, from C to Python, SQL and web development. The most purist foundation in algorithms and data structures I have ever had. I would confidently recommend it even to experienced programmers.',
        'The problem sets are extremely creative and challenging: they force you to really understand the topic of the week, within an interactive, logical context that makes sense.',
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
        'REST API, modelagem de domínio, ORM com JPA, camadas, tratamento de exceções, validação de dados, otimização de consultas SQL e JPQL, OAuth2 e JWT.',
        'Foi também meu primeiro contato com autenticação stateless: tokens, claims, expiração e refresh. Foi ali que comecei a entender autenticação de verdade.',
      ],
      en: [
        'REST API, domain modelling, ORM with JPA, layers, exception handling, data validation, SQL and JPQL query optimisation, OAuth2 and JWT.',
        'It was also my first contact with stateless authentication: tokens, claims, expiry and refresh. That is where I started to truly understand authentication.',
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
      pt: 'Nível C2 do Quadro Europeu Comum: leitura técnica, escrita e conversação sem camada de tradução no meio.',
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
