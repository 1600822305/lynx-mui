import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { formControlState, useFormControl, type FormControlColor } from './FormControlContext.js'

export interface FormLabelProps {
  children?: ReactNode
  color?: FormControlColor
  disabled?: boolean
  error?: boolean
  focused?: boolean
  required?: boolean
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

type PaletteColorKey = Exclude<FormControlColor, 'default'>

/**
 * v7 FormLabel color resolution (priority error > disabled > focused > base).
 * Exported so InputLabel (which extends FormLabel) can reuse it 1:1.
 */
export function formLabelColor(
  color: FormControlColor,
  focused: boolean,
  disabled: boolean,
  error: boolean,
  theme: Theme,
): string {
  if (error) return theme.palette.error.main
  if (disabled) return theme.palette.text.disabled
  if (focused && color !== 'default') return theme.palette[color as PaletteColorKey].main
  return theme.palette.text.secondary
}

/** Shared FormLabel root style (body1 typography + lineHeight 1.4375em override). */
export function formLabelRootSx(theme: Theme): SxObject {
  const body1 = theme.typography.body1
  return {
    fontSize: `${body1.fontSize}px`,
    // MUI sets ...body1 then overrides lineHeight to '1.4375em' (= 23px @ 16px font).
    lineHeight: '1.4375',
    fontWeight: `${body1.fontWeight}`,
    letterSpacing: `${body1.letterSpacing}px`,
    padding: 0,
    position: 'relative',
  }
}

/**
 * MUI `FormLabel` -> Lynx `<text>`. Reads disabled/error/focused/required/color
 * from the surrounding FormControl when not given explicitly.
 *
 * Lynx degradation: rendered as `<text>` (not `<label>` — Lynx has no label
 * element / htmlFor association); the required asterisk is concatenated inline
 * rather than via a `::after`-style span.
 */
export function FormLabel(props: FormLabelProps) {
  const theme = useTheme()
  const fcs = useFormControl()

  const color = formControlState<FormControlColor>(props.color, fcs?.color, 'primary')
  const disabled = formControlState<boolean>(props.disabled, fcs?.disabled, false)
  const error = formControlState<boolean>(props.error, fcs?.error, false)
  const focused = formControlState<boolean>(props.focused, fcs?.focused, false)
  const required = formControlState<boolean>(props.required, fcs?.required, false)

  const textColor = formLabelColor(color, focused, disabled, error, theme)

  const style: LynxStyle = {
    ...sxToStyle(formLabelRootSx(theme), theme),
    color: textColor,
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  return (
    <text className={props.className} style={style}>
      {props.children}
      {required ? '\u2009*' : ''}
    </text>
  )
}
FormLabel.displayName = 'FormLabel'
