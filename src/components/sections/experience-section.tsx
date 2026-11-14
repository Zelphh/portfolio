import { BlackHoleArt, LandscapeArt } from "@/components/ascii";
import { SectionHeading } from "@/components/ui/section-heading";
import { EXPERIENCE } from "@/content/experience";
import { NEXT_STEP } from "@/content/timeline";
import type { ExperienceEntry } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/utils";
import { TimelineMotion, TypedText } from "./experience-motion";

interface ExperienceLogProps {
  locale: Locale;
  label: string;
  copy: Dictionary["experience"];
  grassLabel: string;
}

/** Consecutive roles at one company, newest first, as `EXPERIENCE` lists them. */
interface CompanyStint {
  readonly company: string;
  readonly roles: readonly ExperienceEntry[];
}

/**
 * Folds back-to-back roles at the same company into one stint, so a
 * promotion reads as one branch with sub-branches instead of two jobs.
 */
function groupByCompany(entries: readonly ExperienceEntry[]): CompanyStint[] {
  const stints: { company: string; roles: ExperienceEntry[] }[] = [];
  for (const entry of entries) {
    const last = stints.at(-1);
    if (last?.company === entry.company) last.roles.push(entry);
    else stints.push({ company: entry.company, roles: [entry] });
  }
  return stints;
}

/**
 * Shared by every node on the rule, so the glyphs line up with the period.
 * `data-lit` is set by `TimelineMotion` once the drawn line reaches it.
 */
const NODE =
  "absolute left-0 top-0 z-[2] -translate-x-1/2 bg-ink px-1 text-[0.8125rem] leading-[1.5] transition-colors duration-500";

const PERIOD_LINE = "text-[0.8125rem] leading-[1.5] tracking-[0.08em]";

/** `start → end`, the arrow dimmed, as `TypedText` parts. */
function periodParts(start: string, end: string) {
  return [
    { text: start },
    { text: " → ", className: "text-line-bright" },
    { text: end },
  ];
}

function RoleDetails({
  role,
  locale,
}: {
  role: ExperienceEntry;
  locale: Locale;
}) {
  const highlights = role.highlights[locale];

  return (
    <>
      {highlights.length > 0 && (
        <ul className="grid max-w-[72ch] gap-1.5 text-[0.9375rem] leading-[1.8] text-fg-muted">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span aria-hidden className="text-moss-light">
                ›
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      {role.stack.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {role.stack.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-line-strong px-2.5 py-[0.3125rem] text-[0.6875rem] tracking-[0.12em] text-fg-subtle"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Work history as a career tree, its own section below the bio: every
 * company hangs off one dashed rule, newest first, with the current one
 * marked and an open invitation closing the tree. Several roles at the same
 * company (a promotion) branch off it as `├─` / `└─` sub-branches.
 *
 * The tree is plain server-rendered HTML; `TimelineMotion` adds the motion on
 * top (the line drawing itself on scroll, nodes lighting up, entries fading
 * in) and `TypedText` types the dates. The landscape runs along the bottom edge.
 */
export function ExperienceLog({
  locale,
  label,
  copy,
  grassLabel,
}: ExperienceLogProps) {
  const stints = groupByCompany(EXPERIENCE);

  return (
    <section
      id="experiencia"
      className="border-b border-dashed border-line px-6 py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[73.75rem]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
          <SectionHeading label={label} className="mb-11 lg:col-start-1" />

          <TimelineMotion className="ml-1.5 lg:col-start-1">
            <ol className="grid">
              {stints.map((stint) => {
                const newest = stint.roles[0]!;
                const oldest = stint.roles.at(-1)!;
                const current = stint.roles.some((role) => role.current);
                const promoted = stint.roles.length > 1;

                return (
                  <li
                    key={newest.id}
                    data-timeline-entry
                    className="relative grid gap-3 border-l border-dashed border-line-bright pb-12 pl-8"
                  >
                    <span
                      aria-hidden
                      data-timeline-node
                      className={cn(
                        NODE,
                        current
                          ? "text-accent data-lit:animate-node-pulse"
                          : "text-fg-fainter data-lit:text-accent",
                      )}
                    >
                      {current ? "◆" : "·"}
                    </span>

                    <p
                      className={cn(
                        PERIOD_LINE,
                        current ? "text-accent" : "text-fg-fainter",
                      )}
                    >
                      <TypedText
                        parts={periodParts(
                          oldest.period.start[locale],
                          newest.period.end[locale],
                        )}
                      />
                    </p>

                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="font-display text-[1.625rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-fg">
                          {stint.company}
                        </h3>
                        {!promoted && (
                          <span className="text-[0.9375rem] text-fg-dim">
                            {newest.role[locale]}
                          </span>
                        )}
                        {current && (
                          <span className="rounded-md border border-accent-dim px-2 py-[0.1875rem] text-[0.625rem] uppercase tracking-[0.22em] text-accent">
                            {copy.current}
                          </span>
                        )}
                      </div>

                      {promoted ? (
                        <ol className="mt-1 grid">
                          {stint.roles.map((role, i) => {
                            const isOldest = i === stint.roles.length - 1;

                            return (
                              <li
                                key={role.id}
                                data-timeline-entry
                                className="group/role relative grid gap-2.5 pb-8 pl-8 last:pb-0"
                              >
                                {/* The sub-rule down to the next role. */}
                                <span
                                  aria-hidden
                                  className="absolute bottom-0 left-0 top-0 border-l border-dashed border-line-bright group-last/role:hidden"
                                />
                                {/* The elbow into this role: ├─ or └─. */}
                                <span
                                  aria-hidden
                                  data-timeline-node
                                  className="absolute left-0 top-0 h-[0.8125rem] w-5 rounded-bl-[0.1875rem] border-b border-l border-dashed border-line-bright transition-colors duration-500 data-lit:border-accent-dim"
                                />

                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                  <span className="text-[1.0625rem] font-semibold leading-[1.5] text-fg-strong">
                                    {role.role[locale]}
                                  </span>
                                  <span
                                    className={cn(
                                      PERIOD_LINE,
                                      "text-[0.75rem]",
                                      role.current
                                        ? "text-accent"
                                        : "text-fg-fainter",
                                    )}
                                  >
                                    <TypedText
                                      parts={periodParts(
                                        role.period.start[locale],
                                        role.period.end[locale],
                                      )}
                                    />
                                  </span>
                                  {!isOldest && (
                                    <span className="text-[0.6875rem] tracking-[0.12em] text-moss-light">
                                      <span aria-hidden>↑ </span>
                                      {copy.promoted}
                                    </span>
                                  )}
                                </div>

                                <RoleDetails role={role} locale={locale} />
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <RoleDetails role={newest} locale={locale} />
                      )}
                    </div>
                  </li>
                );
              })}

              <li
                data-timeline-entry
                className="relative pl-8 text-[0.9375rem] leading-[1.3] text-accent"
              >
                <span aria-hidden data-timeline-node className={NODE}>
                  →
                </span>
                {NEXT_STEP[locale]}
                <span aria-hidden className="animate-blink">
                  _
                </span>
              </li>
            </ol>
          </TimelineMotion>

          {/* Beside the tree on wide screens only. The column spans the
            heading and the tree, and its negative margins stretch it from the
            section's top edge (through the `lg:py-28` padding) down to where
            the grass starts (its `-2.875rem` overlap), so the art sits dead
            centre between the two. Credit is a condition of the art's
            licence; it hangs below the art so it does not shift the centre. */}
          <aside className="hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mb-[2.875rem] lg:-mt-28 lg:flex lg:items-center">
            <figure className="relative w-full">
              <div className="aspect-[9/8] [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_78%)]">
                <BlackHoleArt label={copy.blackHole} />
              </div>
              <figcaption className="absolute right-0 top-full mt-3 text-[0.6875rem] tracking-[0.08em] text-fg-ghost">
                {copy.blackHoleCredit}{" "}
                <a
                  href="https://instagram.com/jin_22ee"
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg-faint transition-colors hover:text-accent"
                >
                  @jin_22ee
                </a>
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>

      <div className="pointer-events-none -mx-6 -mb-24 mt-[-2.875rem] lg:-mx-10 lg:-mb-28">
        <LandscapeArt label={grassLabel} />
      </div>
    </section>
  );
}
