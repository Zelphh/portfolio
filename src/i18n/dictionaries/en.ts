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
    line1: 'Good evening,',
    line2: 'traveler.',
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
    github: 'github',
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
    dragHint: 'drag the card',
    previous: 'previous certificate',
    next: 'next certificate',
    counter: '{current} / {total}',
  },

  contributions: {
    commitsInYear: 'commits in the last year',
    streak: '@Zelphh · current streak {days} days',
    lastTwelveMonths: 'last 12 months',
    less: 'less',
    more: 'more',
    noCommits: '{date} · no commits',
    someCommits: '{date} · {count} commits',
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
    placeholder: 'type help',
    prompt: 'visitor@portfolio:~$',
    boot: [
      'portfolio-cli v1.0 — session started',
      'type `help` to list the available commands.',
    ],
    helpTitle: 'commands',
    helpLines: [
      '  whoami            who i am',
      '  skills            list skills and level',
      '  projetos          list the projects',
      '  contato           contact channels',
      '  goto <section>    scroll to a section',
      '  clear             clear the terminal',
    ],
    whoami: [
      'back-end dev focused on node and postgres, react on the front.',
      'i like ascii art, terminals and things that run on their own.',
    ],
    skillsTierPro: 'professional',
    skillsTierProList: '  react · node.js · postgresql · git · docker',
    skillsTierSecondary: 'secondary',
    skillsTierSecondaryList: '  rust · java · python · spring boot · c',
    projectsHint: 'run `goto projetos` to see the cards with details.',
    contactLines: [
      'email    matheus.tartari@gmail.com',
      'github   github.com/Zelphh',
      'linkedin linkedin.com/in/matheusmtar',
    ],
    goingTo: 'going to #{section}...',
    unknownSection:
      'unknown section. use: sobre, skills, projetos, certificados, contato',
    notFound: 'command not found: {command} — try `help`',
    cvUnavailable:
      'resume not published yet. ask for the current version at matheus.tartari@gmail.com',
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
