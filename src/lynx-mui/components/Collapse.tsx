import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle } from '../system/types.js'
import { useTransitionState } from '../hooks/useTransitionState.js'

export type CollapseOrientation = 'horizontal' | 'vertical'

export interface CollapseTimeout {
  enter?: number
  exit?: number
}

export interface CollapseProps {
  /** Whether the component is expanded. */
  in?: boolean
  /** Collapse along the vertical (height) or horizontal (width) axis. @default 'vertical' */
  orientation?: CollapseOrientation
  /** Size of the container when collapsed. @default '0px' */
  collapsedSize?: number | string
  /** Enter/exit duration in ms, a per-mode object, or 'auto'. @default duration.standard */
  timeout?: number | 'auto' | CollapseTimeout
  /** Animate on the initial mount when already `in`. @default true */
  appear?: boolean
  children?: ReactNode
  className?: string
  style?: LynxStyle
}

/**
 * Upper bound for the expanded axis. MUI animates to the measured content size;
 * Lynx has no synchronous layout read, so (like `StepContent` / `Accordion` in
 * this repo) we transition a `max-height` / `max-width` cap instead.
 */
const EXPANDED_CAP = '2000px'

function toSize(size: number | string): string {
  return typeof size === 'number' ? `${size}px` : size
}

function resolveDuration(
  timeout: number | 'auto' | CollapseTimeout | undefined,
  standard: number,
): { enter: number; exit: number } {
  // DEGRADATION: 'auto' can't measure content on Lynx, so it falls back to the
  // standard duration.
  if (timeout === undefined || timeout === 'auto') return { enter: standard, exit: standard }
  if (typeof timeout === 'number') return { enter: timeout, exit: timeout }
  return { enter: timeout.enter ?? standard, exit: timeout.exit ?? standard }
}

/**
 * MUI `Collapse` -> Lynx max-size transition. Keeps MUI's nested Root / Wrapper
 * / WrapperInner structure and the `useTransitionState` lifecycle, but animates
 * a `max-height` / `max-width` cap (no measurement on Lynx).
 */
export function Collapse(props: CollapseProps) {
  const theme = useTheme()
  const inProp = props.in === true
  const orientation = props.orientation ?? 'vertical'
  const isHorizontal = orientation === 'horizontal'
  const collapsedSize = toSize(props.collapsedSize ?? '0px')
  const { duration, easing } = theme.transitions
  const { enter, exit } = resolveDuration(props.timeout, duration.standard)

  const status = useTransitionState(inProp, { appear: props.appear ?? true, enter, exit })
  const opened = status === 'entering' || status === 'entered'
  const dur = status === 'exiting' || status === 'exited' ? exit : enter
  const hidden = status === 'exited' && !inProp && collapsedSize === '0px'

  const target = opened ? EXPANDED_CAP : collapsedSize

  const rootStyle: LynxStyle = isHorizontal
    ? {
        display: 'flex',
        overflow: 'hidden',
        transition: `max-width ${dur}ms ${easing.easeInOut}`,
        maxWidth: target,
        minWidth: collapsedSize,
        ...(hidden ? { visibility: 'hidden' } : {}),
        ...props.style,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: `max-height ${dur}ms ${easing.easeInOut}`,
        maxHeight: target,
        minHeight: collapsedSize,
        ...(hidden ? { visibility: 'hidden' } : {}),
        ...props.style,
      }

  const wrapperStyle: LynxStyle = isHorizontal
    ? { display: 'flex', height: '100%' }
    : { display: 'flex', flexDirection: 'column', width: '100%' }

  const wrapperInnerStyle: LynxStyle = isHorizontal ? { height: '100%' } : { width: '100%' }

  return (
    <view className={props.className} style={rootStyle}>
      <view style={wrapperStyle}>
        <view style={wrapperInnerStyle}>{props.children}</view>
      </view>
    </view>
  )
}
Collapse.displayName = 'Collapse'
