import { LogoArt } from '@/components/ascii'
import { TierBadge } from '@/components/ui/tier-badge'
import type { Skill } from '@/content/types'
import { format } from '@/i18n/format'
import type { Locale } from '@/i18n/config'

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
      {skill.visual.kind === 'ascii' ? (
        <div className="-mb-3.5 h-[230px] w-[300px] flex-none">
          <LogoArt
            logo={skill.visual.logo}
            label={format(logoLabelTemplate, { name: skill.name })}
          />
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element --
           Local, already-minimal SVGs: the image optimizer cannot improve a
           1 kB vector and would only add a request through /_next/image. */
        <img
          src={skill.visual.src}
          alt=""
          width={60}
          height={60}
          loading="lazy"
          decoding="async"
          className="block h-[60px] w-[60px] flex-none"
        />
      )}

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

        <span className="max-w-[46ch] text-sm leading-[1.8] text-fg-dim">
          {skill.blurb[locale]}
        </span>
      </div>
    </div>
  )
}
