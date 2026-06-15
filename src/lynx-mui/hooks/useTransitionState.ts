import { useEffect, useRef, useState } from '@lynx-js/react'

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited'

export interface UseTransitionOptions {
  /** Animate on the initial mount when already `in`. @default true */
  appear?: boolean
  /** Enter duration in ms. */
  enter?: number
  /** Exit duration in ms. */
  exit?: number
}

/**
 * Minimal replica of `react-transition-group`'s `Transition` lifecycle for Lynx
 * (which has no react-transition-group). Children are kept mounted across the
 * whole cycle — `mountOnEnter` / `unmountOnExit` are not modelled — and the
 * returned status drives the CSS-transition styles, exactly like MUI's
 * transition wrappers (Fade / Slide / Collapse).
 *
 * The first paint deliberately sits in the pre-animation status ('exited') so
 * the enter transition has a real start->end delta to animate from; this stands
 * in for react-transition-group's forced reflow.
 */
export function useTransitionState(inProp: boolean, opts: UseTransitionOptions = {}): TransitionStatus {
  const appear = opts.appear ?? true
  const enter = opts.enter ?? 0
  const exit = opts.exit ?? 0

  const [status, setStatus] = useState<TransitionStatus>(inProp && !appear ? 'entered' : 'exited')
  const mounted = useRef(false)

  useEffect(() => {
    // Skip the first effect when appearing is disabled and already open, so the
    // component stays 'entered' without re-animating.
    if (!mounted.current && inProp && !appear) {
      mounted.current = true
      return undefined
    }
    mounted.current = true

    if (inProp) {
      setStatus('entering')
      const id = setTimeout(() => {
        setStatus('entered')
      }, enter)
      return () => {
        clearTimeout(id)
      }
    }
    setStatus('exiting')
    const id = setTimeout(() => {
      setStatus('exited')
    }, exit)
    return () => {
      clearTimeout(id)
    }
  }, [inProp, enter, exit, appear])

  return status
}
