'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { Dictionary } from '@/i18n/types'
import type { LineTone, TerminalLine } from '@/lib/terminal'
import { cn } from '@/lib/utils'

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
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

/**
 * The console panel.
 *
 * Collapses to zero height rather than unmounting, so reopening it keeps the
 * session history and skips a remount. While closed it is inert —
 * `pointer-events: none` plus `aria-hidden` — so it cannot be tabbed into.
 */
export function TerminalPanel({
  open,
  copy,
  lines,
  value,
  onChange,
  onSubmit,
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

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
    if (event.key === 'Escape') onClose()
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'box-border flex w-[min(620px,calc(100vw-48px))] flex-col overflow-hidden rounded-[15px] border border-line-strong bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.6)]',
        'origin-bottom-left transition-[height,opacity,transform,filter] duration-[420ms] ease-[var(--ease-out-spring)]',
        open
          ? 'h-[min(340px,calc(100vh-240px))] translate-y-0 scale-100 opacity-100 blur-0'
          : 'pointer-events-none h-0 translate-y-6 scale-[0.96] opacity-0 blur-[6px]',
      )}
    >
      <div className="flex flex-none items-center gap-2.5 border-b border-line-soft px-3.5 py-2.5">
        <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-accent" />
        <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-moss" />
        <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-line" />
        <span className="flex-1 text-center text-[11px] uppercase tracking-[0.2em] text-fg-fainter">
          {copy.title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.title}
          tabIndex={open ? 0 : -1}
          className="px-1 text-[13px] text-fg-fainter transition-colors hover:text-accent"
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
                'whitespace-pre-wrap text-[13px] leading-[1.7]',
                TONE_CLASS[line.tone],
              )}
            >
              {line.text}
            </div>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <label htmlFor="terminal-input" className="flex-none text-[13px] text-accent">
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
            className="min-w-0 flex-1 border-none bg-transparent font-mono text-[13px] text-fg caret-accent outline-none"
          />
        </div>
      </div>
    </div>
  )
}
