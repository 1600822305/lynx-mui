import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | false

export interface ContainerProps extends BaseProps {
  /** Max width breakpoint. `false` removes the max-width. */
  maxWidth?: ContainerMaxWidth
  /** Remove the left/right gutters. */
  disableGutters?: boolean
}

interface ContainerOwnerState {
  maxWidth: ContainerMaxWidth
  disableGutters: boolean
}

/** Breakpoint min-widths MUI uses for `Container`'s max-width. */
const maxWidthMap: Record<Exclude<ContainerMaxWidth, false>, string> = {
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
}

function containerStyle(os: ContainerOwnerState): SxObject {
  const style: SxObject = {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
  }
  if (!os.disableGutters) {
    style.paddingLeft = '16px'
    style.paddingRight = '16px'
  }
  if (os.maxWidth !== false) style.maxWidth = maxWidthMap[os.maxWidth]
  return style
}

/** MUI `Container` -> Lynx `<view>` centered, max-width-capped column. */
export const Container = createComponent<ContainerOwnerState, ContainerProps>({
  name: 'Container',
  root: 'view',
  defaultProps: { maxWidth: 'lg', disableGutters: false },
  ownerState: (p) => ({
    maxWidth: p.maxWidth ?? 'lg',
    disableGutters: p.disableGutters === true,
  }),
  rootStyle: containerStyle,
})
