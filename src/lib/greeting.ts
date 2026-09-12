export type GreetingPeriod = 'morning' | 'afternoon' | 'evening'

/**
 * Maps a 0-23 hour to a time-of-day bucket, morning starting at 5am and
 * evening taking both the night and the small hours.
 */
export function greetingPeriodForHour(hour: number): GreetingPeriod {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}
