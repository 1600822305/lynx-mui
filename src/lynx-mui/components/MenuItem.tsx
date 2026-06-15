import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export interface MenuItemProps extends BaseProps {
  /** If `true`, the item renders in the selected state. @default false */
  selected?: boolean
  /** Compact vertical padding + body2 typography. @default false */
  dense?: boolean
  /** Adds a 1px bottom divider. @default false */
  divider?: boolean
  /** Removes the left/right padding. @default false */
  disableGutters?: boolean
}

interface MenuItemOwnerState {
  selected: boolean
  dense: boolean
  divider: boolean
  disableGutters: boolean
  disabled: boolean
}

function menuItemRootStyle(os: MenuItemOwnerState, theme: Theme): SxObject {
  const { action } = theme.palette
  const selectedBg = alpha(theme.palette.primary.main, action.selectedOpacity)
  // selected + hover collapses to selectedOpacity + hoverOpacity (per v7 cascade).
  const selectedHoverBg = alpha(theme.palette.primary.main, action.selectedOpacity + action.hoverOpacity)

  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    // v7 base minHeight is 48 (32 dense); the `sm` breakpoint override to 'auto'
    // is dropped (no media queries on Lynx) — mobile value is kept.
    minHeight: os.dense ? 32 : 48,
    paddingTop: os.dense ? 4 : 6,
    paddingBottom: os.dense ? 4 : 6,
    backgroundColor: os.selected ? selectedBg : 'transparent',
    // hover -> &:active on Lynx.
    '&:active': { backgroundColor: os.selected ? selectedHoverBg : action.hover },
  }
  if (!os.disableGutters) {
    style.paddingLeft = 16
    style.paddingRight = 16
  }
  if (os.divider) {
    style.borderBottomWidth = 1
    style.borderBottomStyle = 'solid'
    style.borderBottomColor = theme.palette.divider
  }
  if (os.disabled) style.opacity = action.disabledOpacity
  return style
}

/** v7 MenuItem inherits body1 (body2 when dense); Lynx text needs it explicitly. */
function menuItemTextStyle(os: MenuItemOwnerState, theme: Theme): LynxStyle {
  const t = os.dense ? theme.typography.body2 : theme.typography.body1
  return sxToStyle({
    fontSize: `${t.fontSize}px`,
    fontWeight: `${t.fontWeight}`,
    lineHeight: `${t.lineHeight}`,
    letterSpacing: `${t.letterSpacing}px`,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
  }, theme)
}

/**
 * MUI `MenuItem` -> Lynx tappable `<view>` row.
 *
 * Lynx degradations: no ButtonBase ripple; hover maps to `&:active`;
 * `focusVisible` background and the `sm` `minHeight: auto` override are dropped;
 * `dense` is per-item (no ListContext inheritance from a parent Menu/List).
 */
export const MenuItem = createComponent<MenuItemOwnerState, MenuItemProps>({
  name: 'MenuItem',
  root: 'view',
  stateful: { active: true },
  defaultProps: { selected: false, dense: false, divider: false, disableGutters: false },
  ownerState: (p) => ({
    selected: p.selected === true,
    dense: p.dense === true,
    divider: p.divider === true,
    disableGutters: p.disableGutters === true,
    disabled: p.disabled === true,
  }),
  rootStyle: menuItemRootStyle,
  content: ({ ownerState, theme, props }) => {
    const { children } = props
    if (children == null) return null
    if (typeof children === 'string' || typeof children === 'number') {
      return <text style={menuItemTextStyle(ownerState, theme)}>{children}</text>
    }
    return children
  },
})
