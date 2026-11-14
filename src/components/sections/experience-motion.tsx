'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** Where on screen the line's tip sits, as a fraction of the viewport height. */
const DRAW_AT = 0.65
/** Per character while a date is typed out. */
const TYPE_MS = 38
/** Pause between the entry appearing and its date starting to type. */
const TYPE_DELAY_MS = 180

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface TimelineMotionProps {
  className?: string
  children: ReactNode
}

/**
 * The moving parts of the career tree, wrapped around the static list:
 *
 * - a solid line draws itself down the dashed rule as the page scrolls,
 *   ending at the last node;
 * - every `[data-timeline-node]` gets `data-lit` once the line reaches it;
 * - every `[data-timeline-entry]` gets `data-shown` the first time it scrolls
 *   in, which the CSS in `globals.css` turns into a fade-up.
 *
 * Everything is driven through attributes and one inline height, so the tree
 * never re-renders. With reduced motion the line is drawn in full and every
 * node is lit from the start.
 */
export function TimelineMotion({ className, children }: TimelineMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const fill = fillRef.current
    if (!root || !fill) return

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-timeline-node]'),
    )
    const entries = Array.from(
      root.querySelectorAll<HTMLElement>('[data-timeline-entry]'),
    )
    const reduced = prefersReducedMotion()

    // The line stops at the last node on the main rule (the closing arrow).
    const nodeOffset = (node: HTMLElement, rootTop: number) => {
      const rect = node.getBoundingClientRect()
      return rect.top + rect.height / 2 - rootTop
    }
    const lineEnd = (rootTop: number) => {
      const last = nodes.at(-1)
      return last ? nodeOffset(last, rootTop) : 0
    }

    if (reduced) {
      const rootTop = root.getBoundingClientRect().top
      fill.style.height = `${lineEnd(rootTop)}px`
      fill.dataset.done = ''
      for (const node of nodes) node.dataset.lit = ''
      return
    }

    root.dataset.motion = 'on'

    let frame = 0
    const draw = () => {
      frame = 0
      const rootTop = root.getBoundingClientRect().top
      const end = lineEnd(rootTop)
      const drawn = Math.min(
        Math.max(window.innerHeight * DRAW_AT - rootTop, 0),
        end,
      )
      fill.style.height = `${drawn}px`
      fill.toggleAttribute('data-done', drawn >= end - 1)
      for (const node of nodes) {
        node.toggleAttribute('data-lit', nodeOffset(node, rootTop) <= drawn + 1)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue
          const entry = record.target as HTMLElement
          entry.dataset.shown = ''
          observer.unobserve(entry)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    for (const entry of entries) observer.observe(entry)

    draw()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      delete root.dataset.motion
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <span
        ref={fillRef}
        aria-hidden
        className="group/fill pointer-events-none absolute left-0 top-0 z-[1] w-px bg-linear-to-b from-accent-dim/40 to-accent"
        style={{ height: 0 }}
      >
        <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent shadow-[0_0_0.625rem_0.125rem_var(--color-accent)] transition-opacity duration-300 group-data-done/fill:opacity-0" />
      </span>
      {children}
    </div>
  )
}

interface TypedTextProps {
  /** Pieces typed one after the other, each with its own colour. */
  parts: readonly { text: string; className?: string }[]
  className?: string
}

/**
 * A line that types itself out the first time it scrolls into view, with a
 * block cursor while it goes. The full text is server rendered and kept for
 * screen readers; only the visible copy is animated.
 */
export function TypedText({ parts, className }: TypedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const chars = parts.map((part) => Array.from(part.text))
  const total = chars.reduce((sum, list) => sum + list.length, 0)
  const [typed, setTyped] = useState(total)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    setTyped(0)
    const observer = new IntersectionObserver(
      ([record]) => {
        if (!record?.isIntersecting) return
        setStarted(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || typed >= total) return
    const timer = setTimeout(
      () => setTyped((n) => n + 1),
      typed === 0 ? TYPE_DELAY_MS : TYPE_MS,
    )
    return () => clearTimeout(timer)
  }, [started, typed, total])

  // Split every part at the cursor: what is typed so far, then the rest kept
  // invisible so the line holds its final width and nothing shifts.
  let left = typed
  const split = parts.map((part, i) => {
    const list = chars[i]!
    const cut = Math.min(Math.max(left, 0), list.length)
    left -= list.length
    return {
      className: part.className,
      shown: list.slice(0, cut).join(''),
      rest: list.slice(cut).join(''),
    }
  })

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{parts.map((part) => part.text).join('')}</span>
      <span aria-hidden>
        {split.map((part, i) => (
          <span key={i} className={part.className}>
            {part.shown}
          </span>
        ))}
        {started && typed < total && (
          <span className="animate-blink text-accent">▌</span>
        )}
        <span className="invisible">
          {split.map((part, i) => (
            <span key={i}>{part.rest}</span>
          ))}
        </span>
      </span>
    </span>
  )
}
