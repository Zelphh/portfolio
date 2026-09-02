'use client'

import { SectionHeading } from '@/components/ui/section-heading'
import { SKILLS } from '@/content/skills'
import { useRingCarousel } from '@/hooks/use-ring-carousel'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/types'
import { SkillMarquee } from './skill-marquee'
import { SkillShowcase } from './skill-showcase'
import { SkillWheel } from './skill-wheel'
import { TierLegend } from './tier-legend'

interface SkillsSectionProps {
  locale: Locale
  label: string
  copy: Dictionary['skills']
  logoLabelTemplate: string
}

export function SkillsSection({
  locale,
  label,
  copy,
  logoLabelTemplate,
}: SkillsSectionProps) {
  const wheel = useRingCarousel(SKILLS.length)
  const skill = SKILLS[wheel.index] as (typeof SKILLS)[number]

  const step = (direction: 1 | -1) =>
    direction === 1 ? wheel.next() : wheel.previous()

  return (
    <section
      id="skills"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-11">
          <TierLegend copy={copy} />
        </SectionHeading>

        <div className="grid min-h-[300px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-15">
          <SkillShowcase
            skill={skill}
            locale={locale}
            tierLabel={skill.tier === 'pro' ? copy.tierPro : copy.tierSecondary}
            logoLabelTemplate={logoLabelTemplate}
          />

          <SkillWheel
            skills={SKILLS}
            position={wheel.position}
            activeIndex={wheel.index}
            onSelect={wheel.goTo}
            onStep={step}
            label={copy.listLabel}
          />
        </div>

        <SkillMarquee
          skills={SKILLS}
          activeIndex={wheel.index}
          onSelect={wheel.goTo}
        />
      </div>
    </section>
  )
}
