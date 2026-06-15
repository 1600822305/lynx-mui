import { defaultTheme } from '../system/defaultTheme.js'
import type { SxObject } from '../system/types.js'
import { useFormControl } from './FormControlContext.js'
import {
  InputBase,
  inputAccentColor,
  type InputBaseProps,
  type InputBaseState,
} from './InputBase.js'

export interface InputProps extends InputBaseProps {
  /** Remove the bottom underline (MUI `disableUnderline`). */
  disableUnderline?: boolean
}

/**
 * MUI `Input` (standard variant) -> InputBase + a bottom underline drawn as a
 * real `borderBottom` on the root.
 *
 * Lynx degradations:
 *  - underline uses a real `borderBottom` (no `::before`/`::after` two-line
 *    animation; the focus thickening is an instant 1px->2px swap, no scaleX
 *    transition).
 *  - no `:hover` underline darkening.
 *  - the standard "label + &" top spacing is applied whenever the input sits in
 *    a FormControl (assumes a floating label is present, as TextField always is).
 */
export function Input(props: InputProps) {
  const inFormControl = useFormControl() !== undefined
  const disableUnderline = props.disableUnderline === true

  const getRootSx = (state: InputBaseState): SxObject => {
    const theme = defaultTheme
    const sx: SxObject = { position: 'relative' }
    if (inFormControl) sx.marginTop = '16px'
    if (!disableUnderline) {
      let bottomColor = 'rgba(0, 0, 0, 0.42)'
      if (state.error) bottomColor = theme.palette.error.main
      else if (state.focused && !state.disabled) bottomColor = inputAccentColor(state.color, theme)
      sx.borderBottomWidth = state.focused && !state.disabled ? '2px' : '1px'
      sx.borderBottomStyle = state.disabled ? 'dotted' : 'solid'
      sx.borderBottomColor = bottomColor
    }
    return sx
  }

  return <InputBase {...props} getRootSx={getRootSx} />
}
Input.displayName = 'Input'
