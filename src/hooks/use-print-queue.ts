'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TerminalLine } from '@/lib/terminal'

/** Gap between streamed lines. Fast enough to read, slow enough to watch. */
const TICK_MS = 55

export interface PrintQueue {
  readonly lines: readonly TerminalLine[]
  /** True while a streamed block is still arriving. */
  readonly streaming: boolean
  readonly print: (lines: readonly TerminalLine[], stream?: boolean) => void
  readonly clear: () => void
}

/**
 * The console's output buffer.
 *
 * Most replies land whole, the way a shell answers `whoami`. Output that is
 * meant to be watched — the banner, `neofetch`, the easter eggs — is queued
 * and released a line at a time instead.
 *
 * A second print arriving mid-stream flushes whatever is pending first, so a
 * visitor who types ahead never sees their reply interleaved with the tail of
 * the last one. Reduced-motion users skip the animation entirely.
 */
export function usePrintQueue(): PrintQueue {
  const [lines, setLines] = useState<readonly TerminalLine[]>([])
  const [streaming, setStreaming] = useState(false)
  const queueRef = useRef<TerminalLine[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  useEffect(() => stop, [stop])

  const tick = useCallback(() => {
    const next = queueRef.current.shift()
    if (!next) {
      stop()
      setStreaming(false)
      return
    }

    setLines((current) => [...current, next])
    timerRef.current = setTimeout(tick, TICK_MS)
  }, [stop])

  const flush = useCallback(() => {
    stop()
    const pending = queueRef.current
    queueRef.current = []
    if (pending.length > 0) setLines((current) => [...current, ...pending])
    setStreaming(false)
  }, [stop])

  const print = useCallback(
    (next: readonly TerminalLine[], stream = false) => {
      flush()
      if (next.length === 0) return

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (!stream || reduceMotion) {
        setLines((current) => [...current, ...next])
        return
      }

      queueRef.current = [...next]
      setStreaming(true)
      tick()
    },
    [flush, tick],
  )

  const clear = useCallback(() => {
    stop()
    queueRef.current = []
    setStreaming(false)
    setLines([])
  }, [stop])

  return useMemo(
    () => ({ lines, streaming, print, clear }),
    [lines, streaming, print, clear],
  )
}
