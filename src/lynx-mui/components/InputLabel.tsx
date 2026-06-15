import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import {
  formControlState,
  useFormControl,
  type FormControlColor,
  type FormControlSize,
  type FormControlVariant,
} from './FormControlContext.js'
import { formLabelColor, formLabelRootSx } from './FormLabel.js'

export interface InputLabelProps {
  children?: ReactNode
  /** Force the floating ("shrunk") position. Defaults from FormControl state. */
  shrink?: boolean
  disableAnimation?: boolean
  color?: FormControlColor
  disabled?: boolean
  error?: boolean
  focused?: boolean
  required?: boolean
  variant?: FormControlVariant
  size?: FormControlSize
  /** Lynx degradation: no `<label htmlFor>` association; accepted for parity. */
  htmlFor?: string
  id?: string
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `InputLabel` -> Lynx `<text>` extending FormLabel, positioned absolutely
 * inside the FormControl and floated via `transform: translate(...) scale(...)`.
 *
 * Lynx degradations:
 *  - `maxWidth: calc(133% - N)` from MUI is not supported -> kept at `100%`
 *    (label may clip slightly differently from MUI when very long).
 *  - For the outlined variant the shrunk label paints a `background.paper`
 *    strip (paddingLeft/Right 4px) to fake the `<fieldset>` notch; assumes the
 *    field sits on a paper (#fff) surface.
 *  - transform/scale are supported natively; transitions animate color+transform.
 */
export function InputLabel(props: InputLabelProps) {
  const theme = useTheme()
  const fcs = useFormControl()
  const inFormControl = fcs !== undefined

  const color = formControlState<FormControlColor>(props.color, fcs?.color, 'primary')
  const disabled = formControlState<boolean>(props.disabled, fcs?.disabled, false)
  const error = formControlState<boolean>(props.error, fcs?.error, false)
  const focused = formControlState<boolean>(props.focused, fcs?.focused, false)
  const required = formControlState<boolean>(props.required, fcs?.required, false)
  const variant = formControlState<FormControlVariant>(props.variant, fcs?.variant, 'outlined')
  const size = formControlState<FormControlSize>(props.size, fcs?.size, 'medium')
  const small = size === 'small'

  const shrink =
    props.shrink ?? (fcs ? fcs.filled || fcs.focused || fcs.adornedStart : false)

  const sx: SxObject = {
    ...formLabelRootSx(theme),
    color: formLabelColor(color, focused, disabled, error, theme),
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  }
  if (inFormControl) {
    sx.position = 'absolute'
    sx.left = 0
    sx.top = 0
  }
  if (props.disableAnimation !== true) {
    const d = theme.transitions.duration.shorter
    const e = theme.transitions.easing.easeOut
    sx.transition = `color ${d}ms ${e}, transform ${d}ms ${e}`
  }

  if (variant === 'standard') {
    sx.transform = shrink
      ? 'translate(0px, -1.5px) scale(0.75)'
      : small
        ? 'translate(0px, 17px) scale(1)'
        : 'translate(0px, 20px) scale(1)'
  } else if (variant === 'filled') {
    sx.zIndex = 1
    sx.pointerEvents = shrink ? 'auto' : 'none'
    sx.transform = shrink
      ? small
        ? 'translate(12px, 4px) scale(0.75)'
        : 'translate(12px, 7px) scale(0.75)'
      : small
        ? 'translate(12px, 13px) scale(1)'
        : 'translate(12px, 16px) scale(1)'
  } else {
    // outlined
    sx.zIndex = 1
    sx.pointerEvents = shrink ? 'auto' : 'none'
    sx.transform = shrink
      ? 'translate(14px, -9px) scale(0.75)'
      : small
        ? 'translate(14px, 9px) scale(1)'
        : 'translate(14px, 16px) scale(1)'
    if (shrink) {
      // Fake the notch: paint over the top border with the paper color.
      sx.backgroundColor = theme.palette.background.paper
      sx.paddingLeft = '4px'
      sx.paddingRight = '4px'
    }
  }

  const style: LynxStyle = {
    ...sxToStyle(sx, theme),
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
InputLabel.displayName = 'InputLabel'
