import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { AboutSection } from '@/components/sections/about-section'
import { CertificatesSection } from '@/components/sections/certificates/certificates-section'
import { ContactSection } from '@/components/sections/contact-section'
import { HeroSection } from '@/components/sections/hero-section'
import { ProjectsSection } from '@/components/sections/projects/projects-section'
import { SkillsSection } from '@/components/sections/skills/skills-section'
import { CommandDock } from '@/components/widgets/command-dock'
import { ConsoleBusProvider } from '@/components/widgets/console-bus'
import { getDictionary, otherLocale } from '@/i18n'
import { toLocale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const locale = toLocale((await params).locale)
  const dictionary = getDictionary(locale)
  const { sections, a11y } = dictionary

  return (
    // Console commands reach the carousels, the bonfire and the footer board
    // through this provider, so it wraps the page rather than just the dock.
    // Everything inside stays server-rendered — it only passes children on.
    <ConsoleBusProvider>
      <div className="min-h-screen bg-ink text-[#c9c9c4]">
        <a
          href="#sobre"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          {a11y.skipToContent}
        </a>

        <SiteHeader
          locale={locale}
          labels={dictionary.nav}
          otherLanguageName={getDictionary(otherLocale(locale)).meta.ogAlt}
          switchLabel={a11y.switchLanguage}
        />

        <main>
          <HeroSection copy={dictionary.hero} bonfireLabel={a11y.bonfire} />

          <AboutSection
            locale={locale}
            copy={dictionary.about}
            label={sections.sobre}
            timelineLabel={a11y.timeline}
            grassLabel={a11y.grass}
          />

          <SkillsSection
            locale={locale}
            label={sections.skills}
            copy={dictionary.skills}
            logoLabelTemplate={a11y.logo}
          />

          <ProjectsSection
            locale={locale}
            label={sections.projetos}
            copy={dictionary.projects}
          />

          <CertificatesSection
            locale={locale}
            label={sections.certificados}
            copy={dictionary.certificates}
          />

          <ContactSection label={sections.contato} />
        </main>

        <SiteFooter copy={dictionary.footer} />

        <CommandDock
          locale={locale}
          terminal={dictionary.terminal}
          dock={dictionary.dock}
        />
      </div>
    </ConsoleBusProvider>
  )
}
