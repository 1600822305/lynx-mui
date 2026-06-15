import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import type { IconProps } from '../icons/createSvgIcon.js'
import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export interface BottomNavigationActionProps extends BaseProps {
  icon?: ReactNode
  label?: ReactNode
  /** Identifies this action; defaults to the child index inside BottomNavigation. */
  value?: unknown
  /** Injected by `BottomNavigation`. */
  selected?: boolean
  /** Injected by `BottomNavigation`. */
  showLabel?: boolean
}

interface BottomNavigationActionOwnerState {
  selected: boolean
  showLabel: boolean
  hasLabel: boolean
}

/** Selected actions tint to primary.main; others to text.secondary. */
function actionColor(os: BottomNavigationActionOwnerState, theme: Theme): string {
  return os.selected ? theme.palette.primary.main : theme.palette.text.secondary
}

function bottomNavigationActionRootStyle(
  os: BottomNavigationActionOwnerState,
  theme: Theme,
): SxObject {
  const { duration, easing } = theme.transitions
  // v7 variants: icon-only (!showLabel && !selected) gets paddingTop 14 to keep
  // the icon centered while the (opacity-0) label still occupies layout space;
  // with no label at all it stays 0.
  const paddingTop = !os.showLabel && !os.selected ? (os.hasLabel ? 14 : 0) : 0
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 80,
    maxWidth: 168,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 0,
    paddingTop,
    color: actionColor(os, theme),
    // v7: transition(['color', 'padding-top'], { duration: short }).
    transition:
      `color ${duration.short}ms ${easing.easeInOut}, padding-top ${duration.short}ms ${easing.easeInOut}`,
  }
}

/** v7 BottomNavigationActionLabel: 12px (14px when selected), hidden when icon-only. */
function labelStyle(os: BottomNavigationActionOwnerState, theme: Theme): LynxStyle {
  const hidden = !os.showLabel && !os.selected
  return sxToStyle({
    fontSize: os.selected ? '14px' : '12px',
    fontWeight: '400',
    color: actionColor(os, theme),
    opacity: hidden ? 0 : 1,
    // Lynx degradation: transitionDelay (0.1s) dropped.
    transition: 'font-size 200ms, opacity 200ms',
  }, theme)
}

/** Inject `htmlColor` into the icon (Lynx `<svg>` can't inherit `currentColor`). */
function tintIcon(node: ReactNode, color: string): ReactNode {
  if (!isValidElement(node)) return node
  const el = node as ReactElement<IconProps>
  const hasExplicit = el.props.htmlColor != null || (el.props.color != null && el.props.color !== 'inherit')
  return hasExplicit ? node : cloneElement(el, { htmlColor: color })
}

/**
 * MUI `BottomNavigationAction` -> Lynx tappable `<view>` column holding the
 * tinted icon and a `<text>` label.
 *
 * Lynx degradations: no ButtonBase ripple; the label's `transitionDelay` is
 * dropped; the icon is tinted via `htmlColor` (no `currentColor` inheritance).
 */
export const BottomNavigationAction = createComponent<
  BottomNavigationActionOwnerState,
  BottomNavigationActionProps
>({
  name: 'BottomNavigationAction',
  root: 'view',
  ownerState: (p) => ({
    selected: p.selected === true,
    showLabel: p.showLabel === true,
    hasLabel: p.label != null,
  }),
  rootStyle: bottomNavigationActionRootStyle,
  content: ({ ownerState, theme, props }) => {
    const color = actionColor(ownerState, theme)
    return (<>
      {tintIcon(props.icon, color)}
      {props.label != null ? (
        <text style={labelStyle(ownerState, theme)}>{props.label}</text>
      ) : null}
    </>)
  },
})
