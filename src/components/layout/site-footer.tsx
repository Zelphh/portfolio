import { SITE } from '@/content/site'
import type { Dictionary } from '@/i18n/types'
import { FooterTetris } from './footer-tetris'

interface SiteFooterProps {
  copy: Dictionary['footer']
}

export function SiteFooter({ copy }: SiteFooterProps) {
  return (
    <>
      <FooterTetris />

      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-dashed border-line px-6 pb-8 pt-6 text-xs text-fg-fainter lg:px-10">
        <span className="flex items-center gap-3">
          <span aria-hidden className="text-accent">
            &gt;
          </span>
          <span>{copy.note}</span>
        </span>

        <span className="flex items-center gap-3.5 text-fg-ghost">
          <span>© {SITE.startYear}</span>
          <span aria-hidden className="text-line-strong">
            ·
          </span>
          <span>{copy.location}</span>
        </span>
      </footer>
    </>
  )
}
