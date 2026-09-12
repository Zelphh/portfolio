import { BonfireArt } from '@/components/ascii'
import type { Dictionary } from '@/i18n/types'
import { HeroGreeting } from './hero-greeting'

interface HeroSectionProps {
  copy: Dictionary['hero']
  bonfireLabel: string
}

/**
 * Server-rendered hero. Only the bonfire is a client component, so the
 * headline and copy are in the initial HTML and paint before any JS runs.
 */
export function HeroSection({ copy, bonfireLabel }: HeroSectionProps) {
  return (
    <section className="relative grid min-h-[calc(100svh-var(--header-height))] items-center gap-0 border-b border-dashed border-line px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:pl-10 lg:pr-0">
      <div className="relative z-[2] py-16 lg:left-[50px]">
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-fg-fainter">
          {copy.welcome}
        </p>

        <h1 className="m-0 text-balance font-display text-[clamp(60px,9.6vw,168px)] font-extrabold leading-[0.9] tracking-[-0.035em] text-fg">
          <HeroGreeting greetings={copy.greetings} line2={copy.line2} />
        </h1>

        <p className="mt-9 max-w-[44ch] text-[19px] leading-[1.8] text-fg-dim">
          {copy.paragraph}
        </p>

        <p className="mt-11 flex items-center gap-3.5 text-sm text-fg-fainter">
          <span className="text-accent">&gt;</span>
          <span>{copy.scroll}</span>
          <span
            aria-hidden
            className="h-px w-[120px] bg-gradient-to-r from-moss to-transparent"
          />
        </p>
      </div>

      <div className="pointer-events-none relative h-[45svh] lg:h-[calc(100svh-var(--header-height))] lg:pt-20">
        <BonfireArt label={bonfireLabel} />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_62%,rgba(72,78,61,0.28),transparent_70%)]"
        />
      </div>
    </section>
  )
}
