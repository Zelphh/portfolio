import { SectionHeading } from '@/components/ui/section-heading'
import { NOW, NOW_UPDATED } from '@/content/now'
import { SITE } from '@/content/site'
import type { NowTag } from '@/content/types'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import type { ContributionCalendar } from '@/lib/github'
import { cn } from '@/lib/utils'
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
          <p className="grow text-pretty text-sm leading-[1.8] text-fg-faint">
            {copy.intro}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-moss-light">
            {format(copy.updated, { date: NOW_UPDATED[locale] })}
          </p>
        </div>

        <ul className="grid gap-3.5">
          {NOW.map((entry) => (
            <li
              key={entry.id}
              className="group relative grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3.5 overflow-hidden rounded-[15px] border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent-dim sm:grid-cols-[auto_150px_1fr] sm:gap-x-7"
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-surface-raised">
                {/* eslint-disable-next-line @next/next/no-img-element --
                    Local, already-minimal SVGs: the optimizer cannot improve
                    a 1 kB vector and would only add a request through
                    /_next/image. */}
                <img
                  src={entry.icon}
                  alt=""
                  aria-hidden
                  width={22}
                  height={22}
                  loading="lazy"
                  decoding="async"
                  className="block size-[22px]"
                />
              </span>

              <span className="text-[10px] uppercase tracking-[0.22em] text-moss-light">
                {entry.label[locale]}
              </span>

              {/* On narrow screens the icon and the label take the first row
                  on their own and the copy drops under both of them. */}
              <div className="relative col-span-2 grid gap-3 sm:col-span-1 sm:content-center sm:self-stretch">
                <p className="text-pretty text-sm leading-[1.8] text-fg-muted">
                  {entry.text[locale]}
                </p>

                <ul className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag.label}
                      className="rounded-full border border-line-strong px-2.5 py-[5px] text-[11px] tracking-[0.12em] text-fg-subtle"
                    >
                      {tag.label}
                    </li>
                  ))}
                </ul>

                <TagPanel tags={entry.tags} />
              </div>
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

/**
 * The hover state: the accent eats the card from the right edge inward and
 * leaves the tags behind as marks, so a glance at a hovered line reads as
 * logos rather than prose.
 *
 * It is a sibling of the copy rather than an overlay on the whole card: the
 * panel bleeds out to the card's padding on every side it touches, so the
 * wipe stops exactly where the text column starts and the icon and label
 * stay readable under it. Tags the icon set has no mark for keep their word.
 */
function TagPanel({ tags }: { tags: readonly NowTag[] }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute -bottom-6 -left-6 -right-6 top-0 bg-accent sm:-top-6 sm:left-0',
        // The leading edge is a semicircle rather than a straight cut: the
        // radius is deliberately larger than any card, so CSS scales it down
        // to exactly half the panel's height whatever the copy does to it,
        // and the nose stays round through the whole wipe instead of only
        // at rest.
        '[clip-path:inset(0_0_0_100%_round_9999px_0_0_9999px)]',
        'transition-[clip-path] duration-[450ms] ease-[var(--ease-out-soft)]',
        'group-hover:[clip-path:inset(0_0_0_0%_round_9999px_0_0_9999px)]',
        'motion-reduce:transition-none',
      )}
    >
      {/* The extra left padding is what the curve buys: the first mark sits
          clear of the nose instead of riding on it. */}
      <ul className="flex h-full flex-wrap items-center gap-2.5 py-6 pl-8 pr-6">
        {tags.map((tag) => (
          <li
            key={tag.label}
            className={cn(
              'flex items-center gap-2 rounded-full bg-ink py-2 pl-2.5 pr-3.5',
              'translate-x-3 opacity-0 transition-[opacity,translate] duration-300',
              'group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-150',
              'motion-reduce:transition-none',
            )}
          >
            {tag.icon && (
              /* eslint-disable-next-line @next/next/no-img-element --
                 Local, already-minimal SVGs; see SkillShowcase for why these
                 skip the image optimizer. */
              <img
                src={tag.icon}
                alt=""
                width={18}
                height={18}
                loading="lazy"
                decoding="async"
                className="block size-[18px] flex-none"
              />
            )}
            <span className="text-[11px] uppercase tracking-[0.16em] text-accent">
              {tag.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
