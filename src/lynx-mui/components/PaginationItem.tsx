import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import type { IconProps } from '../icons/createSvgIcon.js'
import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, PaletteColor, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'
import { SvgIcon } from './SvgIcon.js'

export type PaginationItemType =
  | 'page' | 'first' | 'last' | 'next' | 'previous' | 'start-ellipsis' | 'end-ellipsis'
export type PaginationItemColor =
  | 'standard' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
export type PaginationItemVariant = 'text' | 'outlined'
export type PaginationItemShape = 'circular' | 'rounded'
export type PaginationItemSize = 'small' | 'medium' | 'large'

export interface PaginationItemProps extends BaseProps {
  /** Page number rendered when `type === 'page'`. */
  page?: number | null
  type?: PaginationItemType
  selected?: boolean
  color?: PaginationItemColor
  variant?: PaginationItemVariant
  shape?: PaginationItemShape
  size?: PaginationItemSize
}

interface PaginationItemOwnerState {
  type: PaginationItemType
  selected: boolean
  disabled: boolean
  color: PaginationItemColor
  variant: PaginationItemVariant
  shape: PaginationItemShape
  size: PaginationItemSize
}

// v7 nav-icon path data, verbatim from @mui/material/internal/svg-icons (24x24).
const NAVIGATE_BEFORE = 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
const NAVIGATE_NEXT = 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'
const FIRST_PAGE = 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z'
const LAST_PAGE = 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z'

const iconPathByType: Partial<Record<PaginationItemType, string>> = {
  previous: NAVIGATE_BEFORE,
  next: NAVIGATE_NEXT,
  first: FIRST_PAGE,
  last: LAST_PAGE,
}

interface SizeSpec {
  minWidth: number
  height: number
  radius: number
  margin: string
  padding: string
  fontSize: number
  iconSize: number
}

// v7 PaginationItemPage size matrix (medium base + small/large variants).
const sizeSpecs: Record<PaginationItemSize, SizeSpec> = {
  small: { minWidth: 26, height: 26, radius: 13, margin: '0 1px', padding: '0 4px', fontSize: 14, iconSize: 18 },
  medium: { minWidth: 32, height: 32, radius: 16, margin: '0 3px', padding: '0 6px', fontSize: 14, iconSize: 20 },
  large: { minWidth: 40, height: 40, radius: 20, margin: '0 3px', padding: '0 10px', fontSize: 15, iconSize: 22 },
}

function paletteColor(theme: Theme, color: PaginationItemColor): PaletteColor | undefined {
  switch (color) {
    case 'primary': return theme.palette.primary
    case 'secondary': return theme.palette.secondary
    case 'error': return theme.palette.error
    case 'info': return theme.palette.info
    case 'success': return theme.palette.success
    case 'warning': return theme.palette.warning
    default: return undefined
  }
}

// v7 outlined border, light theme: 1px solid rgba(0, 0, 0, 0.23).
// FLAG: MUI computes this literal inline from palette.mode; no theme token exists.
const OUTLINED_BORDER = '1px solid rgba(0, 0, 0, 0.23)'

interface ItemColors {
  color: string
  backgroundColor: string
  activeBackgroundColor?: string
  border?: string
  opacity?: number
}

/**
 * Resolve color/background/border for a PaginationItem, following the v7 CSS
 * cascade. The `&.selected.disabled` rules (specificity 0,3,0) win, so every
 * disabled+selected item collapses to bg=action.selected / color=action.disabled.
 */
function resolveItemColors(os: PaginationItemOwnerState, theme: Theme): ItemColors {
  const action = theme.palette.action
  const pal = paletteColor(theme, os.color)

  let color = theme.palette.text.primary
  let backgroundColor = 'transparent'
  let activeBackgroundColor: string | undefined
  let border = os.variant === 'outlined' ? OUTLINED_BORDER : undefined
  let opacity: number | undefined

  if (os.selected) {
    if (os.variant === 'text' && pal) {
      color = pal.contrastText
      backgroundColor = pal.main
      activeBackgroundColor = pal.dark
    } else if (os.variant === 'outlined' && pal) {
      color = pal.main
      border = `1px solid ${alpha(pal.main, 0.5)}`
      backgroundColor = alpha(pal.main, action.activatedOpacity)
      activeBackgroundColor = alpha(pal.main, action.activatedOpacity + action.focusOpacity)
    } else {
      backgroundColor = action.selected
      activeBackgroundColor = alpha(action.selected, action.selectedOpacity + action.hoverOpacity)
    }
  } else {
    activeBackgroundColor = action.hover
  }

  if (os.disabled) {
    activeBackgroundColor = undefined
    if (os.selected) {
      backgroundColor = action.selected
      color = action.disabled
      opacity = 1
      if (os.variant === 'outlined') border = `1px solid ${action.disabledBackground}`
    } else {
      opacity = action.disabledOpacity
    }
  }

  return { color, backgroundColor, activeBackgroundColor, border, opacity }
}

function paginationItemRootStyle(os: PaginationItemOwnerState, theme: Theme): SxObject {
  const spec = sizeSpecs[os.size]
  const isEllipsis = os.type === 'start-ellipsis' || os.type === 'end-ellipsis'
  const colors = resolveItemColors(os, theme)
  const { duration, easing } = theme.transitions

  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    textAlign: 'center',
    minWidth: spec.minWidth,
    height: isEllipsis ? 'auto' : spec.height,
    padding: spec.padding,
    margin: spec.margin,
    borderRadius: os.shape === 'rounded' ? `${theme.shape.borderRadius}px` : `${spec.radius}px`,
    backgroundColor: colors.backgroundColor,
  }
  if (colors.border) style.border = colors.border
  if (colors.opacity !== undefined) style.opacity = colors.opacity

  if (!isEllipsis) {
    // v7: transition(['color', 'background-color'], { duration: short }).
    style.transition =
      `color ${duration.short}ms ${easing.easeInOut}, background-color ${duration.short}ms ${easing.easeInOut}`
    if (colors.activeBackgroundColor) {
      style['&:active'] = { backgroundColor: colors.activeBackgroundColor }
    }
  }

  return style
}

/** body2 label color carried explicitly (Lynx `<text>` doesn't inherit font). */
function labelStyle(os: PaginationItemOwnerState, theme: Theme): LynxStyle {
  const spec = sizeSpecs[os.size]
  const colors = resolveItemColors(os, theme)
  return sxToStyle({
    fontSize: `${spec.fontSize}px`,
    fontWeight: `${theme.typography.body2.fontWeight}`,
    lineHeight: `${theme.typography.body2.lineHeight}`,
    letterSpacing: `${theme.typography.body2.letterSpacing}px`,
    color: colors.color,
  }, theme)
}

/**
 * MUI `PaginationItem` -> Lynx `<view>` holding a page-number `<text>`, an
 * ellipsis `<text>`, or a nav `<svg>` icon (first/previous/next/last).
 *
 * Lynx degradations: `&:hover` -> `&:active` press feedback; `focusVisible`
 * background dropped (no keyboard focus on device); the nav-icon color is
 * injected via `htmlColor` since Lynx `<svg>` can't inherit `currentColor`.
 */
export const PaginationItem = createComponent<PaginationItemOwnerState, PaginationItemProps>({
  name: 'PaginationItem',
  root: 'view',
  defaultProps: {
    type: 'page',
    selected: false,
    color: 'standard',
    variant: 'text',
    shape: 'circular',
    size: 'medium',
  },
  stateful: { active: true },
  ownerState: (p) => ({
    type: p.type ?? 'page',
    selected: p.selected === true,
    disabled: p.disabled === true,
    color: p.color ?? 'standard',
    variant: p.variant ?? 'text',
    shape: p.shape ?? 'circular',
    size: p.size ?? 'medium',
  }),
  rootStyle: paginationItemRootStyle,
  content: ({ ownerState, theme, props }) => {
    const spec = sizeSpecs[ownerState.size]
    const colors = resolveItemColors(ownerState, theme)

    if (ownerState.type === 'start-ellipsis' || ownerState.type === 'end-ellipsis') {
      return <text style={labelStyle(ownerState, theme)}>{'\u2026'}</text>
    }

    const iconPath = iconPathByType[ownerState.type]
    if (iconPath) {
      // v7 PaginationItemPageIcon: margin '0 -8px', fontSize 20/18/22 by size.
      return (
        <SvgIcon
          pathData={iconPath}
          htmlColor={colors.color}
          size={spec.iconSize}
          sx={{ marginLeft: -8, marginRight: -8 }}
        />
      )
    }

    return <text style={labelStyle(ownerState, theme)}>{`${props.page ?? ''}`}</text>
  },
})

/** Tint a child icon by injecting `htmlColor` (Lynx `<svg>` can't inherit color). */
export function tintPaginationIcon(node: ReactNode, color: string): ReactNode {
  if (!isValidElement(node)) return node
  const el = node as ReactElement<IconProps>
  const hasExplicit = el.props.htmlColor != null || (el.props.color != null && el.props.color !== 'inherit')
  return hasExplicit ? node : cloneElement(el, { htmlColor: color })
}
