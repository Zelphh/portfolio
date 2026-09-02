'use client'

import { useRef } from 'react'
import { TIER_DOT } from '@/components/ui/tier-badge'
import type { Skill } from '@/content/types'
import { useWheelStep } from '@/hooks/use-wheel-step'
import { cn, ringOffset } from '@/lib/utils'

/** Row height in pixels; also the travel distance of one wheel step. */
const ITEM_HEIGHT = 45
/** Rows further than this from the centre are faded out entirely. */
const VISIBLE_RADIUS = 3

interface SkillWheelProps {
  skills: readonly Skill[]
  position: number
  activeIndex: number
  onSelect: (index: number) => void
  onStep: (direction: 1 | -1) => void
  label: string
}

/**
 * Vertical skill picker. Rows are laid out from a single ring offset, so the
 * list wraps in whichever direction the reader is scrolling instead of
 * rewinding to the top.
 */
export function SkillWheel({
  skills,
  position,
  activeIndex,
  onSelect,
  onStep,
  label,
}: SkillWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  useWheelStep(wheelRef, onStep)

  return (
    <div
      ref={wheelRef}
      role="listbox"
      aria-label={label}
      className="fade-y relative h-[210px] touch-none overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-1/2">
        {skills.map((skill, index) => {
          const offset = ringOffset(index, position, skills.length)
          const distance = Math.abs(offset)
          const isActive = index === activeIndex

          return (
            <button
              key={skill.id}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => onSelect(index)}
              className={cn(
                'absolute left-0 right-0 -mt-[22px] flex h-[45px] items-center justify-end text-[15px]',
                'transition-[transform,color,opacity] duration-[450ms] ease-[var(--ease-out-soft)]',
                isActive ? 'text-accent' : 'text-fg-faint',
              )}
              style={{
                transform: `translateY(${offset * ITEM_HEIGHT}px)`,
                opacity:
                  distance > VISIBLE_RADIUS
                    ? 0
                    : Math.max(0.85 - distance * 0.2, 0.12),
              }}
              // Faded-out rows must not be reachable by keyboard or pointer.
              tabIndex={distance > VISIBLE_RADIUS ? -1 : 0}
              aria-hidden={distance > VISIBLE_RADIUS}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={cn('text-accent', isActive ? 'opacity-100' : 'opacity-0')}
                >
                  -&gt;
                </span>
                <span>[ {skill.name} ]</span>
                <span
                  aria-hidden
                  className={cn(
                    'h-1.5 w-1.5 flex-none',
                    TIER_DOT[skill.tier],
                    isActive ? 'opacity-100' : 'opacity-35',
                  )}
                />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
