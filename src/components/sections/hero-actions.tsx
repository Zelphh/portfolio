'use client'

import type { MouseEvent } from 'react'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import type { Dictionary } from '@/i18n/types'

interface HeroActionsProps {
  copy: Dictionary['hero']['cta']
}

/**
 * The hero's two calls to action. Plain anchors, so they still work before
 * hydration; once the page is interactive they take the eased scroll the
 * header nav uses instead of jumping.
 */
export function HeroActions({ copy }: HeroActionsProps) {
  const scrollTo = useSmoothScroll()

  const glide = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollTo(id)
  }

  return (
    <div className="mt-[2.875rem] flex flex-wrap items-center gap-3.5">
      <a
        href="#projetos"
        onClick={glide('projetos')}
        className="flex items-center gap-3 rounded-full bg-accent px-[1.375rem] py-[0.9375rem] text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-[background-color,translate] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-fg"
      >
        <span>[ {copy.projects} ]</span>
        <span aria-hidden>-&gt;</span>
      </a>

      <a
        href="#contato"
        onClick={glide('contato')}
        className="flex items-center gap-3 rounded-full border border-dashed border-moss px-[1.375rem] py-3.5 text-[0.8125rem] uppercase tracking-[0.16em] text-fg-muted transition-[border-color,color,translate] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-accent hover:text-accent"
      >
        <span aria-hidden className="text-accent">
          @
        </span>
        <span>{copy.contact}</span>
      </a>
    </div>
  )
}
