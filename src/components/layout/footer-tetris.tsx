'use client'

import { useEffect, useRef, useState } from 'react'
import { TetrisBoard } from '@/components/tetris'
import { useConsoleSignal } from '@/components/widgets/console-bus'
import { cn } from '@/lib/utils'

/** Block colours for the footer board, drawn from the site palette. */
const TETRIS_COLORS = ['#484E3D', '#77885d', '#E7E74A'] as const

/** How long the board stays turned up after the console points at it. */
const SPOTLIGHT_MS = 4000

/**
 * The board that plays itself behind the footer.
 *
 * It is decorative and dimmed by default — most visitors never scroll far
 * enough to notice it. The console's `tetris` command sends them here and
 * turns it up for a few seconds, which is the whole payoff of finding a
 * command that is not in `help`.
 */
export function FooterTetris() {
  const [spotlit, setSpotlit] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useConsoleSignal('tetris', () => {
    setSpotlit(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSpotlit(false), SPOTLIGHT_MS)
  })

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return (
    <div
      id="tetris"
      aria-hidden
      className="relative h-[340px] overflow-hidden border-t border-dashed border-line bg-panel"
    >
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          spotlit ? 'opacity-100' : 'opacity-80',
        )}
      >
        <TetrisBoard
          boardColor="rgba(255,255,255,0.035)"
          colors={TETRIS_COLORS}
          cellSize={30}
          gap={3}
          rounded={0}
          dropSpeed={2}
          movement={5}
        />
      </div>

      {/* Lifting the veil is what actually reveals the board. */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b from-ink via-[rgba(20,20,20,0.35)] to-[rgba(20,20,20,0.15)] transition-opacity duration-700',
          spotlit && 'opacity-30',
        )}
      />
    </div>
  )
}
