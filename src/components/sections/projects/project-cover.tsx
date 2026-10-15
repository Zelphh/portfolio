'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ProjectCover as Cover } from '@/content/types'

interface ProjectCoverProps {
  cover: Cover | undefined
  /** Empty for the dialog, where the heading right below already names it. */
  alt: string
  /** Word drawn in the frame while a project has no artwork yet. */
  placeholder: string
  /**
   * Whether the cover's slot is in view within its carousel. Videos also wait
   * for the frame to reach the browser viewport before mounting and playing.
   */
  active: boolean
  /**
   * Sizes the frame. Use box classes, not positioning ones: the frame owns
   * `relative` so the media can fill it, and Tailwind emits `relative` after
   * `absolute`, so an `absolute` passed in here loses and collapses the frame
   * to zero height.
   */
  className?: string
}

/**
 * The artwork frame shared by the project card and the project dialog.
 *
 * Artwork is contained rather than cropped: these are screen recordings and
 * screenshots of dense UIs, where losing an edge costs more than the letterbox
 * bars do.
 *
 * Video covers are deliberately lazy: the element mounts the first time the
 * cover is both active and on screen, and stays mounted afterwards, so a card
 * scrolled out and back in (carousel or page) resumes instead of refetching
 * the file. They keep playing while
 * merely off-centre, since a carousel of stills that only animates on the
 * focused card reads as broken rather than as restraint.
 */
export function ProjectCover({
  cover,
  alt,
  placeholder,
  active,
  className,
}: ProjectCoverProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  const [armed, setArmed] = useState(false)
  const isVideo = cover?.kind === 'video'
  const playing = active && onScreen

  useEffect(() => {
    const frame = frameRef.current
    if (!isVideo || !frame) return

    // The margin arms the video a little before it scrolls in, so it shows
    // its first frame on arrival instead of a black box.
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry?.isIntersecting ?? false),
      { rootMargin: '200px 0px' },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [isVideo])

  useEffect(() => {
    if (playing) setArmed(true)
  }, [playing])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (playing && !reduceMotion) {
      // Autoplay can still be refused (a battery-saver tab, say); the frame
      // then simply holds on its first frame.
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [playing, armed])

  if (!cover) {
    return (
      <div
        className={`grid place-items-center border border-dashed border-line-strong text-[11px] tracking-[0.24em] text-[#4a4d44] ${className ?? ''}`}
      >
        {placeholder}
      </div>
    )
  }

  // A logo is transparent art that reads best straight on the card surface,
  // inset so it never touches the frame. Everything else is opaque and gets a
  // dark backdrop behind whatever letterbox bars the aspect ratio leaves over.
  const frame = cover.kind === 'logo' ? 'p-10' : 'bg-ink'

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden ${frame} ${className ?? ''}`}
    >
      {cover.kind === 'video' ? (
        armed && (
          <video
            ref={videoRef}
            src={cover.src}
            aria-label={alt || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          />
        )
      ) : (
        <Image
          src={cover.src}
          alt={alt}
          fill
          sizes="(max-width: 760px) 100vw, 760px"
          className="object-contain"
        />
      )}
    </div>
  )
}
