import { useEffect, useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import {
  formControlState,
  useFormControl,
  type FormControlColor,
  type FormControlSize,
} from './FormControlContext.js'

type LynxInputType = 'text' | 'number' | 'digit' | 'password' | 'tel' | 'email'

type PaletteColorKey = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

/** Accent (focused) color for an input; MUI treats inputs as always palette-colored. */
export function inputAccentColor(color: FormControlColor, theme = defaultTheme): string {
  const key: PaletteColorKey = color === 'default' ? 'primary' : color
  return theme.palette[key].main
}

/** Resolved state handed to variant style hooks (Input/OutlinedInput/FilledInput). */
export interface InputBaseState {
  focused: boolean
  disabled: boolean
  error: boolean
  filled: boolean
  color: FormControlColor
  size: FormControlSize
  multiline: boolean
  fullWidth: boolean
  adornedStart: boolean
  adornedEnd: boolean
  hiddenLabel: boolean
}

export interface InputBaseOwnProps {
  /**
   * Lynx degradation: `value` cannot be pushed into a Lynx `<input>` (the element
   * has no `value` write attribute). It is used only to seed the initial
   * filled/shrink state; the field is effectively uncontrolled. Track edits via
   * `onChange`.
   */
  value?: string
  defaultValue?: string
  /** Lynx degradation: reports the next string directly (no DOM event object). */
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  multiline?: boolean
  rows?: number
  type?: string
  fullWidth?: boolean
  color?: FormControlColor
  size?: FormControlSize
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  name?: string
  id?: string
  required?: boolean
  readOnly?: boolean
  maxLength?: number
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

export interface InputBaseProps extends InputBaseOwnProps {
  /** Internal: variant-specific root styling (border/underline/background). */
  getRootSx?: (state: InputBaseState) => SxObject
  /** Internal: variant-specific input padding. */
  getInputSx?: (state: InputBaseState) => SxObject
  /** Internal: extra nodes rendered inside the root (e.g. outlined notch). */
  renderSuffix?: (state: InputBaseState) => ReactNode
}

function toLynxInputType(type: string | undefined, multiline: boolean): LynxInputType {
  switch (type) {
    case 'password':
      return multiline ? 'text' : 'password'
    case 'number':
      return 'number'
    case 'tel':
      return 'tel'
    case 'email':
      return 'email'
    default:
      return 'text'
  }
}

/** v7 InputBaseRoot (bare; variants layer border/underline/background on top). */
function baseRootSx(state: InputBaseState, theme: Theme): SxObject {
  const body1 = theme.typography.body1
  const sx: SxObject = {
    fontSize: `${body1.fontSize}px`,
    fontWeight: `${body1.fontWeight}`,
    letterSpacing: `${body1.letterSpacing}px`,
    color: state.disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    lineHeight: '1.4375',
    boxSizing: 'border-box',
    position: 'relative',
    cursor: state.disabled ? 'default' : 'text',
    display: 'inline-flex',
    alignItems: 'center',
  }
  if (state.multiline) {
    // MUI multiline root padding '4px 0 5px' (small -> paddingTop 1).
    sx.paddingTop = state.size === 'small' ? '1px' : '4px'
    sx.paddingBottom = '5px'
  }
  if (state.fullWidth) sx.width = '100%'
  return sx
}

/** v7 InputBaseInput (the native `<input>`/`<textarea>`). */
function baseInputSx(state: InputBaseState, theme: Theme): SxObject {
  const body1 = theme.typography.body1
  const sx: SxObject = {
    fontSize: `${body1.fontSize}px`,
    fontWeight: `${body1.fontWeight}`,
    letterSpacing: `${body1.letterSpacing}px`,
    color: state.disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    borderWidth: 0,
    boxSizing: 'content-box',
    backgroundColor: 'transparent',
    margin: 0,
    minWidth: 0,
    width: '100%',
  }
  if (state.multiline) {
    sx.padding = 0
    sx.height = 'auto'
  } else {
    // padding '4px 0 5px' (+ small paddingTop 1); height 1.4375em = 23px.
    sx.paddingTop = state.size === 'small' ? '1px' : '4px'
    sx.paddingRight = 0
    sx.paddingBottom = '5px'
    sx.paddingLeft = 0
    sx.height = '23px'
  }
  return sx
}

/**
 * MUI `InputBase` -> Lynx `<view>` wrapping a `<input>` (or `<textarea>` when
 * `multiline`). The bare base has no border; Input/OutlinedInput/FilledInput
 * pass `getRootSx`/`getInputSx` to layer underline/outline/background.
 *
 * Lynx degradations:
 *  - No declarative value control (see `value`); edits flow out via `onChange`.
 *  - Focus is tracked through `bindfocus`/`bindblur` (no `:focus` pseudo-class).
 *  - Placeholder color/opacity follow the Lynx default (MUI placeholder opacity
 *    0.42 not reproducible — no `::placeholder` styling hook).
 *  - Tapping the root does not programmatically focus the input (no `htmlFor`);
 *    tap the field itself.
 */
export function InputBase(props: InputBaseProps) {
  const theme = useTheme()
  const fcs = useFormControl()

  const disabled = formControlState<boolean>(props.disabled, fcs?.disabled, false)
  const error = formControlState<boolean>(props.error, fcs?.error, false)
  const color = formControlState<FormControlColor>(props.color, fcs?.color, 'primary')
  const size = formControlState<FormControlSize>(props.size, fcs?.size, 'medium')
  const fullWidth = props.fullWidth ?? fcs?.fullWidth ?? false
  const hiddenLabel = fcs?.hiddenLabel ?? false
  const multiline = props.multiline === true

  const [focusedLocal, setFocusedLocal] = useState(false)
  const focused = fcs ? fcs.focused : focusedLocal

  const initialFilled = (props.value ?? props.defaultValue ?? '') !== ''
  const [filled, setFilled] = useState(initialFilled)

  const adornedStart = Boolean(props.startAdornment)
  const adornedEnd = Boolean(props.endAdornment)

  // Report filled / start-adornment up to a surrounding FormControl (label shrink).
  useEffect(() => {
    if (filled) fcs?.onFilled()
    else fcs?.onEmpty()
  }, [filled, fcs])
  useEffect(() => {
    fcs?.setAdornedStart(adornedStart)
  }, [adornedStart, fcs])

  const state: InputBaseState = {
    focused,
    disabled,
    error,
    filled,
    color,
    size,
    multiline,
    fullWidth,
    adornedStart,
    adornedEnd,
    hiddenLabel,
  }

  const rootStyle: LynxStyle = {
    ...sxToStyle(baseRootSx(state, theme), theme),
    ...sxToStyle(props.getRootSx ? props.getRootSx(state) : {}, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }
  const inputStyle: LynxStyle = {
    ...sxToStyle(baseInputSx(state, theme), theme),
    ...sxToStyle(props.getInputSx ? props.getInputSx(state) : {}, theme),
  }
  if (multiline && props.rows && props.rows > 0) {
    // Lynx degradation: no TextareaAutosize; approximate height = rows * lineHeight.
    inputStyle.height = `${props.rows * 23}px`
  }

  const handleInput = (next: string) => {
    setFilled(next.length > 0)
    props.onChange?.(next)
  }
  const handleFocus = () => {
    setFocusedLocal(true)
    fcs?.onFocus()
    props.onFocus?.()
  }
  const handleBlur = () => {
    setFocusedLocal(false)
    fcs?.onBlur()
    props.onBlur?.()
  }

  const inputType = toLynxInputType(props.type, multiline)

  return (
    <view className={props.className} style={rootStyle}>
      {props.startAdornment}
      {multiline ? (
        <textarea
          style={inputStyle}
          placeholder={props.placeholder}
          disabled={disabled}
          readonly={props.readOnly === true}
          maxlength={props.maxLength}
          name={props.name}
          bindinput={(e) => handleInput(e.detail.value)}
          bindfocus={() => handleFocus()}
          bindblur={() => handleBlur()}
        />
      ) : (
        <input
          style={inputStyle}
          type={inputType}
          placeholder={props.placeholder}
          disabled={disabled}
          readonly={props.readOnly === true}
          maxlength={props.maxLength}
          name={props.name}
          bindinput={(e) => handleInput(e.detail.value)}
          bindfocus={() => handleFocus()}
          bindblur={() => handleBlur()}
        />
      )}
      {props.endAdornment}
      {props.renderSuffix ? props.renderSuffix(state) : null}
    </view>
  )
}
InputBase.displayName = 'InputBase'
