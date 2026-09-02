'use client'

import { useCallback, useRef, useState } from 'react'

/** Horizontal travel, in pixels, that commits the swipe. */
const COMMIT_DISTANCE = 90
/** Vertical drag is damped so the card follows the finger without flying off. */
const VERTICAL_DAMPING = 0.35

export interface DragState {
  readonly dragging: boolean
  readonly x: number
  readonly y: number
}

const IDLE: DragState = { dragging: false, x: 0, y: 0 }

export interface DragSwipe {
  readonly drag: DragState
  /** Spread onto the draggable element. */
  readonly handlers: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => void
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => void
    onPointerCancel: (event: React.PointerEvent<HTMLElement>) => void
  }
}

/**
 * Pointer-driven card swiping for the certificate stack.
 *
 * Uses React's pointer events plus `setPointerCapture`, so a drag that leaves
 * the element still tracks and still ends — no window-level listeners to
 * register, leak, or clean up.
 */
export function useDragSwipe(
  onCommit: (direction: 1 | -1) => void,
): DragSwipe {
  const [drag, setDrag] = useState<DragState>(IDLE)
  const originRef = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    originRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag({ dragging: true, x: 0, y: 0 })
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const origin = originRef.current
    if (!origin) return
    setDrag({
      dragging: true,
      x: event.clientX - origin.x,
      y: (event.clientY - origin.y) * VERTICAL_DAMPING,
    })
  }, [])

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const origin = originRef.current
      if (!origin) return
      originRef.current = null

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      const travelled = event.clientX - origin.x
      setDrag(IDLE)
      if (Math.abs(travelled) > COMMIT_DISTANCE) {
        onCommit(travelled < 0 ? 1 : -1)
      }
    },
    [onCommit],
  )

  return {
    drag,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
