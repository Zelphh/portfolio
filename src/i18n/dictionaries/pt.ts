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
    line1: 'Boa noite,',
    line2: 'viajante.',
    paragraph:
      'senta um pouco perto do fogo. aqui eu guardo o que construo, o que ando aprendendo e as coisas aleatórias que acho boas demais pra deixar morrer numa aba aberta.',
    scroll: 'role pra baixo',
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
      'sou desenvolvedor, mexo principalmente com web — backend em node, front em react, banco em postgres. ultimamente ando cavando rust por curiosidade e porque compilador gritando comigo é uma forma decente de aprender.',
      'gosto de coisa pequena e bem feita: cli que resolve um problema só, terminal configurado do jeito certo, ascii art onde não precisava ter ascii art.',
      'esse site é uma fogueira. um lugar pra deixar registro antes de seguir andando.',
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
    dragHint: 'arraste o card',
    previous: 'certificado anterior',
    next: 'próximo certificado',
    counter: '{current} / {total}',
  },

  contributions: {
    commitsInYear: 'commits no último ano',
    streak: '@zelph · sequência atual {days} dias',
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
      'email    ola@exemplo.dev',
      'github   github.com/zelph',
      'linkedin linkedin.com/in/zelph',
    ],
    goingTo: 'indo para #{section}...',
    unknownSection:
      'seção desconhecida. use: sobre, skills, projetos, certificados, contato',
    notFound: 'comando não encontrado: {command} — tente `help`',
    cvUnavailable:
      'currículo ainda não publicado. peça a versão atual em ola@exemplo.dev',
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
