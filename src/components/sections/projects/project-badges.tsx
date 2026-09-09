interface ProjectBadgesProps {
  labels: readonly string[]
  className?: string
}

/**
 * Small claims about how a project was built, shown on the card and over the
 * dialog hero. Deliberately quieter than the accent colour: they qualify the
 * project, they are not the reason to look at it.
 */
export function ProjectBadges({ labels, className }: ProjectBadgesProps) {
  return (
    <span className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full border border-moss px-2.5 py-1 text-[10px] uppercase leading-none tracking-[0.18em] text-moss-light"
        >
          {label}
        </span>
      ))}
    </span>
  )
}
