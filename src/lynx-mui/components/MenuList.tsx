import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export type MenuListVariant = 'menu' | 'selectedMenu'

export interface MenuListProps extends BaseProps {
  /**
   * v7 parity / keyboard-only — no-op on Lynx (no DOM focus or arrow-key nav):
   * `autoFocus`, `autoFocusItem`, `disabledItemsFocusable`, `disableListWrap`.
   */
  autoFocus?: boolean
  autoFocusItem?: boolean
  disabledItemsFocusable?: boolean
  disableListWrap?: boolean
  /** Affects focus/scroll alignment in v7; positioning-only, inert on Lynx. @default 'selectedMenu' */
  variant?: MenuListVariant
  /** Remove the top/bottom padding (List passthrough). @default false */
  disablePadding?: boolean
}

interface MenuListOwnerState {
  disablePadding: boolean
}

/** v7 MenuList renders a `List` (role="menu"): flex column with 8px block padding. */
function menuListStyle(os: MenuListOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'column',
  }
  if (!os.disablePadding) {
    style.paddingTop = 8
    style.paddingBottom = 8
  }
  return style
}

/**
 * MUI `MenuList` -> Lynx `<view>` column of `MenuItem`s.
 *
 * Lynx degradation: all keyboard navigation / focus management (the bulk of the
 * v7 component) is dropped — there is no DOM focus or arrow-key handling on a
 * device. The `variant` and `autoFocus*` props are accepted for API parity but
 * are inert.
 */
export const MenuList = createComponent<MenuListOwnerState, MenuListProps>({
  name: 'MenuList',
  root: 'view',
  defaultProps: { variant: 'selectedMenu', disablePadding: false },
  ownerState: (p) => ({ disablePadding: p.disablePadding === true }),
  rootStyle: menuListStyle,
})
