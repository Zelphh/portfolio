'use client'

import { useMemo } from 'react'
import { CoffeeSimulation, COFFEE_FPS } from '@/lib/ascii/coffee'
import { AsciiStage } from './ascii-stage'

interface CoffeeArtProps {
  label: string
  className?: string
}

export function CoffeeArt({ label, className }: CoffeeArtProps) {
  // One simulation per mount; it carries the plume between frames.
  const simulation = useMemo(() => new CoffeeSimulation(), [])

  return (
    <AsciiStage
      label={label}
      fps={COFFEE_FPS}
      fontSize={13}
      onPointer={(point) => simulation.track(point)}
      onPress={(point) => simulation.swirl(point)}
      className={className}
      frame={() => {
        simulation.step()
        return simulation.toHtml()
      }}
    />
  )
}
