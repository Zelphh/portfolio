'use client'

import { useMemo, useRef } from 'react'
import type { AsciiLogoName } from '@/content/types'
import { LOGO_SPECS } from '@/lib/ascii/logos'
import { PointCloudRenderer } from '@/lib/ascii/point-cloud'
import { AsciiStage } from './ascii-stage'

const FPS = 30
/** Radians added per frame — a full turn every ~7 seconds. */
const SPIN_STEP = 0.03

interface LogoArtProps {
  logo: AsciiLogoName
  label: string
}

/** One of the three rotating 3D logos, picked by name. */
export function LogoArt({ logo, label }: LogoArtProps) {
  const renderer = useMemo(
    () => new PointCloudRenderer(LOGO_SPECS[logo]),
    [logo],
  )
  const angleRef = useRef(0)

  return (
    <AsciiStage
      label={label}
      fps={FPS}
      frame={() => {
        const html = renderer.render(angleRef.current)
        angleRef.current += SPIN_STEP
        return html
      }}
    />
  )
}
