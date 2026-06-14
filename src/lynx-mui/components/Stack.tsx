import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'

export interface StackProps extends BaseProps {
  direction?: StackDirection
  /** Gap between children, in theme spacing units (1 = 8px). */
  spacing?: number
  alignItems?: string
  justifyContent?: string
}

interface StackOwnerState {
  direction: StackDirection
  spacing: number
  alignItems?: string
  justifyContent?: string
}

function stackStyle(os: StackOwnerState): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: os.direction,
  }
  if (os.spacing) style.gap = os.spacing // numeric -> spacing units via the sx runtime
  if (os.alignItems) style.alignItems = os.alignItems
  if (os.justifyContent) style.justifyContent = os.justifyContent
  return style
}

/** MUI `Stack` -> Lynx `<view>` flex container with `gap` spacing. */
export const Stack = createComponent<StackOwnerState, StackProps>({
  name: 'Stack',
  root: 'view',
  defaultProps: { direction: 'column', spacing: 0 },
  ownerState: (p) => ({
    direction: p.direction ?? 'column',
    spacing: p.spacing ?? 0,
    alignItems: p.alignItems,
    justifyContent: p.justifyContent,
  }),
  rootStyle: stackStyle,
})
