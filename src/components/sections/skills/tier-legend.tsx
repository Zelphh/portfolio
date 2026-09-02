'use client'

import { useId, useState } from 'react'
import { TierBadge } from '@/components/ui/tier-badge'
import type { Dictionary } from '@/i18n/types'
import { cn } from '@/lib/utils'

interface TierLegendProps {
  copy: Dictionary['skills']
}

/**
 * The `i` bubble next to the skills heading, explaining the two tiers.
 *
 * Opens on hover for pointers and on click for touch and keyboard, so the
 * content is reachable without a hover state to rely on.
 */
export function TierLegend({ copy }: TierLegendProps) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()

  return (
    <div
      className="relative flex flex-none items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={copy.legendLabel}
        aria-expanded={open}
        aria-describedby={tooltipId}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        className="grid h-[18px] w-[18px] cursor-help place-items-center rounded-full border border-line-bright text-[11px] font-bold leading-none text-fg-subtle"
      >
        i
      </button>

      <div
        id={tooltipId}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute -left-2 top-7 z-20 w-[320px] border border-line-bright bg-surface-raised p-4 shadow-[0_18px_40px_rgba(0,0,0,0.5)]',
          'transition-[opacity,transform] duration-200 ease-[var(--ease-out-soft)]',
          open ? 'translate-y-0 opacity-100' : '-translate-y-1.5 opacity-0',
        )}
      >
        <span
          aria-hidden
          className="absolute -top-[5px] left-3 h-2 w-2 rotate-45 border-l border-t border-line-bright bg-surface-raised"
        />
        <div className="grid gap-2.5">
          <div className="grid gap-1.5">
            <TierBadge tier="pro" label={copy.tierPro} className="justify-self-start" />
            <span className="text-[13px] leading-[1.6] text-fg-dim">
              {copy.tierProDescription}
            </span>
          </div>
          <div className="grid gap-1.5">
            <TierBadge
              tier="secondary"
              label={copy.tierSecondary}
              className="justify-self-start"
            />
            <span className="text-[13px] leading-[1.6] text-fg-dim">
              {copy.tierSecondaryDescription}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
