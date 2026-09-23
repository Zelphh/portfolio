import { format } from '@/i18n/format'
import { lookup } from './commands'
import { LISTED_COMMANDS } from './names'
import {
  line,
  type CommandContext,
  type TerminalCopy,
  type TerminalLine,
  type TerminalResult,
} from './types'

/**
 * The console's entry points: run a line, complete a line, print the banner.
 *
 * All three read the same registry in `./commands`, so the three never
 * disagree about what exists.
 */

export * from './types'
export { LISTED_COMMANDS, HIDDEN_COMMANDS } from './names'

/** What the caller knows before an input is split into command and arguments. */
export type RunContext = Omit<CommandContext, 'args'>

export function bootLines(copy: TerminalCopy): TerminalLine[] {
  return copy.boot.map((text) => line(text))
}

export function runCommand(raw: string, context: RunContext): TerminalResult {
  const input = raw.trim()
  if (!input) return { lines: [] }

  const echo = line(`${context.t.prompt} ${input}`, 'input')
  const [name = '', ...args] = input.toLowerCase().split(/\s+/)
  const command = lookup(name)

  if (!command) {
    return {
      lines: [echo, line(format(context.t.notFound, { command: name }), 'error')],
    }
  }

  const result = command.run({ ...context, args })

  // `clear` is the one command whose echo would outlive the screen it wipes.
  if (result.effect?.type === 'clear') return result

  return { ...result, lines: [echo, ...result.lines] }
}

export interface Completion {
  /** The input as it should read after completing; unchanged when nothing fits. */
  readonly value: string
  /** Candidates to print when the prefix is still ambiguous. */
  readonly hints: readonly string[]
}

/** The longest prefix shared by every candidate, e.g. `ce` for `cert`/`certs`. */
function commonPrefix(values: readonly string[]): string {
  const [first = '', ...rest] = values
  let length = first.length

  for (const value of rest) {
    while (length > 0 && !value.startsWith(first.slice(0, length))) length--
  }

  return first.slice(0, length)
}

function resolve(matches: readonly string[], prefix: string, head: string): Completion {
  const [only] = matches
  if (!only) return { value: head + prefix, hints: [] }
  if (matches.length === 1) return { value: `${head}${only} `, hints: [] }

  return { value: head + commonPrefix(matches), hints: matches }
}

/**
 * Tab completion.
 *
 * Only listed commands are offered: an easter egg that autocompletes is no
 * longer an easter egg. Typed in full they still run.
 */
export function complete(input: string): Completion {
  const trailingSpace = /\s$/.test(input)
  const [name = '', ...args] = input.trimStart().split(/\s+/)

  if (args.length === 0 && !trailingSpace) {
    const prefix = name.toLowerCase()
    const matches = LISTED_COMMANDS.filter((command) => command.startsWith(prefix))
    return resolve(matches, prefix, '')
  }

  const options = lookup(name.toLowerCase())?.complete?.()
  if (!options) return { value: input, hints: [] }

  const prefix = (trailingSpace ? '' : (args.at(-1) ?? '')).toLowerCase()
  const head = `${name} ${args.slice(0, trailingSpace ? args.length : -1).join(' ')}`
  const matches = options.filter((option) => option.startsWith(prefix))

  return resolve(matches, prefix, head.trimEnd() + ' ')
}
