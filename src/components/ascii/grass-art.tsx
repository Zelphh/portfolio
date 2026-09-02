'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAnimationLoop } from '@/hooks/use-animation-loop'
import { GrassField, GRASS_FPS } from '@/lib/ascii/grass'

interface GrassArtProps {
  label: string
}

/**
 * The full-width grass strip.
 *
 * Unlike the fixed-grid art this one reflows: the number of blades follows
 * the container width, so it is re-seeded on resize rather than scaled.
 */
export function GrassArt({ label }: GrassArtProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const field = useMemo(() => new GrassField(), [])
  const tickRef = useRef(0)

  const paint = useCallback(() => {
    const box = boxRef.current
    if (box) box.innerHTML = field.toHtml(tickRef.current)
  }, [field])

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    // Re-seeding is width-dependent, so only a real column change repaints.
    const reseed = () => {
      if (field.resize(box.clientWidth || window.innerWidth)) paint()
    }

    reseed()
    const observer = new ResizeObserver(reseed)
    observer.observe(box)
    return () => observer.disconnect()
  }, [field, paint])

  useAnimationLoop(
    () => {
      tickRef.current += 1
      paint()
    },
    { fps: GRASS_FPS, target: boxRef },
  )

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={label}
      suppressHydrationWarning
      className="w-full select-none overflow-hidden whitespace-pre font-mono text-[11px] leading-none"
    />
  )
}
