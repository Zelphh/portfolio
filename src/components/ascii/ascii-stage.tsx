'use client'

import { useCallback, useEffect, useRef, type PointerEvent } from 'react'
import { useAnimationLoop } from '@/hooks/use-animation-loop'
import { useFitToBox } from '@/hooks/use-fit-to-box'
import { cn } from '@/lib/utils'

interface AsciiStageProps {
  /** Screen-reader description; the art itself is `role="img"`. */
  label: string
  fps: number
  /** Produces the markup for one frame. Must be cheap and allocation-light. */
  frame: () => string
  /** Lets art bleed past its container on purpose. */
  overscale?: number
  fontSize?: number
  /**
   * Pointer position in the art's own box, both axes `0..1`, or `null` once
   * it leaves. Normalised rather than in pixels because the `<pre>` is
   * scaled to fit: its pixel size is a layout accident, while the character
   * grid behind it is fixed, and only the art knows how wide that grid is.
   */
  onPointer?: (point: { x: number; y: number } | null) => void
  /** A press, in the same space as `onPointer`. */
  onPress?: (point: { x: number; y: number }) => void
  className?: string
}

/**
 * Shell for fixed-grid ASCII art: a box, a centred `<pre>` scaled to fit it,
 * and a throttled frame loop that pauses off screen.
 *
 * Frames are written straight to `innerHTML` on a ref. Routing thousands of
 * characters through React's reconciler ten to thirty times a second would
 * dominate the main thread for art that is, by design, decorative — so the
 * element is rendered childless and React never touches its contents again.
 */
export function AsciiStage({
  label,
  fps,
  frame,
  overscale = 1,
  fontSize = 13,
  onPointer,
  onPress,
  className,
}: AsciiStageProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLPreElement>(null)
  const frameRef = useRef(frame)
  frameRef.current = frame

  const fit = useFitToBox(artRef, boxRef, overscale)

  // Reads refs only, so it never needs to be recreated.
  const paint = useCallback(() => {
    const art = artRef.current
    if (art) art.innerHTML = frameRef.current()
  }, [])

  // First paint happens outside the loop so reduced-motion users still get a
  // rendered frame rather than an empty box.
  useEffect(() => {
    paint()
    fit()
  }, [paint, fit])

  useAnimationLoop(paint, { fps, target: boxRef })

  // Measured against the art rather than the box, so the coordinates mean
  // the same thing whatever the fit scaled the `<pre>` to. Points outside it
  // are reported as they are: art that cares about reach treats a cursor
  // beside it as simply far away, which is what it is.
  const pointIn = (event: PointerEvent<HTMLDivElement>) => {
    const art = artRef.current
    if (!art) return null

    const rect = art.getBoundingClientRect()
    if (!rect.width || !rect.height) return null

    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }
  }

  return (
    <div
      ref={boxRef}
      onPointerMove={
        onPointer && ((event) => onPointer(pointIn(event)))
      }
      onPointerLeave={onPointer && (() => onPointer(null))}
      onPointerDown={
        onPress &&
        ((event) => {
          const point = pointIn(event)
          if (point) onPress(point)
        })
      }
      className={cn('relative h-full w-full overflow-hidden', className)}
    >
      <pre
        ref={artRef}
        role="img"
        aria-label={label}
        suppressHydrationWarning
        className="absolute left-1/2 top-1/2 m-0 origin-center select-none whitespace-pre font-mono leading-none [text-rendering:optimizeSpeed]"
        style={{ fontSize }}
      />
    </div>
  )
}
