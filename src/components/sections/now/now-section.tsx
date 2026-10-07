import { SectionHeading } from '@/components/ui/section-heading'
import { NOW, NOW_UPDATED } from '@/content/now'
import { SITE } from '@/content/site'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import type { ContributionCalendar } from '@/lib/github'
import { ContributionGraph } from './contribution-graph'

interface NowSectionProps {
  locale: Locale
  label: string
  copy: Dictionary['now']
  /** `null` when GitHub could not be reached at build time. */
  contributions: ContributionCalendar | null
  contributionsLabel: string
}

/**
 * What is on the desk right now, and the commit graph that backs it up.
 * The two share a section because each is thin alone: the list says what,
 * the graph shows it is actually happening. Without a calendar the graph
 * block is left out and the list stands on its own.
 */
export function NowSection({
  locale,
  label,
  copy,
  contributions,
  contributionsLabel,
}: NowSectionProps) {
  return (
    <section
      id="agora"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading label={label} className="mb-[18px]" />

        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="max-w-[56ch] text-pretty text-sm leading-[1.8] text-fg-faint">
            {copy.intro}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-moss-light">
            {format(copy.updated, { date: NOW_UPDATED[locale] })}
          </p>
        </div>

        <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {NOW.map((entry) => (
            <li
              key={entry.id}
              className="grid content-start gap-3 rounded-[15px] border border-line bg-surface p-6"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-moss-light">
                {entry.label[locale]}
              </span>
              <p className="text-pretty text-sm leading-[1.8] text-fg-muted">
                {entry.text[locale]}
              </p>
            </li>
          ))}
        </ul>

        {contributions && (
          <div className="mt-14">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-fg-fainter">
                {copy.githubTitle}
                <span className="text-line-bright"> · </span>
                <span className="normal-case tracking-[0.08em] text-fg-subtle">
                  @{SITE.github}
                </span>
              </h3>
              <a
                href={`https://github.com/${SITE.github}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[13px] text-accent transition-colors hover:text-fg"
              >
                {copy.githubLink}
              </a>
            </div>

            <div className="rounded-[15px] border border-line bg-surface p-6">
              <ContributionGraph
                calendar={contributions}
                locale={locale}
                copy={copy}
                label={format(contributionsLabel, {
                  total: contributions.total,
                })}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
