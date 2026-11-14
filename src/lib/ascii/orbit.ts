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
 * The projects as a little planetary system, drawn like the black hole: each
 * project is a planet on its own tilted orbit around a star, inner orbits
 * turning faster (Keplerian, r^-1.5). Planets are lit from the star, so
 * their bright side turns as they go round, and each drags a tail of light
 * along its orbit. A project still being built wears a pulsing ring.
 *
 * Hovering a planet (or focusing it from outside, from the project list)
 * slows time almost to a stop, swells the planet, lights its orbit and
 * writes its name and stack beside it, so it is easy to click.
 *
 * Coordinates are in frame units: the box is 1 tall, both axes centred on 0,
 * y down. Orbits are circles in a disk tilted towards the viewer.
 */

export interface OrbitPlanet {
  readonly name: string
  readonly stack: string
  readonly inProgress?: boolean
}

/** dim, star, star core, then one colour per planet (cycled) */
export const ORBIT_COLORS: readonly Rgb[] = [
  [109, 112, 101],
  [231, 200, 90],
  [255, 244, 200],
  [220, 228, 255],
  [231, 231, 74],
  [143, 160, 114],
  [179, 165, 138],
  [201, 116, 74],
  [138, 160, 190],
]
const DIM = 0
const STAR = 1
const CORE = 2
const SKY = 3
const PLANET_TAGS = [4, 5, 6, 7, 8] as const

/** By the time every orbit is drawn and every planet is out. */
export const ORBIT_SETTLED = 4

/** The disk leans this much. */
const TILT = (-9 * Math.PI) / 180
const COS_TILT = Math.cos(TILT)
const SIN_TILT = Math.sin(TILT)
/** How open the disk looks: 1 is face on, 0 edge on. */
const INC = 0.55
const STAR_R = 0.04
const FIRST_ORBIT = 0.17
const ORBIT_GAP = 0.085
/** Base angular speed of the innermost orbit (rad/s). */
const SPIN = 0.42
/** Time runs this fast while a planet is hovered or focused. */
const SLOW = 0.12

/** Planet letters by how lit they are, dark to bright. */
const POOLS = ['.,', ':;!', 'oaex', 'O0B8', '$%&#'] as const

interface Placed {
  index: number
  x: number
  y: number
  r: number
  angle: number
  front: boolean
}

export class OrbitField implements CellField {
  readonly chars: string[]
  readonly tags: Uint8Array
  readonly lum: Float32Array
  /** The planet under the pointer, if any. */
  hovered: number | null = null

  private readonly rnd: Float32Array
  private readonly hsh: Uint8Array
  private readonly radii: number[]
  private readonly sizes: number[]
  private readonly starts: number[]
  /** 0..1 per planet, how swollen it is from being hovered or focused. */
  private readonly grow: number[]
  private placed: Placed[] = []
  private external: number | null = null
  private pointerAt: { x: number; y: number } | null = null
  private clock = 0
  private last = -1
  private speed = 1

  constructor(
    readonly cols: number,
    readonly rows: number,
    private readonly aspect: number,
    private readonly planets: readonly OrbitPlanet[],
  ) {
    const n = cols * rows
    this.chars = new Array<string>(n).fill(' ')
    this.tags = new Uint8Array(n)
    this.lum = new Float32Array(n)
    this.rnd = new Float32Array(n)
    this.hsh = new Uint8Array(n)
    const random = mulberry32(3)
    for (let k = 0; k < n; k++) {
      this.rnd[k] = random()
      this.hsh[k] = Math.floor(random() * 256)
    }
    this.radii = planets.map((_, i) => FIRST_ORBIT + i * ORBIT_GAP)
    // Newer projects (listed first) are a little bigger.
    this.sizes = planets.map((_, i) => 0.05 - i * 0.004)
    this.starts = planets.map((_, i) => i * 2.4 + 0.6)
    this.grow = planets.map(() => 0)
  }

  /** Focus a planet from outside (the project list), or clear it. */
  focus(index: number | null): void {
    this.external = index
  }

  pointer(point: BoxPoint | null): void {
    this.pointerAt = point
      ? { x: (point.x - 0.5) * this.aspect, y: point.y - 0.5 }
      : null
    this.hovered = this.hitTest()
  }

  /** A tap counts as hovering, so touch screens can pick a planet too. */
  press(point: BoxPoint): void {
    this.pointer(point)
  }

  private hitTest(): number | null {
    const at = this.pointerAt
    if (!at) return null
    let best: number | null = null
    let bestDistance = Infinity
    for (const p of this.placed) {
      const distance = Math.hypot(p.x - at.x, p.y - at.y)
      if (distance < Math.max(p.r * 1.8, 0.05) && distance < bestDistance) {
        best = p.index
        bestDistance = distance
      }
    }
    return best
  }

  private put(row: number, col: number, char: string, tag: number, l: number) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return
    const k = row * this.cols + col
    this.chars[k] = char
    this.tags[k] = tag
    this.lum[k] = l
  }

  private toCell(x: number, y: number) {
    return {
      col: (x / this.aspect + 0.5) * this.cols - 0.5,
      row: (y + 0.5) * this.rows - 0.5,
    }
  }

  /** A point on orbit `r` at `angle`, on screen. */
  private project(r: number, angle: number) {
    const u = r * Math.cos(angle)
    const v = r * Math.sin(angle) * INC
    return { x: u * COS_TILT - v * SIN_TILT, y: u * SIN_TILT + v * COS_TILT }
  }

  render(t: number): void {
    const dt = this.last < 0 ? 0 : Math.min(Math.max(t - this.last, 0), 0.1)
    this.last = t
    const focused = this.hovered ?? this.external
    const target = focused === null ? 1 : SLOW
    this.speed += (target - this.speed) * Math.min(1, dt * 4)
    this.clock += dt * this.speed
    for (let i = 0; i < this.grow.length; i++) {
      const want = i === focused ? 1 : 0
      this.grow[i]! += (want - this.grow[i]!) * Math.min(1, dt * 6)
    }

    const { cols, rows, chars, lum, aspect, rnd, hsh, radii } = this
    chars.fill(' ')
    lum.fill(0)
    const cellX = aspect / cols
    const cellY = 1 / rows

    // Where every planet is now.
    this.placed = this.planets.map((_, index) => {
      const r = radii[index]!
      const angle = this.starts[index]! + SPIN * (FIRST_ORBIT / r) ** 1.5 * this.clock
      const at = this.project(r, angle)
      const appear = smooth((t - 0.9 - index * 0.25) / 0.6)
      return {
        index,
        x: at.x,
        y: at.y,
        r: this.sizes[index]! * (1 + 0.3 * this.grow[index]!) * appear,
        angle: mod(angle, TAU),
        front: Math.sin(angle) > 0,
      }
    })

    // 1. Faint stars, twinkling.
    for (let k = 0; k < rnd.length; k++) {
      const p = rnd[k]!
      if (p < 0.004) {
        chars[k] = p < 0.0008 ? '+' : p < 0.002 ? '*' : '.'
        this.tags[k] = SKY
        lum[k] = 0.35 + 0.25 * Math.sin(1.3 * t + p * 7000)
      }
    }

    // 2. The orbits: dotted paths that draw themselves round, a tail of
    //    light behind each planet, and the whole path lit when focused.
    for (let j = 0; j < rows; j++) {
      const y = (j + 0.5) / rows - 0.5
      for (let i = 0; i < cols; i++) {
        const x = ((i + 0.5) / cols - 0.5) * aspect
        const u = x * COS_TILT + y * SIN_TILT
        const v = (-x * SIN_TILT + y * COS_TILT) / INC
        const rho = Math.hypot(u, v)
        const theta = Math.atan2(v, u)
        const nearest = Math.round((rho - FIRST_ORBIT) / ORBIT_GAP)
        if (nearest < 0 || nearest >= radii.length) continue
        const r = radii[nearest]!
        const width =
          0.55 * (Math.abs(Math.cos(theta)) * cellX + (Math.abs(Math.sin(theta)) * cellY) / INC)
        if (Math.abs(rho - r) > width) continue

        const drawn = smooth((t - 0.2 - nearest * 0.15) / 1.2)
        if (mod(theta + Math.PI / 2, TAU) / TAU > drawn * 1.05) continue

        const planet = this.placed[nearest]!
        const tag = PLANET_TAGS[nearest % PLANET_TAGS.length]!
        const behind = mod(planet.angle - theta + Math.PI, TAU) - Math.PI
        const tail = behind > 0 ? Math.exp(-behind / 0.55) : 0
        const lit = Math.max(tail, 0.75 * this.grow[nearest]!)
        const k = j * cols + i
        const sx = -r * Math.sin(theta)
        const sy = r * Math.cos(theta) * INC
        const stroke = tangentLetter(sx * COS_TILT - sy * SIN_TILT, sx * SIN_TILT + sy * COS_TILT)

        if (lit > 0.12) {
          chars[k] = stroke
          this.tags[k] = tag
          lum[k] = 0.35 + 0.75 * lit
        } else if (hsh[k]! % 3 === 0) {
          chars[k] = '.'
          this.tags[k] = DIM
          lum[k] = 0.55
        }
      }
    }

    // 3. Planets behind the star, then the star, then the ones in front.
    for (const p of this.placed) if (!p.front) this.drawPlanet(p, t)
    this.drawStar(t)
    for (const p of this.placed) if (p.front) this.drawPlanet(p, t)

    // 4. The focused planet's name and stack, written beside it.
    if (focused !== null && this.grow[focused]! > 0.4) this.drawLabel(focused)
  }

  private drawStar(t: number): void {
    const on = smooth(t / 0.6)
    if (on <= 0) return
    const reach = STAR_R * 2.2
    const from = this.toCell(-reach, -reach)
    const to = this.toCell(reach, reach)
    for (let row = Math.floor(from.row); row <= Math.ceil(to.row); row++) {
      for (let col = Math.floor(from.col); col <= Math.ceil(to.col); col++) {
        const x = ((col + 0.5) / this.cols - 0.5) * this.aspect
        const y = (row + 0.5) / this.rows - 0.5
        const r = Math.hypot(x, y)
        const a = Math.atan2(y, x)
        // A breathing corona with a few slow flares.
        const corona =
          STAR_R *
          (1 + 0.25 * Math.sin(3 * a + 1.1 * t) + 0.15 * Math.sin(5 * a - 0.7 * t))
        const heat = r < STAR_R ? 1 : Math.exp(-(((r - STAR_R) / (corona * 0.5)) ** 2)) * 0.9
        if (heat < 0.15) continue
        const k = row * this.cols + col
        const h = this.hsh[Math.max(0, Math.min(k, this.hsh.length - 1))]!
        const level = Math.min(4, Math.floor(heat * 4.5))
        const pool = POOLS[level]!
        this.put(row, col, pool[h % pool.length]!, heat > 0.85 ? CORE : STAR, (0.5 + 0.7 * heat) * on)
      }
    }
  }

  private drawPlanet(p: Placed, t: number): void {
    if (p.r <= 0.002) return
    const tag = PLANET_TAGS[p.index % PLANET_TAGS.length]!
    // Lit from the star: a 3D light direction from the planet towards it.
    const lx = -p.x
    const ly = -p.y
    const lz = 0.35
    const ln = Math.hypot(lx, ly, lz) || 1

    const from = this.toCell(p.x - p.r, p.y - p.r)
    const to = this.toCell(p.x + p.r, p.y + p.r)
    for (let row = Math.floor(from.row); row <= Math.ceil(to.row); row++) {
      for (let col = Math.floor(from.col); col <= Math.ceil(to.col); col++) {
        const x = ((col + 0.5) / this.cols - 0.5) * this.aspect
        const y = (row + 0.5) / this.rows - 0.5
        const dx = (x - p.x) / p.r
        const dy = (y - p.y) / p.r
        const d2 = dx * dx + dy * dy
        if (d2 > 1) continue
        const nz = Math.sqrt(1 - d2)
        const light = Math.max(0, (dx * lx + dy * ly + nz * lz) / ln)
        const b = 0.12 + 0.88 * light
        const k = Math.max(0, Math.min(row * this.cols + col, this.hsh.length - 1))
        const pool = POOLS[Math.min(4, Math.floor(b * 5))]!
        const edge = d2 > 0.75
        this.put(
          row,
          col,
          edge && light < 0.2 ? '.' : pool[this.hsh[k]! % pool.length]!,
          tag,
          0.3 + 0.9 * b,
        )
      }
    }

    // Still being built: a ring that pulses out from the planet.
    if (this.planets[p.index]?.inProgress) {
      const pulse = mod(t * 0.6, 1)
      const ring = p.r * (1.35 + 0.9 * pulse)
      const fade = 1 - pulse
      const steps = Math.max(12, Math.round((ring / this.aspect) * this.cols * 7))
      for (let s = 0; s < steps; s++) {
        const a = (s / steps) * TAU
        const cell = this.toCell(p.x + ring * Math.cos(a), p.y + ring * Math.sin(a))
        const row = Math.round(cell.row)
        const col = Math.round(cell.col)
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) continue
        if (this.chars[row * this.cols + col] !== ' ' && this.tags[row * this.cols + col] !== DIM) continue
        this.put(row, col, s % 2 ? '.' : ':', tag, 0.4 + 0.6 * fade)
      }
    }
  }

  private drawLabel(index: number): void {
    const p = this.placed[index]
    const planet = this.planets[index]
    if (!p || !planet) return
    const tag = PLANET_TAGS[index % PLANET_TAGS.length]!
    const centre = this.toCell(p.x, p.y)
    const rowName = Math.round(centre.row)
    const reachCols = (p.r / this.aspect) * this.cols
    const name = ` -- ${planet.name} `
    const stack = `    ${planet.stack} `
    const width = Math.max(name.length, stack.length)

    // To the right of the planet, unless that runs off the edge.
    let start = Math.round(centre.col + reachCols + 2)
    if (start + width > this.cols - 1) {
      start = Math.round(centre.col - reachCols - 2 - width)
    }
    const rows: [string, number, number][] = [
      [name, rowName, 1.15],
      [stack, rowName + 1, 0.8],
    ]
    // The label clears what is behind it, so it reads over orbits and stars.
    for (const [text, row, l] of rows) {
      const padded = text.padEnd(width)
      for (let c = 0; c < padded.length; c++) {
        const char = padded[c]!
        this.put(row, start + c, char, row === rowName ? tag : DIM, char === ' ' ? 0 : l)
      }
    }
  }
}
