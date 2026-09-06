import { LogoArt } from '@/components/ascii'
import { TierBadge } from '@/components/ui/tier-badge'
import type { Skill } from '@/content/types'
import { format } from '@/i18n/format'
import type { Locale } from '@/i18n/config'

/**
 * Captures a bare URL while leaving sentence punctuation that trails it
 * outside the match, so `see https://x.com/y.` does not link the full stop.
 */
const URL_PATTERN = /(https?:\/\/[^\s]+[^\s.,;:!?)])/g

/** Splits a blurb line so any URL written inside it renders as an anchor. */
function linkify(line: string) {
  return line.split(URL_PATTERN).map((part, index) =>
    part.startsWith('http') ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noreferrer noopener"
        className="text-accent underline-offset-4 transition-colors hover:text-fg hover:underline"
      >
        {part}
      </a>
    ) : (
      part
    ),
  )
}

interface SkillShowcaseProps {
  skill: Skill
  locale: Locale
  tierLabel: string
  logoLabelTemplate: string
}

/** The large panel showing whichever skill the wheel has selected. */
export function SkillShowcase({
  skill,
  locale,
  tierLabel,
  logoLabelTemplate,
}: SkillShowcaseProps) {
  return (
    <div
      // Re-keying on the skill id restarts the entrance animation on change.
      key={skill.id}
      className="flex animate-rise flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-7"
    >
      {/* Both visual kinds share one box so the copy beside them starts at the
          same x-position, whichever kind the selected skill happens to use. */}
      <div className="-mb-3.5 h-[230px] w-[300px] flex-none">
        {skill.visual.kind === 'ascii' ? (
          <LogoArt
            logo={skill.visual.logo}
            label={format(logoLabelTemplate, { name: skill.name })}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element --
                Local, already-minimal SVGs: the image optimizer cannot improve
                a 1 kB vector and would only add a request through
                /_next/image. */}
            <img
              src={skill.visual.src}
              alt=""
              width={132}
              height={132}
              loading="lazy"
              decoding="async"
              className="block h-[132px] w-[132px]"
            />
          </div>
        )}
      </div>

      <div className="grid gap-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.28em] text-fg-fainter">
            {skill.note[locale]}
          </span>
          <TierBadge tier={skill.tier} label={tierLabel} />
        </div>

        <span className="font-display text-[clamp(34px,4vw,52px)] font-extrabold leading-none tracking-[-0.02em] text-fg">
          {skill.name}
        </span>

        {skill.blurb[locale].length > 1 ? (
          <ul className="grid max-w-[68ch] list-disc gap-1.5 pl-4 text-sm leading-[1.8] text-fg-dim marker:text-fg-fainter">
            {skill.blurb[locale].map((line) => (
              <li key={line}>{linkify(line)}</li>
            ))}
          </ul>
        ) : (
          <span className="max-w-[46ch] text-sm leading-[1.8] text-fg-dim">
            {linkify(skill.blurb[locale][0] ?? '')}
          </span>
        )}
      </div>
    </div>
  )
}
