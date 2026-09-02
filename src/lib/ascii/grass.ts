import { rowsToHtml } from './render'

/**
 * The grass strip and lone tree that close the about section.
 *
 * Each column holds one blade with its own phase, speed and amplitude, so the
 * field ripples instead of waving in lockstep. Blades swap between an upright
 * sprite and left/right bent sprites as their swing crosses a threshold —
 * cheaper and crisper than interpolating character positions.
 */

export const GRASS_FPS = 24
export const GRASS_ROWS = 20

/** Approximate width of one monospace cell at the strip's font size. */
const COLUMN_WIDTH = 6.6

const UPRIGHT = [[','], ["'", 'l'], ['`', '|', 'l'], ['`', '/', '|', 'l']] as const
const BENT_RIGHT = [['-'], ['.', '/'], ['.', '.', '/'], ['.', '.', '_', '/']] as const
const BENT_LEFT = [['-'], ['.', '\\'], ["'", '.', '\\'], ['`', "'", '.', '\\']] as const

type TreePose = ReadonlyArray<readonly [number, string]>

/** Three poses; the tree cross-fades between them with the wind. */
const TREE: Readonly<Record<'neutral' | 'right' | 'left', TreePose>> = {
  neutral: [
    [-15, '        ^        '],
    [-14, '       /|\\       '],
    [-13, '      / | \\      '],
    [-12, '     /  |  \\     '],
    [-11, '    /   |   \\    '],
    [-10, '   /   /|\\   \\   '],
    [-9, '  /   / | \\   \\  '],
    [-8, ' /___/  |  \\___\\ '],
    [-7, '    /   |   \\    '],
    [-6, '   /   /|\\   \\   '],
    [-5, '  /   / | \\   \\  '],
    [-4, ' /___/  |  \\___\\ '],
    [-3, '   /   /|\\   \\   '],
    [-2, '  /___/ | \\___\\  '],
    [-1, '       |||       '],
  ],
  right: [
    [-15, '         ^       '],
    [-14, '        /|\\      '],
    [-13, '       / | \\     '],
    [-12, '      /  |  \\    '],
    [-11, '     /   |   \\   '],
    [-10, '    /   /|\\   \\  '],
    [-9, '   /   / | \\   \\ '],
    [-8, '  /___/  |  \\___\\'],
    [-7, '     /  |   \\    '],
    [-6, '    /  /|\\   \\   '],
    [-5, '   /  / | \\   \\  '],
    [-4, '  /__/  |  \\___\\ '],
    [-3, '    /  /|\\   \\   '],
    [-2, '   /__/ | \\___\\  '],
    [-1, '        |||      '],
  ],
  left: [
    [-15, '       ^         '],
    [-14, '      /|\\        '],
    [-13, '     / | \\       '],
    [-12, '    /  |  \\      '],
    [-11, '   /   |   \\     '],
    [-10, '  /   /|\\   \\    '],
    [-9, ' /   / | \\   \\   '],
    [-8, '/___/  |  \\___\\  '],
    [-7, '    /   |  \\     '],
    [-6, '   /   /|\\  \\    '],
    [-5, '  /   / | \\  \\   '],
    [-4, ' /___/  |  \\__\\  '],
    [-3, '   /   /|\\  \\    '],
    [-2, '  /___/ | \\__\\   '],
    [-1, '      |||        '],
  ],
}

const TREE_SPRITE_WIDTH = 17
/** The tree sits over the crest of the hill, at 78% of the strip's width. */
const TREE_POSITION = 0.78

/** Height of the ground at a column: a soft bump under the tree. */
const hillHeight = (column: number, total: number): number =>
  Math.round(
    Math.exp(
      -Math.pow((column / Math.max(total - 1, 1) - TREE_POSITION) / 0.18, 2),
    ) * 4,
  )

interface Blade {
  height: number
  phase: number
  speed: number
  amplitude: number
}

export class GrassField {
  private columns = 0
  private blades: Array<Blade | null> = []

  /** Rebuilds the field for a new pixel width. Returns true if it changed. */
  resize(pixelWidth: number): boolean {
    const columns = Math.max(Math.floor(pixelWidth / COLUMN_WIDTH), 10)
    if (columns === this.columns) return false

    this.columns = columns
    this.blades = Array.from({ length: columns }, (_, column) => {
      const hill = hillHeight(column, columns)
      // Bare patches thin out away from the hill, where the soil is poorer.
      if (Math.random() > 0.72 + hill * 0.1) return null
      return {
        height: 1 + Math.floor(Math.random() * (hill > 1 ? 4 : 3)),
        phase: Math.random() * Math.PI * 2,
        speed: 0.032 + Math.random() * 0.038,
        amplitude: 0.65 + Math.random() * 0.8,
      }
    })

    return true
  }

  toHtml(tick: number): string {
    const { columns, blades } = this
    if (columns === 0) return ''

    const grid = Array.from({ length: GRASS_ROWS }, () =>
      new Array<string>(columns).fill(' '),
    )
    const ground = Array.from(
      { length: columns },
      (_, column) => GRASS_ROWS - 1 - hillHeight(column, columns),
    )

    // Soil line plus a sparse speckle of debris just below it.
    for (let column = 0; column < columns; column++) {
      const groundRow = ground[column] as number
      if (groundRow < GRASS_ROWS) {
        ;(grid[groundRow] as string[])[column] = column % 3 === 0 ? '.' : '_'
      }
      if (groundRow + 1 < GRASS_ROWS) {
        ;(grid[groundRow + 1] as string[])[column] = column % 5 === 0 ? ',' : '.'
      }
    }

    for (let column = 0; column < columns; column++) {
      const blade = blades[column]
      if (!blade) continue

      const swing =
        Math.sin(blade.phase + tick * blade.speed) * blade.amplitude
      const sprite =
        swing > 0.5
          ? BENT_RIGHT[blade.height - 1]
          : swing < -0.5
            ? BENT_LEFT[blade.height - 1]
            : UPRIGHT[blade.height - 1]
      if (!sprite) continue

      const base = (ground[column] as number) - 1
      for (let i = 0; i < sprite.length; i++) {
        const row = base - (sprite.length - 1 - i)
        if (row < 0 || row >= GRASS_ROWS) continue
        ;(grid[row] as string[])[column] = sprite[i] as string
      }
    }

    this.stampTree(grid, columns, tick)

    return rowsToHtml(
      grid.map((row) => row.join('')),
      (row) => {
        // Fade the strip from dark at the horizon to lighter at the soil.
        const value = Math.round(32 + (row / (GRASS_ROWS - 1)) * 50)
        const hex = value.toString(16).padStart(2, '0')
        return `#${hex}${hex}${hex}`
      },
    )
  }

  private stampTree(grid: string[][], columns: number, tick: number): void {
    const treeColumn = Math.round(columns * TREE_POSITION)
    const swing = Math.sin(tick * 0.018) * 1.1 + Math.sin(tick * 0.011) * 0.5
    const sprite =
      swing > 0.7 ? TREE.right : swing < -0.7 ? TREE.left : TREE.neutral
    const trunkRow = GRASS_ROWS - 1 - hillHeight(treeColumn, columns)
    const offset = treeColumn - (TREE_SPRITE_WIDTH >> 1)

    for (const [rowOffset, glyphs] of sprite) {
      const row = trunkRow + rowOffset
      if (row < 0 || row >= GRASS_ROWS) continue
      for (let i = 0; i < glyphs.length; i++) {
        const column = offset + i
        const char = glyphs[i] as string
        if (column < 0 || column >= columns || char === ' ') continue
        ;(grid[row] as string[])[column] = char
      }
    }
  }
}
