import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps extends BaseProps {
  orientation?: DividerOrientation
  /** In a flex container, stretch to the cross-axis size of its siblings. */
  flexItem?: boolean
}

interface DividerOwnerState {
  orientation: DividerOrientation
  flexItem: boolean
}

function dividerStyle(os: DividerOwnerState, theme: Theme): SxObject {
  if (os.orientation === 'vertical') {
    const style: SxObject = {
      width: '1px',
      backgroundColor: theme.palette.divider,
    }
    if (os.flexItem) style.alignSelf = 'stretch'
    else style.height = '100%'
    return style
  }
  return {
    width: '100%',
    height: '1px',
    backgroundColor: theme.palette.divider,
  }
}

/** MUI `Divider` -> Lynx `<view>` hairline (1px). */
export const Divider = createComponent<DividerOwnerState, DividerProps>({
  name: 'Divider',
  root: 'view',
  defaultProps: { orientation: 'horizontal', flexItem: false },
  ownerState: (p) => ({
    orientation: p.orientation ?? 'horizontal',
    flexItem: p.flexItem === true,
  }),
  rootStyle: dividerStyle,
})
