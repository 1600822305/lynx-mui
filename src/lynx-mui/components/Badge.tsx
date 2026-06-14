import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export type BadgeColor = 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type BadgeVariant = 'standard' | 'dot'

type BadgePaletteColor = Exclude<BadgeColor, 'default'>

export interface BadgeProps extends BaseProps {
  badgeContent?: ReactNode
  color?: BadgeColor
  variant?: BadgeVariant
  max?: number
  showZero?: boolean
  invisible?: boolean
}

interface BadgeOwnerState {
  color: BadgeColor
  variant: BadgeVariant
  max: number
  showZero: boolean
  invisible: boolean
  badgeContent: ReactNode
}

// v7 source: RADIUS_STANDARD = 10, RADIUS_DOT = 4
const RADIUS_STANDARD = 10
const RADIUS_DOT = 4

function badgeStyle(os: BadgeOwnerState, theme: Theme): SxObject {
  return {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
  }
}

function getBadgeElementStyle(os: BadgeOwnerState, theme: Theme): LynxStyle {
  const isDot = os.variant === 'dot'
  const radius = isDot ? RADIUS_DOT : RADIUS_STANDARD

  const sx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    boxSizing: 'border-box',
    fontWeight: '500',
    fontSize: '12px',
    minWidth: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    lineHeight: 1,
    zIndex: 1,
    // v7 positioning: top-right corner.
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    transformOrigin: '100% 0%',
  }

  if (isDot) {
    sx.padding = 0
  } else {
    sx.padding = '0 6px'
  }

  // Color.
  if (os.color !== 'default') {
    const c = theme.palette[os.color as BadgePaletteColor]
    sx.backgroundColor = c.main
    sx.color = c.contrastText
  } else {
    // Default: grey background (v7 fallback, no explicit palette entry).
    sx.backgroundColor = theme.palette.grey['300']
    sx.color = theme.palette.text.primary
  }

  return sxToStyle(sx, theme)
}

function getBadgeTextStyle(theme: Theme): LynxStyle {
  return sxToStyle({
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: 1,
    color: 'inherit',
  }, theme)
}

/** Compute display value and visibility. */
function resolveBadge(os: BadgeOwnerState): { displayValue: string | undefined; visible: boolean } {
  if (os.invisible) return { displayValue: undefined, visible: false }
  if (os.variant === 'dot') return { displayValue: undefined, visible: true }
  if (os.badgeContent == null) return { displayValue: undefined, visible: false }
  if (os.badgeContent === 0 && !os.showZero) return { displayValue: undefined, visible: false }
  const num = Number(os.badgeContent)
  const displayValue = !isNaN(num) && num > os.max ? `${os.max}+` : `${os.badgeContent}`
  return { displayValue, visible: true }
}

/** MUI `Badge` -> Lynx `<view>` (relative wrapper) + badge `<view>` + `<text>`. */
export const Badge = createComponent<BadgeOwnerState, BadgeProps>({
  name: 'Badge',
  root: 'view',
  defaultProps: { color: 'default', variant: 'standard', max: 99, showZero: false, invisible: false },
  ownerState: (p) => ({
    color: p.color ?? 'default',
    variant: p.variant ?? 'standard',
    max: p.max ?? 99,
    showZero: p.showZero === true,
    invisible: p.invisible === true,
    badgeContent: p.badgeContent,
  }),
  rootStyle: badgeStyle,
  content: ({ ownerState, theme, props }) => {
    const { displayValue, visible } = resolveBadge(ownerState)
    const badgeElStyle = getBadgeElementStyle(ownerState, theme)
    const textStyle = getBadgeTextStyle(theme)

    return (
      <>
        {props.children}
        {visible && (
          <view style={badgeElStyle}>
            {ownerState.variant !== 'dot' && displayValue != null && (
              <text style={textStyle}>{displayValue}</text>
            )}
          </view>
        )}
      </>
    )
  },
})
