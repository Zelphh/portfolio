'use client'

import {
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useAnimationLoop } from '@/hooks/use-animation-loop'
import type { BoxPoint, CellField, Rgb } from '@/lib/ascii/field'
import { cn } from '@/lib/utils'

/** Line height of a cell, relative to the font size. */
const CELL_HEIGHT = 1.1
/** Longest step the clock takes, so a stalled tab does not skip the intro. */
const MAX_STEP = 1 / 15
/** Brightest luminance a field may ask for; above 1 the colour washes out. */
const MAX_LUM = 1.3

interface AsciiCanvasProps {
  /** Screen-reader description; the box is `role="img"`. */
  label: string
  /** Builds the field for a grid; called again whenever the grid changes. */
  createField: (cols: number, rows: number, aspect: number) => CellField
  /** The field's colour tags, by index. */
  colors: readonly Rgb[]
  fps: number
  /** Font size in px. Ignored when `rows` is given. */
  fontPx?: number
  /** A fixed row count instead: the font is sized to fit the box's height. */
  rows?: number
  /** How much of the previous frame survives into the next one (0 clears). */
  trail: number
  /** The time painted once, without motion, for reduced-motion visitors. */
  stillAt: number
  /** Classes for each blurred copy layered on top as glow (blur, opacity). */
  glows?: readonly string[]
  className?: string
}

/**
 * Canvas shell for per-cell field art: a box, a canvas sized to it, the
 * field rendered into it every frame, plus a fading trail and glow layers.
 *
 * Used instead of `AsciiStage`'s `<pre>` when every letter carries its own
 * colour and brightness: thousands of coloured spans per frame would choke
 * the DOM, while a canvas draws them for the price of a `fillText` each.
 *
 * Fields that implement `pointer` / `press` get the cursor and clicks,
 * normalised to the box, so they can react to the mouse.
 *
 * The clock only runs while the box is on screen (`useAnimationLoop`), so an
 * intro plays the first time it is actually seen. With reduced motion a
 * single frame at `stillAt` is painted and nothing runs.
 */
export function AsciiCanvas({
  label,
  createField,
  colors,
  fps,
  fontPx = 10,
  rows: fixedRows,
  trail,
  stillAt,
  glows = [],
  className,
}: AsciiCanvasProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLCanvasElement>(null)
  const glowRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const createRef = useRef(createField)
  createRef.current = createField
  const stateRef = useRef<{
    field: CellField | null
    cellW: number
    cellH: number
    font: string
    t: number
    last: number
  }>({ field: null, cellW: 0, cellH: 0, font: '', t: 0, last: 0 })

  // Each colour × 256 luminance steps, built once instead of per cell.
  const palette = useMemo(
    () =>
      colors.map(([r, g, b]) =>
        Array.from({ length: 256 }, (_, i) => {
          const l = (i / 255) * MAX_LUM
          const c = (v: number) => Math.min(255, Math.round(v * l))
          return `rgb(${c(r)} ${c(g)} ${c(b)})`
        }),
      ),
    [colors],
  )
  const paletteRef = useRef(palette)
  paletteRef.current = palette

  const draw = useCallback(
    (t: number, keepTrail: boolean) => {
      const canvas = artRef.current
      const state = stateRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx || !state.field) return

      const { field, cellW, cellH } = state
      field.render(t)

      const dpr = canvas.width / canvas.clientWidth || 1
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      if (keepTrail && trail > 0) {
        // The previous frame fades rather than clears.
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = `rgb(0 0 0 / ${1 - trail})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-over'
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = state.font
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const shades = paletteRef.current
      const { cols, rows, chars, tags, lum } = field
      for (let j = 0; j < rows; j++) {
        const y = (j + 0.5) * cellH
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          const char = chars[k]!
          if (char === ' ') continue
          const step = Math.min(
            255,
            Math.max(0, Math.round((lum[k]! / MAX_LUM) * 255)),
          )
          const shade = shades[tags[k]!]?.[step]
          if (!shade) continue
          ctx.fillStyle = shade
          ctx.fillText(char, (i + 0.5) * cellW, y)
        }
      }

      for (const glow of glowRefs.current) {
        const g = glow?.getContext('2d')
        if (!glow || !g) continue
        g.clearRect(0, 0, glow.width, glow.height)
        g.drawImage(canvas, 0, 0, glow.width, glow.height)
      }
    },
    [trail],
  )

  // Size the grid to the box. A new grid re-samples; the clock carries on.
  useEffect(() => {
    const box = boxRef.current
    const canvas = artRef.current
    if (!box || !canvas) return

    const resize = () => {
      const { width, height } = box.getBoundingClientRect()
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      for (const glow of glowRefs.current) {
        if (!glow) continue
        // The glow is blurred anyway, so a quarter of the pixels will do.
        glow.width = Math.round(width / 2)
        glow.height = Math.round(height / 2)
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const px = fixedRows ? height / fixedRows / CELL_HEIGHT : fontPx
      // Canvas fonts cannot read CSS variables, so take the resolved stack.
      const state = stateRef.current
      state.font = `${px}px ${getComputedStyle(box).fontFamily}`
      ctx.font = state.font
      const cellW = ctx.measureText('M').width || px * 0.6
      const cols = Math.max(1, Math.floor(width / cellW))
      const rows = fixedRows ?? Math.max(1, Math.floor(height / (px * CELL_HEIGHT)))
      state.cellW = width / cols
      state.cellH = height / rows
      state.field = createRef.current(cols, rows, width / height)

      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      draw(reduced ? stillAt : state.t, false)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(box)
    return () => observer.disconnect()
  }, [draw, fixedRows, fontPx, stillAt])

  useAnimationLoop(
    () => {
      const state = stateRef.current
      const now = performance.now()
      const dt = state.last ? (now - state.last) / 1000 : 0
      state.last = now
      state.t += Math.min(dt, MAX_STEP)
      draw(state.t, true)
    },
    { fps, target: boxRef },
  )

  const pointIn = (event: PointerEvent<HTMLDivElement>): BoxPoint | null => {
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect?.width || !rect.height) return null
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }
  }

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={label}
      onPointerMove={(event) => stateRef.current.field?.pointer?.(pointIn(event))}
      onPointerLeave={() => stateRef.current.field?.pointer?.(null)}
      onPointerDown={(event) => {
        const point = pointIn(event)
        if (point) stateRef.current.field?.press?.(point)
      }}
      className={cn('relative h-full w-full', className)}
    >
      <canvas ref={artRef} className="absolute inset-0 h-full w-full" />
      {glows.map((look, i) => (
        <canvas
          key={look}
          ref={(el) => {
            glowRefs.current[i] = el
          }}
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 h-full w-full mix-blend-screen',
            look,
          )}
        />
      ))}
    </div>
  )
}
