'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { SnakeEngine, type Direction } from '@/lib/snake'
import { rem, rootScale } from '@/lib/utils'

const FONT_SIZE = 12
const LINE_HEIGHT = 14
/** Monospace advance width is a stable fraction of the font size. */
const CHAR_WIDTH = FONT_SIZE * 0.602
/** Two characters per cell, so a cell comes out roughly square. */
const CELL_WIDTH = CHAR_WIDTH * 2

/** Milliseconds per move at the start, shaved per point down to the floor. */
const BASE_TICK_MS = 120
const MIN_TICK_MS = 60
const SPEEDUP_MS = 3

/** Shortest drag that counts as a swipe rather than a tap. */
const SWIPE_PX = 24

const BEST_KEY = 'snake-best'

const KEYS: Readonly<Record<string, Direction>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function saveBest(best: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(best))
  } catch {
    // A private window keeps the record for this game only.
  }
}

type Phase = 'ready' | 'playing' | 'over'

interface SnakeGameProps {
  copy: Dictionary['terminal']['snake']
  /** Called with the final score when the visitor leaves the game. */
  onStop: (score: number) => void
}

/**
 * The `snake` command: a playable board inside the console panel.
 *
 * Frames go straight to `innerHTML`, as with the matrix rain. Unlike the
 * decorative ASCII it does not ride `useAnimationLoop`: that loop stands
 * down under reduced motion, and a game the visitor asked for has to move.
 *
 * The board takes focus while it is open, so the arrow keys steer the snake
 * instead of walking the console history. Escape hands focus back.
 */
export function SnakeGame({ copy, onStop }: SnakeGameProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLPreElement>(null)

  const engineRef = useRef<SnakeEngine | null>(null)
  const phaseRef = useRef<Phase>('ready')
  const focusedRef = useRef(true)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  const [phase, setPhase] = useState<Phase>('ready')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [focused, setFocused] = useState(true)

  const enter = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const paint = useCallback(() => {
    const art = artRef.current
    const engine = engineRef.current
    if (!art || !engine) return

    const { cols, rows, body } = engine
    const occupied = new Map<number, string>()
    body.forEach(([col, row], index) => {
      occupied.set(row * cols + col, index === 0 ? 'text-accent' : 'text-moss-light')
    })

    let html = ''
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tone = occupied.get(row * cols + col)
        if (tone) html += `<span class="${tone}">██</span>`
        else if (engine.isFood([col, row])) html += '<span class="text-warn">[]</span>'
        else html += '· '
      }
      html += '\n'
    }

    art.innerHTML = html
  }, [])

  const restart = useCallback(() => {
    engineRef.current?.reset()
    setScore(0)
    enter('ready')
    paint()
  }, [enter, paint])

  // Size the board to the panel once. A resize mid-game starts a new one,
  // since the old snake may no longer fit.
  useEffect(() => {
    const measure = () => {
      const board = boardRef.current
      if (!board) return

      const scale = rootScale()
      const cols = Math.max(8, Math.floor(board.clientWidth / (CELL_WIDTH * scale)))
      const rows = Math.max(6, Math.floor(board.clientHeight / (LINE_HEIGHT * scale)))
      engineRef.current = new SnakeEngine(cols, rows)
      restart()
    }

    setBest(readBest())
    measure()
    rootRef.current?.focus({ preventScroll: true })

    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [restart])

  useEffect(() => {
    let frame = 0
    let previous = 0
    let elapsed = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = previous ? now - previous : 0
      previous = now

      const engine = engineRef.current
      if (!engine || phaseRef.current !== 'playing' || !focusedRef.current) return

      elapsed += dt
      const interval = Math.max(MIN_TICK_MS, BASE_TICK_MS - engine.score * SPEEDUP_MS)
      if (elapsed < interval) return
      elapsed = 0

      const before = engine.score
      engine.step()
      paint()

      if (engine.score !== before) setScore(engine.score)
      if (engine.over) {
        enter('over')
        setBest((current) => {
          if (engine.score <= current) return current
          saveBest(engine.score)
          return engine.score
        })
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paint, enter])

  const steer = useCallback(
    (direction: Direction) => {
      if (phaseRef.current === 'over') return
      engineRef.current?.turn(direction)
      if (phaseRef.current === 'ready') enter('playing')
    },
    [enter],
  )

  const leave = useCallback(() => {
    onStop(engineRef.current?.score ?? 0)
  }, [onStop])

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = KEYS[event.key.length === 1 ? event.key.toLowerCase() : event.key]

    if (direction) {
      event.preventDefault()
      steer(direction)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      leave()
    } else if (
      phaseRef.current === 'over' &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      restart()
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeRef.current = { x: event.clientX, y: event.clientY }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) {
      if (phaseRef.current === 'over') restart()
      return
    }

    if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 'right' : 'left')
    else steer(dy > 0 ? 'down' : 'up')
  }

  const setFocus = (value: boolean) => {
    focusedRef.current = value
    setFocused(value)
  }

  const status =
    phase === 'over'
      ? format(copy.over, { score })
      : !focused
        ? copy.paused
        : phase === 'ready'
          ? copy.ready
          : copy.controls

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="application"
      aria-label={copy.label}
      onKeyDown={handleKey}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      className="absolute inset-0 z-10 flex flex-col bg-panel px-4 pb-3 pt-3 outline-none"
    >
      <div className="flex flex-none items-center justify-between pb-2 text-[0.6875rem] uppercase tracking-[0.2em] text-fg-fainter">
        <span>
          {format(copy.score, { score })}
          <span className="px-2 text-line-bright">/</span>
          {format(copy.best, { best: Math.max(best, score) })}
        </span>
        <button
          type="button"
          onClick={leave}
          className="text-fg-fainter transition-colors hover:text-accent"
        >
          {copy.exit}
        </button>
      </div>

      <div
        ref={boardRef}
        onPointerDown={(event) => {
          rootRef.current?.focus({ preventScroll: true })
          handlePointerDown(event)
        }}
        onPointerUp={handlePointerUp}
        className="relative min-h-0 flex-1 touch-none overflow-hidden"
      >
        <pre
          ref={artRef}
          aria-hidden
          className="m-0 select-none whitespace-pre font-mono text-line-bright [text-rendering:optimizeSpeed]"
          style={{ fontSize: rem(FONT_SIZE), lineHeight: rem(LINE_HEIGHT) }}
        />
      </div>

      <span
        aria-live="polite"
        className="flex-none pt-2 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-fg-fainter"
      >
        {status}
      </span>
    </div>
  )
}
