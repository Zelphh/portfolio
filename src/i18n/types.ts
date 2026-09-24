import type { SectionId } from '@/content/navigation'
import type { StudyKind } from '@/content/types'
import type { ListedCommand } from '@/lib/terminal/names'

/**
 * The full UI copy contract. Both dictionaries are typed against it, so a
 * key added to Portuguese fails the build until English catches up.
 *
 * Domain copy (project write-ups, skill blurbs, certificate descriptions)
 * lives next to its data in `src/content` — this file is chrome only.
 */
export interface Dictionary {
  meta: {
    title: string
    description: string
    /** Human label for this language, shown in the toggle. */
    ogAlt: string
  }

  nav: Readonly<Record<SectionId, string>>

  hero: {
    welcome: string
    /** Keyed by time of day — read client-side from the visitor's own clock. */
    greetings: Readonly<{ morning: string; afternoon: string; evening: string }>
    line2: string
    paragraph: string
    scroll: string
  }

  sections: Readonly<Record<SectionId, string>>

  about: {
    paragraphs: readonly [string, string, string]
    timelineLabel: string
  }

  skills: {
    tierPro: string
    tierProDescription: string
    tierSecondary: string
    tierSecondaryDescription: string
    legendLabel: string
    listLabel: string
  }

  projects: {
    details: string
    openSource: string
    openGithub: string
    previous: string
    next: string
    close: string
    /** `{current} / {total}` */
    counter: string
  }

  certificates: {
    /** Standfirst under the section heading. */
    intro: string
    /** Badge copy per study kind — the pill on every card and dialog. */
    kinds: Readonly<Record<StudyKind, string>>
    openCertificate: string
    /** Footer note when there is a credential to open, and when there is not. */
    certNote: string
    noCert: string
    /** Aria-label for the click-to-zoom scan and the lightbox's close button. */
    enlarge: string
    close: string
  }

  dock: {
    consoleOpen: string
    consoleClose: string
    actionsOpen: string
    actionsClose: string
    contactMe: string
    downloadCv: string
  }

  terminal: {
    title: string
    placeholder: string
    prompt: string
    /** Aria-label for the panel's close button. */
    close: string
    boot: readonly string[]
    helpTitle: string
    /** Nudge that `help` is not the whole list. */
    helpHint: string
    /**
     * One line per command `help` lists. The tuple in `lib/terminal/names`
     * is the contract: add a name there and this record stops compiling
     * until both languages describe it.
     */
    commands: Readonly<Record<ListedCommand, string>>
    whoami: readonly string[]
    neofetchRole: string
    neofetchLabels: Readonly<{
      host: string
      role: string
      location: string
      stack: string
      projects: string
      certs: string
      language: string
      uptime: string
    }>
    skillsTierPro: string
    skillsTierProList: string
    skillsTierSecondary: string
    skillsTierSecondaryList: string
    projectsTitle: string
    projectsHint: string
    certsTitle: string
    certsHint: string
    timelineTitle: string
    contactTitle: string
    /** `{name}` */
    opening: string
    unknownProject: string
    unknownCertificate: string
    /** `{targets}` */
    copyUsage: string
    copyUnknown: string
    /** `{target}` */
    copyDone: string
    copyFailed: string
    cvUnavailable: string
    /** `{section}` */
    goingTo: string
    unknownSection: string
    /** `{locale}` */
    langCurrent: string
    /** `{locales}` */
    langUsage: string
    langAlready: string
    langUnknown: string
    /** `{locale}` */
    langSwitching: string
    historyTitle: string
    historyEmpty: string
    /** `{command}` */
    notFound: string
    /** Printed by the hidden `tetris` command. */
    tetris: readonly string[]
    bonfireLit: string
    praise: string
    matrixHint: string
    matrixStop: string
    sudoDenied: string
    sudoGranted: readonly string[]
  }

  footer: {
    note: string
    location: string
  }

  a11y: {
    /** `{language}` */
    switchLanguage: string
    bonfire: string
    grass: string
    timeline: string
    /** `{name}` */
    logo: string
    skipToContent: string
  }
}
