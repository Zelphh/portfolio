import Image from 'next/image'
import type { Dictionary } from '@/i18n/types'
import { HeroActions } from './hero-actions'
import { HeroField } from './hero-field'
import { HeroGreeting } from './hero-greeting'

interface HeroSectionProps {
  copy: Dictionary['hero']
}

/** A `+` pinned to one corner of the photo frame. */
const CORNER = 'absolute text-sm leading-none text-accent'

/**
 * Server-rendered hero: copy and calls to action on the left, a framed
 * cut-out photo on the right standing in front of a drifting ASCII field.
 * Only the greeting, the buttons and the field need the browser, so the
 * headline and paragraph are in the initial HTML.
 *
 * The frame and the photo share the same left edge maths but not the same
 * box: the photo is taller than the frame, so the head rises out of it.
 */
export function HeroSection({ copy }: HeroSectionProps) {
  return (
    <section data-hero className="relative grid min-h-[calc(100svh-var(--header-height))] items-center border-b border-dashed border-line px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:px-10">
      <div className="relative z-[2] py-15 lg:left-[3.125rem]">
        <p className="mb-7.5 text-sm uppercase tracking-[0.3em] text-fg-fainter">
          {copy.welcome}
        </p>

        <h1 className="m-0 text-balance font-display text-[clamp(3.75rem,9.6vw,10.5rem)] font-extrabold leading-[0.9] tracking-[-0.035em] text-fg">
          <HeroGreeting greetings={copy.greetings} epithets={copy.epithets} />
        </h1>

        <p className="mt-[2.375rem] max-w-[44ch] text-[1.1875rem] leading-[1.8] text-fg-dim">
          {copy.paragraph}
        </p>

        <HeroActions copy={copy.cta} />
      </div>

      <div className="pointer-events-none relative h-[34rem] lg:h-[calc(100svh-var(--header-height))] lg:min-h-[35rem]">
        <div className="absolute bottom-[10%] left-1/2 h-[64%] w-[min(27.5rem,86%)] -translate-x-[44%]">
          <div className="absolute inset-0 overflow-hidden border border-dashed border-moss bg-panel">
            <HeroField />
          </div>
          <span aria-hidden className={`${CORNER} -left-[0.3125rem] -top-[0.5625rem]`}>+</span>
          <span aria-hidden className={`${CORNER} -right-[0.3125rem] -top-[0.5625rem]`}>+</span>
          <span aria-hidden className={`${CORNER} -bottom-[0.4375rem] -left-[0.3125rem]`}>+</span>
          <span aria-hidden className={`${CORNER} -bottom-[0.4375rem] -right-[0.3125rem]`}>+</span>

          <p
            aria-hidden
            className="absolute inset-x-0 -bottom-[1.875rem] flex gap-2.5 overflow-hidden whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.2em] text-fg-ghost"
          >
            <span className="text-moss">└─</span>
            <span>~/zelph.png</span>
            <span className="section-rule text-line">{'─'.repeat(120)}</span>
          </p>
        </div>

        <div className="absolute bottom-[10%] left-1/2 h-[84%] w-[min(22.5rem,70%)] -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(180deg,#000_72%,transparent_100%)]">
          <Image
            src="/hero/zelph.png"
            alt={copy.photoAlt}
            width={285}
            height={950}
            priority
            sizes="(min-width: 64rem) 28rem, 70vw"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </section>
  )
}
