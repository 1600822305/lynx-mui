import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface ListProps extends BaseProps {
  /** Remove the top/bottom padding. */
  disablePadding?: boolean
}

interface ListOwnerState {
  disablePadding: boolean
}

function listStyle(os: ListOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'column',
  }
  if (!os.disablePadding) {
    style.paddingTop = '8px'
    style.paddingBottom = '8px'
  }
  return style
}

/** MUI `List` -> Lynx `<view>` vertical column. */
export const List = createComponent<ListOwnerState, ListProps>({
  name: 'List',
  root: 'view',
  defaultProps: { disablePadding: false },
  ownerState: (p) => ({ disablePadding: p.disablePadding === true }),
  rootStyle: listStyle,
})
