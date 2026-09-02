'use client'

import { useMemo } from 'react'
import { BonfireSimulation, BONFIRE_FPS } from '@/lib/ascii/bonfire'
import { AsciiStage } from './ascii-stage'

interface BonfireArtProps {
  label: string
  overscale?: number
}

export function BonfireArt({ label, overscale = 1.25 }: BonfireArtProps) {
  // One simulation per mount; it carries heat and embers between frames.
  const simulation = useMemo(() => new BonfireSimulation(), [])

  return (
    <AsciiStage
      label={label}
      fps={BONFIRE_FPS}
      overscale={overscale}
      fontSize={14}
      frame={() => {
        simulation.step()
        return simulation.toHtml()
      }}
    />
  )
}
