'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { Dictionary } from '@/i18n/types'
import type { LineTone, TerminalLine } from '@/lib/terminal'
import { cn } from '@/lib/utils'
import { MatrixRain } from './matrix-rain'
import { SnakeGame } from './snake-game'

const TONE_CLASS: Readonly<Record<LineTone, string>> = {
  input: 'text-fg',
  output: 'text-fg-dim',
  accent: 'text-accent',
  error: 'text-warn',
}

interface TerminalPanelProps {
  open: boolean
  copy: Dictionary['terminal']
  lines: readonly TerminalLine[]
  /** True while a block of output is still arriving a line at a time. */
  streaming: boolean
  matrix: boolean
  snake: boolean
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  /** `-1` reaches for an older command, `+1` for a newer one. */
  onRecall: (direction: -1 | 1) => void
  onComplete: () => void
  onStopMatrix: () => void
  /** Receives the final score of the game being left. */
  onStopSnake: (score: number) => void
  onClose: () => void
}

/**
 * The console panel.
 *
 * Collapses to zero height rather than unmounting, so reopening it keeps the
 * session history and skips a remount. While closed it is inert —
 * `pointer-events: none` plus `aria-hidden` — so it cannot be tabbed into.
 *
 * The input deliberately swallows Tab and the arrow keys: inside a terminal
 * those mean completion and history, not focus and caret movement. Escape
 * still closes, so the keyboard is never trapped here.
 */
export function TerminalPanel({
  open,
  copy,
  lines,
  streaming,
  matrix,
  snake,
  value,
  onChange,
  onSubmit,
  onRecall,
  onComplete,
  onStopMatrix,
  onStopSnake,
  onClose,
}: TerminalPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the newest line in view as output arrives.
  useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [lines])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 260)
    return () => clearTimeout(timer)
  }, [open])

  // The board holds focus while it is up; leaving hands it back to the prompt.
  const stopSnake = (score: number) => {
    onStopSnake(score)
    inputRef.current?.focus()
  }

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        onSubmit()
        break
      case 'Tab':
        event.preventDefault()
        onComplete()
        break
      case 'ArrowUp':
        event.preventDefault()
        onRecall(-1)
        break
      case 'ArrowDown':
        event.preventDefault()
        onRecall(1)
        break
      case 'Escape':
        onClose()
        break
    }
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'relative box-border flex w-[min(38.75rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-[0.9375rem] border border-line-strong bg-panel shadow-[0_1.5rem_3.75rem_rgba(0,0,0,0.6)]',
        'origin-bottom-left transition-[height,opacity,transform,filter] duration-[420ms] ease-[var(--ease-out-spring)]',
        open
          ? 'h-[min(21.25rem,calc(100vh-15rem))] translate-y-0 scale-100 opacity-100 blur-0'
          : 'pointer-events-none h-0 translate-y-6 scale-[0.96] opacity-0 blur-[0.375rem]',
      )}
    >
      <div className="flex flex-none items-center gap-2.5 border-b border-line-soft px-3.5 py-2.5">
        <span aria-hidden className="h-[0.5625rem] w-[0.5625rem] rounded-full bg-accent" />
        <span aria-hidden className="h-[0.5625rem] w-[0.5625rem] rounded-full bg-moss" />
        <span aria-hidden className="h-[0.5625rem] w-[0.5625rem] rounded-full bg-line" />
        <span className="flex-1 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-fg-fainter">
          {copy.title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          tabIndex={open ? 0 : -1}
          className="px-1 text-[0.8125rem] text-fg-fainter transition-colors hover:text-accent"
        >
          ✕
        </button>
      </div>

      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        className="box-border min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain px-4 py-3.5"
      >
        <div role="log" aria-live="polite">
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                'whitespace-pre-wrap text-[0.8125rem] leading-[1.7]',
                TONE_CLASS[line.tone],
              )}
            >
              {line.text}
            </div>
          ))}
        </div>

        {streaming && (
          <span
            aria-hidden
            className="mt-1 inline-block h-[0.875rem] w-[0.4375rem] animate-blink bg-accent align-middle"
          />
        )}

        {/*
          While output streams the prompt is hidden rather than unmounted: a
          remount would drop focus, and typing ahead is exactly how a visitor
          cuts a long block short.
        */}
        <div
          className={cn(
            'mt-1 flex items-center gap-2 transition-opacity',
            streaming && 'opacity-0',
          )}
        >
          <label
            htmlFor="terminal-input"
            className="flex-none text-[0.8125rem] text-accent"
          >
            {copy.prompt}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKey}
            placeholder={copy.placeholder}
            spellCheck={false}
            autoComplete="off"
            tabIndex={open ? 0 : -1}
            className="min-w-0 flex-1 border-none bg-transparent font-mono text-[0.8125rem] text-fg caret-accent outline-none"
          />
        </div>
      </div>

      {matrix && open && (
        <MatrixRain onStop={onStopMatrix} hint={copy.matrixStop} />
      )}

      {snake && open && <SnakeGame copy={copy.snake} onStop={stopSnake} />}
    </div>
  )
}
