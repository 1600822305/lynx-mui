import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { useControlled } from '../hooks/useControlled.js'
import type { LynxStyle, SxProp } from '../system/types.js'
import { FormGroup } from './FormGroup.js'

interface RadioChildProps {
  value?: unknown
  control?: ReactElement
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export interface RadioGroupProps {
  children?: ReactNode
  value?: string
  defaultValue?: string
  name?: string
  row?: boolean
  /** Lynx degradation: reports the selected value directly (no DOM event). */
  onChange?: (value: string) => void
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `RadioGroup` -> FormGroup + controlled selection.
 *
 * Lynx degradations:
 *  - `RadioGroupContext` + `useId` are unavailable in ReactLynx, so selection is
 *    wired by cloning children: `checked`/`onChange` are injected into each
 *    `<Radio>` (or into the `control` of each `<FormControlLabel>`, since
 *    FormControlLabel does not forward those to its control).
 *  - children are read from `props.children` directly (no `React.Children`),
 *    so only top-level Radio/FormControlLabel children are wired.
 */
export function RadioGroup(props: RadioGroupProps) {
  const [value, setValue] = useControlled<string | undefined>(props.value, props.defaultValue)

  const handleSelect = (next: string) => {
    setValue(next)
    props.onChange?.(next)
  }

  const items = Array.isArray(props.children) ? props.children : [props.children]
  const children = items.map((child: ReactNode, index: number) => {
    if (!isValidElement(child)) return child
    const el = child as ReactElement<RadioChildProps>
    const childValue = el.props.value
    const checked = childValue !== undefined && String(childValue) === String(value)
    const onChange = (c: boolean) => {
      if (c && childValue !== undefined) handleSelect(String(childValue))
    }

    if (isValidElement(el.props.control)) {
      const control = el.props.control as ReactElement<RadioChildProps>
      return cloneElement(el, {
        key: index,
        control: cloneElement(control, { checked, onChange }),
      })
    }
    return cloneElement(el, { key: index, checked, onChange })
  })

  return (
    <FormGroup row={props.row} className={props.className} style={props.style} sx={props.sx}>
      {children}
    </FormGroup>
  )
}
RadioGroup.displayName = 'RadioGroup'
