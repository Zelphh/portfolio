'use client'

import { useCallback, useMemo, useState } from 'react'
import { mod, ringOffset } from '@/lib/utils'

export interface RingCarousel {
  /** Unbounded counter. Keeps motion directional across the wrap point. */
  readonly position: number
  /** `position` folded back into `0 … length - 1`. */
  readonly index: number
  readonly next: () => void
  readonly previous: () => void
  /** Moves to `target` the short way round rather than rewinding. */
  readonly goTo: (target: number) => void
}

/**
 * Index state for the skill wheel, the project carousel and the certificate
 * stack. The position is intentionally unbounded: animating from item 9 to
 * item 0 should slide forward one step, not scrub backwards through eight.
 */
export function useRingCarousel(length: number): RingCarousel {
  const [position, setPosition] = useState(0)

  const goTo = useCallback(
    (target: number) => {
      setPosition((current) => current + ringOffset(target, current, length))
    },
    [length],
  )

  return useMemo(
    () => ({
      position,
      index: mod(position, length),
      next: () => setPosition((current) => current + 1),
      previous: () => setPosition((current) => current - 1),
      goTo,
    }),
    [position, length, goTo],
  )
}
