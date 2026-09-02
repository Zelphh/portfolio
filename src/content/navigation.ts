/**
 * Section ids double as anchor targets, nav keys and terminal `goto`
 * arguments, so they are declared once here and reused everywhere.
 */
export const SECTION_IDS = [
  'sobre',
  'skills',
  'projetos',
  'certificados',
  'contato',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Pixels of sticky-header clearance to leave above a scroll target. */
export const SCROLL_OFFSET = 80

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value)
}
