/**
 * Every command name the console answers to, split by whether `help` lists it.
 *
 * The listed half is a dictionary contract: each name here needs a one-line
 * description under `terminal.commands`, so adding a command to this tuple
 * fails the build until both languages describe it. The hidden half is easter
 * eggs — they run and they are found by trying, never by reading a list.
 */
export const LISTED_COMMANDS = [
  'help',
  'whoami',
  'neofetch',
  'skills',
  'projects',
  'open',
  'certs',
  'cert',
  'timeline',
  'contact',
  'copy',
  'cv',
  'goto',
  'lang',
  'history',
  'clear',
  'exit',
] as const

export type ListedCommand = (typeof LISTED_COMMANDS)[number]

export const HIDDEN_COMMANDS = [
  'tetris',
  'bonfire',
  'praise',
  'matrix',
  'sudo',
] as const

export type HiddenCommand = (typeof HIDDEN_COMMANDS)[number]

export type CommandName = ListedCommand | HiddenCommand
