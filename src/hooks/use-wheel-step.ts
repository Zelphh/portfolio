'use client'

import { useEffect, useRef, type RefObject } from 'react'

/** Ignore wheel events closer together than this, in milliseconds. */
const COOLDOWN_MS = 110
/** Ignore trackpad jitter below this delta. */
const MIN_DELTA = 4

/**
 * Turns wheel gestures over an element into discrete ±1 steps.
 *
 * The listener is registered non-passively on purpose — it calls
 * `preventDefault` so the page does not scroll while the pointer is over the
 * wheel. React's `onWheel` cannot do this, since React attaches wheel
 * listeners passively.
 */
export function useWheelStep(
  target: RefObject<Element | null>,
  onStep: (direction: 1 | -1) => void,
): void {
  const callbackRef = useRef(onStep)
  callbackRef.current = onStep

  useEffect(() => {
    const element = target.current
    if (!element) return

    let lastAt = 0

    const handle = (event: Event) => {
      const wheel = event as WheelEvent
      wheel.preventDefault()

      const now = performance.now()
      if (now - lastAt < COOLDOWN_MS) return
      if (Math.abs(wheel.deltaY) < MIN_DELTA) return

      lastAt = now
      callbackRef.current(wheel.deltaY > 0 ? 1 : -1)
    }

    element.addEventListener('wheel', handle, { passive: false })
    return () => element.removeEventListener('wheel', handle)
  }, [target])
}
