'use client'

import { useCallback, useMemo, useState } from 'react'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import type { Dictionary } from '@/i18n/types'
import {
  bootLines,
  resumeLines,
  runCommand,
  type TerminalLine,
} from '@/lib/terminal'
import { cn } from '@/lib/utils'
import { QuickActionsPanel } from './quick-actions-panel'
import { TerminalPanel } from './terminal-panel'

type Panel = 'terminal' | 'actions' | null

interface CommandDockProps {
  /** Only the two slices the dock renders, so nothing unused is serialized. */
  terminal: Dictionary['terminal']
  dock: Dictionary['dock']
}

const TRIGGER_CLASS =
  'flex select-none items-center gap-2.5 rounded-full border border-line-strong bg-dock py-2.5 pl-3 pr-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-[border-color,transform] duration-250 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-moss'

/**
 * The floating bottom-left dock: a console and a short list of actions.
 *
 * Only one panel is ever open, so opening one closes the other. Command
 * behaviour lives in `lib/terminal`; this component only renders lines and
 * carries out the effects a command asks for.
 */
export function CommandDock({ terminal, dock }: CommandDockProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const [lines, setLines] = useState<TerminalLine[]>(() => bootLines(terminal))
  const [input, setInput] = useState('')
  const scrollTo = useSmoothScroll()

  const toggle = useCallback(
    (next: Exclude<Panel, null>) =>
      setPanel((current) => (current === next ? null : next)),
    [],
  )

  const submit = useCallback(() => {
    const { lines: output, effect } = runCommand(input, terminal)
    setInput('')

    if (effect?.type === 'clear') {
      setLines([])
      return
    }

    setLines((current) => [...current, ...output])
    if (effect?.type === 'scrollTo') scrollTo(effect.section, 520)
  }, [input, terminal, scrollTo])

  const downloadResume = useCallback(() => {
    setPanel('terminal')
    setLines((current) => [...current, ...resumeLines(terminal)])
  }, [terminal])

  const labels = useMemo(
    () => ({
      terminal: panel === 'terminal' ? dock.consoleClose : dock.consoleOpen,
      actions: panel === 'actions' ? dock.actionsClose : dock.actionsOpen,
    }),
    [panel, dock],
  )

  return (
    <div className="fixed bottom-6 left-6 z-[80] flex flex-col items-start gap-3 font-mono">
      <TerminalPanel
        open={panel === 'terminal'}
        copy={terminal}
        lines={lines}
        value={input}
        onChange={setInput}
        onSubmit={submit}
        onClose={() => setPanel(null)}
      />

      <QuickActionsPanel
        open={panel === 'actions'}
        copy={dock}
        onDownloadResume={downloadResume}
      />

      <button
        type="button"
        onClick={() => toggle('actions')}
        aria-expanded={panel === 'actions'}
        className={TRIGGER_CLASS}
      >
        <span
          aria-hidden
          className="grid h-[22px] w-[22px] place-items-center rounded-full bg-moss text-xs font-bold leading-none text-accent"
        >
          ✦
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-fg-dim">
          {labels.actions}
        </span>
      </button>

      <button
        type="button"
        onClick={() => toggle('terminal')}
        aria-expanded={panel === 'terminal'}
        className={cn(TRIGGER_CLASS)}
      >
        <span
          aria-hidden
          className="grid h-[22px] w-[22px] place-items-center rounded-full bg-accent text-[11px] font-bold leading-none text-ink"
        >
          &gt;_
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-fg-dim">
          {labels.terminal}
        </span>
      </button>
    </div>
  )
}
