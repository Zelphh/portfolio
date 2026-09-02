/** Joins class names, dropping anything falsy. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

/** Always-positive modulo, unlike `%` for negative operands. */
export function mod(value: number, length: number): number {
  return ((value % length) + length) % length
}

/**
 * Shortest signed distance from `position` to slot `index` on a ring of
 * `length` slots. Drives both the skill wheel and the project carousel:
 * items wrap around instead of snapping back to the start.
 */
export function ringOffset(
  index: number,
  position: number,
  length: number,
): number {
  const offset = mod(index - position, length)
  return offset > length / 2 ? offset - length : offset
}

export const pad2 = (value: number): string => String(value).padStart(2, '0')
