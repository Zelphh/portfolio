import type { ReactNode } from 'react'

/** Long enough to run off the widest layout; overflow is clipped by CSS. */
const RULE = '─'.repeat(240)

interface SectionHeadingProps {
  label: string
  /** Optional adornment between the label and the rule, e.g. an info tooltip. */
  children?: ReactNode
  className?: string
}

/** The `label ─────────` heading that opens every section. */
export function SectionHeading({
  label,
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <h2 className="text-[0.8125rem] uppercase tracking-[0.28em] text-accent">
        {label}
      </h2>
      {children}
      <span aria-hidden className="section-rule">
        {RULE}
      </span>
    </div>
  )
}
