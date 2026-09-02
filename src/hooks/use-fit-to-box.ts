'use client'

import { useCallback, useEffect, type RefObject } from 'react'

/**
 * Scales a fixed-size `<pre>` of ASCII art to fill its container.
 *
 * The art is authored at a fixed character grid, so instead of reflowing text
 * we measure it once and apply a CSS `scale`. That keeps the glyph grid
 * perfectly square at any viewport size and costs one composited transform
 * rather than a relayout.
 *
 * @param overscale Multiplier applied after the fit, to let art bleed past
 *                  its box on purpose (the hero bonfire does this).
 */
export function useFitToBox(
  artRef: RefObject<HTMLElement | null>,
  boxRef: RefObject<HTMLElement | null>,
  overscale = 1,
): () => void {
  const fit = useCallback(() => {
    const art = artRef.current
    const box = boxRef.current
    if (!art || !box) return

    // Measure unscaled, then re-apply the transform in one write.
    art.style.transform = 'translate(-50%,-50%)'
    const { offsetWidth, offsetHeight } = art
    if (!offsetWidth || !offsetHeight) return

    const scale =
      Math.min(box.clientWidth / offsetWidth, box.clientHeight / offsetHeight) *
      overscale
    art.style.transform = `translate(-50%,-50%) scale(${scale.toFixed(4)})`
  }, [artRef, boxRef, overscale])

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    const observer = new ResizeObserver(fit)
    observer.observe(box)
    fit()

    return () => observer.disconnect()
  }, [boxRef, fit])

  return fit
}
