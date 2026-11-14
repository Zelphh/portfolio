import {
  type CellField,
  mod,
  mulberry32,
  type Rgb,
  smooth,
} from './field'

/**
 * The landscape strip that closes the experience section, drawn the same
 * way as the black hole above it: every cell is asked what is there at time
 * `t` and answers with a letter, a colour and a brightness.
 *
 * Back to front: a far ridge with a sparse slope below it, the soil, a lone
 * pine on a low hill, the grass, and a few fireflies. Wind is two gusts that
 * roll across the strip left to right; where one passes, the grass bends
 * over and catches the light, the pine leans and its needles shimmer, and
 * the far slope brightens a touch — the travelling bright band reads as wind
 * the way the black hole's streaks read as orbiting gas.
 *
 * The first time it is on screen the ridge fades in, the grass grows, the
 * pine draws itself up from the trunk and then the fireflies come out.
 */

/** soil, far ridge, dark needles, moss, light moss, bright, bark, firefly */
export const LANDSCAPE_COLORS: readonly Rgb[] = [
  [124, 128, 115],
  [86, 96, 74],
  [72, 82, 58],
  [104, 120, 80],
  [143, 160, 114],
  [196, 210, 150],
  [140, 124, 100],
  [231, 231, 74],
]
const SOIL = 0
const FAR = 1
const NEEDLE_DARK = 2
const MOSS = 3
const MOSS_LIGHT = 4
const BRIGHT = 5
const BARK = 6
const FIREFLY = 7

/** By the time everything has grown in. */
export const LANDSCAPE_SETTLED = 5

/** Where the pine stands, as a fraction of the strip's width. */
const TREE_AT = 0.78
/** Pine height in rows, trunk included. */
const TREE_ROWS = 15
/** Gust speed across the strip, in strip heights per second. */
const GUST_SPEED = 0.9

/** Needle texture inside the pine, dark to bright. */
const NEEDLES = ['.,', ':;', '^v*', '%&#'] as const

/**
 * Pine silhouette: half-width (in cells) at `k` rows above the ground, and
 * whether that row closes a tier. Three tiers, widest at the bottom.
 */
function pineRow(k: number): { width: number; floor: boolean } | null {
  if (k >= 8 && k <= TREE_ROWS) return { width: TREE_ROWS - k + 0.3, floor: k === 8 }
  if (k >= 5 && k <= 7) return { width: 3.2 + (7 - k) * 2, floor: k === 5 }
  if (k >= 3 && k <= 4) return { width: 3.2 + (4 - k) * 2.5, floor: k === 3 }
  return null
}

interface Blade {
  readonly height: number
  readonly phase: number
  readonly amplitude: number
}

interface Firefly {
  readonly x: number
  readonly y: number
  readonly drift: number
  readonly bob: number
  readonly blink: number
  readonly phase: readonly [number, number, number, number]
}

export class LandscapeField implements CellField {
  readonly chars: string[]
  readonly tags: Uint8Array
  readonly lum: Float32Array
  private readonly xs: Float32Array
  private readonly ground: Int16Array
  private readonly ridge: Int16Array
  private readonly blades: (Blade | null)[]
  private readonly flies: Firefly[]
  private readonly rnd: Float32Array
  private readonly hsh: Uint8Array
  private readonly treeCol: number

  constructor(
    readonly cols: number,
    readonly rows: number,
    private readonly aspect: number,
  ) {
    const n = cols * rows
    this.chars = new Array<string>(n).fill(' ')
    this.tags = new Uint8Array(n)
    this.lum = new Float32Array(n)
    this.rnd = new Float32Array(n)
    this.hsh = new Uint8Array(n)
    this.xs = new Float32Array(cols)
    this.ground = new Int16Array(cols)
    this.ridge = new Int16Array(cols)

    const random = mulberry32(11)
    for (let k = 0; k < n; k++) {
      this.rnd[k] = random()
      this.hsh[k] = Math.floor(random() * 256)
    }

    for (let i = 0; i < cols; i++) {
      const u = (i + 0.5) / cols
      const x = u * aspect
      this.xs[i] = x
      // A low hill under the pine on gently rolling ground.
      const hill = Math.exp(-(((u - TREE_AT) / 0.17) ** 2))
      const groundY =
        0.97 - 0.21 * hill - 0.025 * (0.5 + 0.5 * Math.sin(x * 1.7 + 0.6))
      this.ground[i] = Math.min(rows - 1, Math.floor(groundY * rows))
      const ridgeY =
        0.42 +
        0.09 * Math.sin(x * 0.55 + 1.2) +
        0.05 * Math.sin(x * 1.35 + 0.3) +
        0.03 * Math.sin(x * 3.1)
      this.ridge[i] = Math.floor(ridgeY * rows)
    }

    this.blades = Array.from({ length: cols }, (_, i) => {
      const hill = Math.exp(-((((i + 0.5) / cols - TREE_AT) / 0.17) ** 2))
      // Bare patches thin out towards the hill, where the soil is richer.
      if (random() > 0.74 + hill * 0.2) return null
      return {
        height: 1 + Math.floor(random() * (hill > 0.3 ? 4 : 3)),
        phase: random() * Math.PI * 2,
        amplitude: 0.7 + random() * 0.7,
      }
    })

    this.flies = Array.from({ length: Math.max(3, Math.round(cols / 22)) }, () => ({
      x: random(),
      y: 0.35 + random() * 0.45,
      drift: 0.15 + random() * 0.25,
      bob: 0.4 + random() * 0.6,
      blink: 0.6 + random() * 0.9,
      phase: [random() * 6.3, random() * 6.3, random() * 6.3, random() * 6.3],
    }))

    this.treeCol = Math.round(TREE_AT * cols - 0.5)
  }

  /** How strongly the wind is gusting at `x` (strip heights) right now. */
  private gust(x: number, t: number): number {
    const span = this.aspect + 3
    const a = mod(t * GUST_SPEED, span) - 1.5
    const b = mod(t * GUST_SPEED * 0.73 + span * 0.5, span) - 1.5
    return (
      Math.exp(-(((x - a) / 0.7) ** 2)) + 0.7 * Math.exp(-(((x - b) / 0.9) ** 2))
    )
  }

  private put(row: number, col: number, char: string, tag: number, lum: number) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return
    const k = row * this.cols + col
    this.chars[k] = char
    this.tags[k] = tag
    this.lum[k] = lum
  }

  render(t: number): void {
    const { cols, rows, chars, lum, xs, ground, ridge, rnd, hsh } = this
    chars.fill(' ')
    lum.fill(0)

    const farOn = smooth(t / 1.2)
    const grow = smooth((t - 0.2) / 1.8)
    const treeGrow = smooth((t - 0.6) / 2.4)
    const fliesOn = smooth((t - 2.4) / 1.6)

    // 1. The far ridge, and a sparse slope down to the near ground. A gust
    //    passing over lifts it a little, so the wind shows even back there.
    for (let i = 0; i < cols; i++) {
      const top = ridge[i]!
      const g = ground[i]!
      if (top >= g - 1) continue
      const gust = this.gust(xs[i]!, t)
      const slope = (ridge[i + 1] ?? top) - (ridge[i - 1] ?? top)
      const edge =
        slope < 0 ? '/' : slope > 0 ? '\\' : hsh[top * cols + i]! % 5 ? '-' : '~'
      this.put(top, i, edge, FAR, (0.55 + 0.25 * gust) * farOn)
      for (let row = top + 1; row < g; row++) {
        const k = row * cols + i
        const depth = (row - top) / Math.max(g - top, 1)
        if (rnd[k]! < 0.1 * (1 - depth)) {
          this.put(row, i, rnd[k]! < 0.03 ? ':' : '.', FAR, (0.3 + 0.2 * gust) * farOn)
        }
      }
    }

    // 2. The soil line and a speckle of earth below it.
    for (let i = 0; i < cols; i++) {
      const g = ground[i]!
      // Where the ground steps up or down, the step is drawn as a slope.
      const rising = (ground[i - 1] ?? g) > g
      const falling = (ground[i + 1] ?? g) > g
      const line = rising
        ? '/'
        : falling
          ? '\\'
          : hsh[g * cols + i]! % 3 === 0
            ? '.'
            : '_'
      this.put(g, i, line, SOIL, 0.75)
      for (let row = g + 1; row < rows; row++) {
        const k = row * cols + i
        const d = row - g
        if (rnd[k]! < 0.55 * Math.exp(-(d - 1) / 2.2)) {
          this.put(row, i, ".,:;'"[hsh[k]! % 5]!, SOIL, 0.5 * Math.exp(-d / 5))
        }
      }
    }

    // 3. The pine, drawn up from the trunk, leaning with the wind; needles
    //    shimmer while a gust goes through it.
    if (treeGrow > 0) {
      const tc = this.treeCol
      const tg = ground[tc] ?? rows - 1
      const treeGust = this.gust(xs[tc] ?? 0, t)
      const lean =
        0.5 * Math.sin(t * 0.9) + 0.3 * Math.sin(t * 0.53 + 1) + 1.1 * treeGust
      const shown = treeGrow * TREE_ROWS + 0.5

      for (let k = 1; k <= TREE_ROWS && k <= shown; k++) {
        const row = tg - k
        if (row < 0) break
        const centre = tc + lean * (k / TREE_ROWS) ** 1.6 * 1.6

        if (k <= 2) {
          for (let d = -1; d <= 1; d++) this.put(row, Math.round(centre) + d, '|', BARK, 0.85)
          continue
        }

        const tier = pineRow(k)
        if (!tier) continue
        if (k === TREE_ROWS) {
          this.put(row, Math.round(centre), '^', MOSS_LIGHT, 1)
          continue
        }

        const from = Math.floor(centre - tier.width - 0.5)
        const to = Math.ceil(centre + tier.width + 0.5)
        for (let col = from; col <= to; col++) {
          const dx = col - centre
          const ax = Math.abs(dx)
          if (ax > tier.width + 0.5) continue
          const h = hsh[row * cols + Math.max(0, Math.min(cols - 1, col))]!

          if (ax > tier.width - 0.6) {
            this.put(row, col, dx < 0 ? '/' : '\\', MOSS_LIGHT, 0.9 + 0.2 * treeGust)
          } else if (tier.floor) {
            this.put(row, col, ax < 0.5 ? '|' : '_', MOSS, 0.8)
          } else if (ax < 0.5) {
            this.put(row, col, '|', BARK, 0.6)
          } else {
            const texture =
              0.5 + 0.5 * Math.sin(dx * 1.7 + k * 2.3 + h * 0.05) +
              0.35 * treeGust * Math.sin(t * 6 + dx + k)
            if (texture < 0.35) continue
            // Lit from the upper left.
            const light =
              (0.35 + 0.35 * (-dx / (tier.width + 1)) + 0.25 * (k / TREE_ROWS)) *
              (0.6 + 0.4 * texture)
            const level = Math.max(0, Math.min(3, Math.floor(light * 4)))
            const pool = NEEDLES[level]!
            const tag =
              light < 0.35 ? NEEDLE_DARK : light < 0.6 ? MOSS : light < 0.8 ? MOSS_LIGHT : BRIGHT
            this.put(row, col, pool[h % pool.length]!, tag, 0.6 + 0.5 * light)
          }
        }
      }
    }

    // 4. The grass: each blade bends with the wind, more at the tip, and
    //    catches the light while a gust holds it over.
    for (let i = 0; i < cols; i++) {
      const blade = this.blades[i]
      if (!blade) continue
      const height = Math.round(blade.height * grow)
      if (height === 0) continue

      const g = ground[i]!
      const gust = this.gust(xs[i]!, t)
      const wind =
        (0.28 * Math.sin(1.2 * t + 0.6 * xs[i]! + blade.phase) + 1.25 * gust) *
        blade.amplitude

      for (let d = 1; d <= height; d++) {
        const along = d / blade.height
        const bend = wind * along
        const over = Math.abs(bend) - 0.9
        const shift = over > 0 && d > 1 ? Math.sign(bend) * Math.round(over * (d - 1) * 0.8) : 0
        const tip = d === height
        const h = hsh[(g - d >= 0 ? g - d : 0) * cols + i]!

        let char: string
        if (tip && Math.abs(bend) > 1.3) char = '-'
        else if (bend > 0.45) char = '/'
        else if (bend < -0.45) char = '\\'
        else if (tip) char = blade.height === 1 ? ',' : h % 2 ? "'" : '`'
        else char = h % 3 ? '|' : 'l'

        const heat = 0.35 + 0.55 * Math.min(gust, 1) + 0.2 * along
        const tag = heat > 0.85 ? BRIGHT : heat > 0.6 ? MOSS_LIGHT : MOSS
        this.put(g - d, i + shift, char, tag, 0.55 + 0.5 * heat)
      }
    }

    // 5. Fireflies, drifting and blinking; the trail draws their tails.
    if (fliesOn > 0) {
      for (const fly of this.flies) {
        const [p1, p2, p3, p4] = fly.phase
        const x = mod(
          fly.x * this.aspect +
            0.35 * Math.sin(t * fly.drift + p1) +
            0.12 * Math.sin(t * fly.drift * 2.7 + p2),
          this.aspect,
        )
        const col = Math.floor((x / this.aspect) * cols)
        const y = fly.y + 0.07 * Math.sin(t * fly.bob + p3)
        const row = Math.min(Math.floor(y * rows), (ground[col] ?? rows) - 1)
        const glow = smooth((Math.sin(t * fly.blink + p4) - 0.1) * 2.5) * fliesOn
        if (glow < 0.05) continue
        this.put(row, col, glow > 0.55 ? '*' : '.', FIREFLY, 0.5 + 0.8 * glow)
      }
    }
  }
}
