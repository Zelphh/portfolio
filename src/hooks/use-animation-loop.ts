'use client'

import { useEffect, useRef, type RefObject } from 'react'

interface AnimationLoopOptions {
  /** Frames per second. The loop still rides rAF; extra frames are skipped. */
  fps: number
  /**
   * Element to watch. While it is off screen the callback is not invoked, so
   * a page with five animations only pays for the ones you can actually see.
   */
  target: RefObject<Element | null>
  enabled?: boolean
}

/**
 * The single animation driver for every ASCII component.
 *
 * It owns three things those components would otherwise each reimplement:
 * an fps-throttled `requestAnimationFrame` loop, an IntersectionObserver that
 * pauses work off screen, and a `prefers-reduced-motion` check that stops the
 * loop entirely rather than running it invisibly.
 *
 * Visibility and the callback live in refs, so neither re-renders the tree.
 */
export function useAnimationLoop(
  onFrame: () => void,
  { fps, target, enabled = true }: AnimationLoopOptions,
): void {
  const callbackRef = useRef(onFrame)
  callbackRef.current = onFrame

  useEffect(() => {
    if (!enabled) return

    const element = target.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    let visible = true
    let frame = 0
    let previous = 0
    const interval = 1000 / fps

    const observer = element
      ? new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true
          },
          { threshold: 0 },
        )
      : null
    if (observer && element) observer.observe(element)

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!visible || now - previous < interval) return
      previous = now
      callbackRef.current()
    }

    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [enabled, fps, target])
}
