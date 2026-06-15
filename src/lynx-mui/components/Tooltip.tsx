import type { ReactNode } from '@lynx-js/react'

import { useAnchorRect } from '../hooks/useAnchorRect.js'
import type { AnchorRect } from '../hooks/useAnchorRect.js'
import { useControlled } from '../hooks/useControlled.js'
import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject } from '../system/types.js'
import { alpha } from '../utils/alpha.js'
import { FixedLayer } from './Portal.js'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Tooltip label. Rendered inside a `<text>`, so a string is preferred. */
  title?: ReactNode
  /** The anchor element. */
  children?: ReactNode
  /** @default 'bottom' */
  placement?: TooltipPlacement
  /** Controlled open state. Omit for tap-to-toggle (uncontrolled). */
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
  className?: string
}

// MUI popper offset between the anchor and the tooltip, per placement axis.
const GAP = 14

function bubblePosition(placement: TooltipPlacement, rect: AnchorRect): SxObject {
  switch (placement) {
    case 'top':
      return { left: rect.left + rect.width / 2, top: rect.top - GAP, transform: 'translate(-50%, -100%)' }
    case 'left':
      return { left: rect.left - GAP, top: rect.top + rect.height / 2, transform: 'translate(-100%, -50%)' }
    case 'right':
      return { left: rect.right + GAP, top: rect.top + rect.height / 2, transform: 'translateY(-50%)' }
    case 'bottom':
    default:
      return { left: rect.left + rect.width / 2, top: rect.bottom + GAP, transform: 'translateX(-50%)' }
  }
}

/**
 * MUI `Tooltip` -> tap-anchored Lynx overlay.
 * MUI TooltipTooltip: backgroundColor alpha(grey[700] '#616161', 0.92), borderRadius 4,
 * color '#fff', padding '4px 8px', fontSize 11, fontWeight 500, maxWidth 300, 14px gap.
 *
 * Lynx degradations: no hover -> tap the anchor to toggle (or drive `open` yourself);
 * positioning uses `boundingClientRect` (async) + `transform` to self-center, so the
 * bubble appears one frame after the first tap; the anchor is wrapped in a `<view>`
 * (MUI clones the child instead); placement is limited to the 4 base sides.
 */
export function Tooltip(props: TooltipProps) {
  const theme = defaultTheme
  const placement = props.placement ?? 'bottom'
  const anchor = useAnchorRect()
  const [open, setOpen] = useControlled(props.open, false)

  const handleTap = () => {
    const next = !open
    if (next) {
      anchor.measure()
      props.onOpen?.()
    } else {
      props.onClose?.()
    }
    setOpen(next)
  }

  const bubbleViewStyle: LynxStyle = sxToStyle(
    {
      backgroundColor: alpha('#616161', 0.92),
      borderRadius: '4px',
      padding: '4px 8px',
      maxWidth: '300px',
    },
    theme,
  )
  const bubbleTextStyle: LynxStyle = sxToStyle(
    { color: '#fff', fontSize: '11px', fontWeight: '500', wordBreak: 'break-all' },
    theme,
  )

  return (
    <>
      <view ref={anchor.ref} bindtap={handleTap}>
        {props.children}
      </view>
      {open && anchor.rect ? (
        <FixedLayer
          className={props.className}
          style={sxToStyle({ ...bubblePosition(placement, anchor.rect), zIndex: theme.zIndex.tooltip }, theme)}
        >
          <view style={bubbleViewStyle}>
            <text style={bubbleTextStyle}>{props.title}</text>
          </view>
        </FixedLayer>
      ) : null}
    </>
  )
}
Tooltip.displayName = 'Tooltip'
