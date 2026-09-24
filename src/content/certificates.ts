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
    issuer: 'udesc — universidade do estado de santa catarina',
    year: '2024 →',
    icon: '/icons/graduation.svg',
    name: {
      pt: 'análise e desenvolvimento de sistemas',
      en: 'systems analysis and development',
    },
    summary: {
      pt: 'graduação em andamento: algoritmos, estrutura de dados, banco relacional, engenharia de software e redes.',
      en: 'degree in progress: algorithms, data structures, relational databases, software engineering and networks.',
    },
    story: {
      pt: [
        'graduação tecnológica na universidade do estado de santa catarina, em andamento. a grade cobre a base que não se aprende só na prática: complexidade de algoritmo, estrutura de dados, modelagem relacional, engenharia de software e redes.',
        'é onde a teoria encosta no que eu já faço todo dia. boa parte do que eu sei explicar — e não só fazer — veio de trabalho de disciplina que acabei levando mais longe do que precisava.',
      ],
      en: [
        'a technologist degree at universidade do estado de santa catarina, in progress. the syllabus covers the ground you do not pick up from practice alone: algorithmic complexity, data structures, relational modelling, software engineering and networks.',
        'this is where the theory meets what i already do daily. most of what i can explain — not just build — came out of coursework i took further than it needed to go.',
      ],
    },
    topics: {
      pt: ['algoritmos', 'estrutura de dados', 'banco de dados', 'engenharia de software', 'redes'],
      en: ['algorithms', 'data structures', 'databases', 'software engineering', 'networks'],
    },
  },
  {
    id: 'cs50x',
    kind: 'course',
    issuer: 'harvard university (cs50)',
    year: '2025',
    hours: '24h',
    icon: '/icons/terminal.svg',
    url: 'https://cs50.harvard.edu/certificates/5f5ac8da-16c8-49d3-894c-023d9845a481',
    image: '/certificates/cs50x.jpg',
    imageAspect: '1600 / 1131',
    name: {
      pt: 'cs50x',
      en: 'cs50x',
    },
    summary: {
      pt: 'dez problem sets e um projeto final, de c a python, sql e desenvolvimento web. a base mais purista de algoritmos e estrutura de dados que eu já tive.',
      en: 'ten problem sets and one final project, from c to python, sql and web development. the most purist base in algorithms and data structures i have had.',
    },
    story: {
      pt: [
        'dez problem sets e um projeto final, de c a python, sql e desenvolvimento web. a base mais purista de algoritmos e estrutura de dados que eu já tive.',
        'começar em c muda o jeito de escrever em qualquer linguagem depois: alocar memória na mão, entender ponteiro e pagar o custo de cada cópia deixa claro o que as linguagens de alto nível estão escondendo.',
      ],
      en: [
        'ten problem sets and one final project, from c to python, sql and web development. the most purist base in algorithms and data structures i have had.',
        'starting in c changes how you write every language after it: allocating memory by hand, understanding pointers and paying for every copy makes it obvious what the high-level languages are hiding.',
      ],
    },
    topics: {
      pt: ['c', 'python', 'sql', 'flask', 'big-o'],
      en: ['c', 'python', 'sql', 'flask', 'big-o'],
    },
  },
  {
    id: 'java-spring-professional',
    kind: 'course',
    issuer: 'devsuperior',
    year: '2024',
    hours: '120h',
    icon: '/icons/spring.svg',
    url: 'https://devsuperior.club/c',
    image: '/certificates/java-spring-professional.png',
    imageAspect: '1807 / 1019',
    name: {
      pt: 'java spring professional',
      en: 'java spring professional',
    },
    summary: {
      pt: 'rest api, modelagem de domínio, orm com jpa, camadas, tratamento de exceções, validação e autenticação com oauth2 e jwt.',
      en: 'rest api, domain modelling, orm with jpa, layers, exception handling, validation and authentication with oauth2 and jwt.',
    },
    story: {
      pt: [
        'rest api, modelagem de domínio, orm com jpa, camadas, tratamento de exceções, validação de dados, consultas sql e jpql, oauth2 e jwt.',
        'foi onde autenticação stateless deixou de ser mágica: token assinado, claims, expiração e refresh viraram coisas que eu consigo desenhar no quadro antes de escrever a primeira linha.',
      ],
      en: [
        'rest api, domain modelling, orm with jpa, layers, exception handling, data validation, sql and jpql queries, oauth2 and jwt.',
        'this is where stateless authentication stopped being magic: signed tokens, claims, expiry and refresh became things i can draw on a whiteboard before writing the first line.',
      ],
    },
    topics: {
      pt: ['jpa', 'hibernate', 'jpql', 'oauth2', 'jwt'],
      en: ['jpa', 'hibernate', 'jpql', 'oauth2', 'jwt'],
    },
  },
  {
    id: 'english-c2',
    kind: 'certification',
    issuer: 'cefr c2',
    year: '2023',
    icon: '/icons/language.svg',
    name: {
      pt: 'inglês — proficiência c2',
      en: 'english — c2 proficiency',
    },
    summary: {
      pt: 'nível c2 do quadro europeu comum: leitura técnica, escrita e conversa sem camada de tradução no meio.',
      en: 'c2 on the common european framework: technical reading, writing and conversation with no translation layer in between.',
    },
    story: {
      pt: [
        'nível c2 do quadro europeu comum de referência — o topo da escala, usuário proficiente.',
        'na prática é o que faz documentação, rfc, issue e code review em inglês serem o meu padrão e não um esforço extra. a maior parte do que eu estudo nunca foi traduzida, e esperar tradução é abrir mão de chegar primeiro.',
      ],
      en: [
        'c2 on the common european framework of reference — the top of the scale, proficient user.',
        'in practice it is what makes documentation, rfcs, issues and code review in english my default rather than extra effort. most of what i study was never translated, and waiting for a translation means giving up on getting there first.',
      ],
    },
    topics: {
      pt: ['leitura técnica', 'escrita', 'conversação', 'compreensão'],
      en: ['technical reading', 'writing', 'speaking', 'listening'],
    },
  },
]
