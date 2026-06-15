import type { ReactNode } from '@lynx-js/react'

import type { AnchorRect } from '../hooks/useAnchorRect.js'
import type { LynxStyle, SxProp } from '../system/types.js'
import { MenuList } from './MenuList.js'
import type { MenuListVariant } from './MenuList.js'
import { Popover } from './Popover.js'
import type { PopoverCloseReason, PopoverOrigin } from './Popover.js'

export interface MenuProps {
  open: boolean
  /** Lynx replacement for `anchorEl`: the anchor rect from `useAnchorRect`. */
  anchorRect?: AnchorRect | null
  /** Fired when the (invisible) backdrop is tapped. */
  onClose?: (reason: PopoverCloseReason) => void
  /** Menu contents, normally `MenuItem`s. */
  children?: ReactNode
  /** @default { vertical: 'bottom', horizontal: 'left' } */
  anchorOrigin?: PopoverOrigin
  /** @default { vertical: 'top', horizontal: 'left' } */
  transformOrigin?: PopoverOrigin
  /** Paper elevation. @default 8 */
  elevation?: number
  /** @default 'selectedMenu' */
  variant?: MenuListVariant
  /** Accepted for v7 parity; inert on Lynx (no DOM focus). @default true */
  autoFocus?: boolean
  keepMounted?: boolean
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

// v7 Menu origins (LTR): opens below the anchor, pinned by its top-left corner.
const MENU_ANCHOR_ORIGIN: PopoverOrigin = { vertical: 'bottom', horizontal: 'left' }
const MENU_TRANSFORM_ORIGIN: PopoverOrigin = { vertical: 'top', horizontal: 'left' }

/**
 * MUI `Menu` -> `Popover` + `MenuList`.
 *
 * Lynx degradations: inherits Popover's (anchorRect instead of anchorEl, invisible
 * tap-to-close backdrop, no transitions); all keyboard focus/auto-focus behaviour
 * is dropped. Clicking a `MenuItem` does not auto-close (matches v7) — wire each
 * item's `onClick` to your `onClose`/state.
 */
export function Menu(props: MenuProps) {
  return (
    <Popover
      open={props.open}
      anchorRect={props.anchorRect}
      onClose={props.onClose}
      anchorOrigin={props.anchorOrigin ?? MENU_ANCHOR_ORIGIN}
      transformOrigin={props.transformOrigin ?? MENU_TRANSFORM_ORIGIN}
      elevation={props.elevation ?? 8}
      keepMounted={props.keepMounted}
      // specZ: leave a tappable strip so the menu never fills the whole viewport.
      paperSx={{ maxHeight: 'calc(100% - 96px)' }}
      sx={props.sx}
      style={props.style}
      className={props.className}
    >
      <MenuList variant={props.variant ?? 'selectedMenu'}>{props.children}</MenuList>
    </Popover>
  )
}
Menu.displayName = 'Menu'
