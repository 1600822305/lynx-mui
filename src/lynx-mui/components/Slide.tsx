import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle } from '../system/types.js'
import { useTransitionState } from '../hooks/useTransitionState.js'

export type SlideDirection = 'left' | 'right' | 'up' | 'down'

export interface SlideTimeout {
  enter?: number
  exit?: number
}

export interface SlideProps {
  /** Whether the component is shown. */
  in?: boolean
  /** Direction the child slides in towards. @default 'down' */
  direction?: SlideDirection
  /** Animate on the initial mount when already `in`. @default true */
  appear?: boolean
  /** Enter/exit duration in ms, or a per-mode object. */
  timeout?: number | SlideTimeout
  /** A single element that accepts a `style` prop. */
  children: ReactElement
  style?: LynxStyle
}

/**
 * Off-screen transform for the exited state, per slide direction.
 *
 * DEGRADATION: MUI measures the node + container rect to translate the element
 * exactly to the viewport edge. Lynx has no synchronous layout read, so we use
 * `100vw` / `100vh` offsets — this pushes the child fully off-screen for the
 * usual edge-anchored usage (Drawer / Snackbar) without measurement.
 */
function offscreenTransform(direction: SlideDirection): string {
  switch (direction) {
    case 'left':
      return 'translateX(100vw)'
    case 'right':
      return 'translateX(-100vw)'
    case 'up':
      return 'translateY(100vh)'
    case 'down':
    default:
      return 'translateY(-100vh)'
  }
}

function resolveDuration(timeout: number | SlideTimeout | undefined, enter: number, exit: number) {
  if (typeof timeout === 'number') return { enter: timeout, exit: timeout }
  return { enter: timeout?.enter ?? enter, exit: timeout?.exit ?? exit }
}

/**
 * MUI `Slide` -> Lynx transform transition. Uses the `useTransitionState`
 * lifecycle (no react-transition-group on Lynx) and injects `transform` +
 * `transition` onto the single child via `cloneElement`.
 */
export function Slide(props: SlideProps) {
  const theme = useTheme()
  const inProp = props.in === true
  const direction = props.direction ?? 'down'
  const { duration, easing } = theme.transitions
  const { enter, exit } = resolveDuration(props.timeout, duration.enteringScreen, duration.leavingScreen)

  const status = useTransitionState(inProp, { appear: props.appear ?? true, enter, exit })
  const exiting = status === 'exiting' || status === 'exited'
  const dur = exiting ? exit : enter
  // MUI: enter uses easeOut, exit uses sharp.
  const ease = exiting ? easing.sharp : easing.easeOut
  const opened = status === 'entering' || status === 'entered'

  const child = props.children
  if (!isValidElement(child)) return child

  const el = child as ReactElement<{ style?: LynxStyle }>
  const transitionStyle: LynxStyle = {
    transform: opened ? 'translateX(0px)' : offscreenTransform(direction),
    transition: `transform ${dur}ms ${ease}`,
    ...(status === 'exited' && !inProp ? { visibility: 'hidden' } : {}),
  }

  return cloneElement(el, {
    style: { ...transitionStyle, ...props.style, ...(el.props.style ?? {}) },
  })
}
Slide.displayName = 'Slide'
