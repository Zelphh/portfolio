'use client'

import {
  LANDSCAPE_COLORS,
  LANDSCAPE_SETTLED,
  LandscapeField,
} from '@/lib/ascii/landscape'
import { AsciiCanvas } from './ascii-canvas'

/** Fewer, softer glows than the black hole: greens wash out quickly. */
const GLOWS = ['blur-[2px] opacity-40', 'blur-[9px] opacity-30'] as const

const createField = (cols: number, rows: number, aspect: number) =>
  new LandscapeField(cols, rows, aspect)

interface LandscapeArtProps {
  label: string
}

/**
 * The full-width landscape strip (see `@/lib/ascii/landscape`). Twenty rows
 * tall whatever the width: the font is sized to the height and the number of
 * columns follows the width, so wider screens see more of the field.
 */
export function LandscapeArt({ label }: LandscapeArtProps) {
  return (
    <div className="h-[13.75rem]">
      <AsciiCanvas
        label={label}
      createField={createField}
      colors={LANDSCAPE_COLORS}
      fps={24}
      rows={20}
      trail={0.25}
      stillAt={LANDSCAPE_SETTLED}
      glows={GLOWS}
      />
    </div>
  )
}
