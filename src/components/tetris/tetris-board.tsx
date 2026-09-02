'use client'

import { useEffect, useRef } from 'react'
import { EMPTY, TetrisEngine } from '@/lib/tetris'

export interface TetrisBoardProps {
  /** Colour of an empty cell. Gaps stay transparent. */
  boardColor?: string
  /** Block colours; a piece picks one at spawn. */
  colors?: readonly string[]
  /** 0-10. How far a piece drifts before settling into its target column. */
  movement?: number
  /** Requested cell size in pixels; the real size is fitted to the board. */
  cellSize?: number
  gap?: number
  /** 0-20, where 20 rounds a cell into a full circle. */
  rounded?: number
  /** Rows dropped per second, divided by four. */
  dropSpeed?: number
}

const FLASH_COLOR = 'rgba(255, 255, 255, 0.95)'
const MIN_COLS = 4
const MIN_ROWS = 6

/**
 * Canvas renderer for the self-playing tetris in the footer.
 *
 * The whole thing lives in one effect: React renders a canvas and never
 * re-renders it. Simulation state stays in the engine, drawing stays on the
 * 2D context, and the only React work is mounting.
 */
export function TetrisBoard({
  boardColor = 'rgba(255, 255, 255, 0.035)',
  colors = ['#484E3D', '#77885d', '#E7E74A'],
  movement = 5,
  cellSize = 30,
  gap = 3,
  rounded = 0,
  dropSpeed = 2,
}: TetrisBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Arrays get a new identity every render; key the effect on contents.
  const colorKey = colors.join(',')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const palette = colorKey.split(',')
    const pitch = cellSize + gap
    const dropEvery = 1000 / Math.max(1, dropSpeed * 4)

    let engine: TetrisEngine | null = null
    let frame = 0
    let lastTime = 0
    let alive = true

    // Cell metrics, recomputed on resize.
    let cellW = 0
    let cellH = 0
    let pitchX = 0
    let pitchY = 0
    let radius = 0

    function build() {
      if (!canvas || !ctx) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const width = Math.max(1, Math.round(canvas.clientWidth))
      const height = Math.max(1, Math.round(canvas.clientHeight))

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Take the whole-cell count first, then size cells to fill the board
      // exactly. The remainder is spread across every cell instead of left
      // over as a strip or a half-drawn column at the edge.
      const cols = Math.max(MIN_COLS, Math.floor((width + gap) / pitch))
      const rows = Math.max(MIN_ROWS, Math.floor((height + gap) / pitch))
      cellW = Math.max(1, (width - gap * (cols - 1)) / cols)
      cellH = Math.max(1, (height - gap * (rows - 1)) / rows)
      pitchX = cellW + gap
      pitchY = cellH + gap
      // `rounded` is a 0-20 ratio, not pixels: 20 is always a full circle.
      radius = (Math.min(cellW, cellH) / 2) * (Math.min(20, Math.max(0, rounded)) / 20)

      engine = new TetrisEngine({
        cols,
        rows,
        colorCount: palette.length,
        movement,
      })
    }

    function tilePath(col: number, row: number) {
      if (!ctx) return
      const x = col * pitchX
      const y = row * pitchY
      if (radius > 0) ctx.roundRect(x, y, cellW, cellH, radius)
      else ctx.rect(x, y, cellW, cellH)
    }

    function draw() {
      if (!canvas || !ctx || !engine) return
      const { cols, rows, grid, piece } = engine
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // Resting board — one path for every empty cell, filled in a single go.
      ctx.beginPath()
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) tilePath(col, row)
      }
      ctx.fillStyle = boardColor
      ctx.fill()

      const flashing = new Set(engine.clearingRows)
      const lit = engine.blinkLit

      for (let row = 0; row < rows; row++) {
        const strobe = flashing.has(row) && lit
        for (let col = 0; col < cols; col++) {
          const color = grid[row * cols + col] as number
          if (color === EMPTY) continue
          ctx.beginPath()
          tilePath(col, row)
          ctx.fillStyle = strobe ? FLASH_COLOR : (palette[color] ?? palette[0] ?? '#fff')
          ctx.fill()
        }
      }

      if (piece) {
        ctx.fillStyle = palette[piece.color] ?? palette[0] ?? '#fff'
        for (const [c, r] of piece.cells) {
          const row = piece.row + r
          if (row < 0) continue
          ctx.beginPath()
          tilePath(piece.col + c, row)
          ctx.fill()
        }
      }
    }

    function loop(time: number) {
      if (!alive) return
      const dt = lastTime ? Math.min(time - lastTime, 200) : 0
      lastTime = time
      engine?.step(dt, dropEvery)
      draw()
      frame = requestAnimationFrame(loop)
    }

    build()

    // A new size means a new grid, so the board restarts. This also covers
    // the first layout, which can land after the effect with the canvas
    // still measuring nothing.
    let builtAt = `${canvas.clientWidth}x${canvas.clientHeight}`
    const observer = new ResizeObserver(() => {
      const size = `${canvas.clientWidth}x${canvas.clientHeight}`
      if (size === builtAt) return
      builtAt = size
      build()
    })
    observer.observe(canvas)

    frame = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [boardColor, colorKey, movement, cellSize, gap, rounded, dropSpeed])

  return (
    <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />
  )
}
