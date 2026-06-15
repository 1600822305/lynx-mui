import type { ReactNode } from '@lynx-js/react'

import type { AnchorRect } from '../hooks/useAnchorRect.js'
import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { Paper } from './Paper.js'
import { FixedLayer } from './Portal.js'

export type PopoverVertical = 'top' | 'center' | 'bottom' | number
export type PopoverHorizontal = 'left' | 'center' | 'right' | number

export interface PopoverOrigin {
  vertical: PopoverVertical
  horizontal: PopoverHorizontal
}

export type PopoverReference = 'anchorEl' | 'anchorPosition'
export type PopoverCloseReason = 'backdropClick'

export interface PopoverPosition {
  top: number
  left: number
}

export interface PopoverProps {
  open: boolean
  /**
   * Lynx replacement for MUI's `anchorEl` (a DOM node has no analogue here):
   * the measured screen rect of the anchor, obtained via `useAnchorRect`.
   */
  anchorRect?: AnchorRect | null
  /** @default 'anchorEl' */
  anchorReference?: PopoverReference
  /** Used when `anchorReference="anchorPosition"`. */
  anchorPosition?: PopoverPosition
  /** Point on the anchor the popover attaches to. @default { vertical: 'top', horizontal: 'left' } */
  anchorOrigin?: PopoverOrigin
  /** Point on the popover pinned to the anchor point. @default { vertical: 'top', horizontal: 'left' } */
  transformOrigin?: PopoverOrigin
  /** Paper elevation. @default 8 */
  elevation?: number
  /** Fired when the (invisible) backdrop is tapped. */
  onClose?: (reason: PopoverCloseReason) => void
  /** Keep the popover mounted (hidden) while closed. @default false */
  keepMounted?: boolean
  /**
   * Accepted for v7 parity; inert on Lynx (the popover size can't be measured
   * synchronously, so no viewport edge clamping is performed).
   */
  marginThreshold?: number
  /** Extra style merged onto the popover Paper (e.g. Menu's maxHeight). */
  paperSx?: SxObject
  children?: ReactNode
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

const DEFAULT_ORIGIN: PopoverOrigin = { vertical: 'top', horizontal: 'left' }

function offsetTop(rect: AnchorRect, vertical: PopoverVertical): number {
  if (typeof vertical === 'number') return vertical
  if (vertical === 'center') return rect.height / 2
  if (vertical === 'bottom') return rect.height
  return 0
}

function offsetLeft(rect: AnchorRect, horizontal: PopoverHorizontal): number {
  if (typeof horizontal === 'number') return horizontal
  if (horizontal === 'center') return rect.width / 2
  if (horizontal === 'right') return rect.width
  return 0
}

/**
 * transformOrigin without measuring the popover: keywords become a percentage
 * self-translate (the Tooltip trick), numbers become a px self-translate.
 */
function transformValue(transformOrigin: PopoverOrigin): string {
  const h = transformOrigin.horizontal
  const v = transformOrigin.vertical
  const x = typeof h === 'number' ? `${-h}px` : h === 'center' ? '-50%' : h === 'right' ? '-100%' : '0'
  const y = typeof v === 'number' ? `${-v}px` : v === 'center' ? '-50%' : v === 'bottom' ? '-100%' : '0'
  return `translate(${x}, ${y})`
}

/**
 * MUI `Popover` -> Lynx fixed overlay anchored to a measured rect.
 *
 * Lynx degradations: `anchorEl` (DOM node) becomes `anchorRect` (from
 * `useAnchorRect`); the backdrop is invisible but still tap-to-close (only
 * `'backdropClick'` reason); transformOrigin is realised via CSS `transform`
 * (no synchronous popover measurement), so `marginThreshold` edge-clamping and
 * enter/exit transitions are dropped. Renders one frame after the anchor is
 * measured.
 */
export function Popover(props: PopoverProps) {
  const open = props.open === true
  const keepMounted = props.keepMounted === true
  if (!open && !keepMounted) return null

  const theme = defaultTheme
  const anchorReference = props.anchorReference ?? 'anchorEl'
  const anchorOrigin = props.anchorOrigin ?? DEFAULT_ORIGIN
  const transformOrigin = props.transformOrigin ?? DEFAULT_ORIGIN

  let base: PopoverPosition | null = null
  if (anchorReference === 'anchorPosition') {
    base = props.anchorPosition ?? null
  } else if (props.anchorRect) {
    const r = props.anchorRect
    base = {
      top: r.top + offsetTop(r, anchorOrigin.vertical),
      left: r.left + offsetLeft(r, anchorOrigin.horizontal),
    }
  }
  if (!open || !base) return null

  const rootStyle: LynxStyle = {
    ...sxToStyle({ top: 0, left: 0, right: 0, bottom: 0, zIndex: theme.zIndex.modal }, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  const backdropStyle = sxToStyle(
    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' },
    theme,
  )

  const paperSx: SxObject = {
    position: 'absolute',
    left: base.left,
    top: base.top,
    transform: transformValue(transformOrigin),
    overflowY: 'auto',
    overflowX: 'hidden',
    minWidth: 16,
    minHeight: 16,
    maxWidth: 'calc(100% - 32px)',
    maxHeight: 'calc(100% - 32px)',
    ...(props.paperSx ?? {}),
  }

  return (
    <FixedLayer className={props.className} style={rootStyle}>
      <view style={backdropStyle} bindtap={() => props.onClose?.('backdropClick')} />
      <Paper elevation={props.elevation ?? 8} sx={paperSx}>
        {props.children}
      </Paper>
    </FixedLayer>
  )
}
Popover.displayName = 'Popover'
