'use client'

import { useEffect, useState } from 'react'
import { greetingPeriodForHour, type GreetingPeriod } from '@/lib/greeting'
import type { Dictionary } from '@/i18n/types'

interface HeroGreetingProps {
  greetings: Dictionary['hero']['greetings']
  epithets: Dictionary['hero']['epithets']
}

/** How long each epithet stays on screen before the next one rises in. */
const EPITHET_INTERVAL_MS = 3500

/**
 * The only part of the hero that needs a browser: which of "good morning /
 * afternoon / evening" to show. The page is static — prerendered once at
 * build time, with no server left to read a clock from per visitor — so it
 * starts on the same "morning" pick both server and client render before
 * anything has mounted (avoiding a hydration mismatch), then the effect
 * swaps it for the visitor's own clock right after mount. That's a plain
 * state update, not a hydration pass, so it always takes — briefly showing
 * the placeholder is the trade-off for not running a server per visitor.
 *
 * The second line cycles through the epithets in dictionary order, starting
 * on the first one so the prerendered HTML matches the first client render.
 */
export function HeroGreeting({ greetings, epithets }: HeroGreetingProps) {
  const [period, setPeriod] = useState<GreetingPeriod>('morning')
  const [epithetIndex, setEpithetIndex] = useState(0)

  useEffect(() => {
    setPeriod(greetingPeriodForHour(new Date().getHours()))
  }, [])

  useEffect(() => {
    if (epithets.length < 2) return
    const timer = setInterval(
      () => setEpithetIndex((i) => (i + 1) % epithets.length),
      EPITHET_INTERVAL_MS,
    )
    return () => clearInterval(timer)
  }, [epithets.length])

  return (
    <>
      {greetings[period]}
      <br />
      <span className="text-accent">
        {/* Keyed so each swap remounts the word and replays the rise. */}
        <span key={epithetIndex} className="inline-block animate-rise">
          {epithets[epithetIndex]}
        </span>
        !
      </span>
    </>
  )
}
