import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface CardActionsProps extends BaseProps {
  /** Remove the spacing between action items. */
  disableSpacing?: boolean
}

interface CardActionsOwnerState {
  disableSpacing: boolean
}

function cardActionsStyle(os: CardActionsOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px',
  }
  if (!os.disableSpacing) style.gap = 1 // 1 spacing unit -> 8px via the sx runtime
  return style
}

/** MUI `CardActions` -> Lynx `<view>` flex row of actions. */
export const CardActions = createComponent<CardActionsOwnerState, CardActionsProps>({
  name: 'CardActions',
  root: 'view',
  defaultProps: { disableSpacing: false },
  ownerState: (p) => ({ disableSpacing: p.disableSpacing === true }),
  rootStyle: cardActionsStyle,
})
