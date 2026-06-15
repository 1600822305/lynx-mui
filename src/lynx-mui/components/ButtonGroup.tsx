import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'
import type { ButtonColor, ButtonSize, ButtonVariant } from './Button.js'

export type ButtonGroupVariant = ButtonVariant
export type ButtonGroupColor = ButtonColor
export type ButtonGroupSize = ButtonSize
export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps extends BaseProps {
  variant?: ButtonGroupVariant
  color?: ButtonGroupColor
  size?: ButtonGroupSize
  orientation?: ButtonGroupOrientation
  fullWidth?: boolean
  disableElevation?: boolean
}

interface ButtonGroupOwnerState {
  variant: ButtonGroupVariant
  color: ButtonGroupColor
  size: ButtonGroupSize
  orientation: ButtonGroupOrientation
  fullWidth: boolean
  disabled: boolean
  disableElevation: boolean
}

// v7 ButtonGroup grouped buttons clamp minWidth to 40 (overrides Button's 64).
const GROUPED_MIN_WIDTH = '40px'

function buttonGroupRootStyle(os: ButtonGroupOwnerState, theme: Theme): SxObject {
  // v7 ButtonGroupRoot: display inline-flex, borderRadius shape.borderRadius.
  const style: SxObject = {
    display: 'inline-flex',
    flexDirection: os.orientation === 'vertical' ? 'column' : 'row',
    borderRadius: `${theme.shape.borderRadius}px`,
  }
  if (os.fullWidth) style.width = '100%'
  // v7: contained -> shadows[2]; disableElevation -> none.
  if (os.variant === 'contained' && !os.disableElevation) {
    style.boxShadow = theme.shadows[2]
  }
  return style
}

/**
 * Per-position style overrides injected into each grouped child Button.
 * Mirrors v7 ButtonGroupRoot's firstButton/middleButton/lastButton variants:
 * inner corners lose their radius, and adjacent buttons are joined with a
 * divider (text/contained) or overlapping border (outlined).
 */
function groupedChildStyle(
  os: ButtonGroupOwnerState,
  index: number,
  count: number,
  theme: Theme,
): LynxStyle {
  const r = `${theme.shape.borderRadius}px`
  const z = '0px'
  const horizontal = os.orientation === 'horizontal'
  const isFirst = index === 0
  const isLast = index === count - 1
  const style: Record<string, string> = { minWidth: GROUPED_MIN_WIDTH }

  // v7: ButtonGroupContext forwards disableElevation to each child Button, which
  // then zeroes its own shadow. Without disableElevation, children keep their
  // contained shadow (root carries shadows[2] too) — matching MUI 1:1.
  if (os.disableElevation) style.boxShadow = 'none'

  if (count > 1) {
    // Inner-corner radius removal (first/middle/last).
    if (horizontal) {
      if (isFirst) {
        style.borderTopLeftRadius = r
        style.borderBottomLeftRadius = r
        style.borderTopRightRadius = z
        style.borderBottomRightRadius = z
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
    } else if (isFirst) {
      style.borderTopLeftRadius = r
      style.borderTopRightRadius = r
      style.borderBottomLeftRadius = z
      style.borderBottomRightRadius = z
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

    if (os.variant === 'outlined') {
      // v7: overlap adjacent 1px borders so they merge into a single line.
      if (!isFirst) {
        if (horizontal) style.marginLeft = '-1px'
        else style.marginTop = '-1px'
      }
    } else if (!isLast) {
      // text/contained: a divider sits on the inner edge of every non-last button.
      // v7: text -> alpha(color.main, .5); contained -> color.dark (the contained
      // color variant overrides the base grey[400] divider with palette[color].dark);
      // disabled -> action.disabled (the `.disabled` border rule, both variants).
      const dividerColor = os.disabled
        ? theme.palette.action.disabled
        : os.variant === 'contained'
          ? theme.palette[os.color].dark
          : alpha(theme.palette[os.color].main, 0.5)
      if (horizontal) style.borderRight = `1px solid ${dividerColor}`
      else style.borderBottom = `1px solid ${dividerColor}`
    }
  }

  return style as LynxStyle
}

/**
 * MUI `ButtonGroup` -> Lynx `<view>` flex container wrapping `Button` children.
 *
 * Lynx degradation: MUI shares group props via `ButtonGroupContext`; Lynx has no
 * such context wiring here, so the group injects `variant/color/size/disabled/
 * fullWidth` (child props win) plus per-position style by cloning each child.
 */
export const ButtonGroup = createComponent<ButtonGroupOwnerState, ButtonGroupProps>({
  name: 'ButtonGroup',
  root: 'view',
  defaultProps: {
    variant: 'outlined',
    color: 'primary',
    size: 'medium',
    orientation: 'horizontal',
    fullWidth: false,
    disableElevation: false,
  },
  ownerState: (p) => ({
    variant: p.variant ?? 'outlined',
    color: p.color ?? 'primary',
    size: p.size ?? 'medium',
    orientation: p.orientation ?? 'horizontal',
    fullWidth: p.fullWidth === true,
    disabled: p.disabled === true,
    disableElevation: p.disableElevation === true,
  }),
  rootStyle: buttonGroupRootStyle,
  content: ({ ownerState, theme, props }) => {
    const childArray = Array.isArray(props.children) ? props.children : [props.children]
    const children = childArray.filter(isValidElement)
    const count = children.length
    return (
      <>
        {children.map((child: ReactNode, index: number) => {
          if (!isValidElement(child)) return child
          const el = child as ReactElement<Record<string, unknown>>
          const existingStyle = (el.props.style ?? {}) as Record<string, unknown>
          return cloneElement(el, {
            key: `bg-${index}`,
            // Group props as defaults; explicit child props win (mirrors MUI context).
            variant: el.props.variant ?? ownerState.variant,
            color: el.props.color ?? ownerState.color,
            size: el.props.size ?? ownerState.size,
            fullWidth: el.props.fullWidth ?? ownerState.fullWidth,
            disabled: el.props.disabled ?? (ownerState.disabled || undefined),
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
