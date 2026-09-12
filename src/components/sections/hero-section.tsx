import { BonfireArt } from '@/components/ascii'
import type { Dictionary } from '@/i18n/types'
import { HeroGreeting } from './hero-greeting'

interface HeroSectionProps {
  copy: Dictionary['hero']
  bonfireLabel: string
}

/** Generic head-and-shoulders mark for the not-yet-filled-in photo spot. */
function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5.5 19.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    </svg>
  )
}

/**
 * Server-rendered hero. Only the bonfire is a client component, so the
 * headline and copy are in the initial HTML and paint before any JS runs.
 */
export function HeroSection({ copy, bonfireLabel }: HeroSectionProps) {
  return (
    <section className="relative grid min-h-[calc(100svh-var(--header-height))] items-center gap-0 border-b border-dashed border-line px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:pl-10 lg:pr-0">
      <div className="relative z-[2] py-8 lg:left-[50px]">
        <p className="mb-6 text-sm uppercase tracking-[0.3em] text-fg-fainter">
          {copy.welcome}
        </p>

        <h1 className="m-0 text-balance font-display text-[clamp(60px,9.6vw,168px)] font-extrabold leading-[0.9] tracking-[-0.035em] text-fg">
          <HeroGreeting greetings={copy.greetings} line2={copy.line2} />
        </h1>

        <div className="mt-6 flex items-start gap-3">
          <div
            aria-hidden
            className="grid h-20 w-20 flex-none place-items-center rounded-full border border-dashed border-line-strong text-fg-fainter"
          >
            <PersonIcon className="h-8 w-8" />
          </div>

          <p className="relative max-w-[44ch] rounded-[14px] border border-line-strong bg-surface px-4 py-3 text-[17px] leading-[1.6] text-fg-dim">
            <span
              aria-hidden
              className="absolute left-0 top-10 -ml-[7px] h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-b border-l border-line-strong bg-surface"
            />
            {copy.paragraph}
          </p>
        </div>

        <p className="mt-6 flex items-center gap-3.5 text-sm text-fg-fainter">
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
