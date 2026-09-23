import type { Dictionary } from '../types'

export const en: Dictionary = {
  meta: {
    title: 'zelph — full stack developer',
    description:
      "zelph's portfolio: node, react and postgres, with animated ascii art and a terminal that answers back. Projects, certificates and contact.",
    ogAlt: 'english',
  },

  nav: {
    sobre: 'about',
    skills: 'skills',
    projetos: 'projects',
    certificados: 'certificates',
    contato: 'contact',
  },

  hero: {
    welcome: '~/ welcome',
    greetings: {
      morning: 'Good morning,',
      afternoon: 'Good afternoon,',
      evening: 'Good evening,',
    },
    line2: 'traveler!',
    paragraph:
      "sit by the fire for a bit. this is where i keep what i build, what i'm learning and the random things i think are too good to die in an open tab.",
    scroll: 'scroll down',
  },

  sections: {
    sobre: 'about',
    skills: 'skills',
    projetos: 'projects',
    certificados: 'certificates',
    contato: 'contact',
  },

  about: {
    paragraphs: [
      "i'm a developer, mostly web — node on the back, react on the front, postgres underneath. lately i've been digging into rust out of curiosity, and because a compiler yelling at me is a decent way to learn.",
      'i like small things done well: a cli that solves exactly one problem, a terminal configured the right way, ascii art where no ascii art was required.',
      'this site is a bonfire. a place to leave a record before moving on.',
    ],
    timelineLabel: 'TIMELINE',
  },

  skills: {
    tierPro: 'professional',
    tierProDescription: 'I work with this skill actively.',
    tierSecondary: 'secondary',
    tierSecondaryDescription: "I've used it in personal projects or studied it.",
    legendLabel: 'what the levels mean',
    listLabel: 'skill list',
  },

  projects: {
    details: '[ see details ]',
    openSource: 'open source',
    openGithub: '[ open on github ]',
    previous: 'previous project',
    next: 'next project',
    close: 'close',
    counter: '{current} / {total}',
  },

  certificates: {
    openPdf: '[ open pdf ]',
    dragHint: 'drag the certificate',
    enlarge: 'enlarge certificate',
    close: 'close',
    previous: 'previous certificate',
    next: 'next certificate',
    counter: '{current} / {total}',
  },

  dock: {
    consoleOpen: 'console',
    consoleClose: 'close console',
    actionsOpen: "let's talk",
    actionsClose: 'close',
    contactMe: 'get in touch',
    downloadCv: 'download resume',
  },

  terminal: {
    title: 'visitor@portfolio — zsh',
    placeholder: 'type help · tab completes · ↑ repeats',
    prompt: 'visitor@portfolio:~$',
    close: 'close console',
    boot: [
      'portfolio-cli v2.0 — session started',
      'type `help` to list the available commands.',
      'tab completes, ↑ and ↓ walk the history.',
    ],
    helpTitle: 'commands',
    helpHint: 'not everything that runs here shows up on this list.',
    commands: {
      help: 'list the commands',
      whoami: 'who i am',
      neofetch: 'system summary',
      skills: 'skills and the level of each',
      projects: 'list the projects',
      open: 'open a project card',
      certs: 'list the certificates',
      cert: 'enlarge a certificate',
      timeline: 'the career so far',
      contact: 'contact channels',
      copy: 'copy a contact',
      cv: 'download the resume',
      goto: 'scroll to a section',
      lang: 'switch language',
      history: 'previous commands',
      clear: 'clear the terminal',
      exit: 'close the console',
    },
    whoami: [
      'back-end dev focused on node and postgres, react on the front.',
      'i like ascii art, terminals and things that run on their own.',
    ],
    neofetchRole: 'junior full stack dev',
    neofetchLabels: {
      host: 'host',
      role: 'role',
      location: 'location',
      stack: 'stack',
      projects: 'projects',
      certs: 'certificates',
      language: 'language',
      uptime: 'uptime',
    },
    skillsTierPro: 'professional',
    skillsTierProList: '  react · node.js · postgresql · git · docker',
    skillsTierSecondary: 'secondary',
    skillsTierSecondaryList: '  rust · java · python · spring boot · c',
    projectsTitle: 'projects',
    projectsHint: 'run `open <id>` or `open <n>` to bring up the card.',
    certsTitle: 'certificates',
    certsHint: 'run `cert <id>` or `cert <n>` to enlarge it.',
    timelineTitle: 'career',
    contactTitle: 'contact',
    opening: 'opening {name}...',
    unknownProject: 'unknown project. run `projects` for the list.',
    unknownCertificate: 'unknown certificate. run `certs` for the list.',
    copyUsage: 'usage: copy <id> — available: {targets}',
    copyUnknown: 'unknown target. run `contact` for the channels.',
    copyDone: '{target} copied to the clipboard.',
    copyFailed: 'could not reach the clipboard.',
    cvUnavailable:
      'resume not published yet. ask for the current version at matheus.tartari@gmail.com',
    goingTo: 'going to #{section}...',
    unknownSection:
      'unknown section. use: sobre, skills, projetos, certificados, contato',
    langCurrent: 'current language: {locale}',
    langUsage: 'usage: lang <id> — available: {locales}',
    langAlready: 'the site is already in that language.',
    langUnknown: 'unknown language.',
    langSwitching: 'switching to {locale}...',
    historyTitle: 'history',
    historyEmpty: 'no commands yet.',
    notFound: 'command not found: {command} — try `help`',
    tetris: [
      'tetris found in the footer.',
      'it has been playing itself since the first deploy, waiting to be noticed.',
    ],
    bonfireLit: 'bonfire lit.',
    praise: '\\[T]/ praise the sun',
    matrixStop: 'any key to exit',
    matrixHint: 'wake up, neo...',
    sudoDenied: 'visitor is not in the sudoers file. this incident will be reported.',
    sudoGranted: [
      'permission granted.',
      'opening the contact channel — the hard part is yours now.',
    ],
  },

  footer: {
    note: 'made slowly, over a low fire.',
    location: 'joinville — sc',
  },

  a11y: {
    switchLanguage: 'switch language to {language}',
    bonfire: 'animated ascii art bonfire',
    grass: 'animated ascii art grass and tree',
    timeline: 'career timeline in ascii art',
    logo: '{name} logo in 3d ascii',
    skipToContent: 'skip to content',
  },
}
