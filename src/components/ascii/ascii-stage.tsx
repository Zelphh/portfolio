'use client'

import { useCallback, useEffect, useRef } from 'react'
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

  return (
    <div
      ref={boxRef}
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
