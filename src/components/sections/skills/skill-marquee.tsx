'use client'

import { TIER_DOT } from '@/components/ui/tier-badge'
import type { Skill } from '@/content/types'
import { cn } from '@/lib/utils'

interface SkillMarqueeProps {
  skills: readonly Skill[]
  activeIndex: number
  onSelect: (index: number) => void
}

/**
 * Infinite horizontal ticker. The list is rendered twice and translated by
 * exactly -50%, which makes the loop seamless with one CSS animation and no
 * JavaScript running per frame.
 */
export function SkillMarquee({
  skills,
  activeIndex,
  onSelect,
}: SkillMarqueeProps) {
  const track = [...skills, ...skills]

  return (
    <div className="fade-x mt-16 overflow-hidden border-t border-dashed border-line pt-8">
      <div className="flex w-max animate-marquee">
        {track.map((skill, position) => {
          const index = position % skills.length
          const isActive = index === activeIndex

          return (
            <button
              key={`${skill.id}-${position}`}
              type="button"
              onClick={() => onSelect(index)}
              // The second copy exists only to make the loop seamless.
              aria-hidden={position >= skills.length}
              tabIndex={position >= skills.length ? -1 : 0}
              className={cn(
                'flex items-center gap-3 px-[30px] transition-opacity duration-300',
                isActive ? 'opacity-100' : 'opacity-60',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element --
                  Fixed-size local SVGs; see SkillShowcase for the rationale. */}
              <img
                src={skill.marqueeIcon}
                alt=""
                width={34}
                height={34}
                loading="lazy"
                decoding="async"
                className="block h-[34px] w-[34px] flex-none"
              />
              <span
                className={cn(
                  'whitespace-nowrap text-[13px] uppercase tracking-[0.16em]',
                  isActive ? 'text-accent' : 'text-fg-faint',
                )}
              >
                {skill.name}
              </span>
              <span
                aria-hidden
                className={cn('h-[5px] w-[5px] flex-none', TIER_DOT[skill.tier])}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
