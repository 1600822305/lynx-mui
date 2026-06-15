import { useCallback, useMemo, useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import {
  FormControlContext,
  type FormControlColor,
  type FormControlMargin,
  type FormControlSize,
  type FormControlState,
  type FormControlVariant,
} from './FormControlContext.js'

export interface FormControlProps {
  children?: ReactNode
  color?: FormControlColor
  disabled?: boolean
  error?: boolean
  /** Visually focused override (MUI `focused`). When set, drives the focus styling. */
  focused?: boolean
  fullWidth?: boolean
  hiddenLabel?: boolean
  margin?: FormControlMargin
  required?: boolean
  size?: FormControlSize
  variant?: FormControlVariant
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/** v7 FormControlRoot: inline-flex column, plus margin/fullWidth variants. */
function rootStyle(margin: FormControlMargin, fullWidth: boolean): LynxStyle {
  const sx: SxObject = {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'relative',
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0,
    verticalAlign: 'top',
  }
  if (margin === 'normal') {
    sx.marginTop = '16px'
    sx.marginBottom = '8px'
  } else if (margin === 'dense') {
    sx.marginTop = '8px'
    sx.marginBottom = '4px'
  }
  if (fullWidth) sx.width = '100%'
  return sxToStyle(sx, defaultTheme)
}

/**
 * MUI `FormControl` -> Lynx `<view>` column that provides FormControlContext to
 * its label / input / helper-text descendants.
 *
 * Lynx degradation: `component` prop is ignored (always renders `<view>`);
 * initial adornedStart/filled are seeded by the child InputBase reporting up
 * (no React.Children inspection, since `Children` is unavailable in ReactLynx).
 */
export function FormControl(props: FormControlProps) {
  const color = props.color ?? 'primary'
  const disabled = props.disabled === true
  const error = props.error === true
  const fullWidth = props.fullWidth === true
  const hiddenLabel = props.hiddenLabel === true
  const margin = props.margin ?? 'none'
  const required = props.required === true
  const size = props.size ?? 'medium'
  const variant = props.variant ?? 'outlined'

  const [adornedStart, setAdornedStart] = useState(false)
  const [filled, setFilled] = useState(false)
  const [focusedState, setFocused] = useState(false)

  // MUI: a disabled control can never look focused; explicit `focused` prop wins.
  const focused = props.focused !== undefined && !disabled ? props.focused : focusedState

  const onFilled = useCallback(() => setFilled(true), [])
  const onEmpty = useCallback(() => setFilled(false), [])
  const onFocus = useCallback(() => setFocused(true), [])
  const onBlur = useCallback(() => setFocused(false), [])

  const contextValue = useMemo<FormControlState>(
    () => ({
      adornedStart,
      setAdornedStart,
      color,
      disabled,
      error,
      filled,
      focused,
      fullWidth,
      hiddenLabel,
      required,
      size,
      variant,
      onBlur,
      onFocus,
      onEmpty,
      onFilled,
    }),
    [
      adornedStart,
      color,
      disabled,
      error,
      filled,
      focused,
      fullWidth,
      hiddenLabel,
      required,
      size,
      variant,
      onBlur,
      onFocus,
      onEmpty,
      onFilled,
    ],
  )

  const style: LynxStyle = {
    ...rootStyle(margin, fullWidth),
    ...sxToStyle(props.sx, defaultTheme),
    ...props.style,
  }

  return (
    <FormControlContext.Provider value={contextValue}>
      <view className={props.className} style={style}>
        {props.children}
      </view>
    </FormControlContext.Provider>
  )
}
FormControl.displayName = 'FormControl'
