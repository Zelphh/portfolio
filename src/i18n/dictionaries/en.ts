import type { Dictionary } from '../types'

export const en: Dictionary = {
  meta: {
    title: 'zelph — Full stack developer',
    description:
      "zelph's portfolio: Node, React and Postgres, with animated ASCII art and a terminal that answers back. Projects, certificates and contact.",
    ogAlt: 'English',
  },

  nav: {
    sobre: 'About',
    skills: 'Skills',
    projetos: 'Projects',
    certificados: 'Studies',
    contato: 'Contact',
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
      "Sit by the fire for a bit. This is where I keep what I build, what I'm learning and the random things I think are too good to die in an open tab.",
    scroll: 'Scroll down',
  },

  sections: {
    sobre: 'About',
    skills: 'Skills',
    projetos: 'Projects',
    certificados: 'Studies',
    contato: 'Contact',
  },

  about: {
    paragraphs: [
      "I'm a developer, mostly web — Node on the back, React on the front, Postgres underneath. Lately I've been digging into Rust out of curiosity, and because a compiler yelling at me is a decent way to learn.",
      'I like small things done well: a CLI that solves exactly one problem, a terminal configured the right way, ASCII art where no ASCII art was required.',
      'This site is a bonfire. A place to leave a record before moving on.',
    ],
    timelineLabel: 'TIMELINE',
  },

  skills: {
    tierPro: 'Professional',
    tierProDescription: 'I work with this skill actively.',
    tierSecondary: 'Secondary',
    tierSecondaryDescription: "I've used it in personal projects or studied it.",
    legendLabel: 'What the levels mean',
    listLabel: 'Skill list',
  },

  projects: {
    details: '[ See details ]',
    inProgress: 'In progress',
    openSource: 'Open source',
    openGithub: '[ Open on GitHub ]',
    previous: 'Previous project',
    next: 'Next project',
    close: 'Close',
    counter: '{current} / {total}',
  },

  certificates: {
    intro:
      'The formal base, the courses that were worth it and what I study on my own. Click any of them to see what stuck.',
    kinds: {
      degree: 'Degree',
      course: 'Course',
      certification: 'Certification',
    },
    openCertificate: '[ Open certificate ]',
    certNote: 'Certificate available',
    noCert: 'No certificate published',
    enlarge: 'Enlarge certificate',
    close: 'Close',
  },

  dock: {
    consoleOpen: 'Console',
    consoleClose: 'Close console',
    actionsOpen: "Let's talk",
    actionsClose: 'Close',
    contactMe: 'Get in touch',
    downloadCv: 'Download resume',
  },

  terminal: {
    title: 'visitor@portfolio — zsh',
    placeholder: 'Type help · tab completes · ↑ repeats',
    prompt: 'visitor@portfolio:~$',
    close: 'Close console',
    boot: [
      'portfolio-cli v2.0 — session started',
      'Type `help` to list the available commands.',
      'Tab completes, ↑ and ↓ walk the history.',
    ],
    helpTitle: 'Commands',
    helpHint: 'Not everything that runs here shows up on this list.',
    commands: {
      help: 'List the commands',
      whoami: 'Who I am',
      neofetch: 'System summary',
      skills: 'Skills and the level of each',
      projects: 'List the projects',
      open: 'Open a project card',
      certs: 'List the studies and certificates',
      cert: 'Open a certificate',
      timeline: 'The career so far',
      contact: 'Contact channels',
      copy: 'Copy a contact',
      cv: 'Download the resume',
      goto: 'Scroll to a section',
      lang: 'Switch language',
      history: 'Previous commands',
      clear: 'Clear the terminal',
      exit: 'Close the console',
    },
    whoami: [
      'Back-end dev focused on Node and Postgres, React on the front.',
      'I like ASCII art, terminals and things that run on their own.',
    ],
    neofetchRole: 'Junior full stack dev',
    neofetchLabels: {
      host: 'Host',
      role: 'Role',
      location: 'Location',
      stack: 'Stack',
      projects: 'Projects',
      certs: 'Studies',
      language: 'Language',
      uptime: 'Uptime',
    },
    skillsTierPro: 'Professional',
    skillsTierProList: '  React · Node.js · PostgreSQL · Git · Docker',
    skillsTierSecondary: 'Secondary',
    skillsTierSecondaryList: '  Rust · Java · Python · Spring Boot · C',
    projectsTitle: 'Projects',
    projectsWip: 'In progress',
    projectsHint: 'Run `open <id>` or `open <n>` to bring up the card.',
    certsTitle: 'Studies',
    certsHint: 'Run `cert <id>` or `cert <n>` to open it.',
    timelineTitle: 'Career',
    contactTitle: 'Contact',
    opening: 'Opening {name}...',
    unknownProject: 'Unknown project. Run `projects` for the list.',
    unknownCertificate: 'Unknown certificate. Run `certs` for the list.',
    copyUsage: 'Usage: copy <id> — available: {targets}',
    copyUnknown: 'Unknown target. Run `contact` for the channels.',
    copyDone: '{target} copied to the clipboard.',
    copyFailed: 'Could not reach the clipboard.',
    cvUnavailable:
      'Resume not published yet. Ask for the current version at matheus.tartari@gmail.com',
    goingTo: 'Going to #{section}...',
    unknownSection:
      'Unknown section. Use: sobre, skills, projetos, certificados, contato',
    langCurrent: 'Current language: {locale}',
    langUsage: 'Usage: lang <id> — available: {locales}',
    langAlready: 'The site is already in that language.',
    langUnknown: 'Unknown language.',
    langSwitching: 'Switching to {locale}...',
    historyTitle: 'History',
    historyEmpty: 'No commands yet.',
    notFound: 'Command not found: {command} — try `help`',
    tetris: [
      'Tetris found in the footer.',
      'It has been playing itself since the first deploy, waiting to be noticed.',
    ],
    bonfireLit: 'Bonfire lit.',
    praise: '\\[T]/ praise the sun',
    matrixStop: 'Any key to exit',
    matrixHint: 'Wake up, Neo...',
    sudoDenied: 'Visitor is not in the sudoers file. This incident will be reported.',
    sudoGranted: [
      'Permission granted.',
      'Opening the contact channel — the hard part is yours now.',
    ],
  },

  footer: {
    note: 'Made slowly, over a low fire.',
    location: 'Joinville — SC',
  },

  a11y: {
    switchLanguage: 'Switch language to {language}',
    bonfire: 'Animated ASCII art bonfire',
    grass: 'Animated ASCII art grass and tree',
    timeline: 'Career timeline in ASCII art',
    logo: '{name} logo in 3D ASCII',
    skipToContent: 'Skip to content',
  },
}
