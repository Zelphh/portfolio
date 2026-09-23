/**
 * Fixed ASCII blocks printed by the console.
 *
 * These are art, not copy: they say the same thing in every language, so
 * they live here instead of being duplicated across both dictionaries.
 * Every block is padded to a rectangle, so a caller can set one beside text
 * without measuring anything.
 */

/** The site mark, sized for `neofetch`'s left column. */
export const NEOFETCH_LOGO: readonly string[] = [
  '        /\\        ',
  '       /  \\       ',
  '      /    \\      ',
  '     /  /\\  \\     ',
  '    /  /  \\  \\    ',
  '   /  /____\\  \\   ',
  '  /   ______   \\  ',
  ' /   /      \\   \\ ',
  '/___/        \\___\\',
]

/** Lit by `bonfire`, to match the fire burning behind the hero. */
export const BONFIRE_ART: readonly string[] = [
  '         (',
  '        ) \\',
  '       ( ) (',
  '      ) ( ) )',
  '   \\  ( ) ( )  /',
  '    \\  ) ( (  /',
  '  ___\\__||__/___',
  ' /_/_/_/_||_\\_\\_\\',
]

/** Raised by `praise`. */
export const SUN_ART: readonly string[] = [
  '       \\   |   /',
  '         .---.',
  '   --   /     \\   --',
  '        |  o  |',
  '   --   \\     /   --',
  "         '---'",
  '       /   |   \\',
]

/**
 * Sets two blocks side by side, padding the shorter one with blank lines.
 * Used by `neofetch` to put the mark next to its stat table.
 */
export function beside(
  left: readonly string[],
  right: readonly string[],
  gap = 3,
): string[] {
  const width = Math.max(...left.map((row) => row.length))
  const spacer = ' '.repeat(gap)

  return Array.from(
    { length: Math.max(left.length, right.length) },
    (_, index) =>
      `${(left[index] ?? '').padEnd(width)}${spacer}${right[index] ?? ''}`.trimEnd(),
  )
}

/** `1m 04s`, from a duration in milliseconds. */
export function formatUptime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

/** Left-aligned `label   value` rows, with the labels in one column. */
export function table(rows: ReadonlyArray<readonly [string, string]>): string[] {
  const width = Math.max(...rows.map(([label]) => label.length))
  return rows.map(([label, value]) => `${label.padEnd(width)}  ${value}`)
}
