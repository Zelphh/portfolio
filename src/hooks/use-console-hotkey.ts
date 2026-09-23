'use client'

import { useEffect, useRef } from 'react'

interface ConsoleHotkeys {
  /** Ctrl/Cmd + backtick — opens the console, or closes it if already open. */
  readonly toggle: () => void
  /** `/` on its own — only ever opens, the way a search shortcut behaves. */
  readonly open: () => void
}

/** True while the visitor is typing somewhere a bare `/` belongs. */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  )
}

/**
 * Keyboard access to the console.
 *
 * Without this the dock button is the only way in, which asks a visitor to
 * reach for the mouse to open a terminal — the one widget on the page whose
 * whole premise is the keyboard.
 */
export function useConsoleHotkey({ toggle, open }: ConsoleHotkeys): void {
  const handlersRef = useRef({ toggle, open })
  handlersRef.current = { toggle, open }

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === '`' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        handlersRef.current.toggle()
        return
      }

      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (isTyping(event.target)) return
        event.preventDefault()
        handlersRef.current.open()
      }
    }

    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])
}
