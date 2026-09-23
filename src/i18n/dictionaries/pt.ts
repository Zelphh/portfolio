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
    placeholder: 'digite help · tab completa · ↑ repete',
    prompt: 'visitante@portfolio:~$',
    close: 'fechar console',
    boot: [
      'portfolio-cli v2.0 — sessão iniciada',
      'digite `help` para ver os comandos disponíveis.',
      'tab completa, ↑ e ↓ andam pelo histórico.',
    ],
    helpTitle: 'comandos',
    helpHint: 'nem tudo que roda aqui aparece nessa lista.',
    commands: {
      help: 'lista os comandos',
      whoami: 'quem sou eu',
      neofetch: 'resumo do sistema',
      skills: 'as skills e o nível de cada uma',
      projects: 'lista os projetos',
      open: 'abre o card de um projeto',
      certs: 'lista os certificados',
      cert: 'amplia um certificado',
      timeline: 'a carreira até aqui',
      contact: 'canais de contato',
      copy: 'copia um contato',
      cv: 'baixa o currículo',
      goto: 'rola até a seção',
      lang: 'troca o idioma',
      history: 'comandos anteriores',
      clear: 'limpa o terminal',
      exit: 'fecha o console',
    },
    whoami: [
      'dev back-end focado em node e postgres, com front em react.',
      'gosto de ascii art, terminal e coisas que rodam sozinhas.',
    ],
    neofetchRole: 'dev full stack jr.',
    neofetchLabels: {
      host: 'host',
      role: 'cargo',
      location: 'local',
      stack: 'stack',
      projects: 'projetos',
      certs: 'certificados',
      language: 'idioma',
      uptime: 'uptime',
    },
    skillsTierPro: 'profissional',
    skillsTierProList: '  react · node.js · postgresql · git · docker',
    skillsTierSecondary: 'secundária',
    skillsTierSecondaryList: '  rust · java · python · spring boot · c',
    projectsTitle: 'projetos',
    projectsHint: 'use `open <id>` ou `open <n>` para abrir o card.',
    certsTitle: 'certificados',
    certsHint: 'use `cert <id>` ou `cert <n>` para ampliar.',
    timelineTitle: 'carreira',
    contactTitle: 'contato',
    opening: 'abrindo {name}...',
    unknownProject: 'projeto desconhecido. rode `projects` para ver a lista.',
    unknownCertificate:
      'certificado desconhecido. rode `certs` para ver a lista.',
    copyUsage: 'uso: copy <id> — disponíveis: {targets}',
    copyUnknown: 'alvo desconhecido. rode `contato` para ver os canais.',
    copyDone: '{target} copiado para a área de transferência.',
    copyFailed: 'não consegui acessar a área de transferência.',
    cvUnavailable:
      'currículo ainda não publicado. peça a versão atual em matheus.tartari@gmail.com',
    goingTo: 'indo para #{section}...',
    unknownSection:
      'seção desconhecida. use: sobre, skills, projetos, certificados, contato',
    langCurrent: 'idioma atual: {locale}',
    langUsage: 'uso: lang <id> — disponíveis: {locales}',
    langAlready: 'o site já está nesse idioma.',
    langUnknown: 'idioma desconhecido.',
    langSwitching: 'trocando para {locale}...',
    historyTitle: 'histórico',
    historyEmpty: 'nenhum comando ainda.',
    notFound: 'comando não encontrado: {command} — tente `help`',
    tetris: [
      'tetris encontrado no rodapé do site.',
      'ele joga sozinho desde o primeiro deploy, esperando alguém reparar.',
    ],
    bonfireLit: 'bonfire lit.',
    praise: '\\[T]/ praise the sun',
    matrixHint: 'acorde, neo...',
    matrixStop: 'qualquer tecla para sair',
    sudoDenied:
      'visitante não está no arquivo sudoers. este incidente será reportado.',
    sudoGranted: [
      'permissão concedida.',
      'abrindo o canal de contato — a parte difícil agora é sua.',
    ],
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
