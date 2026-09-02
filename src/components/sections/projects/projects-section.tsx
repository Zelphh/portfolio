'use client'

import { useState } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { PROJECTS } from '@/content/projects'
import { useRingCarousel } from '@/hooks/use-ring-carousel'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { pad2, ringOffset } from '@/lib/utils'
import { ProjectCard } from './project-card'
import { ProjectDialog } from './project-dialog'

interface ProjectsSectionProps {
  locale: Locale
  label: string
  copy: Dictionary['projects']
}

const ARROW_CLASS =
  'absolute top-1/2 z-[5] -mt-[21px] border border-line bg-ink px-3.5 py-2.5 text-[15px] text-fg-faint transition-colors hover:border-moss hover:text-accent'

export function ProjectsSection({ locale, label, copy }: ProjectsSectionProps) {
  const carousel = useRingCarousel(PROJECTS.length)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openProject = openIndex === null ? null : PROJECTS[openIndex]

  return (
    <section
      id="projetos"
      className="overflow-hidden border-b border-dashed border-line py-24 lg:py-28"
    >
      <div className="mx-auto mb-11 max-w-[1180px] px-6 lg:px-10">
        <SectionHeading label={label} />
      </div>

      <div className="relative h-[520px]">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            detailsLabel={copy.details}
            onOpen={() => setOpenIndex(index)}
            offset={ringOffset(index, carousel.position, PROJECTS.length)}
          />
        ))}

        <button
          type="button"
          onClick={carousel.previous}
          aria-label={copy.previous}
          className={`${ARROW_CLASS} left-4 lg:left-7`}
        >
          [ &lt; ]
        </button>
        <button
          type="button"
          onClick={carousel.next}
          aria-label={copy.next}
          className={`${ARROW_CLASS} right-4 lg:right-7`}
        >
          [ &gt; ]
        </button>
      </div>

      <p className="mx-auto mt-8 flex max-w-[1180px] justify-center px-6 text-xs text-moss lg:px-10">
        {format(copy.counter, {
          current: pad2(carousel.index + 1),
          total: pad2(PROJECTS.length),
        })}
      </p>

      {openProject && (
        <ProjectDialog
          project={openProject}
          locale={locale}
          copy={copy}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  )
}
