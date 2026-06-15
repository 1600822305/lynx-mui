import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { usePressState } from '../hooks/usePressState.js'
import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { StepLabel } from './StepLabel.js'
import { useStepContext } from './StepContext.js'
import { useStepperContext } from './StepperContext.js'

export interface StepButtonProps {
  children?: ReactNode
  /** Forwarded to the wrapped `StepLabel`. */
  icon?: ReactNode
  /** Forwarded to the wrapped `StepLabel`. */
  optional?: ReactNode
  disabled?: boolean
  onClick?: () => void
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function rootSx(orientation: 'horizontal' | 'vertical'): SxObject {
  const sx: SxObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '24px 16px',
    margin: '-24px -16px',
    boxSizing: 'content-box',
    borderRadius: '0px',
  }
  if (orientation === 'vertical') {
    sx.justifyContent = 'flex-start'
    sx.padding = '8px'
    sx.margin = '-8px'
  }
  return sx
}

/**
 * MUI `StepButton` -> Lynx pressable `<view>` wrapping a `StepLabel`.
 *
 * DEGRADATION: MUI's `ButtonBase` `TouchRipple` (rgba(0,0,0,0.3)) is replaced
 * with a flat press background (`action.hover`) via `usePressState`, since Lynx
 * has no ripple animation primitive.
 */
export function StepButton(props: StepButtonProps) {
  const { children, icon, optional, onClick, className, style, sx } = props
  const theme = useTheme()
  const { orientation } = useStepperContext()
  const { disabled: ctxDisabled } = useStepContext()
  const disabled = props.disabled === true || ctxDisabled
  const press = usePressState()

  const labelProps = { icon, optional }
  const child: ReactNode =
    isValidElement(children) && (children as ReactElement).type === StepLabel
      ? cloneElement(children as ReactElement<Record<string, unknown>>, labelProps)
      : <StepLabel icon={icon} optional={optional}>{children}</StepLabel>

  const pressBg = press.pressed && !disabled ? { backgroundColor: theme.palette.action.hover } : {}
  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx(orientation), theme),
    ...pressBg,
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }

  const tap = disabled ? undefined : onClick

  return (
    <view
      className={className}
      style={rootStyle}
      bindtap={tap}
      bindtouchstart={disabled ? undefined : press.bind.bindtouchstart}
      bindtouchend={disabled ? undefined : press.bind.bindtouchend}
      bindtouchcancel={disabled ? undefined : press.bind.bindtouchcancel}
    >
      {child}
    </view>
  )
}
StepButton.displayName = 'StepButton'
