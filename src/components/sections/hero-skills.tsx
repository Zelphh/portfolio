import type { CSSProperties } from 'react'
import { SKILLS } from '@/content/skills'

/**
 * Where each badge sits on the photo frame, as a share of the frame's box.
 * Left and right edges alternate so the six never line up into a column,
 * and none sits where the face is.
 */
const SLOTS: readonly { x: string; y: string }[] = [
  { x: '0%', y: '16%' },
  { x: '100%', y: '8%' },
  { x: '0%', y: '50%' },
  { x: '100%', y: '42%' },
  { x: '0%', y: '84%' },
  { x: '100%', y: '76%' },
]

const PRO_SKILLS = SKILLS.filter((skill) => skill.tier === 'pro').slice(
  0,
  SLOTS.length,
)

/**
 * The professional skills pinned around the hero's photo frame: a vendor
 * icon in a dashed ring that slowly turns, tagged with its name in brackets
 * like the rest of the site's ASCII furniture. Purely decorative — the
 * skills section is where they are actually described.
 */
export function HeroSkills() {
  return (
    <ul aria-hidden className="absolute inset-0 z-[1] m-0 list-none p-0">
      {PRO_SKILLS.map((skill, index) => {
        const slot = SLOTS[index]!
        const style: CSSProperties = {
          left: slot.x,
          top: slot.y,
          // Out of step, so the badges drift rather than bob in unison.
          animationDelay: `${index * -0.9}s`,
        }

        return (
          <li
            key={skill.id}
            style={style}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 animate-drift flex-col items-center gap-1.5"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-panel lg:h-12 lg:w-12">
              <span className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-moss-light/70" />
              {/* eslint-disable-next-line @next/next/no-img-element --
                  Fixed-size local SVGs, same as the skill marquee. */}
              <img
                src={skill.marqueeIcon}
                alt=""
                width={22}
                height={22}
                decoding="async"
                className="block h-[1.125rem] w-[1.125rem] lg:h-[1.375rem] lg:w-[1.375rem]"
              />
            </span>
            <span className="whitespace-nowrap bg-ink/80 px-1 text-[0.625rem] lowercase leading-none tracking-[0.12em] text-fg-faint">
              [{skill.id}]
            </span>
          </li>
        )
      })}
    </ul>
  )
}
