import { clamp } from '@/lib/utils'
import { gridToHtml } from './render'

/**
 * The cup of coffee beside the bio.
 *
 * Steam is a particle system rather than a loop of pre-drawn frames: puffs
 * are born on the rim, rise with a per-particle sine wobble, and are splatted
 * bilinearly into a density grid that a ramp turns back into characters. The
 * cup itself is a fixed sprite composited on top, with its rim alternating
 * between two glyphs so the surface reads as hot.
 *
 * The pointer is part of the simulation, not a decoration on it: `track`
 * feeds in where the cursor is and how fast it is moving, which pushes the
 * steam aside and drags it along, and `swirl` is the harder shove a click
 * gives it. Like the bonfire, everything writes into buffers the instance
 * owns, so a running cup allocates nothing per frame but the output string.
 */

export const COFFEE_FPS = 30

const WIDTH = 60
const HEIGHT = 28
const CENTER_X = 30
/** Left edge of the sprite on the grid. */
const CUP_X = CENTER_X - 15
/** Columns the sprite occupies, blanked before it is drawn. */
const CUP_SPAN = 32
/** Row of the rim: where puffs are born, and the floor they cannot sink past. */
const RIM_ROW = HEIGHT - 8

/** Density ramp for the steam, thin to thick. */
const STEAM_RAMP = ' .:~=*'
/** Above this share of the ramp a puff counts as thick and brightens. */
const THICK_STEP = 3
/** Below this density a cell is empty — keeps stray eighth-puffs off screen. */
const VISIBLE_DENSITY = 0.06

const MAX_PUFFS = 260
const SPAWN_PER_FRAME = 3

/** How close the pointer has to be, in columns, to move a puff at all. */
const POINTER_REACH = 10
/** A click reaches further and shoves harder than a hover does. */
const SWIRL_REACH = 16

const STEAM_THICK = '#b4b7ab'
const STEAM_THIN = '#6d7065'
const CUP_BODY = '#8a8d82'
const CUP_RIM = '#b3a58a'

const repeat = (char: string, count: number): string => char.repeat(count)

const SPRITE = [
  `    .-${repeat('~', 19)}-.`,
  `    |${repeat(' ', 21)}|-.`,
  `    |${repeat(' ', 21)}|  \\`,
  `    |${repeat(' ', 21)}|  |`,
  `    |${repeat(' ', 21)}| /`,
  `     \\${repeat(' ', 19)}/-'`,
  `      '-.${repeat('_', 13)}.-'`,
  ` \`-.${repeat('_', 23)}.-'`,
] as const

/** A point in the art's own box, both axes `0..1`. */
export interface StagePoint {
  x: number
  y: number
}

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

/** Grid-space cursor: fractional column and row. */
interface Cursor {
  col: number
  row: number
}

export class CoffeeSimulation {
  private readonly density = new Float32Array(WIDTH * HEIGHT)
  private readonly chars = new Array<string>(WIDTH * HEIGHT).fill(' ')
  private readonly colors = new Array<string | null>(WIDTH * HEIGHT).fill(null)
  private readonly puffs: Puff[] = []

  private cursor: Cursor | null = null
  private previous: Cursor | null = null
  /** Pointer velocity, which is what lets a fast swipe drag the steam. */
  private dragX = 0
  private dragY = 0
  private tick = 0

  /** Rises a plausible plume so the first painted frame is not a bare cup. */
  constructor(warmupFrames = 70) {
    for (let i = 0; i < warmupFrames; i++) this.step()
  }

  /** Feeds in the pointer, or `null` once it leaves the art. */
  track(point: StagePoint | null): void {
    if (!point) {
      this.cursor = null
      this.previous = null
      return
    }

    const next = CoffeeSimulation.toGrid(point)
    const { previous } = this

    if (previous) {
      this.dragX = clamp(this.dragX + (next.col - previous.col) * 0.4, -3, 3)
      this.dragY = clamp(this.dragY + (next.row - previous.row) * 0.4, -3, 3)
    }

    this.previous = next
    this.cursor = next
  }

  /** Shoves the plume outward from a press. */
  swirl(point: StagePoint): void {
    const { col, row } = CoffeeSimulation.toGrid(point)

    for (const puff of this.puffs) {
      // Rows are twice as tall as columns are wide, so vertical distance is
      // doubled to keep the blast circular on screen rather than an ellipse.
      const dx = puff.x - col
      const dy = (puff.y - row) * 2
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance >= SWIRL_REACH) continue

      const force = 1 - distance / SWIRL_REACH
      puff.vx += (dx / (distance + 0.5)) * force * 0.9
      puff.vy += (dy / (distance + 0.5)) * force * 0.35
    }
  }

  step(): void {
    this.tick++
    this.spawn()
    this.dragX *= 0.88
    this.dragY *= 0.88
    this.advance()
    this.splat()
  }

  toHtml(): string {
    this.compose()
    return gridToHtml(this.chars, this.colors, WIDTH, HEIGHT)
  }

  private static toGrid({ x, y }: StagePoint): Cursor {
    return { col: x * WIDTH, row: y * HEIGHT - 0.5 }
  }

  private spawn(): void {
    for (let n = 0; n < SPAWN_PER_FRAME; n++) {
      if (this.puffs.length >= MAX_PUFFS) return

      this.puffs.push({
        x: CENTER_X + (Math.random() - 0.5) * 12,
        y: RIM_ROW - 0.5,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.25 - Math.random() * 0.15,
        age: 0,
        life: 70 + Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  private advance(): void {
    const { puffs, cursor } = this
    // A slow breath across the whole plume, so it never settles into a column.
    const ambient = Math.sin(this.tick * 0.012) * 0.004

    for (let i = puffs.length - 1; i >= 0; i--) {
      const puff = puffs[i] as Puff

      // The wobble widens with age: a puff leaving the rim is still a thread,
      // one near the top of its life is a drifting cloud.
      puff.vx +=
        Math.sin(puff.age * 0.09 + puff.phase) * 0.01 * (0.5 + puff.age / 60) +
        ambient
      puff.vy += (-0.3 - puff.vy) * 0.04

      if (cursor) this.deflect(puff, cursor)

      puff.vx *= 0.96
      puff.x += puff.vx
      puff.y += puff.vy
      puff.age++

      const gone =
        puff.age > puff.life ||
        puff.y < 0 ||
        puff.y >= RIM_ROW ||
        puff.x < 0 ||
        puff.x >= WIDTH - 1
      if (gone) puffs.splice(i, 1)
    }
  }

  private deflect(puff: Puff, cursor: Cursor): void {
    const dx = puff.x - cursor.col
    const dy = (puff.y - cursor.row) * 2
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= POINTER_REACH) return

    const force = 1 - distance / POINTER_REACH
    // Two effects at once: the cursor pushes puffs off its own position, and
    // its velocity carries them along with it.
    puff.vx += (dx / (distance + 0.5)) * force * 0.03 + this.dragX * force * 0.1
    puff.vy +=
      (dy / (distance + 0.5)) * force * 0.015 + this.dragY * force * 0.05
  }

  private add(index: number, amount: number): void {
    this.density[index] = (this.density[index] as number) + amount
  }

  /**
   * Smears every puff across the four cells it straddles. Without this the
   * steam would pop between characters as puffs crossed cell boundaries.
   */
  private splat(): void {
    const { puffs } = this
    this.density.fill(0)

    for (const puff of puffs) {
      // Fades in over the first few frames and out across its whole life, so
      // puffs neither appear nor vanish as hard edges.
      const weight =
        (1 - puff.age / puff.life) * Math.min(1, puff.age / 10) * 0.55

      const col = Math.floor(puff.x)
      const row = Math.floor(puff.y)
      const fx = puff.x - col
      const fy = puff.y - row

      const top = row * WIDTH + col
      this.add(top, weight * (1 - fx) * (1 - fy))
      this.add(top + 1, weight * fx * (1 - fy))

      if (row + 1 < HEIGHT) {
        const bottom = top + WIDTH
        this.add(bottom, weight * (1 - fx) * fy)
        this.add(bottom + 1, weight * fx * fy)
      }
    }
  }

  private compose(): void {
    const { chars, colors, density } = this

    for (let i = 0; i < WIDTH * HEIGHT; i++) {
      const value = (density[i] as number) * 1.2

      if (value > VISIBLE_DENSITY) {
        const step = clamp(
          Math.floor(value * STEAM_RAMP.length),
          1,
          STEAM_RAMP.length - 1,
        )
        chars[i] = STEAM_RAMP[step] as string
        colors[i] = step >= THICK_STEP ? STEAM_THICK : STEAM_THIN
      } else {
        chars[i] = ' '
        colors[i] = null
      }
    }

    this.drawCup()
  }

  private drawCup(): void {
    const { chars, colors } = this

    SPRITE.forEach((line, r) => {
      const row = RIM_ROW + r
      const isRim = r === 0

      // The cup is opaque: steam that drifted behind it is cleared first, or
      // it would show through the mug's own body.
      for (let x = CUP_X; x < CUP_X + CUP_SPAN; x++) {
        if (x < 0 || x >= WIDTH) continue
        chars[row * WIDTH + x] = ' '
        colors[row * WIDTH + x] = null
      }

      for (let c = 0; c < line.length; c++) {
        const char = line[c] as string
        if (char === ' ') continue

        const x = CUP_X + c
        if (x < 0 || x >= WIDTH) continue
        const index = row * WIDTH + x

        // The rim ripples: its glyphs swap every eight frames, on alternating
        // columns, which reads as the surface moving rather than blinking.
        chars[index] =
          isRim && char === '~'
            ? (c + Math.floor(this.tick / 8)) % 2
              ? '~'
              : '-'
            : char
        colors[index] = isRim ? CUP_RIM : CUP_BODY
      }
    })
  }
}
