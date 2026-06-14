import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'

export interface BoxProps extends BaseProps {}

/** MUI `Box` -> Lynx `<view>`. A pure sx-consuming container; no own styling. */
export const Box = createComponent<Record<string, never>, BoxProps>({
  name: 'Box',
  root: 'view',
})
