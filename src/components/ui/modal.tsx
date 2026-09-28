'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/** Upper bound on the exit animation, in case `animationend` never arrives. */
const EXIT_FALLBACK_MS = 400

interface ModalProps {
  onClose: () => void
  closeLabel: string
  children: ReactNode
  /**
   * `panel` is a card with a terminal-style title bar (a bottom sheet on
   * phones); `lightbox` is bare content with a floating close button.
   */
  variant?: 'panel' | 'lightbox'
  /** Title bar text for a panel, e.g. `~/projects/spatium.md`. */
  path?: string
  /** Panel width on larger screens, as a CSS length. */
  width?: string
  /** Element the lightbox grows out of, and shrinks back into on close. */
  origin?: DOMRect | null
  labelledBy?: string
  label?: string
}

/**
 * The one overlay every modal on the site is built from.
 *
 * A native `<dialog>` opened with `showModal()`, so the browser supplies the
 * top layer (nested modals stack without z-indexes), the focus trap and
 * escape. On top of that it adds an exit animation: closing — by escape,
 * backdrop, or the close button — marks the dialog `data-closing` and only
 * calls `onClose` once the CSS exit animation has finished. Styles live in
 * `globals.css` under "Modals".
 */
export function Modal({
  onClose,
  closeLabel,
  children,
  variant = 'panel',
  path,
  width,
  origin,
  labelledBy,
  label,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const pressedBackdrop = useRef(false)
  const finished = useRef(false)
  const [closing, setClosing] = useState(false)

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Layout effect: the dialog has to be open, and the lightbox's origin
  // measured, before the first paint, or the enter animation starts late.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!dialog.open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null
      dialog.showModal()
    }
    closeRef.current?.focus()

    if (variant === 'lightbox' && origin) {
      const target = dialog.getBoundingClientRect()
      const scale = Math.min(origin.width / target.width, 1)

      dialog.style.setProperty(
        '--modal-from-x',
        `${origin.left + origin.width / 2 - (target.left + target.width / 2)}px`,
      )
      dialog.style.setProperty(
        '--modal-from-y',
        `${origin.top + origin.height / 2 - (target.top + target.height / 2)}px`,
      )
      dialog.style.setProperty('--modal-from-scale', String(scale))
    }
  }, [variant, origin])

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true

    dialogRef.current?.close()
    if (previouslyFocused.current?.isConnected) {
      previouslyFocused.current.focus({ preventScroll: true })
    }
    onCloseRef.current()
  }, [])

  const requestClose = useCallback(() => setClosing(true), [])

  useEffect(() => {
    if (!closing) return
    const timer = window.setTimeout(finish, EXIT_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [closing, finish])

  // A click only counts as a backdrop click if it also started there, so a
  // text selection dragged out of the panel does not dismiss it.
  const isOutside = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget
    if (event.target !== dialog) return false

    const rect = dialog.getBoundingClientRect()
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
  }

  const closeButton = (
    <button
      ref={closeRef}
      type="button"
      onClick={requestClose}
      aria-label={closeLabel}
      className={cn(
        'flex flex-none items-center gap-2 rounded-[10px] border border-line-strong text-xs text-fg-dim transition-colors hover:border-accent-dim hover:text-accent',
        variant === 'panel'
          ? 'px-2 py-1'
          : 'absolute -right-3 -top-3 bg-scrim-soft px-2.5 py-1.5 backdrop-blur-sm',
      )}
    >
      <kbd
        aria-hidden
        className="hidden rounded border border-line px-1 font-mono text-[10px] leading-[1.4] text-fg-ghost sm:inline"
      >
        esc
      </kbd>
      [ x ]
    </button>
  )

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      aria-label={label}
      data-closing={closing || undefined}
      style={width ? ({ '--modal-width': width } as CSSProperties) : undefined}
      className={cn('modal', `modal-${variant}`)}
      onCancel={(event) => {
        // Escape: run the exit animation instead of vanishing.
        event.preventDefault()
        requestClose()
      }}
      onClose={() => {
        // Only reached when the browser closes the dialog itself (e.g. a
        // repeated escape it refuses to let us cancel). Skip the animation.
        if (!dialogRef.current?.open) finish()
      }}
      onPointerDown={(event) => {
        pressedBackdrop.current = isOutside(event)
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && isOutside(event)) requestClose()
        pressedBackdrop.current = false
      }}
      onAnimationEnd={(event) => {
        if (
          closing &&
          event.target === event.currentTarget &&
          event.animationName.startsWith('modal-out')
        ) {
          finish()
        }
      }}
    >
      {variant === 'panel' ? (
        <>
          <div className="flex flex-none items-center gap-2.5 border-b border-line-soft py-2 pl-3.5 pr-2">
            <span aria-hidden className="h-[9px] w-[9px] flex-none rounded-full bg-accent" />
            <span aria-hidden className="h-[9px] w-[9px] flex-none rounded-full bg-moss" />
            <span aria-hidden className="h-[9px] w-[9px] flex-none rounded-full bg-line" />
            <span className="min-w-0 flex-1 truncate text-center text-[11px] tracking-[0.12em] text-fg-fainter">
              {path}
            </span>
            {closeButton}
          </div>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </>
      ) : (
        <>
          {children}
          {closeButton}
        </>
      )}
    </dialog>
  )
}
