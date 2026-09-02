import { clamp } from '@/lib/utils'
import { FIRE_RAMP, gridToHtml } from './render'

/**
 * The bonfire behind the hero.
 *
 * Heat is injected along the base row, rises with per-cell decay and is
 * pushed sideways by a two-octave sinusoidal wind. Embers are separate
 * particles that drift up and fade out. A sword and a mound of stones are
 * composited on top and lit by whatever heat sits behind them.
 *
 * Everything writes into pre-allocated buffers, so a running fire allocates
 * nothing per frame beyond the output string.
 */

export const BONFIRE_FPS = 10

const WIDTH = 96
const HEIGHT = 40
const CENTER_X = 48
const BASE_ROW = 30
const HALF_WIDTH = 15
/** How far above the base the flame column is still meaningfully hot. */
const FLAME_HEIGHT = 19

/** Ten greys matched to the ten steps of `FIRE_RAMP`. */
const GREYS = [
  '#141414',
  '#2b2b2b',
  '#3d3d3d',
  '#525252',
  '#696969',
  '#838383',
  '#9e9e9e',
  '#bdbdbd',
  '#dedede',
  '#ffffff',
] as const

const SWORD_TOP = 1
const TIP_ROW = BASE_ROW - 1
const TIP_COL = CENTER_X
const BLADE_ROW = SWORD_TOP + 7

/** `[column offset, glyphs]`, drawn relative to the sword's leaning axis. */
const SWORD_ROWS: ReadonlyArray<readonly [number, string]> = [
  [-1, '(O)'],
  [-1, '/||\\'],
  [-1, '\\||/'],
  [-1, '/||\\'],
  [-1, '\\||/'],
  [-8, '\\\\_--===||===--_//'],
  [-1, '||/'],
]

const MOUND = [
  '     \\    /\\   _/\\_   /\\    /     ',
  '  _/\\_\\##/  \\#/    \\#/  \\##/\\#/\\_  ',
  ' /  \\__/\\____/\\__/\\____/\\__/  \\   ',
  '_/\\__.-~^~-.__.-~^~-.__.-~^~-.__/\\_',
] as const

const EMBER_CHARS = ['.', "'", '`', ',', '*'] as const
const MAX_EMBERS = 26

/** The sword leans, so its centre column shifts one step every two rows. */
const swordAxis = (row: number) => TIP_COL + Math.floor((TIP_ROW - row) / 2)

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  char: string
}

export class BonfireSimulation {
  static readonly width = WIDTH
  static readonly height = HEIGHT

  private readonly heat = new Float32Array(WIDTH * HEIGHT)
  private readonly chars = new Array<string>(WIDTH * HEIGHT).fill(' ')
  private readonly colors = new Array<string | null>(WIDTH * HEIGHT).fill(null)
  private readonly embers: Ember[] = []
  private time = 0

  /** Burns in a plausible fire so the first painted frame is not a cold grid. */
  constructor(warmupFrames = 90) {
    for (let i = 0; i < warmupFrames; i++) this.step()
  }

  step(): void {
    this.diffuseHeat(this.time)
    this.updateEmbers()
    this.time += 16
  }

  toHtml(): string {
    this.compose()
    return gridToHtml(this.chars, this.colors, WIDTH, HEIGHT)
  }

  private diffuseHeat(time: number): void {
    const { heat } = this

    // Base row: a bell curve across the fire's width, flickering over time.
    for (let x = 0; x < WIDTH; x++) {
      const distance = Math.abs(x - CENTER_X + 0.5) / HALF_WIDTH
      const shape =
        distance < 1 ? Math.pow(1 - distance * distance, 0.55) : 0
      const flicker =
        0.88 +
        0.12 * Math.sin(time * 0.009 + x * 0.6) +
        0.1 * Math.sin(time * 0.021 - x * 1.3) +
        Math.random() * 0.16
      heat[BASE_ROW * WIDTH + x] = clamp(shape * flicker, 0, 1)
    }

    const wind = Math.sin(time * 0.0013) * 0.8 + Math.sin(time * 0.0037) * 0.4

    // Pull heat upward row by row; the column narrows as it climbs.
    for (let y = BASE_ROW - 1; y >= 0; y--) {
      const row = y * WIDTH
      const below = (y + 1) * WIDTH
      const halfAtRow = Math.max(
        HALF_WIDTH * (1 - (0.7 * (BASE_ROW - y)) / FLAME_HEIGHT),
        2.5,
      )

      for (let x = 0; x < WIDTH; x++) {
        const drift = Math.round(wind + Math.random() * 2.2 - 1.1)
        const source = clamp(x + drift, 0, WIDTH - 1)
        const distance = Math.abs(x - CENTER_X + 0.5) / halfAtRow
        // Tongues let a few columns burn taller than their neighbours.
        const tongue =
          0.5 +
          0.5 * Math.sin(x * 0.85 + time * 0.0042) +
          0.3 * Math.sin(x * 0.31 - time * 0.0026)
        const decay = Math.max(
          0.036 +
            0.075 * distance * distance +
            Math.random() * 0.05 -
            0.014 * tongue,
          0.01,
        )
        const value = (heat[below + source] as number) - decay
        heat[row + x] = value > 0 ? value : 0
      }
    }
  }

  private updateEmbers(): void {
    const { embers, heat } = this

    for (let i = embers.length - 1; i >= 0; i--) {
      const ember = embers[i] as Ember
      ember.x += ember.vx + Math.sin(ember.age * 0.09) * 0.13
      ember.y += ember.vy
      ember.age++

      const dead =
        ember.age > ember.life ||
        ember.y < 0 ||
        ember.x < 0 ||
        ember.x > WIDTH - 1
      if (dead) embers.splice(i, 1)
    }

    if (embers.length >= MAX_EMBERS) return

    for (let n = 0; n < 2; n++) {
      const x = CENTER_X + (Math.random() * 2 - 1) * HALF_WIDTH * 0.45
      const column = Math.round(clamp(x, 0, WIDTH - 1))

      // Spawn where the flame has already cooled, so embers appear to escape.
      let y = BASE_ROW - 4
      for (let row = BASE_ROW; row > 4; row--) {
        if ((heat[row * WIDTH + column] as number) < 0.18) {
          y = row
          break
        }
      }

      embers.push({
        x,
        y,
        vx: (Math.random() * 2 - 1) * 0.09,
        vy: -(0.16 + Math.random() * 0.3),
        age: 0,
        life: 34 + Math.random() * 52,
        char: EMBER_CHARS[(Math.random() * EMBER_CHARS.length) | 0] as string,
      })
    }
  }

  private put(x: number, y: number, char: string, level: number): void {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
    const index = y * WIDTH + x
    this.chars[index] = char
    this.colors[index] = GREYS[clamp(level, 0, 9)] as string
  }

  private heatAt(x: number, y: number): number {
    return this.heat[
      clamp(y, 0, HEIGHT - 1) * WIDTH + clamp(x, 0, WIDTH - 1)
    ] as number
  }

  private compose(): void {
    const { chars, colors, heat } = this
    chars.fill(' ')
    colors.fill(null)

    // Flames.
    for (let y = 0; y <= BASE_ROW; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const index = y * WIDTH + x
        const level = clamp(Math.round((heat[index] as number) * 9), 0, 9)
        if (level === 0) continue
        chars[index] = FIRE_RAMP[level] as string
        colors[index] = GREYS[level] as string
      }
    }

    // Embers, but only where the flame has not already claimed the cell.
    for (const ember of this.embers) {
      const x = Math.round(ember.x)
      const y = Math.round(ember.y)
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) continue
      if (chars[y * WIDTH + x] !== ' ') continue
      const fade = 1 - ember.age / ember.life
      this.put(x, y, ember.char, clamp(1 + Math.round(fade * 6), 1, 7))
    }

    // Stones, lit from the flame directly above them.
    MOUND.forEach((line, r) => {
      const offset = Math.round(CENTER_X - line.length / 2)
      const y = BASE_ROW + r
      for (let c = 0; c < line.length; c++) {
        const char = line[c] as string
        if (char === ' ') continue
        const glow = this.heatAt(offset + c, y - 1)
        this.put(offset + c, y, char, clamp(4 + Math.round(glow * 4), 3, 8))
      }
    })

    // Hilt and crossguard.
    SWORD_ROWS.forEach(([delta, glyphs], r) => {
      const row = SWORD_TOP + r
      const col = swordAxis(row) + delta
      for (let c = 0; c < glyphs.length; c++) {
        const char = glyphs[c] as string
        if (char === ' ') continue
        this.put(col + c, row, char, this.heatAt(col + c, row) > 0.3 ? 9 : 8)
      }
    })

    // Blade, down to the point buried in the mound.
    for (let row = BLADE_ROW; row < TIP_ROW; row++) {
      const col = swordAxis(row)
      const level = this.heatAt(col, row) > 0.3 ? 9 : 8
      this.put(col, row, '|', level)
      this.put(col + 1, row, '|', level)
    }
    this.put(TIP_COL, TIP_ROW, '\\', 9)
    this.put(TIP_COL + 1, TIP_ROW, '/', 9)
  }
}
