'use client'

import type { Project } from '@/content/types'
import type { Locale } from '@/i18n/config'
import { ProjectBadges } from './project-badges'
import { ProjectCover } from './project-cover'
import { ProjectStatus } from './project-status'
import { rem } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  locale: Locale
  detailsLabel: string
  inProgressLabel: string
  onOpen: () => void
  /** Signed distance from the centre of the carousel, in slots. */
  offset: number
}

/** Horizontal travel per carousel slot, in design pixels (shipped as rem). */
const SLOT_WIDTH = 660
/** Slots further out than this are fully transparent. */
const VISIBLE_RADIUS = 2.2

export function ProjectCard({
  project,
  locale,
  detailsLabel,
  inProgressLabel,
  onOpen,
  offset,
}: ProjectCardProps) {
  const distance = Math.abs(offset)
  const hidden = distance > VISIBLE_RADIUS

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className="absolute left-1/2 top-0 grid h-[32.5rem] w-[37.5rem] max-w-[calc(100vw-3rem)] grid-rows-[1fr_auto] cursor-pointer rounded-[1.5625rem] border border-line-soft bg-surface text-left transition-[transform,opacity] duration-[550ms] ease-[var(--ease-out-soft)]"
      style={{
        // `-50%` centres whatever width the card ended up at, so the capped
        // mobile width stays centred instead of drifting off the viewport.
        transform: `translateX(calc(-50% + ${rem(offset * SLOT_WIDTH)})) scale(${1 - Math.min(distance, 2) * 0.07})`,
        opacity: hidden ? 0 : Math.max(1 - distance * 0.42, 0.1),
      }}
    >
      <ProjectCover
        cover={project.cover}
        alt={project.name[locale]}
        placeholder="SCREENSHOT"
        active={!hidden}
        className="m-6 mb-0 rounded-[0.375rem]"
      />

      <div className="grid gap-3.5 p-7">
        <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.2em] text-fg-fainter">
          <span>{project.year}</span>
          <span className="text-line-strong">·</span>
          <span>{project.stack}</span>
          {(project.inProgress || project.badges) && (
            <span className="ml-auto flex items-center gap-2">
              {project.inProgress && <ProjectStatus label={inProgressLabel} />}
              {project.badges && (
                <ProjectBadges labels={project.badges[locale]} />
              )}
            </span>
          )}
        </div>

        <span className="font-display text-[1.875rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-fg">
          {project.name[locale]}
        </span>

        <span className="text-sm leading-[1.8] text-fg-dim">
          {project.summary[locale]}
        </span>

        <span className="text-[0.8125rem] text-accent">{detailsLabel}</span>
      </div>
    </button>
  )
}
