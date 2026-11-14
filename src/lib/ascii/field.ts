/**
 * Shared pieces of the per-cell field art (the black hole, the landscape):
 * every cell of a character grid is asked what is there at time `t`, and
 * answers with a letter, a colour tag and a luminance. `AsciiCanvas` draws
 * the result.
 */

export type Rgb = readonly [number, number, number]

/** A field that renders itself into flat, reused per-cell buffers. */
export interface CellField {
  readonly cols: number
  readonly rows: number
  /** Row-major, `cols * rows` long; `' '` is an empty cell. */
  readonly chars: string[]
  /** Index into the colour list the field is drawn with. */
  readonly tags: Uint8Array
  /** Brightness, 0 to about 1.3. */
  readonly lum: Float32Array
  render(t: number): void
  /**
   * The pointer over the art, both axes `0..1` across its box, or `null`
   * once it leaves. Optional: only interactive fields implement it.
   */
  pointer?(point: BoxPoint | null): void
  /** A press, in the same space as `pointer`. */
  press?(point: BoxPoint): void
}

/** A point in the art's box, both axes `0..1`. */
export interface BoxPoint {
  readonly x: number
  readonly y: number
}

export const TAU = Math.PI * 2

/** Smoothstep on 0..1, clamped. */
export function smooth(x: number): number {
  const c = x < 0 ? 0 : x > 1 ? 1 : x
  return c * c * (3 - 2 * c)
}

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x
}

/** Python's `%`: the result takes the divisor's sign. */
export function mod(a: number, n: number): number {
  return ((a % n) + n) % n
}

/** Small seeded PRNG, so a field looks the same across resizes and reloads. */
export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let x = Math.imul(a ^ (a >>> 15), 1 | a)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** The stroke that follows a direction: `-`, `/`, `|` or `\`. */
export function tangentLetter(dx: number, dy: number): string {
  const s = mod((Math.atan2(-dy, dx) * 180) / Math.PI, 180)
  if (s < 22.5 || s >= 157.5) return '-'
  if (s < 67.5) return '/'
  if (s < 112.5) return '|'
  return '\\'
}
