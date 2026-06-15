import type { ReactNode } from '@lynx-js/react'

import type { LynxStyle, SxProp } from '../system/types.js'
import { FormControl } from './FormControl.js'
import type {
  FormControlColor,
  FormControlMargin,
  FormControlSize,
  FormControlVariant,
} from './FormControlContext.js'
import { FormHelperText } from './FormHelperText.js'
import { FilledInput } from './FilledInput.js'
import { Input } from './Input.js'
import { InputLabel } from './InputLabel.js'
import { OutlinedInput } from './OutlinedInput.js'

export interface TextFieldProps {
  label?: ReactNode
  helperText?: ReactNode
  value?: string
  defaultValue?: string
  /** Lynx degradation: reports the next string directly (no DOM event object). */
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  type?: string
  name?: string
  id?: string
  multiline?: boolean
  rows?: number
  disabled?: boolean
  error?: boolean
  required?: boolean
  fullWidth?: boolean
  color?: FormControlColor
  size?: FormControlSize
  margin?: FormControlMargin
  variant?: FormControlVariant
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `TextField` -> FormControl + (InputLabel) + variant input + (FormHelperText).
 *
 * Lynx degradations:
 *  - `select` / multiline auto-resize (minRows/maxRows) are not supported here
 *    (Select needs an overlay; multiline height approximates `rows`).
 *  - label/helper-text `htmlFor`/`id` associations are cosmetic only (no a11y
 *    wiring on Lynx).
 */
export function TextField(props: TextFieldProps) {
  const variant: FormControlVariant = props.variant ?? 'outlined'

  const inputProps = {
    id: props.id,
    name: props.name,
    placeholder: props.placeholder,
    type: props.type,
    multiline: props.multiline,
    rows: props.rows,
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    startAdornment: props.startAdornment,
    endAdornment: props.endAdornment,
  }

  let inputElement: ReactNode
  if (variant === 'standard') inputElement = <Input {...inputProps} />
  else if (variant === 'filled') inputElement = <FilledInput {...inputProps} />
  else inputElement = <OutlinedInput {...inputProps} label={typeof props.label === 'string' ? props.label : undefined} />

  return (
    <FormControl
      className={props.className}
      style={props.style}
      sx={props.sx}
      disabled={props.disabled}
      error={props.error}
      required={props.required}
      fullWidth={props.fullWidth}
      color={props.color}
      size={props.size}
      margin={props.margin}
      variant={variant}
    >
      {props.label != null ? <InputLabel htmlFor={props.id}>{props.label}</InputLabel> : null}
      {inputElement}
      {props.helperText != null ? <FormHelperText>{props.helperText}</FormHelperText> : null}
    </FormControl>
  )
}
TextField.displayName = 'TextField'
