import type { ReactNode } from '@lynx-js/react'

import type { LynxStyle } from '../system/types.js'

/**
 * The single `position: fixed` substrate for the whole overlay system.
 *
 * Lynx promotes any `position: fixed` node to the root container, which is the
 * native equivalent of a DOM portal — so every overlay (Backdrop / Modal /
 * Tooltip / ...) renders through this one primitive. If `fixed` ever misbehaves
 * on a real device, this is the only file that has to change (e.g. swap to an
 * absolute-positioned root host).
 */
export interface FixedLayerProps {
  style?: LynxStyle
  className?: string
  bindtap?: () => void
  children?: ReactNode
}

export function FixedLayer({ style, className, bindtap, children }: FixedLayerProps) {
  return (
    <view className={className} style={{ ...style, position: 'fixed' }} bindtap={bindtap}>
      {children}
    </view>
  )
}
FixedLayer.displayName = 'FixedLayer'

export interface PortalProps {
  children?: ReactNode
  /**
   * No-op in Lynx (kept for `@mui/material` API parity). There is no DOM to
   * portal into; a `position: fixed` descendant is auto-promoted to the root.
   */
  disablePortal?: boolean
}

/**
 * MUI `Portal` -> Lynx passthrough. MUI relocates children into `document.body`;
 * Lynx has no DOM, and a `position: fixed` descendant is already promoted to the
 * root container, so this simply renders its children in place.
 */
export function Portal({ children }: PortalProps) {
  return <>{children}</>
}
Portal.displayName = 'Portal'
