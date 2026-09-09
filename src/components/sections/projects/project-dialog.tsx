'use client'

import { useEffect, useRef } from 'react'
import type { Project } from '@/content/types'
import { useEscapeKey } from '@/hooks/use-escape-key'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { ProjectBadges } from './project-badges'
import { ProjectCover } from './project-cover'

interface ProjectDialogProps {
  project: Project
  locale: Locale
  copy: Dictionary['projects']
  onClose: () => void
}

/**
 * Full write-up for a project.
 *
 * Rendered only while open, so the long-form copy for five projects never
 * sits in the DOM unread. Focus moves to the close button on open and the
 * page behind is locked from scrolling.
 */
export function ProjectDialog({
  project,
  locale,
  copy,
  onClose,
}: ProjectDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEscapeKey(true, onClose)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style

    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [])

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[60] grid animate-rise place-items-center overflow-y-auto overscroll-contain bg-[rgba(10,10,10,0.84)] p-7 backdrop-blur-[3px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-full w-[min(760px,100%)] cursor-default overflow-y-auto overscroll-contain rounded-[15px] border border-line-strong bg-surface"
      >
        <div className="relative h-[clamp(200px,42vh,420px)] flex-none overflow-hidden border-b border-line-soft bg-surface-raised">
          <ProjectCover
            cover={project.hero ?? project.cover}
            alt=""
            placeholder="PREVIEW"
            active
            className="h-full w-full"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-transparent to-[rgba(20,20,20,0.7)]"
          />

          <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-surface px-5 py-3">
            <span className="text-[11px] uppercase tracking-[0.22em] text-fg-fainter">
              {project.stack}
            </span>
            {project.badges && <ProjectBadges labels={project.badges[locale]} />}
          </div>

          <div className="absolute right-0 top-0 rounded-[10px] bg-accent px-4 py-2.5 text-[13px] font-bold text-ink">
            {project.year}
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="absolute left-[18px] top-4 rounded-[10px] border border-line-strong bg-[rgba(20,20,20,0.7)] px-2.5 py-1.5 text-xs text-fg-dim transition-colors hover:text-accent"
          >
            [ x ]
          </button>
        </div>

        <div className="grid gap-4 px-9 pb-8 pt-9">
          <h3
            id="project-dialog-title"
            className="font-display text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] text-fg"
          >
            {project.name[locale]}
          </h3>

          <div className="grid gap-4 text-pretty text-base leading-[1.9] text-fg-dim">
            {project.story[locale].map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-1 flex items-center justify-between gap-4 border-t border-dashed border-line pt-[18px]">
            <span className="text-xs text-fg-ghost">{copy.openSource}</span>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] text-accent transition-colors hover:text-fg"
            >
              {copy.openGithub}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
