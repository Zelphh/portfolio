import type { Localized } from '@/i18n/config'

/** How deeply the owner works with a skill. Drives colour and badge copy. */
export type SkillTier = 'pro' | 'secondary'

/**
 * Skills either show a static vendor icon or one of the animated ASCII
 * logos. Keeping this a tagged union means a card can never ask for both.
 */
export type SkillVisual =
  | { kind: 'icon'; src: string }
  | { kind: 'ascii'; logo: AsciiLogoName }

export type AsciiLogoName = 'react' | 'node' | 'git'

export interface Skill {
  readonly id: string
  readonly name: string
  readonly tier: SkillTier
  readonly visual: SkillVisual
  /** Small icon used by the marquee, which never renders ASCII. */
  readonly marqueeIcon: string
  readonly note: Localized<string>
  /** Bullet points. A single entry renders as a plain line, several as a list. */
  readonly blurb: Localized<readonly string[]>
}

/**
 * Card and dialog artwork.
 *
 * `logo` and `image` differ in how they are framed, not in file type: a logo
 * is transparent art that should float on the card's own surface, while an
 * image is an opaque screenshot that wants a dark backdrop behind its
 * letterbox bars. Screen recordings are served as-is and play muted, so they
 * never need controls or a soundtrack.
 */
export type ProjectCover =
  | { kind: 'logo'; src: string }
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string }

export interface Project {
  readonly id: string
  readonly year: string
  readonly stack: string
  readonly url: string
  /** Card artwork. Absent while a project has none, which draws a placeholder. */
  readonly cover?: ProjectCover
  /**
   * Dialog artwork, for when the wide hero wants a different shot than the
   * card does — an app icon on the card, a full screen inside. Falls back to
   * `cover`.
   */
  readonly hero?: ProjectCover
  readonly name: Localized<string>
  readonly summary: Localized<string>
  /** Long write-up. Paragraphs are separate entries, not `\n\n` in a string. */
  readonly story: Localized<readonly string[]>
}

export interface Certificate {
  readonly id: string
  readonly issuer: string
  readonly year: string
  readonly hours: string
  readonly url: string
  readonly name: Localized<string>
  readonly description: Localized<string>
}

export interface ContactChannel {
  readonly id: string
  readonly mark: string
  readonly name: string
  readonly handle: string
  readonly url: string
}

export interface TimelineEntry {
  readonly company: string | null
  readonly role: Localized<string>
  /**
   * When the stint started and ended, printed in the gutter to the left of
   * the rule. `null` on the open-ended last entry, which has no dates.
   */
  readonly period: {
    readonly start: Localized<string>
    readonly end: Localized<string>
  } | null
  /** The open-ended last entry, drawn with an arrow and a blinking cursor. */
  readonly current: boolean
}
