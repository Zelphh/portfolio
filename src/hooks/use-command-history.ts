'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'zelph-console-history'
/** Enough to scroll back through a session without growing the key forever. */
const LIMIT = 50

export interface CommandHistory {
  /** Submitted commands, oldest first. */
  readonly entries: readonly string[]
  readonly push: (command: string) => void
  /**
   * Walks the history. `-1` reaches for an older entry, `+1` for a newer one.
   * Returns the value the input should show, or `null` when the edge is
   * already reached and the caller should leave the input alone.
   */
  readonly recall: (direction: -1 | 1, current: string) => string | null
  /** Drops the cursor back to the live input, e.g. after submitting. */
  readonly reset: () => void
}

/**
 * Shell-style history for the console input.
 *
 * The cursor lives in refs rather than state: it changes on every arrow key
 * but nothing renders from it — the input is already controlled by the dock —
 * so keeping it out of state avoids a re-render per keystroke.
 *
 * It survives reloads through `localStorage`, which is read in an effect
 * rather than during render so the server and the first client pass agree.
 */
export function useCommandHistory(): CommandHistory {
  const [entries, setEntries] = useState<readonly string[]>([])
  /** Steps back from the live input; 0 means the visitor's own draft. */
  const offsetRef = useRef(0)
  const draftRef = useRef('')
  const entriesRef = useRef<readonly string[]>([])
  entriesRef.current = entries

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? '[]',
      )
      if (Array.isArray(stored)) {
        setEntries(stored.filter((item): item is string => typeof item === 'string'))
      }
    } catch {
      // A blocked or corrupt store just means the session starts empty.
    }
  }, [])

  const reset = useCallback(() => {
    offsetRef.current = 0
    draftRef.current = ''
  }, [])

  const push = useCallback(
    (command: string) => {
      const trimmed = command.trim()
      reset()
      if (!trimmed) return

      setEntries((current) => {
        // Holding a key down should not fill the history with one command.
        if (current.at(-1) === trimmed) return current

        const next = [...current, trimmed].slice(-LIMIT)
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // Not being able to remember is not worth failing the command over.
        }
        return next
      })
    },
    [reset],
  )

  const recall = useCallback((direction: -1 | 1, current: string) => {
    const list = entriesRef.current
    if (list.length === 0) return null

    const offset = offsetRef.current
    const next = offset - direction
    if (next < 0 || next > list.length) return null

    // Stepping off the live input parks the draft so it can be handed back.
    if (offset === 0) draftRef.current = current

    offsetRef.current = next
    return next === 0 ? draftRef.current : (list[list.length - next] ?? '')
  }, [])

  return { entries, push, recall, reset }
}
