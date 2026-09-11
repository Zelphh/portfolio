'use client'

import type { Project } from '@/content/types'
import type { Locale } from '@/i18n/config'
import { ProjectBadges } from './project-badges'
import { ProjectCover } from './project-cover'

interface ProjectCardProps {
  project: Project
  locale: Locale
  detailsLabel: string
  onOpen: () => void
  /** Signed distance from the centre of the carousel, in slots. */
  offset: number
}

/** Horizontal travel per carousel slot, in pixels. */
const SLOT_WIDTH = 660
/** Slots further out than this are fully transparent. */
const VISIBLE_RADIUS = 2.2

export function ProjectCard({
  project,
  locale,
  detailsLabel,
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
      className="absolute left-1/2 top-0 grid h-[520px] w-[600px] max-w-[calc(100vw-48px)] grid-rows-[1fr_auto] cursor-pointer rounded-[25px] border border-line-soft bg-surface text-left transition-[transform,opacity] duration-[550ms] ease-[var(--ease-out-soft)]"
      style={{
        // `-50%` centres whatever width the card ended up at, so the capped
        // mobile width stays centred instead of drifting off the viewport.
        transform: `translateX(calc(-50% + ${offset * SLOT_WIDTH}px)) scale(${1 - Math.min(distance, 2) * 0.07})`,
        opacity: hidden ? 0 : Math.max(1 - distance * 0.42, 0.1),
      }}
    >
      <ProjectCover
        cover={project.cover}
        alt={project.name[locale]}
        placeholder="SCREENSHOT"
        active={!hidden}
        className="m-6 mb-0 rounded-[6px]"
      />

      <div className="grid gap-3.5 p-7">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-fg-fainter">
          <span>{project.year}</span>
          <span className="text-line-strong">·</span>
          <span>{project.stack}</span>
          {project.badges && (
            <ProjectBadges labels={project.badges[locale]} className="ml-auto" />
          )}
        </div>

        <span className="font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.02em] text-fg">
          {project.name[locale]}
        </span>

        <span className="text-sm leading-[1.8] text-fg-dim">
          {project.summary[locale]}
        </span>

        <span className="text-[13px] text-accent">{detailsLabel}</span>
      </div>
    </button>
  )
}
