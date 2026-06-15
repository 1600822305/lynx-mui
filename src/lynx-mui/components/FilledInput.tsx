import { useTheme } from '../system/ThemeContext.js'
import type { SxObject } from '../system/types.js'
import { useFormControl } from './FormControlContext.js'
import {
  InputBase,
  inputAccentColor,
  type InputBaseProps,
  type InputBaseState,
} from './InputBase.js'

export interface FilledInputProps extends InputBaseProps {
  disableUnderline?: boolean
  hiddenLabel?: boolean
}

/**
 * MUI `FilledInput` -> InputBase + a tinted background with rounded top corners
 * and a bottom underline.
 *
 * Lynx degradations:
 *  - no `:hover` background darkening (base/focused share rgba(0,0,0,0.06);
 *    disabled is rgba(0,0,0,0.12)).
 *  - underline drawn as a real `borderBottom` (no `::before`/`::after`); focus
 *    thickening is an instant 1px->2px swap.
 */
export function FilledInput(props: FilledInputProps) {
  const fcs = useFormControl()
  const disableUnderline = props.disableUnderline === true
  const theme = useTheme()

  const isHiddenLabel = (state: InputBaseState) =>
    props.hiddenLabel ?? fcs?.hiddenLabel ?? state.hiddenLabel

  const getRootSx = (state: InputBaseState): SxObject => {
    const hiddenLabel = isHiddenLabel(state)
    const small = state.size === 'small'
    const sx: SxObject = {
      position: 'relative',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      backgroundColor: state.disabled ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.06)',
      transition: `background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeOut}`,
    }
    if (state.adornedStart) sx.paddingLeft = '12px'
    if (state.adornedEnd) sx.paddingRight = '12px'
    if (state.multiline) {
      sx.paddingTop = hiddenLabel ? '16px' : small ? '21px' : '25px'
      sx.paddingBottom = hiddenLabel ? '17px' : small ? '4px' : '8px'
      sx.paddingLeft = '12px'
      sx.paddingRight = '12px'
    }
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

  const getInputSx = (state: InputBaseState): SxObject => {
    if (state.multiline) return { padding: 0 }
    const hiddenLabel = isHiddenLabel(state)
    const small = state.size === 'small'
    return {
      paddingTop: hiddenLabel ? '16px' : small ? '21px' : '25px',
      paddingBottom: hiddenLabel ? '17px' : small ? '4px' : '8px',
      paddingLeft: state.adornedStart ? 0 : '12px',
      paddingRight: state.adornedEnd ? 0 : '12px',
      height: '23px',
    }
  }

  return <InputBase {...props} getRootSx={getRootSx} getInputSx={getInputSx} />
}
FilledInput.displayName = 'FilledInput'
