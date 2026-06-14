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
  // Mirror MUI: a zero-width border box where one side carries the hairline.
  const style: SxObject = {
    margin: 0,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  }
  if (os.orientation === 'vertical') {
    style.borderRightWidth = '1px'
    if (os.flexItem) style.alignSelf = 'stretch'
    else style.height = '100%'
  } else {
    style.borderBottomWidth = '1px'
    style.width = '100%'
  }
  return style
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
