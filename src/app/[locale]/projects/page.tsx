import type { Metadata } from 'next'
import Link from 'next/link'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { ProjectsExplorer } from '@/components/projects-page/projects-explorer'
import { LOGO_MARK, SITE } from '@/content/site'
import { getDictionary, otherLocale } from '@/i18n'
import { LOCALES, toLocale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const { projects } = getDictionary(locale)

  return {
    title: projects.pageTitle,
    description: projects.pageDescription,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: Object.fromEntries(
        LOCALES.map((code) => [
          code === 'pt' ? 'pt-BR' : 'en',
          `/${code}/projects`,
        ]),
      ),
    },
  }
}

export default async function ProjectsPage({ params }: PageProps) {
  const locale = toLocale((await params).locale)
  const dictionary = getDictionary(locale)
  const { projects, a11y } = dictionary

  return (
    <div className="min-h-screen bg-ink text-[#c9c9c4]">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-6 border-b border-dashed border-line bg-ink/90 px-6 backdrop-blur-md lg:px-10">
        <Link
          href={`/${locale}/#projetos`}
          className="text-[13px] text-fg-subtle transition-colors hover:text-fg"
        >
          {projects.back}
        </Link>

        <div className="hidden items-baseline gap-3 sm:flex">
          <pre aria-hidden className="m-0 text-[9px] leading-[1.05] text-moss-light">
            {LOGO_MARK}
          </pre>
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-fg-strong">
            {SITE.name}
          </span>
        </div>

        <LanguageToggle
          current={locale}
          path="/projects"
          otherLanguageName={getDictionary(otherLocale(locale)).meta.ogAlt}
          switchLabel={a11y.switchLanguage}
        />
      </header>

      <main>
        <ProjectsExplorer locale={locale} copy={projects} />
      </main>
    </div>
  )
}
