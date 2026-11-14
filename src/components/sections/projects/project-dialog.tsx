'use client'

import type { Project } from '@/content/types'
import { Modal } from '@/components/ui/modal'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { ProjectBadges } from './project-badges'
import { ProjectCover } from './project-cover'
import { ProjectStatus } from './project-status'

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
 * sits in the DOM unread. `Modal` handles focus, escape, scroll lock and the
 * enter/exit motion.
 */
export function ProjectDialog({
  project,
  locale,
  copy,
  onClose,
}: ProjectDialogProps) {
  return (
    <Modal
      onClose={onClose}
      closeLabel={copy.close}
      path={`~/projects/${project.id}.md`}
      width="47.5rem"
      labelledBy="project-dialog-title"
    >
      <div className="relative h-[clamp(11.25rem,38vh,25rem)] overflow-hidden border-b border-line-soft bg-surface-raised">
        <ProjectCover
          cover={project.hero ?? project.cover}
          alt=""
          placeholder="PREVIEW"
          active
          className="h-full w-full"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[7.5rem] bg-gradient-to-b from-transparent to-scrim-soft"
        />

        <div className="absolute bottom-0 left-0 flex max-w-full items-center gap-3 rounded-tr-[0.625rem] bg-surface px-5 py-3">
          <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-fg-fainter">
            {project.stack}
          </span>
          {project.inProgress && <ProjectStatus label={copy.inProgress} />}
          {project.badges && <ProjectBadges labels={project.badges[locale]} />}
        </div>

        <div className="absolute right-0 top-0 rounded-bl-[0.625rem] bg-accent px-4 py-2.5 text-[0.8125rem] font-bold text-ink">
          {project.year}
        </div>
      </div>

      <div className="grid gap-4 px-5 pb-7 pt-7 sm:px-9 sm:pb-8 sm:pt-9">
        <h3
          id="project-dialog-title"
          className="text-balance font-display text-[clamp(1.75rem,5vw,2.375rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-fg"
        >
          {project.name[locale]}
        </h3>

        <div className="grid gap-4 text-pretty text-base leading-[1.9] text-fg-dim">
          {project.story[locale].map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-line pt-[1.125rem]">
          <span className="text-xs text-fg-ghost">{copy.openSource}</span>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[0.8125rem] text-accent transition-colors hover:text-fg"
          >
            {copy.openGithub}
          </a>
        </div>
      </div>
    </Modal>
  )
}
