import { useEffect } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { FixedLayer } from './Portal.js'
import { SnackbarContent } from './SnackbarContent.js'

export type SnackbarVertical = 'top' | 'bottom'
export type SnackbarHorizontal = 'left' | 'center' | 'right'

export interface SnackbarOrigin {
  vertical: SnackbarVertical
  horizontal: SnackbarHorizontal
}

export type SnackbarCloseReason = 'timeout' | 'clickaway' | 'escapeKeyDown'

export interface SnackbarProps {
  /** If true, the Snackbar is shown. */
  open?: boolean
  /** The message to display (used when `children` is omitted). */
  message?: ReactNode
  /** The action to display after the message. */
  action?: ReactNode
  /** @default { vertical: 'bottom', horizontal: 'left' } */
  anchorOrigin?: SnackbarOrigin
  /** Milliseconds before `onClose(reason: 'timeout')` fires; `null` disables. @default null */
  autoHideDuration?: number | null
  /** Fired when the snackbar requests to be closed. */
  onClose?: (reason: SnackbarCloseReason) => void
  /** Custom content (e.g. an Alert). Replaces the default `SnackbarContent`. */
  children?: ReactNode
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

const DEFAULT_ORIGIN: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

/**
 * MUI `Snackbar` -> Lynx fixed-positioned overlay.
 * MUI root (SnackbarRoot): position fixed, zIndex theme.zIndex.snackbar, display flex,
 * left 8, right 8, justifyContent center, alignItems center; vertical top -> top 8,
 * else bottom 8; horizontal left -> justifyContent flex-start, right -> flex-end,
 * center -> center. Default content is `SnackbarContent` (elevation 6).
 *
 * autoHideDuration -> a timer that fires `onClose('timeout')` (from useSnackbar).
 *
 * Lynx degradations:
 * - The `sm` breakpoint overrides (top/bottom 24, left/right 24, center translateX
 *   -50%) are dropped; the mobile-first base offsets (8) are used.
 * - No Grow/Slide enter/exit transition (appears/disappears immediately).
 * - No ClickAwayListener (`'clickaway'`), keydown (`'escapeKeyDown'`), or window
 *   focus/blur pause-resume (no document/window/mouse events on device). The only
 *   reason the component emits itself is `'timeout'`; the union keeps the other
 *   reasons for API parity / manual dispatch via the action button.
 */
export function Snackbar(props: SnackbarProps) {
  const theme = useTheme()
  const open = props.open === true
  const autoHideDuration = props.autoHideDuration ?? null
  const onClose = props.onClose

  useEffect(() => {
    if (!open || autoHideDuration == null || !onClose) return undefined
    const id = setTimeout(() => {
      onClose('timeout')
    }, autoHideDuration)
    return () => {
      clearTimeout(id)
    }
  }, [open, autoHideDuration, onClose])

  if (!open) return null

  const origin = props.anchorOrigin ?? DEFAULT_ORIGIN
  const rootSx: SxObject = {
    zIndex: theme.zIndex.snackbar,
    display: 'flex',
    flexDirection: 'row',
    left: 8,
    right: 8,
    alignItems: 'center',
    justifyContent:
      origin.horizontal === 'left'
        ? 'flex-start'
        : origin.horizontal === 'right'
          ? 'flex-end'
          : 'center',
  }
  if (origin.vertical === 'top') rootSx.top = 8
  else rootSx.bottom = 8

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  return (
    <FixedLayer className={props.className} style={rootStyle}>
      {props.children ?? <SnackbarContent message={props.message} action={props.action} />}
    </FixedLayer>
  )
}
Snackbar.displayName = 'Snackbar'
