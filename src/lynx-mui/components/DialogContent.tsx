import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface DialogContentProps extends BaseProps {
  /** Display top and bottom dividers. @default false */
  dividers?: boolean
}

interface DialogContentOwnerState {
  dividers: boolean
}

/**
 * MUI `DialogContent` -> Lynx `<view>`.
 * MUI source: flex '1 1 auto', overflowY 'auto', padding '20px 24px'.
 * With dividers: padding '16px 24px', borderTop/borderBottom 1px solid divider.
 */
function dialogContentStyle(os: DialogContentOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    flex: '1 1 auto',
    overflowY: 'auto',
  }
  if (os.dividers) {
    style.padding = '16px 24px'
    // Split border properties (like Divider.tsx pattern)
    style.borderTopWidth = '1px'
    style.borderTopStyle = 'solid'
    style.borderTopColor = theme.palette.divider
    style.borderBottomWidth = '1px'
    style.borderBottomStyle = 'solid'
    style.borderBottomColor = theme.palette.divider
  } else {
    style.padding = '20px 24px'
  }
  return style
}

export const DialogContent = createComponent<DialogContentOwnerState, DialogContentProps>({
  name: 'DialogContent',
  root: 'view',
  defaultProps: { dividers: false },
  ownerState: (p) => ({
    dividers: p.dividers === true,
  }),
  rootStyle: dialogContentStyle,
})
