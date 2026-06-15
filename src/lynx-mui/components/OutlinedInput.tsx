import { useTheme } from '../system/ThemeContext.js'
import type { SxObject } from '../system/types.js'
import {
  InputBase,
  inputAccentColor,
  type InputBaseProps,
  type InputBaseState,
} from './InputBase.js'

export interface OutlinedInputProps extends InputBaseProps {
  /**
   * Label text used by MUI to size the notch. Lynx degradation: the notch is
   * produced by the floating InputLabel's paper background (see InputLabel), so
   * this is accepted for API parity but not used to draw a fieldset legend.
   */
  label?: string
  notched?: boolean
}

/**
 * MUI `OutlinedInput` -> InputBase + a real border on the root (4px radius).
 *
 * Lynx degradations:
 *  - MUI's `<fieldset>` + `<legend>` notch is not reproducible. The border is a
 *    real `border` on the root view; the "notch" (gap for the floating label) is
 *    faked by the InputLabel painting a `background.paper` strip over the top
 *    border when shrunk. Assumes the field sits on a paper (#fff) surface.
 *  - no `:hover` border darkening; focus border thickening is an instant swap.
 */
export function OutlinedInput(props: OutlinedInputProps) {
  const theme = useTheme()
  const getRootSx = (state: InputBaseState): SxObject => {
    const sx: SxObject = {
      position: 'relative',
      borderRadius: '4px',
      borderStyle: 'solid',
    }
    let borderColor = 'rgba(0, 0, 0, 0.23)'
    let borderWidth = '1px'
    if (state.disabled) borderColor = theme.palette.action.disabled
    else if (state.error) borderColor = theme.palette.error.main
    else if (state.focused) {
      borderColor = inputAccentColor(state.color, theme)
      borderWidth = '2px'
    }
    sx.borderColor = borderColor
    sx.borderWidth = borderWidth

    if (state.multiline) {
      sx.paddingTop = state.size === 'small' ? '8.5px' : '16.5px'
      sx.paddingBottom = state.size === 'small' ? '8.5px' : '16.5px'
      sx.paddingLeft = '14px'
      sx.paddingRight = '14px'
    } else {
      if (state.adornedStart) sx.paddingLeft = '14px'
      if (state.adornedEnd) sx.paddingRight = '14px'
    }
    return sx
  }

  const getInputSx = (state: InputBaseState): SxObject => {
    if (state.multiline) return { padding: 0 }
    return {
      paddingTop: state.size === 'small' ? '8.5px' : '16.5px',
      paddingBottom: state.size === 'small' ? '8.5px' : '16.5px',
      paddingLeft: state.adornedStart ? 0 : '14px',
      paddingRight: state.adornedEnd ? 0 : '14px',
      height: '23px',
    }
  }

  return <InputBase {...props} getRootSx={getRootSx} getInputSx={getInputSx} />
}
OutlinedInput.displayName = 'OutlinedInput'
