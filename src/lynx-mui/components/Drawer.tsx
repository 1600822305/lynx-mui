import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { FixedLayer } from './Portal.js'
import { Paper } from './Paper.js'

export type DrawerAnchor = 'left' | 'top' | 'right' | 'bottom'
export type DrawerVariant = 'permanent' | 'persistent' | 'temporary'
export type DrawerCloseReason = 'backdropClick'

export interface DrawerProps {
  /** If true, the drawer is open (ignored for `variant="permanent"`). @default false */
  open?: boolean
  /** Side from which the drawer appears. @default 'left' */
  anchor?: DrawerAnchor
  /** @default 'temporary' */
  variant?: DrawerVariant
  /** Elevation of the sliding surface (temporary only; docked is flat). @default 16 */
  elevation?: number
  /** If true, the backdrop is not rendered (temporary only). @default false */
  hideBackdrop?: boolean
  /** Fired when the backdrop is tapped (reason `'backdropClick'`). */
  onClose?: (reason: DrawerCloseReason) => void
  children?: ReactNode
  /** Extra styling merged into the sliding `Paper` surface (e.g. `{ width: 250 }`). */
  paperSx?: SxObject
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/** Edge-anchored geometry for the Paper, mirroring DrawerPaper's per-anchor variants. */
function paperAnchorSx(anchor: DrawerAnchor): SxObject {
  switch (anchor) {
    case 'right':
      return { top: 0, right: 0, height: '100%' }
    case 'top':
      return { top: 0, left: 0, right: 0, height: 'auto', maxHeight: '100%' }
    case 'bottom':
      return { top: 'auto', bottom: 0, left: 0, right: 0, height: 'auto', maxHeight: '100%' }
    case 'left':
    default:
      return { top: 0, left: 0, height: '100%' }
  }
}

/** Docked (persistent/permanent) edge border, mirroring paperAnchorDocked*. */
function dockedBorderSx(anchor: DrawerAnchor, divider: string): SxObject {
  switch (anchor) {
    case 'right':
      return { borderLeftWidth: '1px', borderLeftStyle: 'solid', borderLeftColor: divider }
    case 'top':
      return { borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: divider }
    case 'bottom':
      return { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: divider }
    case 'left':
    default:
      return { borderRightWidth: '1px', borderRightStyle: 'solid', borderRightColor: divider }
  }
}

/**
 * MUI `Drawer` -> Lynx edge-anchored panel.
 * MUI DrawerPaper: overflowY auto, display flex, flexDirection column, height 100%,
 * zIndex theme.zIndex.drawer, position fixed, outline 0; anchor left -> left 0,
 * right -> right 0, top -> {top/left/right 0, height auto, maxHeight 100%},
 * bottom -> {bottom/left/right 0, height auto, maxHeight 100%}; docked variants add
 * a 1px solid divider border on the inner edge. Paper elevation 16 (temporary) / 0
 * (docked), square. Temporary wraps the Paper in a Modal (backdrop + slide).
 *
 * Lynx degradations:
 * - No Slide enter/exit transition (the panel appears/disappears immediately).
 * - `position: fixed` is used only for the docked (top-level) Paper; inside the
 *   temporary overlay the Paper is `position: absolute` within the single fixed
 *   substrate (FixedLayer), per the overlay base's one-fixed-node rule.
 * - `persistent`/`permanent` do NOT reserve layout space or push sibling content
 *   (no DockedRoot `flex: 0 0 auto` column); the panel simply pins to the edge.
 * - Backdrop tap is the only close path (`'backdropClick'`); no escape key.
 */
export function Drawer(props: DrawerProps) {
  const theme = useTheme()
  const open = props.open === true
  const anchor = props.anchor ?? 'left'
  const variant = props.variant ?? 'temporary'
  const isTemporary = variant === 'temporary'

  // permanent is always visible; temporary/persistent require `open`.
  if (variant !== 'permanent' && !open) return null

  const paperSx: SxObject = {
    position: isTemporary ? 'absolute' : 'fixed',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    zIndex: theme.zIndex.drawer,
    ...paperAnchorSx(anchor),
  }
  if (!isTemporary) Object.assign(paperSx, dockedBorderSx(anchor, theme.palette.divider))
  const mergedPaperSx: SxObject = { ...paperSx, ...(props.paperSx ?? {}) }

  const paper = (
    <Paper elevation={isTemporary ? (props.elevation ?? 16) : 0} square sx={mergedPaperSx}>
      {props.children}
    </Paper>
  )

  // Docked (persistent/permanent): no backdrop, Paper pinned directly to the edge.
  if (!isTemporary) {
    return paper
  }

  // Temporary: full-screen fixed root + backdrop + edge-anchored Paper.
  const rootStyle: LynxStyle = {
    ...sxToStyle({ top: 0, left: 0, right: 0, bottom: 0, zIndex: theme.zIndex.drawer }, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }
  const backdropStyle = sxToStyle(
    {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    theme,
  )
  const handleBackdropTap = () => {
    props.onClose?.('backdropClick')
  }

  return (
    <FixedLayer className={props.className} style={rootStyle}>
      {props.hideBackdrop ? null : <view style={backdropStyle} bindtap={handleBackdropTap} />}
      {paper}
    </FixedLayer>
  )
}
Drawer.displayName = 'Drawer'
