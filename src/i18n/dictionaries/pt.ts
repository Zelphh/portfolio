import type { Dictionary } from '../types'

export const pt: Dictionary = {
  meta: {
    title: 'zelph — Desenvolvedor full stack',
    description:
      'Portfólio de zelph: Node, React e Postgres, com ASCII art animada e um terminal que responde. Projetos, certificados e contato.',
    ogAlt: 'Português',
  },

  nav: {
    sobre: 'Sobre',
    skills: 'Skills',
    projetos: 'Projetos',
    certificados: 'Estudos',
    contato: 'Contato',
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
      'Bem-vindo ao meu cantinho. Aqui eu compartilho o que construo, o que ando aprendendo e quaisquer outras coisas que eu ache interessante.',
    scroll: 'Sinta-se à vontade',
  },

  sections: {
    sobre: 'Sobre',
    skills: 'Skills',
    projetos: 'Projetos',
    certificados: 'Estudos',
    contato: 'Contato',
  },

  about: {
    paragraphs: [
      'Sou desenvolvedor fullstack, mexo principalmente com programação web, backend em Node, front em React e banco em Postgres (Não MySQL 🤢). Ultimamente venho aprendendo Rust por curiosidade e demandas relacionadas no trabalho.',
      'Minha base na programação foi fundada antes da atual era da IA, então não, não sou dependente de IA para criar código, mas, atualmente uso CLI (Claude) no trabalho para desenvolver projetos.',
      'Gosto de compartilhar experiências e conhecimentos, sinta-se à vontade para entrar em contato.',
    ],
    timelineLabel: 'TRAJETÓRIA',
  },

  skills: {
    tierPro: 'Profissional',
    tierProDescription: 'Trabalho ativamente com a skill.',
    tierSecondary: 'Secundária',
    tierSecondaryDescription: 'Já usei em projetos pessoais ou estudei sobre.',
    legendLabel: 'O que os níveis significam',
    listLabel: 'Lista de skills',
  },

  projects: {
    details: '[ Ver detalhes ]',
    inProgress: 'Em andamento',
    openSource: 'Código aberto',
    openGithub: '[ Abrir no GitHub ]',
    previous: 'Projeto anterior',
    next: 'Próximo projeto',
    close: 'Fechar',
    counter: '{current} / {total}',
  },

  certificates: {
    intro:
      'A base formal, os cursos que valeram e o que eu estudo por conta. Clica em qualquer um pra ver o que ficou.',
    kinds: {
      degree: 'Graduação',
      course: 'Curso',
      certification: 'Certificação',
    },
    openCertificate: '[ Abrir certificado ]',
    certNote: 'Certificado disponível',
    noCert: 'Sem certificado publicado',
    enlarge: 'Ampliar certificado',
    close: 'Fechar',
  },

  dock: {
    consoleOpen: 'Console',
    consoleClose: 'Fechar console',
    actionsOpen: 'Vamos conversar',
    actionsClose: 'Fechar',
    contactMe: 'Entrar em contato',
    downloadCv: 'Baixar currículo',
  },

  terminal: {
    title: 'visitante@portfolio — zsh',
    placeholder: 'Digite help · tab completa · ↑ repete',
    prompt: 'visitante@portfolio:~$',
    close: 'Fechar console',
    boot: [
      'portfolio-cli v2.0 — sessão iniciada',
      'Digite `help` para ver os comandos disponíveis.',
      'Tab completa, ↑ e ↓ andam pelo histórico.',
    ],
    helpTitle: 'Comandos',
    helpHint: 'Nem tudo que roda aqui aparece nessa lista.',
    commands: {
      help: 'Lista os comandos',
      whoami: 'Quem sou eu',
      neofetch: 'Resumo do sistema',
      skills: 'As skills e o nível de cada uma',
      projects: 'Lista os projetos',
      open: 'Abre o card de um projeto',
      certs: 'Lista os estudos e certificados',
      cert: 'Abre um certificado',
      timeline: 'A carreira até aqui',
      contact: 'Canais de contato',
      copy: 'Copia um contato',
      cv: 'Baixa o currículo',
      goto: 'Rola até a seção',
      lang: 'Troca o idioma',
      history: 'Comandos anteriores',
      clear: 'Limpa o terminal',
      exit: 'Fecha o console',
    },
    whoami: [
      'Dev back-end focado em Node e Postgres, com front em React.',
      'Gosto de ASCII art, terminal e coisas que rodam sozinhas.',
    ],
    neofetchRole: 'Dev full stack jr.',
    neofetchLabels: {
      host: 'Host',
      role: 'Cargo',
      location: 'Local',
      stack: 'Stack',
      projects: 'Projetos',
      certs: 'Estudos',
      language: 'Idioma',
      uptime: 'Uptime',
    },
    skillsTierPro: 'Profissional',
    skillsTierProList: '  React · Node.js · PostgreSQL · Git · Docker',
    skillsTierSecondary: 'Secundária',
    skillsTierSecondaryList: '  Rust · Java · Python · Spring Boot · C',
    projectsTitle: 'Projetos',
    projectsWip: 'Em andamento',
    projectsHint: 'Use `open <id>` ou `open <n>` para abrir o card.',
    certsTitle: 'Estudos',
    certsHint: 'Use `cert <id>` ou `cert <n>` para abrir.',
    timelineTitle: 'Carreira',
    contactTitle: 'Contato',
    opening: 'Abrindo {name}...',
    unknownProject: 'Projeto desconhecido. Rode `projects` para ver a lista.',
    unknownCertificate:
      'Certificado desconhecido. Rode `certs` para ver a lista.',
    copyUsage: 'Uso: copy <id> — disponíveis: {targets}',
    copyUnknown: 'Alvo desconhecido. Rode `contato` para ver os canais.',
    copyDone: '{target} copiado para a área de transferência.',
    copyFailed: 'Não consegui acessar a área de transferência.',
    cvUnavailable:
      'Currículo ainda não publicado. Peça a versão atual em matheus.tartari@gmail.com',
    goingTo: 'Indo para #{section}...',
    unknownSection:
      'Seção desconhecida. Use: sobre, skills, projetos, certificados, contato',
    langCurrent: 'Idioma atual: {locale}',
    langUsage: 'Uso: lang <id> — disponíveis: {locales}',
    langAlready: 'O site já está nesse idioma.',
    langUnknown: 'Idioma desconhecido.',
    langSwitching: 'Trocando para {locale}...',
    historyTitle: 'Histórico',
    historyEmpty: 'Nenhum comando ainda.',
    notFound: 'Comando não encontrado: {command} — tente `help`',
    tetris: [
      'Tetris encontrado no rodapé do site.',
      'Ele joga sozinho desde o primeiro deploy, esperando alguém reparar.',
    ],
    bonfireLit: 'Bonfire lit.',
    praise: '\\[T]/ praise the sun',
    matrixHint: 'Acorde, Neo...',
    matrixStop: 'Qualquer tecla para sair',
    sudoDenied:
      'Visitante não está no arquivo sudoers. Este incidente será reportado.',
    sudoGranted: [
      'Permissão concedida.',
      'Abrindo o canal de contato — a parte difícil agora é sua.',
    ],
  },

  footer: {
    note: 'Feito devagar, com fogo baixo.',
    location: 'Joinville — SC',
  },

  a11y: {
    switchLanguage: 'Mudar idioma para {language}',
    bonfire: 'Fogueira em arte ASCII animada',
    grass: 'Grama e árvore em arte ASCII animada',
    timeline: 'Trajetória profissional em arte ASCII',
    logo: 'Logo do {name} em ASCII 3D',
    skipToContent: 'Pular para o conteúdo',
  },
}
