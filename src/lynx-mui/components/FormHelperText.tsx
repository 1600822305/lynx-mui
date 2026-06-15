import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import {
  formControlState,
  useFormControl,
  type FormControlSize,
  type FormControlVariant,
} from './FormControlContext.js'

export interface FormHelperTextProps {
  children?: ReactNode
  disabled?: boolean
  error?: boolean
  size?: FormControlSize
  variant?: FormControlVariant
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `FormHelperText` -> Lynx `<text>` (MUI uses `<p>`). caption typography,
 * with error/disabled color overrides and contained (filled/outlined) margins.
 */
export function FormHelperText(props: FormHelperTextProps) {
  const theme = useTheme()
  const fcs = useFormControl()

  const disabled = formControlState<boolean>(props.disabled, fcs?.disabled, false)
  const error = formControlState<boolean>(props.error, fcs?.error, false)
  const size = formControlState<FormControlSize>(props.size, fcs?.size, 'medium')
  const variant = formControlState<FormControlVariant>(props.variant, fcs?.variant, 'standard')
  const contained = variant === 'filled' || variant === 'outlined'

  const caption = theme.typography.caption
  const sx: SxObject = {
    fontSize: `${caption.fontSize}px`,
    fontWeight: `${caption.fontWeight}`,
    lineHeight: `${caption.lineHeight}`,
    letterSpacing: `${caption.letterSpacing}px`,
    textAlign: 'left',
    marginTop: '3px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  }
  if (size === 'small') sx.marginTop = '4px'
  if (contained) {
    sx.marginLeft = '14px'
    sx.marginRight = '14px'
  }
  // Color priority: error > disabled > base (text.secondary).
  sx.color = error
    ? theme.palette.error.main
    : disabled
      ? theme.palette.text.disabled
      : theme.palette.text.secondary

  const style: LynxStyle = {
    ...sxToStyle(sx, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  return (
    <text className={props.className} style={style}>
      {props.children}
    </text>
  )
}
FormHelperText.displayName = 'FormHelperText'
