'use client'

import { useRef, useState, type PointerEvent } from 'react'
import type { ProjectCover as Cover } from '@/content/types'
import { format } from '@/i18n/format'
import { cn, mod } from '@/lib/utils'
import { ProjectCover } from './project-cover'

interface ProjectGalleryProps {
  items: readonly Cover[]
  /** Accessible name of the media; empty where a heading already names it. */
  alt: string
  labels: {
    previous: string
    next: string
    /** `{current} / {total}` */
    goTo: string
  }
  /**
   * Where the dots sit. The dialog keeps its stack pill along the bottom
   * edge, so it asks for them on top instead.
   */
  dotsAt?: 'top' | 'bottom'
  /** Sizes the frame. Same rules as `ProjectCover`'s `className`. */
  className?: string
}

/** Horizontal drag, in pixels, that a touch has to cover to flip a slide. */
const SWIPE_THRESHOLD = 40

/**
 * A project's screenshots and recordings, one at a time.
 *
 * Every slide stays mounted and only the current one shows, so a video that
 * was already fetched resumes instead of reloading when the visitor comes
 * back to it; the ones off screen are paused through `active`. With a single
 * item it is just the cover, without any controls.
 */
export function ProjectGallery({
  items,
  alt,
  labels,
  dotsAt = 'bottom',
  className,
}: ProjectGalleryProps) {
  const [index, setIndex] = useState(0)
  const swipeStart = useRef<number | null>(null)
  const total = items.length
  const several = total > 1

  if (total === 0) {
    return (
      <ProjectCover
        cover={undefined}
        alt={alt}
        placeholder="PREVIEW"
        active
        className={className}
      />
    )
  }

  const go = (step: number) => setIndex((value) => mod(value + step, total))

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    swipeStart.current = event.clientX
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (start === null) return
    const delta = event.clientX - start
    if (Math.abs(delta) >= SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1)
  }

  const arrow =
    'absolute top-1/2 z-10 -translate-y-1/2 rounded-md bg-ink/70 px-2.5 py-1.5 font-mono text-[0.8125rem] text-fg-subtle backdrop-blur-sm transition-colors hover:text-fg focus-visible:text-fg'

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onPointerDown={several ? onPointerDown : undefined}
      onPointerUp={several ? onPointerUp : undefined}
      onPointerCancel={() => {
        swipeStart.current = null
      }}
      aria-roledescription={several ? 'carousel' : undefined}
    >
      {items.map((item, itemIndex) => {
        const current = itemIndex === index
        return (
          <div
            key={item.src}
            aria-hidden={!current}
            className={cn(
              'absolute inset-0 transition-opacity duration-300',
              current ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <ProjectCover
              cover={item}
              alt={
                alt && several
                  ? `${alt} — ${format(labels.goTo, { current: itemIndex + 1, total })}`
                  : alt
              }
              placeholder="PREVIEW"
              active={current}
              className="h-full w-full"
            />
          </div>
        )
      })}

      {several && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className={cn(arrow, 'left-3')}
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className={cn(arrow, 'right-3')}
          >
            &gt;
          </button>

          <div
            className={cn(
              'absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1.5 backdrop-blur-sm',
              dotsAt === 'top' ? 'top-3' : 'bottom-3',
            )}
          >
            {items.map((item, itemIndex) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={format(labels.goTo, { current: itemIndex + 1, total })}
                aria-current={itemIndex === index ? 'true' : undefined}
                className={cn(
                  'h-1.5 rounded-full transition-[width,background-color] duration-300',
                  itemIndex === index
                    ? 'w-4 bg-accent'
                    : 'w-1.5 bg-fg-ghost hover:bg-fg-subtle',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
