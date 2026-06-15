import { createContext, useContext } from '@lynx-js/react'

import type { SelectionControlColor } from './SwitchBase.js'

export type FormControlColor = SelectionControlColor
export type FormControlSize = 'small' | 'medium'
export type FormControlVariant = 'standard' | 'outlined' | 'filled'
export type FormControlMargin = 'none' | 'dense' | 'normal'

/**
 * State shared by a `FormControl` with its descendants (FormLabel / InputLabel /
 * FormHelperText / InputBase / InputAdornment), mirroring MUI's FormControlContext.
 *
 * Lynx degradation: MUI's `registerEffect` (StrictMode double-mount guard) is
 * dropped — Lynx has no such concern here.
 */
export interface FormControlState {
  adornedStart: boolean
  setAdornedStart: (value: boolean) => void
  color: FormControlColor
  disabled: boolean
  error: boolean
  filled: boolean
  focused: boolean
  fullWidth: boolean
  hiddenLabel: boolean
  required: boolean
  size: FormControlSize
  variant: FormControlVariant
  onBlur: () => void
  onFocus: () => void
  onEmpty: () => void
  onFilled: () => void
}

export const FormControlContext = createContext<FormControlState | undefined>(undefined)
FormControlContext.displayName = 'FormControlContext'

/** MUI `useFormControl` -> read the nearest FormControl state (or undefined). */
export function useFormControl(): FormControlState | undefined {
  return useContext(FormControlContext)
}

/**
 * MUI `formControlState`: for each requested key, prefer the component's own prop,
 * otherwise fall back to the surrounding FormControl's value.
 */
export function formControlState<T>(
  propValue: T | undefined,
  fcsValue: T | undefined,
  fallback: T,
): T {
  if (propValue !== undefined) return propValue
  if (fcsValue !== undefined) return fcsValue
  return fallback
}
