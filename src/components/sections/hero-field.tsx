'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { useAnimationLoop } from '@/hooks/use-animation-loop'
import { rootScale } from '@/lib/utils'

const FPS = 16
/** Density ramp, faintest first. The leading space leaves a cell empty. */
const RAMP = ' .:-=+*#'
/** Theme tokens for the four brightness bands, dimmest first. */
const BAND_TOKENS = [
  '--color-line',
  '--color-moss-dim',
  '--color-heat-3',
  '--color-accent',
] as const
/** Design-pixel font size and line height of one cell. */
const FONT_SIZE = 12
const LINE_HEIGHT = 14
/** How long the console's `bonfire` command keeps the field stirred up. */
const FLARE_MS = 4000

/**
 * The drifting ASCII field inside the hero's photo frame.
 *
 * Three crossing sine waves make a slow-moving noise, weighted to grow
 * denser towards the bottom of the frame. It is drawn straight to a canvas:
 * the frame holds a few thousand cells, too many to reconcile as nodes
 * sixteen times a second.
 */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorsRef = useRef<string[]>([])
  const flareUntilRef = useRef(0)

  // The console's `bonfire` command used to fan the hero's fire; with the
  // fire gone it stirs the field instead.
  useConsoleSignal('bonfire', () => {
    flareUntilRef.current = performance.now() + FLARE_MS
  })

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const box = canvas.getBoundingClientRect()
    if (!box.width || !box.height) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const width = Math.round(box.width * dpr)
    const height = Math.round(box.height * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    if (!colorsRef.current.length) {
      const styles = getComputedStyle(document.documentElement)
      colorsRef.current = BAND_TOKENS.map((token) =>
        styles.getPropertyValue(token).trim(),
      )
    }

    const scale = rootScale()
    const fontSize = FONT_SIZE * scale
    const cellHeight = LINE_HEIGHT * scale

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, box.width, box.height)
    ctx.font = `${fontSize}px ${getComputedStyle(canvas).fontFamily}`
    ctx.textBaseline = 'top'

    const cellWidth = ctx.measureText('M').width || fontSize * 0.6
    const columns = Math.ceil(box.width / cellWidth)
    const rows = Math.ceil(box.height / cellHeight)
    const now = performance.now()
    const t = now / 1000
    const flare = Math.max(0, flareUntilRef.current - now) / FLARE_MS

    // One list per band, so each colour is set once per frame.
    const bands: [number, number, string][][] = [[], [], [], []]

    for (let y = 0; y < rows; y++) {
      const depth = y / rows
      for (let x = 0; x < columns; x++) {
        const noise =
          (Math.sin(x * 0.21 + t * 0.7) +
            Math.sin(y * 0.33 - t * 0.9 + x * 0.07) +
            Math.sin((x + y) * 0.13 + t * 0.5)) /
          3
        let value = depth * 0.75 + noise * 0.32 - 0.12 + flare * 0.35
        if (value <= 0.06) continue
        value = Math.min(1, value)

        const glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(value * 8))]
        if (!glyph || glyph === ' ') continue

        const band = value < 0.3 ? 0 : value < 0.55 ? 1 : value < 0.85 ? 2 : 3
        bands[band]?.push([x * cellWidth, y * cellHeight, glyph])
      }
    }

    bands.forEach((cells, band) => {
      ctx.fillStyle = colorsRef.current[band] ?? '#fff'
      for (const [x, y, glyph] of cells) ctx.fillText(glyph, x, y)
    })
  }, [])

  // A first frame outside the loop, so reduced-motion visitors (whose loop
  // never starts) still see a still field, redrawn whenever the box resizes.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    paint()
    const observer = new ResizeObserver(() => paint())
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [paint])

  useAnimationLoop(paint, { fps: FPS, target: canvasRef })

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 block h-full w-full font-mono"
    />
  )
}
