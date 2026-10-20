'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { PROJECTS } from '@/content/projects'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'

const COMMAND = 'ls ~/projects'
/** Per keystroke while the command is typed out. */
const TYPE_MS = 55
/** The beat between pressing enter and the listing coming back. */
const ENTER_MS = 280
/** Gap between listed entries. */
const ENTRY_MS = 110

interface ProjectsMovedProps {
  locale: Locale
  label: string
  copy: Dictionary['projects']
}

/**
 * What is left of the projects section on the home page: a pointer to the
 * page they moved to. It keeps the `projetos` anchor so the nav and the
 * console's `goto` still land somewhere, and `open <id>` follows the move.
 *
 * The first time it scrolls into view it plays out like a shell: the `ls` is
 * typed, the entries come back one by one, then the note and the link.
 * Everything is in the DOM from the start (hidden, not absent), so nothing
 * shifts while it plays and reduced-motion visitors just get the end state.
 */
export function ProjectsMoved({ locale, label, copy }: ProjectsMovedProps) {
  const href = `/${locale}/projects/`
  const boxRef = useRef<HTMLAnchorElement>(null)
  const [started, setStarted] = useState(false)
  const [typed, setTyped] = useState(0)
  const [listed, setListed] = useState(0)

  const commandDone = typed >= COMMAND.length
  const done = listed > PROJECTS.length

  useConsoleSignal('openProject', ({ index }) => {
    const project = PROJECTS[index]
    if (project) window.location.assign(`${href}#${project.id}`)
  })

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(COMMAND.length)
      setListed(PROJECTS.length + 1)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setStarted(true)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  // One step per timeout: each keystroke, then each entry, with the extra
  // index past the last project standing for the note and the link.
  useEffect(() => {
    if (!started || done) return
    const timer = commandDone
      ? setTimeout(
          () => setListed((n) => n + 1),
          listed === 0 ? ENTER_MS : ENTRY_MS,
        )
      : setTimeout(() => setTyped((n) => n + 1), TYPE_MS)
    return () => clearTimeout(timer)
  }, [started, typed, listed, commandDone, done])

  const reveal = (shown: boolean) =>
    `transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`

  return (
    <section
      id="projetos"
      className="border-b border-dashed border-line py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
        <SectionHeading label={label} />

        <Link
          ref={boxRef}
          href={href}
          className="group mt-11 grid gap-5 rounded-[15px] border border-moss-dim bg-surface/40 p-7 font-mono text-sm transition-[border-color,box-shadow] duration-300 hover:border-moss-light hover:shadow-[0_0_48px_-14px_var(--color-moss-light)] sm:p-9"
        >
          <p className="text-fg-faint">
            <span className="text-moss-light">$</span>{' '}
            <span className="sr-only">{COMMAND}</span>
            <span aria-hidden>{COMMAND.slice(0, typed)}</span>
            {!commandDone && (
              <span aria-hidden className="animate-blink text-moss-light">
                ▌
              </span>
            )}
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-1 text-fg-dim transition-colors group-hover:text-fg-muted">
            {PROJECTS.map((project, i) => (
              <span
                key={project.id}
                className={`inline-flex items-center gap-2 ${reveal(listed > i)}`}
              >
                {project.id}/
                {project.inProgress && (
                  <span aria-hidden className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                  </span>
                )}
              </span>
            ))}
          </p>
          <p className={`text-pretty leading-[1.8] text-fg-dim ${reveal(done)}`}>
            {copy.movedNote}
          </p>
          <span
            className={`text-[13px] text-moss-light group-hover:text-fg ${reveal(done)}`}
          >
            {copy.movedLink}
            {done && (
              <span aria-hidden className="ml-1 animate-blink text-moss-light">
                ▌
              </span>
            )}
          </span>
        </Link>
      </div>
    </section>
  )
}
