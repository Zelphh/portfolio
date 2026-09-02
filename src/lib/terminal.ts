import { isSectionId, type SectionId } from '@/content/navigation'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'

/**
 * The console's command set, kept as a pure function of (input, dictionary).
 * The panel component only renders lines and applies effects, so adding a
 * command never touches the UI.
 */

export type LineTone = 'input' | 'output' | 'accent' | 'error'

export interface TerminalLine {
  readonly text: string
  readonly tone: LineTone
}

/** Something the command needs the page to do that is not printing text. */
export type TerminalEffect =
  | { readonly type: 'clear' }
  | { readonly type: 'scrollTo'; readonly section: SectionId }

export interface TerminalResult {
  readonly lines: readonly TerminalLine[]
  readonly effect?: TerminalEffect
}

/** Just the console's slice of the dictionary — the only copy it needs. */
export type TerminalCopy = Dictionary['terminal']

const line = (text: string, tone: LineTone = 'output'): TerminalLine => ({
  text,
  tone,
})

export function bootLines(copy: TerminalCopy): TerminalLine[] {
  return copy.boot.map((text) => line(text))
}

export function runCommand(raw: string, t: TerminalCopy): TerminalResult {
  const input = raw.trim()
  if (!input) return { lines: [] }

  const echo = line(`${t.prompt} ${input}`, 'input')
  const [name = '', ...args] = input.toLowerCase().split(/\s+/)

  switch (name) {
    case 'help':
      return {
        lines: [
          echo,
          line(t.helpTitle, 'accent'),
          ...t.helpLines.map((text) => line(text)),
        ],
      }

    case 'whoami':
      return { lines: [echo, ...t.whoami.map((text) => line(text))] }

    case 'skills':
      return {
        lines: [
          echo,
          line(t.skillsTierPro, 'accent'),
          line(t.skillsTierProList),
          line(t.skillsTierSecondary, 'accent'),
          line(t.skillsTierSecondaryList),
        ],
      }

    case 'projetos':
    case 'projects':
      return { lines: [echo, line(t.projectsHint)] }

    case 'contato':
    case 'contact':
      return { lines: [echo, ...t.contactLines.map((text) => line(text))] }

    case 'goto': {
      const target = args[0] ?? ''
      if (!isSectionId(target)) {
        return { lines: [echo, line(t.unknownSection, 'error')] }
      }
      return {
        lines: [echo, line(format(t.goingTo, { section: target }))],
        effect: { type: 'scrollTo', section: target },
      }
    }

    case 'clear':
      return { lines: [], effect: { type: 'clear' } }

    default:
      return {
        lines: [echo, line(format(t.notFound, { command: name }), 'error')],
      }
  }
}

/** Lines printed when the "download resume" action is used. */
export function resumeLines(copy: TerminalCopy): TerminalLine[] {
  return [
    line(`${copy.prompt} curriculo --download`, 'input'),
    line(copy.cvUnavailable, 'error'),
  ]
}
