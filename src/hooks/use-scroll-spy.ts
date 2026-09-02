'use client'

import { useEffect, useState } from 'react'
import { SECTION_IDS, type SectionId } from '@/content/navigation'

interface ScrollState {
  readonly active: SectionId
  /** True once the page has moved enough to shrink the header. */
  readonly scrolled: boolean
}

const INITIAL: ScrollState = { active: SECTION_IDS[0], scrolled: false }

/** Below this many pixels from the top, a section counts as the current one. */
const ACTIVE_THRESHOLD = 160
const SHRINK_AFTER = 40

/**
 * Tracks which section the reader is in and whether the page has scrolled.
 *
 * Deliberately a scroll listener rather than an IntersectionObserver: the
 * rule here is "the last section whose top has passed the threshold", which
 * an observer expresses awkwardly once sections are taller than the viewport.
 * Reads are batched into one rAF so a fast scroll never forces layout twice
 * in a frame.
 */
export function useScrollSpy(): ScrollState {
  const [state, setState] = useState<ScrollState>(INITIAL)

  useEffect(() => {
    let queued = false

    const measure = () => {
      queued = false
      let active: SectionId = SECTION_IDS[0]

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= ACTIVE_THRESHOLD) {
          active = id
        }
      }

      const scrolled = window.scrollY > SHRINK_AFTER
      setState((previous) =>
        previous.active === active && previous.scrolled === scrolled
          ? previous
          : { active, scrolled },
      )
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return state
}
