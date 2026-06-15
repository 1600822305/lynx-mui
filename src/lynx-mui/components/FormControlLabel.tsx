import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject } from '../system/types.js'
import { Typography } from './Typography.js'

export type FormControlLabelPlacement = 'end' | 'start' | 'top' | 'bottom'

export interface FormControlLabelProps {
  control: ReactElement
  label?: ReactNode
  labelPlacement?: FormControlLabelPlacement
  disabled?: boolean
  value?: unknown
  className?: string
  style?: LynxStyle
}

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
const flexDirection: Record<FormControlLabelPlacement, FlexDirection> = {
  end: 'row',
  start: 'row-reverse',
  top: 'column-reverse',
  bottom: 'column',
}

/** v7 source margins: base ML -11 / MR 16; start flips MR to -11; start/top/bottom set ML 16. */
function rootStyle(placement: FormControlLabelPlacement): LynxStyle {
  const sx: SxObject = {
    display: 'inline-flex',
    flexDirection: flexDirection[placement],
    alignItems: 'center',
    marginLeft: '-11px',
    marginRight: '16px',
  }
  if (placement === 'start') sx.marginRight = '-11px'
  if (placement !== 'end') sx.marginLeft = '16px'
  return sxToStyle(sx, defaultTheme)
}

/** MUI `FormControlLabel` -> Lynx `<view>` row with the control + a Typography label. */
export function FormControlLabel(props: FormControlLabelProps) {
  const placement = props.labelPlacement ?? 'end'
  const disabled = props.disabled === true

  const control = isValidElement(props.control) && disabled
    ? cloneElement(props.control as ReactElement<{ disabled?: boolean }>, { disabled: true })
    : props.control

  const style: LynxStyle = { ...rootStyle(placement), ...props.style }

  return (
    <view className={props.className} style={style}>
      {control}
      {props.label != null && (
        <Typography variant='body1' sx={{ color: disabled ? 'text.disabled' : 'text.primary' }}>
          {props.label}
        </Typography>
      )}
    </view>
  )
}
FormControlLabel.displayName = 'FormControlLabel'
