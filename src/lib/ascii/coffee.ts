import { clamp } from '@/lib/utils'
import {
  type BoxPoint,
  type CellField,
  mod,
  mulberry32,
  type Rgb,
  smooth,
  TAU,
  tangentLetter,
} from './field'

/**
 * The cup of coffee beside the bio, drawn like the black hole and the
 * landscape: every cell is asked what is there and answers with a letter, a
 * colour and a brightness.
 *
 * The cup is geometry, not a sprite: a slightly tapered cylinder lit from
 * the upper left with a glossy highlight, an elliptical rim drawn as strokes
 * that follow its direction, a handle, and a saucer. The coffee surface is a
 * polar field of crema streaks that turn slowly, inner ones faster.
 *
 * The steam is still a particle system, because that is what lets the
 * pointer touch it: puffs rise from the surface with a widening wobble and
 * are splatted into a density grid that becomes letters. Hovering pushes the
 * steam aside and drags it along with the cursor; a click shoves it outward
 * and stirs the coffee, which spins up and slowly settles.
 *
 * Coordinates are in frame units: the box is 1 tall, x runs across it
 * centred on 0, y runs down. The simulation steps at a fixed 30 Hz.
 *
 * The first time it is on screen the rim draws itself around, the cup and
 * saucer fade in, the coffee fills, and then the steam starts to rise.
 */

/**
 * thin steam, steam, thick steam, shadowed ceramic, ceramic, lit ceramic,
 * dark coffee, coffee, crema, rim
 */
export const COFFEE_COLORS: readonly Rgb[] = [
  [109, 112, 101],
  [180, 183, 171],
  [236, 236, 228],
  [92, 84, 70],
  [158, 146, 122],
  [222, 210, 184],
  [70, 44, 26],
  [128, 84, 50],
  [204, 154, 100],
  [236, 226, 198],
]
const STEAM_THIN = 0
const STEAM = 1
const STEAM_THICK = 2
const CERAMIC_DARK = 3
const CERAMIC = 4
const CERAMIC_LIGHT = 5
const COFFEE_DARK = 6
const COFFEE = 7
const CREMA = 8
const RIM = 9

/** By the time the cup is drawn and the steam is up. */
export const COFFEE_SETTLED = 7

const STEP = 1 / 30
/** Most simulation steps one render will catch up on. */
const MAX_STEPS = 240

// The cup, in frame units.
const CUP_R = 0.29
const CUP_TOP = 0.5
const CUP_BOTTOM = 0.8
/** Half-height of the rim ellipse: how far down we look into the cup. */
const CUP_E = 0.105
/** The bottom is this much narrower than the rim. */
const TAPER = 0.12
const HANDLE_X = CUP_R + 0.075
const HANDLE_Y = CUP_TOP + 0.14
const HANDLE_A = 0.085
const HANDLE_B = 0.095
const SAUCER_Y = CUP_BOTTOM + 0.06
const SAUCER_RX = 0.5
const SAUCER_RY = 0.085

/** Letter pools by brightness, dark to bright. */
const CERAMIC_POOLS = ['.:', ';!i', 'oec=', '0B8$'] as const
const COFFEE_POOLS = ['.,', ':;', 'oa%', '&#@'] as const
/** Steam letters by density, thin to thick. */
const STEAM_RAMP = ' .:~=*'
const VISIBLE_DENSITY = 0.06

// Steam, per 30 Hz step, in frame units.
const MAX_PUFFS = 260
const SPAWN_PER_STEP = 3
const RISE = 0.0105
const POINTER_REACH = 0.18
const SWIRL_REACH = 0.29

interface Puff {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  /** Phase offset, so neighbouring puffs do not wobble in lockstep. */
  phase: number
}

/** Cup radius at a height, tapering towards the bottom. */
function radiusAt(y: number): number {
  const s = clamp((y - CUP_TOP) / (CUP_BOTTOM - CUP_TOP), 0, 1)
  return CUP_R * (1 - TAPER * s * s)
}

function pick(pools: readonly string[], level: number, hash: number): string {
  const pool = pools[Math.max(0, Math.min(pools.length - 1, level))]!
  return pool[hash % pool.length]!
}

export class CoffeeField implements CellField {
  readonly chars: string[]
  readonly tags: Uint8Array
  readonly lum: Float32Array
  private readonly density: Float32Array
  private readonly hsh: Uint8Array
  private readonly puffs: Puff[] = []
  private readonly random = mulberry32(5)
  /** Puff weight, scaled so the steam looks as thick at any grid size. */
  private readonly puffWeight: number

  private clock = 0
  private steps = 0
  private spin = 0
  /** Extra spin from a click, settling back to nothing. */
  private stir = 0
  private cursor: { x: number; y: number } | null = null
  private dragX = 0
  private dragY = 0

  constructor(
    readonly cols: number,
    readonly rows: number,
    private readonly aspect: number,
  ) {
    const n = cols * rows
    this.chars = new Array<string>(n).fill(' ')
    this.tags = new Uint8Array(n)
    this.lum = new Float32Array(n)
    this.density = new Float32Array(n)
    this.hsh = new Uint8Array(n)
    for (let k = 0; k < n; k++) this.hsh[k] = Math.floor(this.random() * 256)
    // Tuned on a 56 × 28 cells-per-frame grid; finer grids spread each puff
    // over more cells, so each one weighs more.
    this.puffWeight = 0.55 * ((rows * cols) / aspect / (28 * 56))
  }

  private toFrame({ x, y }: BoxPoint) {
    return { x: (x - 0.5) * this.aspect, y }
  }

  pointer(point: BoxPoint | null): void {
    if (!point) {
      this.cursor = null
      return
    }
    const next = this.toFrame(point)
    if (this.cursor) {
      this.dragX = clamp(this.dragX + (next.x - this.cursor.x) * 0.4, -0.055, 0.055)
      this.dragY = clamp(this.dragY + (next.y - this.cursor.y) * 0.4, -0.055, 0.055)
    }
    this.cursor = next
  }

  press(point: BoxPoint): void {
    const { x, y } = this.toFrame(point)
    for (const puff of this.puffs) {
      const dx = puff.x - x
      const dy = puff.y - y
      const distance = Math.hypot(dx, dy)
      if (distance >= SWIRL_REACH) continue
      const force = 1 - distance / SWIRL_REACH
      puff.vx += (dx / (distance + 0.009)) * force * 0.016
      puff.vy += (dy / (distance + 0.009)) * force * 0.008
    }
    // And the spoon goes in: the coffee spins up.
    this.stir = Math.min(this.stir + 3, 8)
  }

  render(t: number): void {
    // Catch the simulation up to `t` in fixed steps.
    let pending = Math.min(Math.round((t - this.clock) / STEP), MAX_STEPS)
    if (t < this.clock) pending = 0
    for (; pending > 0; pending--) this.step(this.clock + STEP)
    this.clock = Math.max(this.clock, t)
    this.splat()
    this.compose(t)
  }

  private step(t: number): void {
    this.clock = t
    this.steps++
    this.spin += STEP * (0.35 + this.stir)
    this.stir *= Math.exp(-STEP / 1.8)
    this.dragX *= 0.88
    this.dragY *= 0.88

    if (t > 2.2) this.spawn()
    this.advance()
  }

  private spawn(): void {
    const random = this.random
    for (let n = 0; n < SPAWN_PER_STEP && this.puffs.length < MAX_PUFFS; n++) {
      this.puffs.push({
        x: (random() - 0.5) * CUP_R * 1.3,
        y: CUP_TOP - 0.005,
        vx: (random() - 0.5) * 0.0015,
        vy: -0.009 - random() * 0.005,
        age: 0,
        life: 70 + random() * 60,
        phase: random() * TAU,
      })
    }
  }

  private advance(): void {
    const { puffs, cursor } = this
    // A slow breath across the whole plume, so it never settles into a column.
    const ambient = Math.sin(this.steps * 0.012) * 0.00007
    const halfWidth = this.aspect / 2

    for (let i = puffs.length - 1; i >= 0; i--) {
      const puff = puffs[i]!
      // The wobble widens with age: a thread off the surface, a cloud later.
      puff.vx +=
        Math.sin(puff.age * 0.09 + puff.phase) * 0.00018 * (0.5 + puff.age / 60) +
        ambient
      puff.vy += (-RISE - puff.vy) * 0.04

      if (cursor) {
        const dx = puff.x - cursor.x
        const dy = puff.y - cursor.y
        const distance = Math.hypot(dx, dy)
        if (distance < POINTER_REACH) {
          const force = 1 - distance / POINTER_REACH
          // The cursor pushes puffs off itself and carries them with it.
          puff.vx += (dx / (distance + 0.009)) * force * 0.00055 + this.dragX * force * 0.1
          puff.vy += (dy / (distance + 0.009)) * force * 0.0005 + this.dragY * force * 0.05
        }
      }

      puff.vx *= 0.96
      puff.x += puff.vx
      puff.y += puff.vy
      puff.age++

      const gone =
        puff.age > puff.life ||
        puff.y < 0 ||
        puff.y > CUP_TOP ||
        Math.abs(puff.x) > halfWidth
      if (gone) puffs.splice(i, 1)
    }
  }

  /** Smears every puff across the four cells it straddles. */
  private splat(): void {
    const { cols, rows, density, aspect } = this
    density.fill(0)
    for (const puff of this.puffs) {
      const weight =
        (1 - puff.age / puff.life) * Math.min(1, puff.age / 10) * this.puffWeight
      const cx = (puff.x / aspect + 0.5) * cols - 0.5
      const cy = puff.y * rows - 0.5
      const col = Math.floor(cx)
      const row = Math.floor(cy)
      const fx = cx - col
      const fy = cy - row
      for (const [dc, dr, w] of [
        [0, 0, (1 - fx) * (1 - fy)],
        [1, 0, fx * (1 - fy)],
        [0, 1, (1 - fx) * fy],
        [1, 1, fx * fy],
      ] as const) {
        const c = col + dc
        const r = row + dr
        if (c < 0 || c >= cols || r < 0 || r >= rows) continue
        density[r * cols + c]! += weight * w
      }
    }
  }

  private compose(t: number): void {
    const { cols, rows, chars, tags, lum, density, hsh, aspect } = this
    const rimK = smooth((t - 0.2) / 1.4)
    const bodyOn = smooth((t - 0.9) / 1.2)
    const fill = smooth((t - 1.6) / 1.2)

    // How thick the rim stroke must be, in ellipse units, to cover a cell
    // both across (sides) and down (front and back).
    const cellX = aspect / cols
    const cellY = 1 / rows
    const rimAcross = (1.1 * cellX) / CUP_R
    const rimDown = (1.1 * cellY) / CUP_E

    for (let j = 0; j < rows; j++) {
      const y = (j + 0.5) / rows
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i
        const x = ((i + 0.5) / cols - 0.5) * aspect
        const h = hsh[k]!

        let char = ' '
        let tag = STEAM_THIN
        let l = 0

        // Steam first; anything solid in front replaces it.
        const steam = density[k]! * 1.2
        if (steam > VISIBLE_DENSITY) {
          const step = clamp(Math.floor(steam * STEAM_RAMP.length), 1, STEAM_RAMP.length - 1)
          char = STEAM_RAMP[step]!
          tag = step >= 4 ? STEAM_THICK : step >= 2 ? STEAM : STEAM_THIN
          l = Math.min(1.2, 0.55 + steam * 0.6)
        }

        // The rim ellipse and the coffee inside it.
        const ex = x / CUP_R
        const ey = (y - CUP_TOP) / CUP_E
        const d = Math.hypot(ex, ey)
        const theta = Math.atan2(ey, ex)
        const rimWidth =
          Math.abs(Math.sin(theta)) * rimDown + Math.abs(Math.cos(theta)) * rimAcross

        if (d <= 1 && d > 1 - rimWidth) {
          const around = mod(theta + Math.PI / 2, TAU) / TAU
          if (around < rimK * 1.08) {
            const front = ey > 0
            char = tangentLetter(-CUP_R * Math.sin(theta), CUP_E * Math.cos(theta))
            tag = front ? RIM : CERAMIC_LIGHT
            l = front ? 1.05 : 0.8
          }
        } else if (d <= 1 - rimWidth && fill > 0) {
          // Crema streaks turning on the surface, inner ones faster.
          const rho = d / (1 - rimWidth)
          const phase = theta + this.spin * (1.5 - rho)
          const streak =
            0.5 +
            0.3 * Math.sin(3 * phase + 9 * rho) +
            0.2 * Math.sin(5 * phase - 4 * rho + t * 0.7)
          const crema = 0.45 * smooth((rho - 0.7) / 0.3)
          const heat = (0.25 + 0.55 * streak + crema) * fill
          if (steam > 0.35) {
            // A thick wisp right over the surface stays in front of it.
          } else if (heat > 0.12) {
            const level = Math.floor(heat * 4)
            char = pick(COFFEE_POOLS, level, h)
            tag = heat > 0.75 ? CREMA : heat > 0.4 ? COFFEE : COFFEE_DARK
            l = 0.55 + 0.5 * heat
          } else if (steam <= VISIBLE_DENSITY) {
            char = ' '
          }
        } else if (y > CUP_TOP) {
          // The body: a lit cylinder, darker towards its foot.
          const r = radiusAt(y)
          const bottom = CUP_BOTTOM + CUP_E * Math.sqrt(Math.max(0, 1 - (x / r) ** 2))
          const inBody = Math.abs(x) <= r && y <= bottom

          // The handle, a ring on the right that the body hides where they meet.
          const hx = (x - HANDLE_X) / HANDLE_A
          const hy = (y - HANDLE_Y) / HANDLE_B
          const hd = Math.hypot(hx, hy)
          const ha = Math.atan2(hy, hx)
          const handleWidth =
            Math.abs(Math.sin(ha)) * ((1.1 * cellY) / HANDLE_B) +
            Math.abs(Math.cos(ha)) * ((1.1 * cellX) / HANDLE_A)
          const inHandle = !inBody && x > r - 0.005 && Math.abs(hd - 1) < handleWidth * 0.6

          // The saucer under it all.
          const sx = x / SAUCER_RX
          const sy = (y - SAUCER_Y) / SAUCER_RY
          const sd = Math.hypot(sx, sy)

          if (inBody && bodyOn > 0) {
            const nx = x / r
            const s = (y - CUP_TOP) / (CUP_BOTTOM - CUP_TOP)
            if (y > bottom - cellY) {
              // The foot follows the curve of the bottom.
              const a = Math.acos(clamp(nx, -1, 1))
              char = tangentLetter(-r * Math.sin(a), -CUP_E * Math.cos(a))
              tag = CERAMIC
              l = 0.75 * bodyOn
            } else if (Math.abs(nx) > 0.94) {
              char = '|'
              tag = nx < 0 ? CERAMIC_LIGHT : CERAMIC
              l = 0.85 * bodyOn
            } else {
              const light =
                (0.3 +
                  0.45 * (0.5 - 0.5 * nx) +
                  0.55 * Math.exp(-(((nx + 0.5) / 0.13) ** 2))) *
                (1 - 0.3 * s)
              const level = Math.floor(light * 4)
              char = pick(CERAMIC_POOLS, level, h)
              tag = light > 0.75 ? CERAMIC_LIGHT : light > 0.4 ? CERAMIC : CERAMIC_DARK
              l = (0.45 + 0.6 * light) * bodyOn
            }
          } else if (inHandle && bodyOn > 0) {
            char = tangentLetter(-HANDLE_A * Math.sin(ha), HANDLE_B * Math.cos(ha))
            tag = hy < 0 ? CERAMIC_LIGHT : CERAMIC
            l = 0.8 * bodyOn
          } else if (sd <= 1 && bodyOn > 0) {
            const sa = Math.atan2(sy, sx)
            const saucerWidth =
              Math.abs(Math.sin(sa)) * ((1.1 * cellY) / SAUCER_RY) +
              Math.abs(Math.cos(sa)) * ((1.1 * cellX) / SAUCER_RX)
            if (sd > 1 - saucerWidth) {
              char = tangentLetter(-SAUCER_RX * Math.sin(sa), SAUCER_RY * Math.cos(sa))
              tag = sy > 0 ? CERAMIC_LIGHT : CERAMIC
              l = (sy > 0 ? 0.95 : 0.7) * bodyOn
            } else {
              // A soft shadow where the cup stands.
              const shade = 1 - 0.7 * Math.exp(-((Math.abs(x) / (CUP_R * 1.1)) ** 4))
              if (h % 3 !== 0) {
                char = shade < 0.5 ? '.' : h % 2 ? ':' : '.'
                tag = CERAMIC_DARK
                l = (0.35 + 0.35 * shade) * bodyOn
              }
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
