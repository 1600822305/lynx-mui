import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export type ToolbarVariant = 'regular' | 'dense'

export interface ToolbarProps extends BaseProps {
  variant?: ToolbarVariant
  /** Remove the left/right gutters. */
  disableGutters?: boolean
}

interface ToolbarOwnerState {
  variant: ToolbarVariant
  disableGutters: boolean
}

const minHeight: Record<ToolbarVariant, string> = { regular: '56px', dense: '48px' }

function toolbarStyle(os: ToolbarOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: minHeight[os.variant],
  }
  if (!os.disableGutters) {
    style.paddingLeft = '16px'
    style.paddingRight = '16px'
  }
  return style
}

/** MUI `Toolbar` -> Lynx `<view>` flex row with a min-height. */
export const Toolbar = createComponent<ToolbarOwnerState, ToolbarProps>({
  name: 'Toolbar',
  root: 'view',
  defaultProps: { variant: 'regular', disableGutters: false },
  ownerState: (p) => ({
    variant: p.variant ?? 'regular',
    disableGutters: p.disableGutters === true,
  }),
  rootStyle: toolbarStyle,
})
