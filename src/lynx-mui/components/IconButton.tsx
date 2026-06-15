import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import type { IconProps } from '../icons/createSvgIcon.js'
import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export type IconButtonColor =
  | 'default' | 'inherit' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type IconButtonSize = 'small' | 'medium' | 'large'
export type IconButtonEdge = 'start' | 'end' | false

export interface IconButtonProps extends BaseProps {
  color?: IconButtonColor
  size?: IconButtonSize
  edge?: IconButtonEdge
}

interface IconButtonOwnerState {
  color: IconButtonColor
  size: IconButtonSize
  edge: IconButtonEdge
  disabled: boolean
}

// v7 source: padding 8 / fontSize 24 (medium); small 5 / 18; large 12 / 28.
const padding: Record<IconButtonSize, number> = { small: 5, medium: 8, large: 12 }
// MUI uses borderRadius '50%'; repo avoids % radii, so px = padding + half the
// default 24px icon, which clamps the (padding*2 + 24) box to a circle.
const radius: Record<IconButtonSize, number> = { small: 17, medium: 20, large: 24 }

// MUI action.hoverOpacity (0.04): the tint applied on hover -> Lynx press.
const HOVER_OPACITY = 0.04

type PaletteColorKey = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

/** The color MUI tints the icon with (and the hover/press background base).
 * `inherit` keeps the icon's own color, so returns undefined. */
function tintColor(color: IconButtonColor, theme: Theme): string | undefined {
  switch (color) {
    case 'inherit': return undefined
    case 'default': return theme.palette.action.active
    default: return theme.palette[color as PaletteColorKey].main
  }
}

function iconButtonRootStyle(os: IconButtonOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    textAlign: 'center',
    padding: `${padding[os.size]}px`,
    borderRadius: `${radius[os.size]}px`,
  }

  const negative = os.size === 'small' ? '-3px' : '-12px'
  if (os.edge === 'start') style.marginLeft = negative
  if (os.edge === 'end') style.marginRight = negative

  if (!os.disabled) {
    const base = tintColor(os.color, theme) ?? theme.palette.action.active
    style['&:active'] = { backgroundColor: alpha(base, HOVER_OPACITY) }
  }
  return style
}

/** Tint a child icon by injecting `htmlColor` (Lynx `<svg>` can't inherit color).
 * Respects an icon's own explicit `htmlColor`/`color` unless the button is disabled. */
function tintChild(node: ReactNode, tint: string | undefined, disabled: boolean): ReactNode {
  if (!isValidElement(node)) return node
  const el = node as ReactElement<IconProps>
  if (disabled) return cloneElement(el, { htmlColor: tint })
  if (tint == null) return node
  const hasExplicit = el.props.htmlColor != null || (el.props.color != null && el.props.color !== 'inherit')
  return hasExplicit ? node : cloneElement(el, { htmlColor: tint })
}

/** MUI `IconButton` -> Lynx `<view>` wrapping a (color-tinted) icon child. */
export const IconButton = createComponent<IconButtonOwnerState, IconButtonProps>({
  name: 'IconButton',
  root: 'view',
  defaultProps: { color: 'default', size: 'medium', edge: false },
  stateful: { active: true },
  ownerState: (p) => ({
    color: p.color ?? 'default',
    size: p.size ?? 'medium',
    edge: p.edge ?? false,
    disabled: p.disabled === true,
  }),
  rootStyle: iconButtonRootStyle,
  content: ({ ownerState, theme, props }) => {
    const tint = ownerState.disabled
      ? theme.palette.action.disabled
      : tintColor(ownerState.color, theme)
    const kids = Array.isArray(props.children) ? props.children : [props.children]
    return <>{kids.map((c) => tintChild(c, tint, ownerState.disabled))}</>
  },
})
