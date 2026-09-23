'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useAnimationLoop } from '@/hooks/use-animation-loop'

const FPS = 18
const FONT_SIZE = 12
const LINE_HEIGHT = 14
/** Monospace advance width is a stable fraction of the font size. */
const CHAR_WIDTH = FONT_SIZE * 0.602
/** Rows a character stays lit behind the head before going dark. */
const TRAIL = 12

const GLYPHS = 'アカサタナハマヤラワ0123456789<>[]{}/\\|=+*-'

const randomGlyph = () =>
  GLYPHS[(Math.random() * GLYPHS.length) | 0] as string

interface MatrixRainProps {
  /** Called on the first key or pointer press, which ends the effect. */
  onStop: () => void
  hint: string
}

/**
 * The `matrix` easter egg: rain inside the console panel.
 *
 * Like the rest of the ASCII on the site, frames are written straight to
 * `innerHTML` rather than reconciled — a grid this size would otherwise cost
 * a thousand-odd React nodes eighteen times a second. Only the lit heads get
 * their own element; the trail inherits the panel's colour, so a frame costs
 * roughly one span per column.
 */
export function MatrixRain({ onStop, hint }: MatrixRainProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLPreElement>(null)

  const gridRef = useRef<string[]>([])
  const ageRef = useRef<Uint8Array>(new Uint8Array(0))
  const dropsRef = useRef<number[]>([])
  const sizeRef = useRef({ columns: 0, rows: 0 })

  const measure = useCallback(() => {
    const box = boxRef.current
    if (!box) return

    const columns = Math.max(1, Math.floor(box.clientWidth / CHAR_WIDTH))
    const rows = Math.max(1, Math.floor(box.clientHeight / LINE_HEIGHT))

    sizeRef.current = { columns, rows }
    gridRef.current = new Array<string>(columns * rows).fill(' ')
    ageRef.current = new Uint8Array(columns * rows).fill(255)
    dropsRef.current = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * rows * -1),
    )
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    const stop = () => onStop()
    window.addEventListener('keydown', stop)
    window.addEventListener('pointerdown', stop)
    return () => {
      window.removeEventListener('keydown', stop)
      window.removeEventListener('pointerdown', stop)
    }
  }, [onStop])

  const paint = useCallback(() => {
    const art = artRef.current
    const { columns, rows } = sizeRef.current
    if (!art || columns === 0) return

    const grid = gridRef.current
    const age = ageRef.current
    const drops = dropsRef.current

    // Age every lit cell one step; anything past the trail goes dark.
    for (let i = 0; i < age.length; i++) {
      if ((age[i] as number) < 255) age[i] = Math.min((age[i] as number) + 1, 255)
    }

    for (let column = 0; column < columns; column++) {
      const row = drops[column] as number

      if (row >= 0 && row < rows) {
        const index = row * columns + column
        grid[index] = randomGlyph()
        age[index] = 0
      }

      // Restart the column above the top, staggered, once it has fallen out.
      drops[column] =
        row > rows + TRAIL ? -Math.floor(Math.random() * rows) : row + 1
    }

    let html = ''
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = row * columns + column
        const lit = age[index] as number

        if (lit === 0) html += `<span class="text-fg">${grid[index]}</span>`
        else if (lit < TRAIL) html += grid[index]
        else html += ' '
      }
      html += '\n'
    }

    art.innerHTML = html
  }, [])

  // The loop does not run under reduced motion, so paint one frame directly
  // rather than leaving the panel blank.
  useEffect(() => {
    paint()
  }, [paint])

  useAnimationLoop(paint, { fps: FPS, target: boxRef })

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="absolute inset-0 z-10 overflow-hidden bg-panel"
    >
      <pre
        ref={artRef}
        className="m-0 select-none whitespace-pre font-mono text-accent [text-rendering:optimizeSpeed]"
        style={{ fontSize: FONT_SIZE, lineHeight: `${LINE_HEIGHT}px` }}
      />

      <span className="absolute inset-x-0 bottom-3 text-center text-[11px] uppercase tracking-[0.2em] text-fg-fainter">
        {hint}
      </span>
    </div>
  )
}
