'use client'

import dynamic from 'next/dynamic'

/**
 * The footer board is purely decorative and sits below every section, so it
 * is loaded lazily and never server-rendered.
 */
export const TetrisBoard = dynamic(
  () => import('./tetris-board').then((m) => m.TetrisBoard),
  { ssr: false },
)
