'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCommandHistory } from '@/hooks/use-command-history'
import { useConsoleHotkey } from '@/hooks/use-console-hotkey'
import { usePrintQueue } from '@/hooks/use-print-queue'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import type { Locale } from '@/i18n/config'
import { format } from '@/i18n/format'
import type { Dictionary } from '@/i18n/types'
import { rememberLocale } from '@/lib/locale-cookie'
import {
  bootLines,
  complete,
  line,
  runCommand,
  type TerminalEffect,
} from '@/lib/terminal'
import { cn } from '@/lib/utils'
import { useConsoleEmit } from './console-bus'
import { QuickActionsPanel } from './quick-actions-panel'
import { TerminalPanel } from './terminal-panel'

type Panel = 'terminal' | 'actions' | null

interface CommandDockProps {
  locale: Locale
  /** Only the two slices the dock renders, so nothing unused is serialized. */
  terminal: Dictionary['terminal']
  dock: Dictionary['dock']
}

const TRIGGER_CLASS =
  'flex select-none items-center gap-2.5 rounded-full border border-line-strong bg-dock py-2.5 pl-3 pr-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-[border-color,transform] duration-250 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-moss'

/**
 * The floating bottom-left dock: a console and a short list of actions.
 *
 * Only one panel is ever open, so opening one closes the other. What each
 * command prints lives in `lib/terminal`; this component owns the session —
 * the scrollback, the history, the clock `neofetch` reads — and carries out
 * the effects a command asks for, whether that is scrolling, switching
 * language or handing a signal to a section through the console bus.
 */
export function CommandDock({ locale, terminal, dock }: CommandDockProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const [input, setInput] = useState('')
  const [matrix, setMatrix] = useState(false)

  const output = usePrintQueue()
  const history = useCommandHistory()
  const scrollTo = useSmoothScroll()
  const emit = useConsoleEmit()
  const router = useRouter()

  const bootedAtRef = useRef(0)
  const printRef = useRef(output.print)
  printRef.current = output.print

  // The banner streams once per session. Booting from an effect rather than
  // the initial state keeps the server and the first client render identical;
  // the ref is what stops development's double-invoked effects from printing
  // it twice.
  useEffect(() => {
    if (bootedAtRef.current !== 0) return
    bootedAtRef.current = Date.now()
    printRef.current(bootLines(terminal), true)
  }, [terminal])

  const openTerminal = useCallback(() => setPanel('terminal'), [])
  const closePanel = useCallback(() => setPanel(null), [])

  const toggle = useCallback(
    (next: Exclude<Panel, null>) =>
      setPanel((current) => (current === next ? null : next)),
    [],
  )

  const toggleTerminal = useCallback(() => toggle('terminal'), [toggle])
  useConsoleHotkey({ toggle: toggleTerminal, open: openTerminal })

  const copyToClipboard = useCallback(
    (text: string, target: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          output.print([line(format(terminal.copyDone, { target }), 'accent')])
        })
        .catch(() => {
          output.print([line(terminal.copyFailed, 'error')])
        })
    },
    [output, terminal],
  )

  const apply = useCallback(
    (effect: TerminalEffect) => {
      switch (effect.type) {
        case 'clear':
          output.clear()
          break
        case 'close':
          closePanel()
          break
        case 'scrollTo':
          scrollTo(effect.section, 520)
          break
        case 'openProject':
          scrollTo('projetos', 520)
          emit({ type: 'openProject', index: effect.index })
          break
        case 'openCertificate':
          scrollTo('certificados', 520)
          emit({ type: 'openCertificate', index: effect.index })
          break
        case 'setLocale':
          rememberLocale(effect.locale)
          router.push(`/${effect.locale}`)
          break
        case 'copy':
          copyToClipboard(effect.text, effect.target)
          break
        case 'tetris':
          scrollTo('tetris', 700)
          emit({ type: 'tetris' })
          break
        case 'bonfire':
          emit({ type: 'bonfire' })
          break
        case 'matrix':
          setMatrix(true)
          break
      }
    },
    [output, closePanel, scrollTo, emit, router, copyToClipboard],
  )

  const run = useCallback(
    (raw: string) => {
      const result = runCommand(raw, {
        t: terminal,
        locale,
        history: history.entries,
        uptimeMs: Date.now() - bootedAtRef.current,
      })

      // `clear` empties the screen, so its own output must land after it.
      if (result.effect) apply(result.effect)
      output.print(result.lines, result.stream)
    },
    [terminal, locale, history.entries, apply, output],
  )

  const submit = useCallback(() => {
    const raw = input
    setInput('')
    history.push(raw)
    if (raw.trim()) run(raw)
  }, [input, history, run])

  const recall = useCallback(
    (direction: -1 | 1) => {
      const recalled = history.recall(direction, input)
      if (recalled !== null) setInput(recalled)
    },
    [history, input],
  )

  const autocomplete = useCallback(() => {
    const { value, hints } = complete(input)
    setInput(value)
    if (hints.length > 0) {
      output.print([
        line(`${terminal.prompt} ${input}`, 'input'),
        line(hints.join('   ')),
      ])
    }
  }, [input, output, terminal])

  const runQuickAction = useCallback(
    (command: string) => {
      openTerminal()
      run(command)
    },
    [openTerminal, run],
  )

  const stopMatrix = useCallback(() => setMatrix(false), [])

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
        lines={output.lines}
        streaming={output.streaming}
        matrix={matrix}
        value={input}
        onChange={setInput}
        onSubmit={submit}
        onRecall={recall}
        onComplete={autocomplete}
        onStopMatrix={stopMatrix}
        onClose={closePanel}
      />

      <QuickActionsPanel
        open={panel === 'actions'}
        copy={dock}
        onDownloadResume={() => runQuickAction('cv')}
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
        onClick={toggleTerminal}
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
