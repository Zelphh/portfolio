interface ProjectStatusProps {
  label: string
  className?: string
}

/**
 * Marks a project that is still being built.
 *
 * Warm rather than accent-coloured, so it reads as a state of the project
 * instead of competing with the call to action the card already carries. The
 * pulsing dot says "still moving" without a date that would go stale, and it
 * stands still for visitors who asked for less motion.
 */
export function ProjectStatus({ label, className }: ProjectStatusProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-warn/45 bg-warn/10 px-2.5 py-1 text-[10px] uppercase leading-none tracking-[0.18em] text-warn ${className ?? ''}`}
    >
      <span
        aria-hidden
        className="size-[5px] shrink-0 animate-pulse rounded-full bg-warn motion-reduce:animate-none"
      />
      {label}
    </span>
  )
}
