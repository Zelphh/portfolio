import type { SectionId } from '@/content/navigation'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import type { CommandName } from './names'

/**
 * The console's vocabulary: what a command may print, what it may ask the
 * page to do, and what it knows while running.
 *
 * Commands stay pure functions of `(context) -> result`. Anything that
 * touches the DOM, the router or the clipboard leaves as an effect for the
 * dock to carry out, which is what keeps the whole command set testable
 * without rendering a thing.
 */

export type LineTone = 'input' | 'output' | 'accent' | 'error'

export interface TerminalLine {
  readonly text: string
  readonly tone: LineTone
}

/** Something a command needs the page to do that is not printing text. */
export type TerminalEffect =
  | { readonly type: 'clear' }
  | { readonly type: 'close' }
  | { readonly type: 'scrollTo'; readonly section: SectionId }
  | { readonly type: 'openProject'; readonly index: number }
  | { readonly type: 'openCertificate'; readonly index: number }
  | { readonly type: 'setLocale'; readonly locale: Locale }
  /** Writes `text` to the clipboard; the dock prints whether it worked. */
  | { readonly type: 'copy'; readonly text: string; readonly target: string }
  | { readonly type: 'tetris' }
  | { readonly type: 'bonfire' }
  | { readonly type: 'matrix' }

export interface TerminalResult {
  readonly lines: readonly TerminalLine[]
  readonly effect?: TerminalEffect
  /**
   * Print one line at a time instead of all at once. Reserved for output
   * that is meant to be watched — boot, `neofetch`, the easter eggs — never
   * for a reply the visitor is waiting on.
   */
  readonly stream?: boolean
}

/** Just the console's slice of the dictionary — the only copy it needs. */
export type TerminalCopy = Dictionary['terminal']

export interface CommandContext {
  readonly t: TerminalCopy
  readonly locale: Locale
  /** Everything after the command name, lowercased and split on whitespace. */
  readonly args: readonly string[]
  /** Previously submitted commands, oldest first. Read by `history`. */
  readonly history: readonly string[]
  /** Milliseconds since the console booted. Read by `neofetch`. */
  readonly uptimeMs: number
}

export interface Command {
  readonly name: CommandName
  readonly aliases?: readonly string[]
  /**
   * Argument shape shown by `help`. Deliberately language-neutral (`<id>`,
   * `<n>`) so it needs no translation of its own.
   */
  readonly usage?: string
  /** Candidate first arguments, used by Tab completion. */
  readonly complete?: () => readonly string[]
  readonly run: (context: CommandContext) => TerminalResult
}

export const line = (text: string, tone: LineTone = 'output'): TerminalLine => ({
  text,
  tone,
})
