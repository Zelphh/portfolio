'use client'

import { useEffect, useState } from 'react'
import { greetingPeriodForHour, type GreetingPeriod } from '@/lib/greeting'
import type { Dictionary } from '@/i18n/types'

interface HeroGreetingProps {
  greetings: Dictionary['hero']['greetings']
  line2: string
}

/**
 * The only part of the hero that needs a browser: which of "good morning /
 * afternoon / evening" to show. The page is static — prerendered once at
 * build time, with no server left to read a clock from per visitor — so it
 * starts on the same "morning" pick both server and client render before
 * anything has mounted (avoiding a hydration mismatch), then the effect
 * swaps it for the visitor's own clock right after mount. That's a plain
 * state update, not a hydration pass, so it always takes — briefly showing
 * the placeholder is the trade-off for not running a server per visitor.
 */
export function HeroGreeting({ greetings, line2 }: HeroGreetingProps) {
  const [period, setPeriod] = useState<GreetingPeriod>('morning')

  useEffect(() => {
    setPeriod(greetingPeriodForHour(new Date().getHours()))
  }, [])

  return (
    <>
      <span>{greetings[period]}</span>
      <br />
      <span className="text-accent">{line2}</span>
    </>
  )
}
