'use client'

import { COFFEE_COLORS, COFFEE_SETTLED, CoffeeField } from '@/lib/ascii/coffee'
import { AsciiCanvas } from './ascii-canvas'

const GLOWS = ['blur-[2px] opacity-50', 'blur-[10px] opacity-35'] as const

/** How far the steam may rise above the box: past the heading's rule. */
const BLEED_TOP = 128

const createField = (cols: number, rows: number, aspect: number, bleedRows: number) =>
  new CoffeeField(cols, rows, aspect, bleedRows)

interface CoffeeArtProps {
  label: string
  className?: string
}

/**
 * The cup of coffee beside the bio (see `@/lib/ascii/coffee`). Hovering
 * pushes the steam around and drags it with the cursor; a click blows it
 * outward and stirs the coffee.
 */
export function CoffeeArt({ label, className }: CoffeeArtProps) {
  return (
    <AsciiCanvas
      label={label}
      className={className}
      createField={createField}
      colors={COFFEE_COLORS}
      fps={30}
      fontPx={11}
      trail={0.3}
      stillAt={COFFEE_SETTLED}
      glows={GLOWS}
      bleedTop={BLEED_TOP}
    />
  )
}
