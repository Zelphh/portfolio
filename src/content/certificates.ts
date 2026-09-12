import type { Certificate } from './types'

export const CERTIFICATES: readonly Certificate[] = [
  {
    id: 'cs50x',
    issuer: 'harvard university (cs50)',
    year: '2025',
    hours: '24h',
    url: 'https://cs50.harvard.edu/certificates/5f5ac8da-16c8-49d3-894c-023d9845a481',
    image: '/certificates/cs50x.jpg',
    imageAspect: '1600 / 1131',
    name: {
      pt: 'cs50x: introdução à ciência da computação',
      en: 'cs50x: introduction to computer science',
    },
    description: {
      pt: 'dez problem sets e um projeto final, de c a python, sql e desenvolvimento web. a base mais purista de algoritmos e estrutura de dados que eu já tive.',
      en: 'ten problem sets and one final project, from c to python, sql and web development. the most purist base in algorithms and data structures i have had.',
    },
  },
  {
    id: 'java-spring-professional',
    issuer: 'devsuperior',
    year: '2024',
    hours: '120h',
    url: 'https://devsuperior.club/c',
    image: '/certificates/java-spring-professional.png',
    imageAspect: '1807 / 1019',
    name: {
      pt: 'java spring professional',
      en: 'java spring professional',
    },
    description: {
      pt: 'rest api, modelagem de domínio, orm com jpa, camadas, tratamento de exceções, validação de dados, consultas sql e jpql, oauth2 e jwt. onde autenticação stateless deixou de ser mágica.',
      en: 'rest api, domain modeling, orm with jpa, layers, exception handling, data validation, sql and jpql queries, oauth2 and jwt. where stateless authentication stopped being magic.',
    },
  },
]
