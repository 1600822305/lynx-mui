import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle } from '../system/types.js'
import { useTransitionState } from '../hooks/useTransitionState.js'

export interface FadeTimeout {
  enter?: number
  exit?: number
}

export interface FadeProps {
  /** Whether the component is shown. */
  in?: boolean
  /** Animate on the initial mount when already `in`. @default true */
  appear?: boolean
  /** Enter/exit duration in ms, or a per-mode object. */
  timeout?: number | FadeTimeout
  /** A single element that accepts a `style` prop. */
  children: ReactElement
  style?: LynxStyle
}

function resolveDuration(timeout: number | FadeTimeout | undefined, enter: number, exit: number) {
  if (typeof timeout === 'number') return { enter: timeout, exit: timeout }
  return { enter: timeout?.enter ?? enter, exit: timeout?.exit ?? exit }
}

/**
 * MUI `Fade` -> Lynx opacity transition. Uses the `useTransitionState` lifecycle
 * (no react-transition-group on Lynx) and injects `opacity` + `transition` onto
 * the single child via `cloneElement`, exactly like MUI's Fade.
 */
export function Fade(props: FadeProps) {
  const theme = useTheme()
  const inProp = props.in === true
  const { duration, easing } = theme.transitions
  const { enter, exit } = resolveDuration(props.timeout, duration.enteringScreen, duration.leavingScreen)

  const status = useTransitionState(inProp, { appear: props.appear ?? true, enter, exit })
  const dur = status === 'exiting' || status === 'exited' ? exit : enter
  const opened = status === 'entering' || status === 'entered'

  const child = props.children
  if (!isValidElement(child)) return child

  const el = child as ReactElement<{ style?: LynxStyle }>
  const transitionStyle: LynxStyle = {
    opacity: opened ? 1 : 0,
    transition: `opacity ${dur}ms ${easing.easeInOut}`,
    ...(status === 'exited' && !inProp ? { visibility: 'hidden' } : {}),
  }

  return cloneElement(el, {
    style: { ...transitionStyle, ...props.style, ...(el.props.style ?? {}) },
  })
}
Fade.displayName = 'Fade'
