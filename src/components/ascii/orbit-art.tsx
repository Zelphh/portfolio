'use client'

import { useCallback, useEffect, useRef } from 'react'
import {
  ORBIT_COLORS,
  ORBIT_SETTLED,
  OrbitField,
  type OrbitPlanet,
} from '@/lib/ascii/orbit'
import { cn } from '@/lib/utils'
import { AsciiCanvas } from './ascii-canvas'

const GLOWS = ['blur-[3px] opacity-60', 'blur-[12px] opacity-40'] as const

interface OrbitArtProps {
  label: string
  planets: readonly OrbitPlanet[]
  /** A planet focused from outside (hovering it in the list), or `null`. */
  focus: number | null
  /** The planet under the pointer changed. */
  onHover: (index: number | null) => void
  /** A planet was clicked or tapped. */
  onSelect: (index: number) => void
  className?: string
}

/**
 * The projects as planets (see `@/lib/ascii/orbit`). The canvas feeds the
 * pointer to the field, which works out which planet is under it; this
 * wrapper turns that into a pointer cursor, a hover callback and a click.
 */
export function OrbitArt({
  label,
  planets,
  focus,
  onHover,
  onSelect,
  className,
}: OrbitArtProps) {
  const fieldRef = useRef<OrbitField | null>(null)
  const focusRef = useRef(focus)
  focusRef.current = focus
  const hoverRef = useRef<number | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const createField = useCallback(
    (cols: number, rows: number, aspect: number) => {
      const field = new OrbitField(cols, rows, aspect, planets)
      field.focus(focusRef.current)
      fieldRef.current = field
      return field
    },
    [planets],
  )

  useEffect(() => {
    fieldRef.current?.focus(focus)
  }, [focus])

  // Runs after the canvas has handed the pointer to the field (bubbling).
  const syncHover = () => {
    const hovered = fieldRef.current?.hovered ?? null
    if (boxRef.current) {
      boxRef.current.style.cursor = hovered === null ? '' : 'pointer'
    }
    if (hovered !== hoverRef.current) {
      hoverRef.current = hovered
      onHover(hovered)
    }
  }

  return (
    <div
      ref={boxRef}
      onPointerMove={syncHover}
      onPointerDown={syncHover}
      onPointerLeave={syncHover}
      onClick={() => {
        const hovered = fieldRef.current?.hovered
        if (hovered !== null && hovered !== undefined) onSelect(hovered)
      }}
      className={cn('relative', className)}
    >
      <AsciiCanvas
        label={label}
        createField={createField}
        colors={ORBIT_COLORS}
        fps={30}
        fontPx={10}
        trail={0.35}
        stillAt={ORBIT_SETTLED}
        glows={GLOWS}
      />
    </div>
  )
}
