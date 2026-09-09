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
  /** Videos only mount and play while the cover is the one being looked at. */
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
 * Video covers are deliberately lazy: the element mounts on first activation
 * and stays mounted afterwards, so a card scrolled out and back into the
 * carousel resumes instead of refetching the file.
 */
export function ProjectCover({
  cover,
  alt,
  placeholder,
  active,
  className,
}: ProjectCoverProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(active)

  useEffect(() => {
    if (active) setArmed(true)
  }, [active])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (active && !reduceMotion) {
      // Autoplay can still be refused (a battery-saver tab, say); the frame
      // then simply holds on its first frame.
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active, armed])

  if (!cover) {
    return (
      <div
        className={`grid place-items-center text-[11px] tracking-[0.24em] text-[#4a4d44] ${className ?? ''}`}
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
    <div className={`relative overflow-hidden ${frame} ${className ?? ''}`}>
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
