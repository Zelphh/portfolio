import type { StudyKind } from '@/content/types'

/**
 * Pill colours per kind, shared by the card and the dialog so an entry is
 * recognisable in both. A degree carries the accent, a course the moss
 * green the skills section already uses, an exam the warm sand.
 */
export const KIND_PILL: Readonly<Record<StudyKind, string>> = {
  degree: 'border-accent-dim text-accent',
  course: 'border-moss-dim text-moss-light',
  certification: 'border-sand-dim text-sand',
}
