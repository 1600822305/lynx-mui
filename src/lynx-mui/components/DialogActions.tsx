import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface DialogActionsProps extends BaseProps {
  /** If true, the actions do not have additional margin. @default false */
  disableSpacing?: boolean
}

interface DialogActionsOwnerState {
  disableSpacing: boolean
}

/**
 * MUI `DialogActions` -> Lynx `<view>`.
 * MUI source: display flex, alignItems center, padding 8, justifyContent flex-end,
 * flex '0 0 auto'. When !disableSpacing: '& > :not(style) ~ :not(style)' marginLeft 8.
 * Lynx: sibling selectors unavailable in inline styles -> use gap '8px' as
 * equivalent spacing (visually identical result).
 */
function dialogActionsStyle(os: DialogActionsOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '8px',
    flex: '0 0 auto',
  }
  if (!os.disableSpacing) {
    // MUI uses `& > :not(style) ~ :not(style) { marginLeft: 8 }` for sibling spacing.
    // Lynx inline styles do not support sibling selectors; gap achieves the same visual result.
    style.gap = '8px'
  }
  return style
}

export const DialogActions = createComponent<DialogActionsOwnerState, DialogActionsProps>({
  name: 'DialogActions',
  root: 'view',
  defaultProps: { disableSpacing: false },
  ownerState: (p) => ({
    disableSpacing: p.disableSpacing === true,
  }),
  rootStyle: dialogActionsStyle,
})
