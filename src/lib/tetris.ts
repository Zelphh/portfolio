/**
 * A tetris that plays itself, used as the footer backdrop.
 *
 * The engine is renderer-agnostic: it owns the grid, the falling piece and
 * the line-clear animation clock, and exposes them as plain state for a
 * canvas (or anything else) to draw. Nothing here touches the DOM.
 *
 * The AI is a Dellacherie-style one-ply search — every rotation in every
 * column is scored on resulting height, holes and completed lines, and the
 * best placement wins. Good enough to look competent, cheap enough to run
 * once per piece with no measurable cost.
 */

export const EMPTY = -1

/** Cell coordinates of each tetromino in its spawn rotation. */
const SHAPES: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [[0, 1], [1, 1], [2, 1], [3, 1]], // I
  [[0, 0], [0, 1], [1, 1], [2, 1]], // J
  [[2, 0], [0, 1], [1, 1], [2, 1]], // L
  [[1, 0], [2, 0], [0, 1], [1, 1]], // S
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
  [[1, 0], [0, 1], [1, 1], [2, 1]], // T
  [[0, 0], [1, 0], [0, 1], [1, 1]], // O
]

/** Weights for the placement heuristic. Tuned to keep the stack flat. */
const WEIGHTS = {
  lines: 4,
  height: -0.5,
  holes: -3.5,
  bumpiness: -0.3,
} as const

const CLEAR_BLINKS = 2
export const BLINK_MS = 90

type Cells = ReadonlyArray<readonly [number, number]>

export interface Piece {
  readonly cells: Cells
  readonly color: number
  col: number
  row: number
  readonly startCol: number
  readonly startRow: number
  readonly targetCol: number
  readonly targetRow: number
}

export interface TetrisOptions {
  readonly cols: number
  readonly rows: number
  /** Number of block colours available. */
  readonly colorCount: number
  /** 0-10. How far off-target a piece spawns before gliding into place. */
  readonly movement: number
  readonly seed?: number
}

/** Seeded PRNG, so a board of a given size always plays out the same way. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Rotates a shape a quarter-turn at a time, re-seated against the origin. */
function rotate(shapeIndex: number, turns: number): Cells {
  let cells = (SHAPES[shapeIndex] as Cells).map(
    ([c, r]) => [c, r] as [number, number],
  )

  for (let turn = 0; turn < turns; turn++) {
    const maxRow = cells.reduce((max, [, r]) => Math.max(max, r), 0)
    cells = cells.map(([c, r]) => [maxRow - r, c])
  }

  const minCol = cells.reduce((min, [c]) => Math.min(min, c), Infinity)
  const minRow = cells.reduce((min, [, r]) => Math.min(min, r), Infinity)
  return cells.map(([c, r]) => [c - minCol, r - minRow] as [number, number])
}

export class TetrisEngine {
  readonly cols: number
  readonly rows: number

  /** Row-major; each cell is a colour index or `EMPTY`. */
  grid: Int8Array
  piece: Piece | null = null
  /** Rows currently flashing before they collapse. */
  clearingRows: readonly number[] = []
  clearMs = 0

  private readonly random: () => number
  private readonly colorCount: number
  private readonly wander: number
  private dropAccumulator = 0

  constructor({ cols, rows, colorCount, movement, seed = 0x7e7415 }: TetrisOptions) {
    this.cols = cols
    this.rows = rows
    this.colorCount = Math.max(1, colorCount)
    this.wander = Math.min(10, Math.max(0, movement)) / 10
    this.random = mulberry32(seed)
    this.grid = new Int8Array(cols * rows).fill(EMPTY)
    this.spawn()
  }

  /** True while cleared rows are strobing and the board is held still. */
  get isClearing(): boolean {
    return this.clearMs > 0
  }

  /** Whether a flashing row should be drawn lit on this frame. */
  get blinkLit(): boolean {
    return this.clearMs > 0 && Math.floor(this.clearMs / BLINK_MS) % 2 === 0
  }

  /**
   * Advances the simulation.
   *
   * @param dt        Milliseconds since the last call.
   * @param dropEvery Milliseconds between one-row drops.
   */
  step(dt: number, dropEvery: number): void {
    if (this.clearMs > 0) {
      this.clearMs -= dt
      if (this.clearMs <= 0) {
        this.clearMs = 0
        this.collapse()
        this.spawn()
      }
      return
    }

    if (!this.piece) {
      this.spawn()
      return
    }

    this.dropAccumulator += dt
    while (this.dropAccumulator >= dropEvery && this.piece) {
      this.dropAccumulator -= dropEvery
      this.advancePiece()
    }
  }

  private advancePiece(): void {
    const piece = this.piece
    if (!piece) return

    if (piece.row >= piece.targetRow) {
      piece.col = piece.targetCol
      this.lock()
      return
    }

    piece.row++
    // Glide the column toward the target in step with the fall, so the piece
    // arrives exactly where the search said it should.
    const span = piece.targetRow - piece.startRow
    const progress = span > 0 ? (piece.row - piece.startRow) / span : 1
    piece.col = Math.round(
      piece.startCol + (piece.targetCol - piece.startCol) * progress,
    )
  }

  private at(col: number, row: number): number {
    return this.grid[row * this.cols + col] as number
  }

  private fits(cells: Cells, col: number, row: number): boolean {
    for (const [c, r] of cells) {
      const gridCol = col + c
      const gridRow = row + r
      if (gridCol < 0 || gridCol >= this.cols || gridRow >= this.rows) return false
      if (gridRow >= 0 && this.at(gridCol, gridRow) !== EMPTY) return false
    }
    return true
  }

  /** Lowest row a shape can rest at from a column, or -1 if it cannot enter. */
  private landing(cells: Cells, col: number): number {
    if (!this.fits(cells, col, 0)) return -1
    let row = 0
    while (this.fits(cells, col, row + 1)) row++
    return row
  }

  /** Scores a resting placement — higher is a tighter, flatter pack. */
  private score(cells: Cells, col: number, row: number): number {
    const { cols, rows } = this
    const test = Int8Array.from(this.grid)
    for (const [c, r] of cells) {
      const gridRow = row + r
      if (gridRow >= 0) test[gridRow * cols + (col + c)] = 1
    }

    let lines = 0
    for (let r = 0; r < rows; r++) {
      let full = true
      for (let c = 0; c < cols; c++) {
        if (test[r * cols + c] === EMPTY) {
          full = false
          break
        }
      }
      if (full) lines++
    }

    let aggregateHeight = 0
    let holes = 0
    let bumpiness = 0
    let previousTop = -1

    for (let c = 0; c < cols; c++) {
      let top = rows
      for (let r = 0; r < rows; r++) {
        if (test[r * cols + c] !== EMPTY) {
          top = r
          break
        }
      }

      aggregateHeight += rows - top
      for (let r = top + 1; r < rows; r++) {
        if (test[r * cols + c] === EMPTY) holes++
      }
      if (previousTop >= 0) bumpiness += Math.abs(top - previousTop)
      previousTop = top
    }

    return (
      lines * WEIGHTS.lines +
      aggregateHeight * WEIGHTS.height +
      holes * WEIGHTS.holes +
      bumpiness * WEIGHTS.bumpiness
    )
  }

  /** Picks the best column and rotation for the next shape, then spawns it. */
  private spawn(): void {
    const shape = Math.floor(this.random() * SHAPES.length)
    let best: { cells: Cells; col: number; row: number } | null = null
    let bestScore = -Infinity

    for (let turn = 0; turn < 4; turn++) {
      const cells = rotate(shape, turn)
      const width = cells.reduce((max, [c]) => Math.max(max, c), 0)

      for (let col = 0; col + width < this.cols; col++) {
        const row = this.landing(cells, col)
        if (row < 0) continue
        const score = this.score(cells, col, row)
        if (score > bestScore) {
          bestScore = score
          best = { cells, col, row }
        }
      }
    }

    // Nowhere to land: the stack topped out. Wipe and start over.
    if (!best) {
      this.grid = new Int8Array(this.cols * this.rows).fill(EMPTY)
      this.piece = null
      return
    }

    const height = best.cells.reduce((max, [, r]) => Math.max(max, r), 0)
    const width = best.cells.reduce((max, [c]) => Math.max(max, c), 0)
    // Spawn fully above the board so the fall reads as motion, offset
    // sideways by up to `wander` so pieces drift into place instead of
    // dropping in a straight line.
    const startRow = -1 - height
    const maxCol = this.cols - 1 - width
    const swing = Math.round((this.random() * 2 - 1) * this.wander * this.cols)
    const startCol = Math.min(maxCol, Math.max(0, best.col + swing))

    this.piece = {
      cells: best.cells,
      color: this.colorCount > 1 ? Math.floor(this.random() * this.colorCount) : 0,
      col: startCol,
      row: startRow,
      startCol,
      startRow,
      targetCol: best.col,
      targetRow: best.row,
    }
  }

  private lock(): void {
    const piece = this.piece
    if (!piece) return

    for (const [c, r] of piece.cells) {
      const gridRow = piece.row + r
      const gridCol = piece.col + c
      const inside =
        gridRow >= 0 &&
        gridRow < this.rows &&
        gridCol >= 0 &&
        gridCol < this.cols
      if (inside) this.grid[gridRow * this.cols + gridCol] = piece.color
    }
    this.piece = null

    const full: number[] = []
    for (let r = 0; r < this.rows; r++) {
      let solid = true
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r * this.cols + c] === EMPTY) {
          solid = false
          break
        }
      }
      if (solid) full.push(r)
    }

    if (full.length > 0) {
      this.clearingRows = full
      this.clearMs = CLEAR_BLINKS * BLINK_MS * 2
    }
  }

  /** Removes the flashing rows and drops everything above them down. */
  private collapse(): void {
    const gone = new Set(this.clearingRows)
    const next = new Int8Array(this.cols * this.rows).fill(EMPTY)
    let write = this.rows - 1

    for (let r = this.rows - 1; r >= 0; r--) {
      if (gone.has(r)) continue
      for (let c = 0; c < this.cols; c++) {
        next[write * this.cols + c] = this.grid[r * this.cols + c] as number
      }
      write--
    }

    this.grid = next
    this.clearingRows = []
  }
}
