/**
 * Black Hole — ASCII Code Art by JIN2 (@jin_22ee), 2026.
 * https://github.com/JIN2-ASCII/-JIN2-ASCII/tree/main/BLACK-HOLE
 *
 * A TypeScript port of the original `black_hole.py`, shared by the artist for
 * free for personal projects with credit (see the repo's LICENSE.txt: no
 * commercial use, credit @jin_22ee). The maths is the original's, cell for
 * cell; only the NumPy array ops are unrolled into a per-cell loop, and work
 * is skipped in cells where a layer is provably zero.
 *
 * Every cell asks "how hot is the gas here?" and the answer becomes a letter
 * and a colour:
 *   1. a thin ring of light draws itself around the empty shadow;
 *   2. a soft glow breathes around it;
 *   3. the accretion disk, tilted and almost edge on, opens out sideways,
 *      inner orbits turning faster (Keplerian, r^-1.5);
 *   4. the far side of the disk shows up bent over the shadow (lensing);
 *   5. at FLASH everything flares, a shock ring runs out, the view moves in,
 *      and sparks of light ride the orbits from then on.
 */

import {
  type CellField,
  clamp01,
  mod,
  mulberry32,
  type Rgb,
  smooth,
  TAU,
  tangentLetter,
} from './field'

/** Letter pools, dark to bright. */
const POOLS = ['1il!;:', 'rtfjcvxz=+', 'aeoun0{}[]<>', '08B$#&%Q'] as const
const FILL = POOLS.map((pool) =>
  Array.from({ length: 12 }, (_, k) => pool[k % pool.length]!),
)

/** deep red, red, orange, amber, white hot, star, dust */
export const BLACK_HOLE_COLORS: readonly Rgb[] = [
    [190, 38, 12],
    [242, 78, 20],
    [255, 124, 34],
    [255, 172, 78],
    [255, 222, 168],
    [220, 228, 255],
    [130, 72, 48],
  ]
const DEEP = 0
const RED = 1
const ORANGE = 2
const AMBER = 3
const HOT = 4
const STAR = 5
const DUST = 6

/** Shadow radius, with the frame height = 1. */
const R0 = 0.11
/** The disk leans down to the right. */
const TILT = (17 * Math.PI) / 180
const COS_TILT = Math.cos(TILT)
const SIN_TILT = Math.sin(TILT)
/** How flat the disk looks from here. */
const INC = 0.12
const R_IN = 1.55 * R0
const R_OUT = 5.4 * R0
/** The moment the disk lights up (s). */
export const BLACK_HOLE_FLASH = 7.8

/** Orbiting sparks: ring radius (in R0), start angle, angular speed. */
const PULSES = [
  [Math.log(1.8), 0.0, 0.95],
  [Math.log(2.4), 2.1, 0.8],
  [Math.log(3.2), 4.2, 0.65],
] as const



/** Python's `%`: the result takes the divisor's sign. */

function spin(t: number): number {
  // Slow drift before the flash, a little faster after it.
  const s = Math.max(t - BLACK_HOLE_FLASH, 0)
  return 0.06 * t + 0.28 * (s - 0.8 * (1 - Math.exp(-s / 0.8)))
}

function ripple(a: number, b: number, t: number): number {
  return (
    Math.sin(a + 0.9 * Math.sin(b + 1.3 * t)) * 0.5 +
    Math.sin(2.3 * a - b + 0.7 * t) * 0.3 +
    Math.sin(4.1 * a + 1.7 * b - 1.1 * t) * 0.2
  )
}

/** Phase and log-radius of the gas at a disk point, shared by `streak`. */
function gasPhase(phi: number, rho: number, w: number): number {
  return phi - Math.pow(rho / R_IN, -1.5) * w
}

/**
 * Brightness of the thin gas rings at a disk point. Inner rings turn faster;
 * after the flash, comet-shaped sparks ride three of the orbits.
 */
function streak(
  phi: number,
  phase: number,
  lr: number,
  t: number,
  pulsesOn: number,
): number {
  const a = 46 * lr + 0.9 * Math.sin(phase + 3 * lr)
  let s =
    0.55 +
    0.3 * Math.sin(a) +
    0.15 * Math.sin(2.3 * a + 2 * phase) +
    0.12 * Math.sin(3 * phase - 7 * lr + 0.3 * t)

  if (pulsesOn > 0) {
    let pulses = 0
    for (const [ringLr, start, speed] of PULSES) {
      const across = (lr - ringLr) / 0.07
      if (across > 4 || across < -4) continue
      const d = mod(phi - start - speed * t + Math.PI, TAU) - Math.PI
      // Bright head, long tail.
      const comet = d > 0 ? Math.exp(-((d / 0.18) ** 2)) : Math.exp(d / 0.9)
      pulses += comet * Math.exp(-(across * across))
    }
    s += 0.9 * pulsesOn * pulses
  }
  return s
}

function gas(phi: number, rho: number, t: number, w: number, pulsesOn: number) {
  const r = Math.max(rho, 1e-6)
  const phase = gasPhase(phi, r, w)
  const lr = Math.log(r / R0)
  return streak(phi, phase, lr, t, pulsesOn)
}




/**
 * The field on a fixed character grid. `aspect` is the grid's width over
 * its height in pixels, so the hole stays round whatever the cell shape.
 */
export class BlackHoleField implements CellField {
  readonly chars: string[]
  readonly tags: Uint8Array
  readonly lum: Float32Array
  private readonly gx: Float32Array
  private readonly gy: Float32Array
  private readonly rnd: Float32Array
  private readonly hsh: Uint8Array

  constructor(
    readonly cols: number,
    readonly rows: number,
    aspect: number,
  ) {
    const n = cols * rows
    this.chars = new Array<string>(n).fill(' ')
    this.tags = new Uint8Array(n)
    this.lum = new Float32Array(n)
    this.gx = new Float32Array(cols)
    this.gy = new Float32Array(rows)
    this.rnd = new Float32Array(n)
    this.hsh = new Uint8Array(n)

    for (let i = 0; i < cols; i++) this.gx[i] = ((i + 0.5) / cols - 0.5) * aspect
    for (let j = 0; j < rows; j++) this.gy[j] = (j + 0.5) / rows - 0.5
    const random = mulberry32(7)
    for (let k = 0; k < n; k++) {
      this.rnd[k] = random()
      this.hsh[k] = Math.floor(random() * 12)
    }
  }

  /** Fills the buffers with the frame at `t` seconds into the piece. */
  render(t: number): void {
    const { cols, rows, chars, tags, lum, gx, gy, rnd, hsh } = this

    const cam = smooth(smooth((t - BLACK_HOLE_FLASH + 0.3) / 2.6))
    const zoom = 1 + 0.28 * cam
    const inc = INC + 0.09 * cam
    const w = spin(t)
    const flash = Math.exp(-(((t - BLACK_HOLE_FLASH) / 0.22) ** 2))
    const pulsesOn = smooth(t - BLACK_HOLE_FLASH)

    const ringK = smooth((t - 0.3) / 2.2)
    const ringBoost = 0.9 + 0.3 * smooth((t - 5) / 2)
    const diskOn = smooth((t - 5.0) / 2.8)
    const auraK = smooth((t - 2.2) / 1.8) * (1 - 0.65 * diskOn)
    const diskFade =
      smooth((t - 5.0) / 0.8) *
      (0.55 + 0.45 * smooth((t - BLACK_HOLE_FLASH + 0.3) / 0.4))
    const span = R0 + diskOn * (R_OUT * 1.1 - R0)
    const haloOn = smooth((t - 5.0) / 2.2)
    const sinceFlash = t - BLACK_HOLE_FLASH
    const shockOn = sinceFlash > 0 && sinceFlash < 4
    const shockFront = R0 + sinceFlash * 0.55
    const shockFade = Math.exp(-sinceFlash / 0.5) * 0.9
    const dustOn = t > 4.0
    const dustLum = 0.3 * smooth((t - 4.0) / 3.0)

    for (let j = 0; j < rows; j++) {
      const Y = (gy[j]! + 0.02 * cam) / zoom
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i
        const X = gx[i]! / zoom
        const r = Math.hypot(X, Y)
        const ang = Math.atan2(Y, X)

        // 1. The circle draws itself.
        const around = mod(ang + Math.PI / 2, TAU) / TAU
        const ring =
          Math.exp(-(((r - 1.02 * R0) / (0.045 * R0)) ** 2)) *
          smooth((ringK * 1.08 - around) / 0.08)

        // 2. A soft glow breathing around it, settling into the disk's rings.
        let aura = 0
        const outside = Math.max(r - R0, 0)
        if (auraK > 0 && outside < 2.5 * R0) {
          let puff = 0.5 + 0.5 * ripple(2 * ang, 5 * r - 0.45 * t, 0.35 * t)
          if (diskOn > 0) {
            const rings = gas(ang - TILT, R_IN + outside * 2.6, t, w, pulsesOn)
            puff = puff * (1 - diskOn) + rings * diskOn
          }
          const reach = 0.32 * R0 * (0.7 + 0.6 * puff)
          aura =
            auraK *
            Math.exp(-Math.pow(outside / reach, 1.6)) *
            (0.6 + 0.4 * puff)
        }

        // 3. The disk spreads out sideways, then lights up.
        const u = X * COS_TILT + Y * SIN_TILT
        const v = -X * SIN_TILT + Y * COS_TILT
        const rho = Math.max(Math.hypot(u, v / inc), 1e-6)
        const phi = Math.atan2(v / inc, u)
        const phase = gasPhase(phi, rho, w)
        const lr = Math.log(rho / R0)
        let disk = 0
        if (diskFade > 0) {
          const edge =
            smooth((rho - R_IN) / (0.25 * R0)) *
            smooth((R_OUT - rho) / (2.2 * R0))
          const spread = smooth((span - Math.abs(u)) / (0.6 * R0))
          if (edge > 0 && spread > 0) {
            disk =
              1.5 * edge * streak(phi, phase, lr, t, pulsesOn) * (R_IN / rho)
            // The side coming toward us is brighter.
            disk *= 1 - (0.25 * u) / rho
            disk *= diskFade * spread
          }
        }

        // 4. The far side of the disk, bent up and over the shadow.
        let halo = 0
        if (haloOn > 0) {
          const top = 0.5 - 0.5 * Math.sin(ang - TILT)
          const side = Math.abs(Math.cos(ang - TILT)) ** 10
          const out = Math.max(r - 1.1 * R0, 0)
          const width = 0.2 * R0 + 0.24 * R0 * top + 0.45 * R0 * side
          const inner = Math.min(r - 1.1 * R0, 0) / (0.2 * R0)
          const band =
            Math.exp(-((out / width) ** 2)) * Math.exp(-(inner * inner))
          if (band > 1e-4) {
            const ringRho =
              (1 - side) * (R_IN + Math.max(r - R0, 0) * 2.6) +
              side * Math.max(r, R_IN)
            const flow = gas(ang - TILT, ringRho, t, w, pulsesOn)
            halo =
              1.2 *
              band *
              flow *
              (0.5 + 0.8 * top) *
              (1 - 0.25 * Math.cos(ang - TILT)) *
              haloOn
          }
        }

        // 5. The shock ring after the flash.
        const shock = shockOn
          ? Math.exp(-(((r - shockFront) / 0.02) ** 2)) * shockFade
          : 0

        // Screen blend, so glow, halo and disk melt into each other.
        let soft =
          1 -
          (1 - clamp01(aura * 0.55)) * (1 - clamp01(halo)) * (1 - clamp01(disk))
        soft = Math.max(soft, disk, halo)
        let heat = Math.max(ring * ringBoost, soft, shock) * (1 + 1.4 * flash)

        // The shadow hides what is behind it.
        const inside = r < R0 * 0.97
        if (inside) heat = v > 0 && disk > 0.2 ? disk : 0

        const on = heat > 0.07
        let char = ' '
        let tag = DEEP
        let l = 0

        if (on) {
          const level = Math.min(Math.max(Math.trunc(heat * 3.6), 0), 3)
          char =
            FILL[level]![mod(hsh[k]! + Math.trunc(phase * 2 + lr * 6), 12)]!
          if (ring > aura * 0.8 && ring > disk && ring > halo && ring > 0.25) {
            char = tangentLetter(-Math.sin(ang), Math.cos(ang))
          }
          tag =
            heat < 0.1
              ? DEEP
              : heat < 0.2
                ? RED
                : heat < 0.45
                  ? ORANGE
                  : heat < 0.75
                    ? AMBER
                    : HOT
          l =
            Math.min(Math.max(0.42 + 0.85 * heat, 0), 1.3) *
            (0.35 + 0.65 * smooth((heat - 0.07) / 0.15))
        } else if (!inside) {
          // A few stars and some dust behind everything.
          const p = rnd[k]!
          if (p < 0.0025) {
            char = p < 0.0005 ? '+' : p < 0.0012 ? '*' : '.'
            tag = STAR
            l = 0.75 + 0.2 * Math.sin(0.8 * t + p * 9000)
          } else if (dustOn) {
            const lane = Math.exp(
              -(((-X * SIN_TILT + Y * COS_TILT - 0.02) / 0.09) ** 2),
            )
            if (p > 1 - 0.035 * lane) {
              char = p > 1 - 0.01 * lane ? ':' : ','
              tag = DUST
              l = dustLum
            }
          }
        }

        chars[k] = char
        tags[k] = tag
        lum[k] = l
      }
    }
  }
}
