'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LOGO_MARK, SITE } from '@/content/site'
import { SECTION_IDS, type SectionId } from '@/content/navigation'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'
import { LanguageToggle } from './language-toggle'

interface SiteHeaderProps {
  locale: Locale
  labels: Readonly<Record<SectionId, string>>
  otherLanguageName: string
  switchLabel: string
}

interface TabRect {
  x: number
  width: number
}

/**
 * Sticky header with a highlight that slides between nav items.
 *
 * The highlight is a single absolutely-positioned box animated with
 * `transform` and `width`, rather than a border on each link — one composited
 * element instead of five that restyle on every hover.
 */
export function SiteHeader({
  locale,
  labels,
  otherLanguageName,
  switchLabel,
}: SiteHeaderProps) {
  const { active, scrolled } = useScrollSpy()
  const scrollTo = useSmoothScroll()

  const navRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [rects, setRects] = useState<TabRect[] | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const measure = useCallback(() => {
    const measured = tabRefs.current.map((tab) =>
      tab ? { x: tab.offsetLeft, width: tab.offsetWidth } : null,
    )
    if (measured.some((rect) => rect === null)) return
    setRects(measured as TabRect[])
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    measure()
    // Font loading and viewport changes both move the tabs; watch the nav
    // itself rather than guessing at a timeout.
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    document.fonts?.ready.then(measure).catch(() => {})

    return () => observer.disconnect()
  }, [measure])

  const activeIndex = Math.max(SECTION_IDS.indexOf(active), 0)
  const shown = hovered ?? activeIndex
  const highlight = rects?.[activeIndex]

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-dashed border-line bg-ink/90 px-10 backdrop-blur-md',
        'transition-[padding] duration-300 ease-[var(--ease-out-soft)]',
        scrolled ? 'py-3' : 'py-[22px]',
      )}
    >
      <div className="flex items-baseline gap-3">
        <pre aria-hidden className="m-0 text-[9px] leading-[1.05] text-accent">
          {LOGO_MARK}
        </pre>
        <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-fg-strong">
          {SITE.name}
        </span>
      </div>

      <nav
        ref={navRef}
        onMouseLeave={() => setHovered(null)}
        className="relative hidden gap-1.5 text-[13px] md:flex"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 top-0 rounded-2xl border border-moss bg-surface-hover transition-[transform,width,opacity] duration-[280ms] ease-[var(--ease-out-soft)]"
          style={{
            transform: `translateX(${highlight?.x ?? 0}px)`,
            width: highlight?.width ?? 0,
            opacity: highlight ? 1 : 0,
          }}
        />
        {SECTION_IDS.map((id, index) => (
          <a
            key={id}
            href={`#${id}`}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            onMouseEnter={() => setHovered(index)}
            onClick={(event) => {
              event.preventDefault()
              scrollTo(id)
            }}
            className={cn(
              'relative z-[1] rounded-2xl px-3 py-[7px] transition-colors duration-200',
              index === shown ? 'text-accent' : 'text-fg-subtle',
            )}
          >
            [ {labels[id]} ]
          </a>
        ))}
      </nav>

      <LanguageToggle
        current={locale}
        otherLanguageName={otherLanguageName}
        switchLabel={switchLabel}
      />
    </header>
  )
}
