import type { ReactNode } from '@lynx-js/react'

import { mergeSx } from '../system/resolveSx.js'
import type { SxObject } from '../system/types.js'
import { Modal } from './Modal.js'
import type { ModalCloseReason } from './Modal.js'
import { Paper } from './Paper.js'

export type DialogMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false

export interface DialogProps {
  /** If true, the dialog is open. */
  open: boolean
  /** Fired when the backdrop is tapped. */
  onClose?: (reason: ModalCloseReason) => void
  children?: ReactNode
  /** Max width breakpoint of the dialog. @default 'sm' */
  maxWidth?: DialogMaxWidth
  /** Stretch to the max width. @default false */
  fullWidth?: boolean
  /** Full-screen dialog. @default false */
  fullScreen?: boolean
  /** Scroll behaviour. @default 'paper' */
  scroll?: 'paper' | 'body'
  /** Applied to the dialog Paper. */
  sx?: SxObject
  className?: string
}

// MUI Dialog maps maxWidth to `theme.breakpoints.values[mw]px`, except 'xs' which
// is `max(values.xs (0), 444)px` -> 444. Hardcoded here (no theme.breakpoints yet).
const MAX_WIDTH_PX: Record<Exclude<DialogMaxWidth, false>, number> = {
  xs: 444,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
}

/**
 * MUI `Dialog` -> `Modal` + centered `Paper` (elevation 24).
 * MUI DialogPaper: margin 32, position relative, overflowY auto; scroll='paper'
 * adds display flex / flexDirection column / maxHeight calc(100% - 64px). maxWidth
 * resolves to the breakpoint px; fullWidth -> width calc(100% - 64px); fullScreen ->
 * margin 0, width/height 100%, maxWidth 100%, maxHeight none, square corners.
 *
 * Lynx note: centering is handled by the Modal's flex root. `calc()` lengths are
 * passed through verbatim (verify on device). No enter/exit transition.
 */
export function Dialog(props: DialogProps) {
  const maxWidth: DialogMaxWidth = props.maxWidth ?? 'sm'
  const fullWidth = props.fullWidth === true
  const fullScreen = props.fullScreen === true
  const scroll = props.scroll ?? 'paper'

  const paperSx: SxObject = {
    margin: '32px',
    position: 'relative',
    overflowY: 'auto',
  }
  if (scroll === 'paper') {
    paperSx.display = 'flex'
    paperSx.flexDirection = 'column'
    paperSx.maxHeight = 'calc(100% - 64px)'
  }
  paperSx.maxWidth = maxWidth === false ? 'calc(100% - 64px)' : `${MAX_WIDTH_PX[maxWidth]}px`
  if (fullWidth) paperSx.width = 'calc(100% - 64px)'
  if (fullScreen) {
    paperSx.margin = 0
    paperSx.width = '100%'
    paperSx.maxWidth = '100%'
    paperSx.height = '100%'
    paperSx.maxHeight = 'none'
  }

  return (
    <Modal open={props.open} onClose={props.onClose} className={props.className}>
      <Paper elevation={24} square={fullScreen} sx={mergeSx(paperSx, props.sx)}>
        {props.children}
      </Paper>
    </Modal>
  )
}
Dialog.displayName = 'Dialog'
