import type { SkillTier } from '@/content/types'
import { cn } from '@/lib/utils'

const TIER_STYLES: Readonly<Record<SkillTier, string>> = {
  pro: 'border-accent text-accent',
  secondary: 'border-moss-dim text-moss-light',
}

/** Small colour dot used in the wheel and marquee. */
export const TIER_DOT: Readonly<Record<SkillTier, string>> = {
  pro: 'bg-accent',
  secondary: 'bg-moss-light',
}

interface TierBadgeProps {
  tier: SkillTier
  label: string
  className?: string
}

export function TierBadge({ tier, label, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        'border px-2 py-[3px] text-[10px] uppercase tracking-[0.22em]',
        TIER_STYLES[tier],
        className,
      )}
    >
      {label}
    </span>
  )
}
