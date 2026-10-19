'use client'

import Link from 'next/link'
import { SectionHeading } from '@/components/ui/section-heading'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { PROJECTS } from '@/content/projects'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'

interface ProjectsMovedProps {
  locale: Locale
  label: string
  copy: Dictionary['projects']
}

/**
 * What is left of the projects section on the home page: a pointer to the
 * page they moved to. It keeps the `projetos` anchor so the nav and the
 * console's `goto` still land somewhere, and `open <id>` follows the move.
 */
export function ProjectsMoved({ locale, label, copy }: ProjectsMovedProps) {
  const href = `/${locale}/projects/`

  useConsoleSignal('openProject', ({ index }) => {
    const project = PROJECTS[index]
    if (project) window.location.assign(`${href}#${project.id}`)
  })

  return (
    <section
      id="projetos"
      className="border-b border-dashed border-line py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
        <SectionHeading label={label} />

        <Link
          href={href}
          className="group mt-11 grid gap-5 rounded-[15px] border border-dashed border-line-strong p-7 font-mono text-sm transition-colors hover:border-moss sm:p-9"
        >
          <p className="text-fg-faint">
            <span className="text-moss-light">$</span> ls ~/projects
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-1 text-fg-ghost">
            {PROJECTS.map((project) => (
              <span key={project.id}>{project.id}/</span>
            ))}
          </p>
          <p className="text-pretty leading-[1.8] text-fg-dim">{copy.movedNote}</p>
          <span className="text-[13px] text-moss-light transition-colors group-hover:text-fg">
            {copy.movedLink}
          </span>
        </Link>
      </div>
    </section>
  )
}
