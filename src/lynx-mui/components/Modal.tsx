import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { FixedLayer } from './Portal.js'

export type ModalCloseReason = 'backdropClick' | 'escapeKeyDown'

export interface ModalProps {
  /** If true, the modal is open. */
  open: boolean
  /** Fired when the backdrop is tapped (reason `'backdropClick'`). */
  onClose?: (reason: ModalCloseReason) => void
  children?: ReactNode
  /** If true, the backdrop is not rendered. @default false */
  hideBackdrop?: boolean
  /** Keep children mounted (hidden) while closed. @default false */
  keepMounted?: boolean
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/**
 * MUI `Modal` -> Lynx fixed root + backdrop fill.
 * MUI source (ModalRoot): position fixed, zIndex theme.zIndex.modal, inset 0;
 * `!open && exited` -> visibility hidden.
 *
 * Lynx note: instead of nesting a `position: fixed` Backdrop inside the (already
 * fixed) root, the backdrop is an `absolute` fill of the single fixed root — this
 * keeps exactly one fixed node per overlay (the centralized substrate) and avoids
 * nested-fixed edge cases. Content renders after the backdrop, so it paints above.
 * Degradations: no enter/exit transition; backdrop tap is the only close path
 * (no escape key on device).
 */
export function Modal(props: ModalProps) {
  const open = props.open === true
  const keepMounted = props.keepMounted === true
  if (!open && !keepMounted) return null

  const theme = useTheme()
  const rootBase: SxObject = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
  if (!open) rootBase.visibility = 'hidden'

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootBase, theme),
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
      {props.children}
    </FixedLayer>
  )
}
Modal.displayName = 'Modal'
