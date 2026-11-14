'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { OrbitArt } from '@/components/ascii'
import { SectionHeading } from '@/components/ui/section-heading'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { PROJECTS } from '@/content/projects'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { ORBIT_COLORS } from '@/lib/ascii/orbit'

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

  // The list and the planets point at each other: hovering a folder focuses
  // its planet, hovering a planet lights its folder in the planet's colour.
  const [listFocus, setListFocus] = useState<number | null>(null)
  const [planetHover, setPlanetHover] = useState<number | null>(null)
  const planets = useMemo(
    () =>
      PROJECTS.map((project) => ({
        name: project.name[locale],
        stack: project.stack,
        inProgress: project.inProgress,
      })),
    [locale],
  )
  const planetColor = (i: number) => {
    const rgb = ORBIT_COLORS[4 + (i % 5)]
    return rgb ? `rgb(${rgb.join(' ')})` : undefined
  }

  const reveal = (shown: boolean) =>
    `transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`

  return (
    <section
      id="projetos"
      className="border-b border-dashed border-line py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[73.75rem] px-6 lg:px-10">
        <SectionHeading label={label} />

        <div className="mt-11 grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          <Link
            ref={boxRef}
            href={href}
            className="group grid gap-5 rounded-[0.9375rem] border border-moss-dim bg-surface/40 p-7 font-mono text-sm transition-[border-color,box-shadow] duration-300 hover:border-moss-light hover:shadow-[0_0_3rem_-0.875rem_var(--color-moss-light)] sm:p-9"
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
                  onPointerEnter={() => setListFocus(i)}
                  onPointerLeave={() => setListFocus(null)}
                  style={
                    planetHover === i || listFocus === i
                      ? { color: planetColor(i) }
                      : undefined
                  }
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
              className={`text-[0.8125rem] text-moss-light group-hover:text-fg ${reveal(done)}`}
            >
              {copy.movedLink}
              {done && (
                <span aria-hidden className="ml-1 animate-blink text-moss-light">
                  ▌
                </span>
              )}
            </span>
          </Link>

          <OrbitArt
            label={copy.orbitLabel}
            planets={planets}
            focus={listFocus}
            onHover={setPlanetHover}
            onSelect={(i) => {
              const project = PROJECTS[i]
              if (project) window.location.assign(`${href}#${project.id}`)
            }}
            className="aspect-[4/3] w-full sm:aspect-[16/10]"
          />
        </div>
      </div>
    </section>
  )
}
