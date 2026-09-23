'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

/**
 * How a console command reaches the rest of the page.
 *
 * The dock sits beside `<main>`, so `open spatium` has no way to hand the
 * projects carousel an index by prop. This is the channel for that: a
 * subscription list behind context rather than a piece of shared state,
 * because these are moments, not values — re-rendering the tree to announce
 * one and again to unannounce it would be the wrong shape.
 */
export type ConsoleSignal =
  | { readonly type: 'openProject'; readonly index: number }
  | { readonly type: 'openCertificate'; readonly index: number }
  | { readonly type: 'tetris' }
  | { readonly type: 'bonfire' }

type Listener = (signal: ConsoleSignal) => void

interface ConsoleBus {
  readonly emit: (signal: ConsoleSignal) => void
  readonly subscribe: (listener: Listener) => () => void
}

const noop = () => {}

/** Outside a provider every signal is dropped, which is the right failure. */
const FALLBACK: ConsoleBus = { emit: noop, subscribe: () => noop }

const ConsoleBusContext = createContext<ConsoleBus>(FALLBACK)

export function ConsoleBusProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef<Set<Listener>>(new Set())

  const bus = useMemo<ConsoleBus>(
    () => ({
      emit: (signal) => {
        for (const listener of listenersRef.current) listener(signal)
      },
      subscribe: (listener) => {
        listenersRef.current.add(listener)
        return () => {
          listenersRef.current.delete(listener)
        }
      },
    }),
    [],
  )

  return (
    <ConsoleBusContext.Provider value={bus}>{children}</ConsoleBusContext.Provider>
  )
}

/** Stable for the life of the provider, so it is safe in any dependency list. */
export function useConsoleEmit(): ConsoleBus['emit'] {
  return useContext(ConsoleBusContext).emit
}

/**
 * Runs `handler` whenever a signal of `type` is emitted. The handler is read
 * from a ref, so passing an inline function does not resubscribe every render.
 */
export function useConsoleSignal<T extends ConsoleSignal['type']>(
  type: T,
  handler: (signal: Extract<ConsoleSignal, { type: T }>) => void,
): void {
  const { subscribe } = useContext(ConsoleBusContext)
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  const listen = useCallback(
    (signal: ConsoleSignal) => {
      if (signal.type !== type) return
      handlerRef.current(signal as Extract<ConsoleSignal, { type: T }>)
    },
    [type],
  )

  useEffect(() => subscribe(listen), [subscribe, listen])
}
