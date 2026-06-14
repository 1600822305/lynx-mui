import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface ListItemProps extends BaseProps {
  /** Remove the left/right gutters. */
  disableGutters?: boolean
}

interface ListItemOwnerState {
  disableGutters: boolean
}

function listItemStyle(os: ListItemOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    paddingTop: '8px',
    paddingBottom: '8px',
    gap: 2, // 2 spacing units -> 16px via the sx runtime
  }
  if (!os.disableGutters) {
    style.paddingLeft = '16px'
    style.paddingRight = '16px'
  }
  return style
}

/** MUI `ListItem` -> Lynx `<view>` flex row. */
export const ListItem = createComponent<ListItemOwnerState, ListItemProps>({
  name: 'ListItem',
  root: 'view',
  defaultProps: { disableGutters: false },
  ownerState: (p) => ({ disableGutters: p.disableGutters === true }),
  rootStyle: listItemStyle,
})
