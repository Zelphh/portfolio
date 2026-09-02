'use client'

import { SITE } from '@/content/site'
import type { Dictionary } from '@/i18n/types'
import { cn } from '@/lib/utils'

interface QuickActionsPanelProps {
  open: boolean
  copy: Dictionary['dock']
  onDownloadResume: () => void
}

const ITEM_CLASS =
  'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] text-[#c9ccc0] transition-colors hover:bg-surface-raised hover:text-accent'

export function QuickActionsPanel({
  open,
  copy,
  onDownloadResume,
}: QuickActionsPanelProps) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        'box-border w-[min(260px,calc(100vw-48px))] overflow-hidden rounded-[15px] border border-line-strong bg-panel shadow-[0_18px_46px_rgba(0,0,0,0.55)]',
        'origin-bottom-left transition-[height,opacity,transform,filter] duration-[380ms] ease-[var(--ease-out-spring)]',
        open
          ? 'h-[108px] translate-y-0 scale-100 opacity-100 blur-0'
          : 'pointer-events-none h-0 translate-y-[18px] scale-[0.96] opacity-0 blur-[5px]',
      )}
    >
      <div className="grid p-2">
        <a
          href={`mailto:${SITE.email}`}
          tabIndex={open ? 0 : -1}
          className={ITEM_CLASS}
        >
          <span aria-hidden className="text-accent">
            @
          </span>
          <span>{copy.contactMe}</span>
        </a>

        <button
          type="button"
          onClick={onDownloadResume}
          tabIndex={open ? 0 : -1}
          className={ITEM_CLASS}
        >
          <span aria-hidden className="text-accent">
            ↓
          </span>
          <span>{copy.downloadCv}</span>
        </button>
      </div>
    </div>
  )
}
