'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { ProjectBadges } from '@/components/sections/projects/project-badges'
import { ProjectCover } from '@/components/sections/projects/project-cover'
import { ProjectStatus } from '@/components/sections/projects/project-status'
import { PROJECTS } from '@/content/projects'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { cn, mod, pad2 } from '@/lib/utils'

interface ProjectsExplorerProps {
  locale: Locale
  copy: Dictionary['projects']
}

/** Size of the thumbnail that trails the cursor over the list, in pixels. */
const PEEK_WIDTH = 260
const PEEK_HEIGHT = 162
/** Gap between the list's left edge and the thumbnail's right edge. */
const PEEK_GAP = 40
/** Fraction of the remaining distance the thumbnail covers each frame. */
const PEEK_FOLLOW = 0.16

const SPINNER = ['|', '/', '-', '\\'] as const

const FLY_EASING = 'cubic-bezier(0.22, 1, 0.28, 1)'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Plays an element in from where `from` was on screen — the list name it
 * was clicked on, or the thumbnail that was trailing the cursor — so the
 * stage reads as the same thing growing rather than a new page swapping in.
 */
function flyFrom(
  element: HTMLElement | null,
  from: DOMRect | undefined,
  uniform: boolean,
): void {
  if (!element || !from || from.width === 0) return

  const to = element.getBoundingClientRect()
  if (to.width === 0 || to.height === 0) return

  const scaleY = from.height / to.height
  const scaleX = uniform ? scaleY : from.width / to.width

  element.animate(
    [
      {
        transformOrigin: 'top left',
        transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scaleX}, ${scaleY})`,
        opacity: 0.5,
      },
      { transformOrigin: 'top left', transform: 'none', opacity: 1 },
    ],
    { duration: 640, easing: FLY_EASING },
  )
}

/** The `| / - \` tick beside the hovered or open project. */
function Spinner({ spinning }: { spinning: boolean }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!spinning || prefersReducedMotion()) return
    const id = window.setInterval(() => setFrame((value) => value + 1), 110)
    return () => window.clearInterval(id)
  }, [spinning])

  return (
    <span aria-hidden className="inline-block w-[1ch] font-mono text-moss-light">
      {spinning ? SPINNER[frame % SPINNER.length] : '·'}
    </span>
  )
}

/**
 * The projects page: a list that never leaves the screen, and a stage that
 * shows whichever project was picked from it.
 *
 * Hovering a name floats its cover beside the cursor; clicking flies the name
 * and that cover into the stage. The open project lives in the URL hash, so a
 * project can be linked to directly and the console's `open` lands on it.
 */
export function ProjectsExplorer({ locale, copy }: ProjectsExplorerProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [peeking, setPeeking] = useState(false)

  const nameRefs = useRef<Array<HTMLSpanElement | null>>([])
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const peekRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const flight = useRef<{ title?: DOMRect; cover?: DOMRect } | null>(null)

  const peekTarget = useRef({ x: 0, y: 0 })
  const peekPosition = useRef({ x: 0, y: 0 })
  const peekPlaced = useRef(false)

  // The hash is only readable after mount; reading it in the initial state
  // would render a different page on the server than on the client.
  useEffect(() => {
    const readHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const index = PROJECTS.findIndex((project) => project.id === id)
      setSelected(index === -1 ? null : index)
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  const select = useCallback(
    (index: number) => {
      const peek = peekRef.current
      flight.current = {
        title: nameRefs.current[index]?.getBoundingClientRect(),
        // Only grow out of the thumbnail when it is actually showing this
        // project; otherwise the cover just rises in with the rest.
        cover:
          peeking && hovered === index && peek
            ? peek.getBoundingClientRect()
            : undefined,
      }
      setSelected(index)
      window.history.replaceState(null, '', `#${PROJECTS[index]?.id ?? ''}`)
    },
    [hovered, peeking],
  )

  useLayoutEffect(() => {
    const from = flight.current
    flight.current = null
    if (!from || selected === null) return

    // A long write-up may have left the page scrolled down. The list is
    // sticky and the thumbnail fixed, so the rects taken before this jump
    // are still where the flight has to start.
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (prefersReducedMotion()) return

    flyFrom(titleRef.current, from.title, true)
    flyFrom(coverRef.current, from.cover, false)
  }, [selected])

  // Trail the cursor with a little lag. The position is written straight to
  // the element so following the mouse never re-renders the list.
  useEffect(() => {
    if (!peeking) return

    let frame = 0
    const tick = () => {
      const target = peekTarget.current
      const position = peekPosition.current
      position.x += (target.x - position.x) * PEEK_FOLLOW
      position.y += (target.y - position.y) * PEEK_FOLLOW
      if (peekRef.current) {
        peekRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [peeking])

  const onListPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return

    // Pinned beside the list rather than under the cursor, so the
    // thumbnail never covers the names it is previewing; it only rides up
    // and down with the pointer.
    const list = event.currentTarget.getBoundingClientRect()
    peekTarget.current = {
      x: Math.max(list.left - PEEK_WIDTH - PEEK_GAP, 12),
      y: event.clientY - PEEK_HEIGHT / 2,
    }
    // First move after entering: appear under the cursor instead of
    // sliding over from wherever the thumbnail was last left.
    if (!peekPlaced.current) {
      peekPosition.current = { ...peekTarget.current }
      peekPlaced.current = true
    }
    setPeeking(true)
  }

  const onListPointerLeave = () => {
    setHovered(null)
    setPeeking(false)
    peekPlaced.current = false
  }

  // Up and down walk the list, the way they would in a file picker.
  const onListKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()

    const current = itemRefs.current.findIndex(
      (item) => item === document.activeElement,
    )
    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = mod((current === -1 ? (selected ?? -1) : current) + step, PROJECTS.length)
    itemRefs.current[next]?.focus()
  }

  const project = selected === null ? null : PROJECTS[selected]
  const showPeek = peeking && hovered !== null && hovered !== selected

  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:px-10">
      <aside
        aria-label={copy.listLabel}
        onPointerMove={onListPointerMove}
        onPointerLeave={onListPointerLeave}
        onKeyDown={onListKeyDown}
        className="sticky top-16 z-10 border-b border-dashed border-line bg-ink/90 backdrop-blur-md lg:order-2 lg:flex lg:h-[calc(100dvh-4rem)] lg:flex-col lg:justify-center lg:border-b-0 lg:bg-transparent lg:backdrop-blur-none"
      >
        <div className="hidden items-center gap-3 pb-5 text-[11px] uppercase tracking-[0.24em] text-fg-fainter lg:flex">
          <span>~/projects</span>
          <span aria-hidden className="section-rule text-line-strong">
            {'─'.repeat(40)}
          </span>
          <span className="text-fg-ghost">{pad2(PROJECTS.length)}</span>
        </div>

        <ul className="scrollbar-thin flex gap-6 overflow-x-auto px-6 py-4 lg:block lg:overflow-visible lg:p-0">
          {PROJECTS.map((entry, index) => {
            const isOpen = index === selected
            const isHot = index === hovered

            return (
              <li key={entry.id} className="shrink-0">
                <button
                  type="button"
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  onClick={() => select(index)}
                  onPointerEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  aria-current={isOpen ? 'true' : undefined}
                  className="group flex w-full items-baseline gap-3 py-1 text-left lg:gap-4 lg:py-1.5"
                >
                  <span className="font-mono text-[11px] text-fg-ghost">
                    {pad2(index + 1)}
                  </span>
                  <span
                    ref={(node) => {
                      nameRefs.current[index] = node
                    }}
                    className={cn(
                      'whitespace-nowrap font-display text-[17px] font-semibold tracking-[-0.01em] transition-[color,transform] duration-300 ease-[var(--ease-out-soft)] lg:text-[clamp(24px,2.3vw,32px)]',
                      isOpen
                        ? 'text-fg-strong'
                        : isHot
                          ? 'text-fg-muted lg:-translate-x-2'
                          : 'text-fg-ghost',
                    )}
                  >
                    {entry.name[locale]}
                  </span>
                  <span
                    className={cn(
                      'transition-opacity duration-200',
                      isOpen || isHot ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <Spinner spinning={isHot || isOpen} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="hidden pt-6 text-[11px] leading-[1.8] text-fg-ghost lg:block">
          {copy.listHint}
        </p>
      </aside>

      {/* Trails the cursor over the list; mouse only, so it never sticks on
          a touch screen. Every cover stays mounted and only the hovered one
          shows, so a video does not refetch each time the mouse comes back. */}
      <div
        ref={peekRef}
        aria-hidden
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-30 hidden overflow-hidden rounded-[10px] border border-line-strong bg-surface shadow-float transition-opacity duration-200 lg:block',
          showPeek ? 'opacity-100' : 'opacity-0',
        )}
        style={{ width: PEEK_WIDTH, height: PEEK_HEIGHT }}
      >
        {PROJECTS.map((entry, index) => (
          <ProjectCover
            key={entry.id}
            cover={entry.cover}
            alt=""
            placeholder="PREVIEW"
            active={showPeek && index === hovered}
            className={cn(
              'absolute! inset-0 transition-opacity duration-200',
              index === hovered ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>

      <section
        aria-live="polite"
        className="min-h-[calc(100dvh-4rem)] min-w-0 px-6 py-12 lg:order-1 lg:px-0 lg:py-20"
      >
        {project && selected !== null ? (
          <article key={project.id} className="grid gap-7">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-fainter">
              <span className="normal-case tracking-normal text-fg-ghost">
                ~/projects/{project.id}.md
              </span>
              <span aria-hidden className="text-line-strong">
                ─
              </span>
              <span>{project.year}</span>
              <span aria-hidden className="text-line-strong">
                ·
              </span>
              <span>{project.stack}</span>
            </div>

            <h1
              ref={titleRef}
              className="w-fit text-balance font-display text-[clamp(38px,6vw,72px)] font-extrabold leading-[1] tracking-[-0.03em] text-fg-strong"
            >
              {project.name[locale]}
            </h1>

            {(project.inProgress || project.badges) && (
              <div className="flex flex-wrap items-center gap-2 animate-rise">
                {project.inProgress && <ProjectStatus label={copy.inProgress} />}
                {project.badges && <ProjectBadges labels={project.badges[locale]} />}
              </div>
            )}

            <div
              ref={coverRef}
              className="relative aspect-video w-full overflow-hidden rounded-[12px] border border-line-soft bg-surface"
            >
              <ProjectCover
                cover={project.hero ?? project.cover}
                alt={project.name[locale]}
                placeholder="PREVIEW"
                active
                className="h-full w-full"
              />
            </div>

            <div className="grid max-w-[68ch] animate-rise gap-4 text-pretty text-[15px] leading-[1.9] text-fg-dim">
              {project.story[locale].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-line pt-5 text-[13px]">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-moss-light transition-colors hover:text-fg"
              >
                {copy.openGithub}
              </a>

              <div className="flex items-center gap-4 text-fg-subtle">
                <button
                  type="button"
                  onClick={() => select(mod(selected - 1, PROJECTS.length))}
                  aria-label={copy.previous}
                  className="transition-colors hover:text-fg"
                >
                  [ &lt; ]
                </button>
                <span className="text-xs text-fg-ghost">
                  {format(copy.counter, {
                    current: pad2(selected + 1),
                    total: pad2(PROJECTS.length),
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => select(mod(selected + 1, PROJECTS.length))}
                  aria-label={copy.next}
                  className="transition-colors hover:text-fg"
                >
                  [ &gt; ]
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="grid min-h-[50vh] content-center gap-4 font-mono text-sm text-fg-faint lg:min-h-[calc(100dvh-14rem)]">
            <h1 className="sr-only">{copy.pageTitle}</h1>
            <p>
              <span className="text-moss-light">$</span> ls ~/projects
            </p>
            <p className="text-fg-ghost">
              {format(copy.idleCount, { total: PROJECTS.length })}
            </p>
            <p>
              <span className="hidden lg:inline">{copy.idlePointer}</span>
              <span className="lg:hidden">{copy.idleTouch}</span>
              <span aria-hidden className="ml-1 animate-blink text-moss-light">
                ▍
              </span>
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
