'use client'

import { useEffect, useRef } from 'react'

/** Runs `onEscape` while `active`, and only then — no listener when idle. */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
  const callbackRef = useRef(onEscape)
  callbackRef.current = onEscape

  useEffect(() => {
    if (!active) return

    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callbackRef.current()
    }

    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [active])
}
