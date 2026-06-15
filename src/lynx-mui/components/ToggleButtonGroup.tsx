import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import type { ToggleButtonColor, ToggleButtonSize } from './ToggleButton.js'

export type ToggleButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ToggleButtonGroupProps extends BaseProps {
  /** Selected value(s). Scalar when `exclusive`, otherwise an array. */
  value?: unknown
  /** Single-selection mode: value becomes a scalar (or null) instead of an array. */
  exclusive?: boolean
  /** Called with the next value: scalar/null when `exclusive`, else an array. */
  onChange?: (value: unknown) => void
  color?: ToggleButtonColor
  size?: ToggleButtonSize
  orientation?: ToggleButtonGroupOrientation
  fullWidth?: boolean
}

interface ToggleButtonGroupOwnerState {
  color: ToggleButtonColor
  size: ToggleButtonSize
  orientation: ToggleButtonGroupOrientation
  fullWidth: boolean
  disabled: boolean
}

function toggleButtonGroupRootStyle(os: ToggleButtonGroupOwnerState, theme: Theme): SxObject {
  // v7 ToggleButtonGroupRoot: display inline-flex, borderRadius shape.borderRadius.
  const style: SxObject = {
    display: 'inline-flex',
    flexDirection: os.orientation === 'vertical' ? 'column' : 'row',
    borderRadius: `${theme.shape.borderRadius}px`,
  }
  if (os.fullWidth) style.width = '100%'
  return style
}

/** Whether a child's value is currently selected. */
function isValueSelected(value: unknown, candidate: unknown, exclusive: boolean): boolean {
  if (candidate === undefined) return false
  if (exclusive) return value === candidate
  return Array.isArray(value) && value.indexOf(candidate) >= 0
}

/** Next value when a button is toggled (mirrors v7 handleChange/handleExclusiveChange). */
function nextValue(value: unknown, candidate: unknown, exclusive: boolean): unknown {
  if (exclusive) return value === candidate ? null : candidate
  const arr = Array.isArray(value) ? value.slice() : []
  const index = arr.indexOf(candidate)
  if (index >= 0) arr.splice(index, 1)
  else arr.push(candidate)
  return arr
}

/**
 * Per-position style for each grouped ToggleButton. Mirrors v7's
 * firstButton/middleButton/lastButton variants: inner corners lose their radius
 * and adjacent 1px borders overlap (marginLeft/Top -1) into a single divider.
 *
 * Lynx degradation: the v7 "two adjacent selected buttons drop the shared
 * border" rule needs a sibling selector and is omitted.
 */
function groupedChildStyle(
  os: ToggleButtonGroupOwnerState,
  index: number,
  count: number,
  theme: Theme,
): LynxStyle {
  const r = `${theme.shape.borderRadius}px`
  const z = '0px'
  const horizontal = os.orientation === 'horizontal'
  const isFirst = index === 0
  const isLast = index === count - 1
  const style: Record<string, string> = {}
  if (count <= 1) return style as LynxStyle

  if (horizontal) {
    if (isFirst) {
      style.borderTopRightRadius = z
      style.borderBottomRightRadius = z
      style.borderTopLeftRadius = r
      style.borderBottomLeftRadius = r
    } else if (isLast) {
      style.borderTopLeftRadius = z
      style.borderBottomLeftRadius = z
      style.borderTopRightRadius = r
      style.borderBottomRightRadius = r
    } else {
      style.borderTopLeftRadius = z
      style.borderBottomLeftRadius = z
      style.borderTopRightRadius = z
      style.borderBottomRightRadius = z
    }
    if (!isFirst) style.marginLeft = '-1px'
  } else {
    if (isFirst) {
      style.borderBottomLeftRadius = z
      style.borderBottomRightRadius = z
      style.borderTopLeftRadius = r
      style.borderTopRightRadius = r
    } else if (isLast) {
      style.borderTopLeftRadius = z
      style.borderTopRightRadius = z
      style.borderBottomLeftRadius = r
      style.borderBottomRightRadius = r
    } else {
      style.borderTopLeftRadius = z
      style.borderTopRightRadius = z
      style.borderBottomLeftRadius = z
      style.borderBottomRightRadius = z
    }
    if (!isFirst) style.marginTop = '-1px'
  }
  return style as LynxStyle
}

/**
 * MUI `ToggleButtonGroup` -> Lynx `<view>` wrapping `ToggleButton` children.
 *
 * Clones each child to inject `selected` (matched against `value`),
 * group `color/size/disabled/fullWidth` (child props win), the toggle
 * `onClick`, and per-position style. `onChange` reports the next value
 * (scalar/null when `exclusive`, else an array) — there is no DOM event.
 */
export const ToggleButtonGroup = createComponent<ToggleButtonGroupOwnerState, ToggleButtonGroupProps>({
  name: 'ToggleButtonGroup',
  root: 'view',
  defaultProps: {
    exclusive: false,
    color: 'standard',
    size: 'medium',
    orientation: 'horizontal',
    fullWidth: false,
  },
  ownerState: (p) => ({
    color: p.color ?? 'standard',
    size: p.size ?? 'medium',
    orientation: p.orientation ?? 'horizontal',
    fullWidth: p.fullWidth === true,
    disabled: p.disabled === true,
  }),
  rootStyle: toggleButtonGroupRootStyle,
  content: ({ ownerState, theme, props }) => {
    const { value, exclusive = false, onChange } = props
    const childArray = Array.isArray(props.children) ? props.children : [props.children]
    const children = childArray.filter(isValidElement)
    const count = children.length
    return (
      <>
        {children.map((child: ReactNode, index: number) => {
          if (!isValidElement(child)) return child
          const el = child as ReactElement<Record<string, unknown>>
          const buttonValue = el.props.value
          const selected = isValueSelected(value, buttonValue, exclusive)
          const existingStyle = (el.props.style ?? {}) as Record<string, unknown>
          const origClick = el.props.onClick as (() => void) | undefined
          return cloneElement(el, {
            key: `tbg-${index}`,
            selected,
            color: el.props.color ?? ownerState.color,
            size: el.props.size ?? ownerState.size,
            fullWidth: el.props.fullWidth ?? ownerState.fullWidth,
            disabled: el.props.disabled ?? (ownerState.disabled || undefined),
            onClick: () => {
              if (onChange && buttonValue !== undefined) onChange(nextValue(value, buttonValue, exclusive))
              if (origClick) origClick()
            },
            style: {
              ...existingStyle,
              ...groupedChildStyle(ownerState, index, count, theme),
            },
          })
        })}
      </>
    )
  },
})
