import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import {
  FormControlContext,
  formControlState,
  useFormControl,
  type FormControlVariant,
} from './FormControlContext.js'
import { Typography } from './Typography.js'

export interface InputAdornmentProps {
  children?: ReactNode
  /** MUI required: which side the adornment sits on. */
  position: 'start' | 'end'
  disablePointerEvents?: boolean
  disableTypography?: boolean
  variant?: FormControlVariant
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `InputAdornment` -> Lynx `<view>`. Wraps children in a `null`
 * FormControlContext so a nested input doesn't think it lives in a FormControl.
 *
 * Lynx degradation: `maxHeight: '2em'` -> '32px' (em not relied on); pointerEvents
 * is set but has no hover/cursor effect on Lynx.
 */
export function InputAdornment(props: InputAdornmentProps) {
  const theme = useTheme()
  const fcs = useFormControl()
  const variant = formControlState<FormControlVariant>(props.variant, fcs?.variant, 'standard')
  const hiddenLabel = fcs?.hiddenLabel ?? false
  const position = props.position

  const sx: SxObject = {
    display: 'flex',
    maxHeight: '32px',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    color: theme.palette.action.active,
  }
  if (variant === 'filled' && position === 'start' && !hiddenLabel) sx.marginTop = '16px'
  if (position === 'start') sx.marginRight = '8px'
  if (position === 'end') sx.marginLeft = '8px'
  if (props.disablePointerEvents === true) sx.pointerEvents = 'none'

  const style: LynxStyle = {
    ...sxToStyle(sx, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  const renderChildren =
    typeof props.children === 'string' && props.disableTypography !== true ? (
      <Typography sx={{ color: 'text.secondary' }}>{props.children}</Typography>
    ) : (
      props.children
    )

  return (
    <FormControlContext.Provider value={undefined}>
      <view className={props.className} style={style}>
        {renderChildren}
      </view>
    </FormControlContext.Provider>
  )
}
InputAdornment.displayName = 'InputAdornment'
