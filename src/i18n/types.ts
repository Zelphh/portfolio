import type { SectionId } from '@/content/navigation'

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
    line1: string
    line2: string
    paragraph: string
    scroll: string
  }

  sections: Readonly<Record<SectionId, string>> & { github: string }

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
    openPdf: string
    dragHint: string
    previous: string
    next: string
    counter: string
  }

  contributions: {
    /** `{count}` */
    commitsInYear: string
    /** `{days}` */
    streak: string
    lastTwelveMonths: string
    less: string
    more: string
    /** `{date}` */
    noCommits: string
    /** `{date}` and `{count}` */
    someCommits: string
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
    boot: readonly string[]
    helpTitle: string
    helpLines: readonly string[]
    whoami: readonly string[]
    skillsTierPro: string
    skillsTierProList: string
    skillsTierSecondary: string
    skillsTierSecondaryList: string
    projectsHint: string
    contactLines: readonly string[]
    /** `{section}` */
    goingTo: string
    unknownSection: string
    /** `{command}` */
    notFound: string
    cvUnavailable: string
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
