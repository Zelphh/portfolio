'use client'

import { useCallback } from 'react'
import { SCROLL_OFFSET } from '@/content/navigation'

/** easeInOutCubic — slow at both ends, quick through the middle. */
const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Where the target lands: its top under the header, or its middle in the visible area. */
export type ScrollAlign = 'start' | 'center'

/**
 * Scrolls to an anchor with a hand-rolled easing curve.
 *
 * `scroll-behavior: smooth` would be cheaper, but its duration is not
 * controllable and it ignores the sticky header offset, so links landed a
 * header's height too far down.
 */
export function useSmoothScroll() {
  return useCallback((id: string, duration = 650, align: ScrollAlign = 'start') => {
    const element = document.getElementById(id)
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.scrollIntoView()
      return
    }

    const start = window.scrollY
    // Centering measures the section's content, not its padding, so what the
    // reader sees is what ends up in the middle. It only applies while that
    // content fits below the header; anything taller lines its top up instead.
    const measured =
      align === 'center' ? (element.firstElementChild ?? element) : element
    const rect = measured.getBoundingClientRect()
    const room = window.innerHeight - SCROLL_OFFSET
    const inset =
      align === 'center' && rect.height < room ? (room - rect.height) / 2 : 0
    const target = rect.top + start - SCROLL_OFFSET - inset
    const distance = target - start
    const startedAt = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      window.scrollTo(0, start + distance * ease(progress))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [])
}
