/**
 * Snake, played inside the console.
 *
 * Like the tetris engine, this owns only state — the body, the heading, the
 * food — and exposes it for a renderer to draw. Nothing here touches the DOM
 * or keeps time; the caller decides when a tick happens.
 */

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Cell = readonly [col: number, row: number]

const STEP: Readonly<Record<Direction, Cell>> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

const OPPOSITE: Readonly<Record<Direction, Direction>> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const START_LENGTH = 3

/**
 * Turns held for the ticks ahead. Two is enough to land a quick U-turn
 * (`up` then `left`) that would otherwise be eaten by a single tick.
 */
const MAX_QUEUED = 2

export class SnakeEngine {
  readonly cols: number
  readonly rows: number

  /** Head first. */
  body: Cell[] = []
  food: Cell | null = null
  score = 0
  over = false

  private heading: Direction = 'right'
  private queue: Direction[] = []

  constructor(cols: number, rows: number) {
    this.cols = cols
    this.rows = rows
    this.reset()
  }

  reset(): void {
    const row = Math.floor(this.rows / 2)
    const col = Math.min(this.cols - 1, Math.floor(this.cols / 3) + START_LENGTH)

    this.body = Array.from(
      { length: Math.min(START_LENGTH, col + 1) },
      (_, index) => [col - index, row] as const,
    )
    this.heading = 'right'
    this.queue = []
    this.score = 0
    this.over = false
    this.placeFood()
  }

  /**
   * Queues a turn for an upcoming tick. Reversing into the neck and
   * repeating the current heading are dropped, so mashing a key is harmless.
   */
  turn(direction: Direction): void {
    if (this.over || this.queue.length >= MAX_QUEUED) return

    const last = this.queue.at(-1) ?? this.heading
    if (direction === last || direction === OPPOSITE[last]) return
    this.queue.push(direction)
  }

  /** Moves one cell. Hitting a wall or the body ends the game. */
  step(): void {
    if (this.over) return

    this.heading = this.queue.shift() ?? this.heading
    const [headCol, headRow] = this.body[0] as Cell
    const [dc, dr] = STEP[this.heading]
    const next: Cell = [headCol + dc, headRow + dr]

    const eating = this.isFood(next)
    // The tail moves out of the way on the same tick, so stepping into the
    // cell it is leaving is legal — unless this tick grows the snake.
    const body = eating ? this.body : this.body.slice(0, -1)

    if (!this.inside(next) || body.some((cell) => same(cell, next))) {
      this.over = true
      return
    }

    this.body = [next, ...body]

    if (eating) {
      this.score++
      this.placeFood()
    }
  }

  isFood(cell: Cell): boolean {
    return this.food !== null && same(this.food, cell)
  }

  private inside([col, row]: Cell): boolean {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows
  }

  /** Drops food on a random free cell; a board with none left is a win. */
  private placeFood(): void {
    const taken = new Set(this.body.map(([col, row]) => row * this.cols + col))
    const free: number[] = []
    for (let index = 0; index < this.cols * this.rows; index++) {
      if (!taken.has(index)) free.push(index)
    }

    const pick = free[Math.floor(Math.random() * free.length)]
    if (pick === undefined) {
      this.food = null
      this.over = true
      return
    }

    this.food = [pick % this.cols, Math.floor(pick / this.cols)]
  }
}

function same(a: Cell, b: Cell): boolean {
  return a[0] === b[0] && a[1] === b[1]
}
