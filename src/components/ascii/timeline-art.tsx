'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { TimelineEntry } from '@/content/types'
import type { Locale } from '@/i18n/config'
import { useAnimationLoop } from '@/hooks/use-animation-loop'
import { buildTimelineHtml, TIMELINE_FPS } from '@/lib/ascii/timeline'

interface TimelineArtProps {
  entries: readonly TimelineEntry[]
  locale: Locale
  label: string
  /** Heading printed above the tree, e.g. "TRAJETÓRIA". */
  heading: string
}

const PROBE_LENGTH = 20
const FALLBACK_CHAR_WIDTH = 8
const MIN_COLUMNS = 20

/**
 * Career timeline. Only the trailing cursor animates, so this runs at a low
 * frame rate and rebuilds a few hundred characters per tick.
 */
export function TimelineArt({
  entries,
  locale,
  label,
  heading,
}: TimelineArtProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const columnsRef = useRef(MIN_COLUMNS)
  const tickRef = useRef(0)

  /** Measures one character to convert the pixel width into a column count. */
  const measure = useCallback(() => {
    const pre = preRef.current
    if (!pre) return

    const probe = document.createElement('span')
    probe.style.cssText =
      'position:absolute; visibility:hidden; white-space:pre; font:inherit'
    probe.textContent = '─'.repeat(PROBE_LENGTH)
    pre.appendChild(probe)
    const charWidth =
      probe.getBoundingClientRect().width / PROBE_LENGTH || FALLBACK_CHAR_WIDTH
    probe.remove()

    columnsRef.current = Math.max(
      Math.floor((pre.clientWidth || 300) / charWidth),
      MIN_COLUMNS,
    )
  }, [])

  const paint = useCallback(() => {
    const pre = preRef.current
    if (!pre) return
    pre.innerHTML = buildTimelineHtml({
      entries,
      locale,
      label: heading,
      width: columnsRef.current,
      tick: tickRef.current,
    })
  }, [entries, locale, heading])

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return

    const remeasure = () => {
      measure()
      paint()
    }

    remeasure()
    const observer = new ResizeObserver(remeasure)
    observer.observe(pre)
    return () => observer.disconnect()
  }, [measure, paint])

  useAnimationLoop(
    () => {
      tickRef.current += 1
      paint()
    },
    { fps: TIMELINE_FPS, target: preRef },
  )

  return (
    <pre
      ref={preRef}
      role="img"
      aria-label={label}
      suppressHydrationWarning
      className="m-0 select-none whitespace-pre font-mono text-[13px] leading-[1.6]"
    />
  )
}
