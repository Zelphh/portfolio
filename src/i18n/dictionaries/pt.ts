import type { Dictionary } from '../types'

export const pt: Dictionary = {
  meta: {
    title: 'zelph — desenvolvedor full stack',
    description:
      'Portfólio de zelph: node, react e postgres, com ascii art animada e um terminal que responde. Projetos, certificados e contato.',
    ogAlt: 'português',
  },

  nav: {
    sobre: 'sobre',
    skills: 'skills',
    projetos: 'projetos',
    certificados: 'certificados',
    contato: 'contato',
  },

  hero: {
    welcome: '~/ bem-vindo',
    greetings: {
      morning: 'Bom dia,',
      afternoon: 'Boa tarde,',
      evening: 'Boa noite,',
    },
    line2: 'viajante!',
    paragraph:
      'bem vindo ao meu cantinho. aqui eu compartilho o que construo, o que ando aprendendo e quaisquer outras coisas que eu ache interessante.',
    scroll: 'Sintasse a vontade',
  },

  sections: {
    sobre: 'sobre',
    skills: 'skills',
    projetos: 'projetos',
    certificados: 'certificados',
    contato: 'contato',
    github: 'github',
  },

  about: {
    paragraphs: [
      'sou desenvolvedor fullstack, mexo principalmente com programação web, backend em node, front em react e banco em postgres (Não MySQL 🤢). ultimamente venho aprendendo rust por curiosidade e demandas relacionadas no trabalho.',
      'minha base na programação foi fundada antes da atual era da IA, então não, não sou dependente de IA para criar código, mas, atualmente uso cli (Claude) no trabalho para desenvolver projetos.',
      'gosto de compartilhar experiências e conhecimentos, sinta-se à vontade para entrar em contato.',
    ],
    timelineLabel: 'TRAJETÓRIA',
  },

  skills: {
    tierPro: 'profissional',
    tierProDescription: 'Trabalho ativamente com a skill.',
    tierSecondary: 'secundária',
    tierSecondaryDescription: 'Já usei em projetos pessoais ou estudei sobre.',
    legendLabel: 'o que os níveis significam',
    listLabel: 'lista de skills',
  },

  projects: {
    details: '[ ver detalhes ]',
    openSource: 'código aberto',
    openGithub: '[ abrir no github ]',
    previous: 'projeto anterior',
    next: 'próximo projeto',
    close: 'fechar',
    counter: '{current} / {total}',
  },

  certificates: {
    openPdf: '[ abrir pdf ]',
    dragHint: 'arraste o certificado',
    enlarge: 'ampliar certificado',
    close: 'fechar',
    previous: 'certificado anterior',
    next: 'próximo certificado',
    counter: '{current} / {total}',
  },

  contributions: {
    commitsInYear: 'commits no último ano',
    streak: '@Zelphh · sequência atual {days} dias',
    lastTwelveMonths: 'últimos 12 meses',
    less: 'menos',
    more: 'mais',
    noCommits: '{date} · sem commits',
    someCommits: '{date} · {count} commits',
  },

  dock: {
    consoleOpen: 'console',
    consoleClose: 'fechar console',
    actionsOpen: 'vamos conversar',
    actionsClose: 'fechar',
    contactMe: 'entrar em contato',
    downloadCv: 'baixar currículo',
  },

  terminal: {
    title: 'visitante@portfolio — zsh',
    placeholder: 'digite help',
    prompt: 'visitante@portfolio:~$',
    boot: [
      'portfolio-cli v1.0 — sessão iniciada',
      'digite `help` para ver os comandos disponíveis.',
    ],
    helpTitle: 'comandos',
    helpLines: [
      '  whoami            quem sou eu',
      '  skills            lista as skills e o nível',
      '  projetos          lista os projetos',
      '  contato           canais de contato',
      '  goto <seção>      rola até a seção',
      '  clear             limpa o terminal',
    ],
    whoami: [
      'dev back-end focado em node e postgres, com front em react.',
      'gosto de ascii art, terminal e coisas que rodam sozinhas.',
    ],
    skillsTierPro: 'profissional',
    skillsTierProList: '  react · node.js · postgresql · git · docker',
    skillsTierSecondary: 'secundária',
    skillsTierSecondaryList: '  rust · java · python · spring boot · c',
    projectsHint: 'use `goto projetos` para ver os cards com detalhes.',
    contactLines: [
      'email    matheus.tartari@gmail.com',
      'github   github.com/Zelphh',
      'linkedin linkedin.com/in/matheusmtar',
    ],
    goingTo: 'indo para #{section}...',
    unknownSection:
      'seção desconhecida. use: sobre, skills, projetos, certificados, contato',
    notFound: 'comando não encontrado: {command} — tente `help`',
    cvUnavailable:
      'currículo ainda não publicado. peça a versão atual em matheus.tartari@gmail.com',
  },

  footer: {
    note: 'feito devagar, com fogo baixo.',
    location: 'joinville — sc',
  },

  a11y: {
    switchLanguage: 'mudar idioma para {language}',
    bonfire: 'fogueira em arte ascii animada',
    grass: 'grama e árvore em arte ascii animada',
    timeline: 'trajetória profissional em arte ascii',
    logo: 'logo do {name} em ascii 3d',
    skipToContent: 'pular para o conteúdo',
  },
}
