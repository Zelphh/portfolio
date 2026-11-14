'use client'

import {
  BLACK_HOLE_COLORS,
  BLACK_HOLE_FLASH,
  BlackHoleField,
} from '@/lib/ascii/black-hole'
import { AsciiCanvas } from './ascii-canvas'

const GLOWS = ['blur-[3px] opacity-75', 'blur-[11px] opacity-45'] as const

const createField = (cols: number, rows: number, aspect: number) =>
  new BlackHoleField(cols, rows, aspect)

interface BlackHoleArtProps {
  /** Screen-reader description; the art is `role="img"`. */
  label: string
  className?: string
}

/**
 * JIN2's ASCII black hole (see `@/lib/ascii/black-hole`). It plays its intro
 * (ring, glow, disk, flash) the first time it is on screen, then keeps
 * flowing. Like the original, each frame keeps 40% of the last one as a
 * trail, and a soft glow is added on top.
 */
export function BlackHoleArt({ label, className }: BlackHoleArtProps) {
  return (
    <AsciiCanvas
      label={label}
      className={className}
      createField={createField}
      colors={BLACK_HOLE_COLORS}
      fps={30}
      fontPx={10}
      trail={0.4}
      stillAt={BLACK_HOLE_FLASH + 5}
      glows={GLOWS}
    />
  )
}
