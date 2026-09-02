import { TetrisBoard } from '@/components/tetris'
import { SITE } from '@/content/site'
import type { Dictionary } from '@/i18n/types'

interface SiteFooterProps {
  copy: Dictionary['footer']
}

/** Block colours for the footer board, drawn from the site palette. */
const TETRIS_COLORS = ['#484E3D', '#77885d', '#E7E74A'] as const

export function SiteFooter({ copy }: SiteFooterProps) {
  return (
    <>
      <div
        aria-hidden
        className="relative h-[340px] overflow-hidden border-t border-dashed border-line bg-panel"
      >
        <div className="absolute inset-0 opacity-80">
          <TetrisBoard
            boardColor="rgba(255,255,255,0.035)"
            colors={TETRIS_COLORS}
            cellSize={30}
            gap={3}
            rounded={0}
            dropSpeed={2}
            movement={5}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-[rgba(20,20,20,0.35)] to-[rgba(20,20,20,0.15)]" />
      </div>

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
